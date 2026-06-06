#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const GENERIC_PATTERNS = [
  /exceptional opportunity/i,
  /cutting-edge/i,
  /world-class/i,
  /career-defining/i,
  /millions globally/i,
  /problems that matter/i,
  /steep learning curve/i,
  /unique opportunity/i,
  /actively shaping the/i,
  /long-term success/i,
  /career acceleration/i,
  /perfect blend/i,
  /dynamic career/i,
  /transform your career/i,
  /20-40% raises/i,
  /referral increases your chances/i,
  /interviews are a two-way street/i,
]

const TRUST_FIELDS = [
  'sourceUrl',
  'sourceName',
  'lastCheckedAt',
  'applicationDeadline',
  'selectionProcess',
  'documentsRequired',
  'editorNote',
]

const CORE_FIELDS = [
  'title',
  'company',
  'location',
  'postedAt',
  'applyUrl',
  'description',
  'responsibilities',
  'qualifications',
]

const VISIBLE_CONTENT_FIELDS = [
  'overview',
  'applicationAdvice',
  'editorNote',
  'responsibilitiesDetailed',
  'eligibilityDetailed',
  'skillsRequired',
  'salaryInsights',
  'whyApply',
  'selectionProcess',
  'documentsRequired',
  'whoShouldApply',
  'whoShouldSkip',
  'preparationTips',
  'howToApply',
  'aboutCompany',
  'faq',
]

function loadJobs(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected an array in ${filePath}`)
  }

  return parsed
}

function textFrom(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function wordCount(value) {
  return textFrom(value)
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

function countGenericPatterns(job) {
  const text = [
    job.overview,
    job.salaryInsights,
    job.whyApply,
    job.aboutCompany,
    job.faq,
    job.howToApply,
    job.preparationTips,
  ].map(textFrom).join('\n')

  return GENERIC_PATTERNS.reduce((count, pattern) => {
    return count + (pattern.test(text) ? 1 : 0)
  }, 0)
}

function missingFields(job, fields) {
  return fields.filter((field) => {
    const value = job[field]
    if (Array.isArray(value)) return value.length === 0
    return value === undefined || value === null || value === ''
  })
}

function collectDuplicateStarts(jobs, field, length = 90) {
  const buckets = new Map()

  jobs.forEach((job) => {
    const value = textFrom(job[field]).trim()
    if (!value) return
    const key = value.slice(0, length)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(job.id)
  })

  return [...buckets.entries()]
    .filter(([, ids]) => ids.length > 1)
    .sort((a, b) => b[1].length - a[1].length)
}

function buildReport(jobs) {
  const summaries = jobs.map((job) => {
    const genericPatternCount = countGenericPatterns(job)
    const missingCore = missingFields(job, CORE_FIELDS)
    const missingTrust = missingFields(job, TRUST_FIELDS)
    const visibleWords = VISIBLE_CONTENT_FIELDS.reduce((total, field) => {
      return total + wordCount(job[field])
    }, 0)

    const score =
      genericPatternCount * 4 +
      missingTrust.length * 2 +
      missingCore.length * 5 +
      (visibleWords < 700 ? 6 : 0)

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      score,
      visibleWords,
      genericPatternCount,
      missingCore,
      missingTrust,
    }
  })

  const fieldCoverage = [...CORE_FIELDS, ...TRUST_FIELDS].reduce((acc, field) => {
    acc[field] = jobs.filter((job) => !missingFields(job, [field]).length).length
    return acc
  }, {})

  return {
    inputPath,
    jobCount: jobs.length,
    fieldCoverage,
    duplicateStarts: {
      overview: collectDuplicateStarts(jobs, 'overview').slice(0, 10),
      salaryInsights: collectDuplicateStarts(jobs, 'salaryInsights').slice(0, 10),
      whyApply: collectDuplicateStarts(jobs, 'whyApply').slice(0, 10),
    },
    highestPriorityJobs: summaries
      .sort((a, b) => b.score - a.score)
      .slice(0, 30),
  }
}

function printReport(report) {
  console.log(`Job content audit: ${report.inputPath}`)
  console.log(`Jobs checked: ${report.jobCount}`)
  console.log('\nField coverage:')
  Object.entries(report.fieldCoverage).forEach(([field, count]) => {
    console.log(`- ${field}: ${count}/${report.jobCount}`)
  })

  console.log('\nDuplicate opening text:')
  Object.entries(report.duplicateStarts).forEach(([field, groups]) => {
    const total = groups.reduce((sum, [, ids]) => sum + ids.length, 0)
    console.log(`- ${field}: ${groups.length} repeated starts, ${total} jobs affected in top groups`)
    groups.slice(0, 3).forEach(([start, ids]) => {
      console.log(`  - ${ids.length} jobs: "${start}..."`)
    })
  })

  console.log('\nHighest priority jobs to human-edit first:')
  report.highestPriorityJobs.forEach((job) => {
    console.log(`- #${job.id} ${job.company} - ${job.title}`)
    console.log(`  score=${job.score}, genericPatterns=${job.genericPatternCount}, visibleWords=${job.visibleWords}`)
    if (job.missingCore.length) console.log(`  missingCore=${job.missingCore.join(', ')}`)
    if (job.missingTrust.length) console.log(`  missingTrust=${job.missingTrust.join(', ')}`)
  })
}

try {
  printReport(buildReport(loadJobs(inputPath)))
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
