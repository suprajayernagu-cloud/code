#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const today = '2026-06-07'
const replaceExisting = process.argv.includes('--replace-existing')

const sources = [
  {
    board: 'netgear',
    postingId: '4264a3a5-8d8d-419b-89a0-8326fb08576e',
    company: 'NETGEAR',
  },
  {
    board: 'menlosecurity',
    postingId: '95e980a8-745c-492e-83da-018fd398e726',
    company: 'Menlo Security',
  },
  {
    board: 'uptimeai',
    postingId: 'c5d739d2-65c0-4c53-832c-4c3dcbaf6ae0',
    company: 'UptimeAI',
  },
  {
    board: 'junipersquare',
    postingId: 'abbdc0fb-317a-44ff-a365-036207458eef',
    company: 'Juniper Square',
  },
  {
    board: 'almabase',
    postingId: 'eb3485b0-26c8-4211-ac7a-2beff29fbe0e',
    company: 'Almabase',
  },
]

function cleanText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanPlainText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .split(/\r?\n/)
    .map(cleanText)
    .filter(Boolean)
    .join('\n')
}

function titleCaseEmploymentType(value) {
  const normalized = cleanText(value)
  const map = {
    FullTime: 'Full-time',
    PartTime: 'Part-time',
    Contract: 'Contract',
    Internship: 'Internship',
    Temporary: 'Temporary',
  }
  return map[normalized] || normalized || 'Not mentioned'
}

function formatLocation(posting) {
  const location = cleanText(posting.location)
  const country = cleanText(posting.address?.postalAddress?.addressCountry)
  if (!location) return country || 'Not mentioned'
  if (!country || location.toLowerCase().includes(country.toLowerCase())) return location
  return `${location}, ${country}`
}

function getSalary(posting) {
  const comp = posting.compensation || {}
  return (
    cleanText(comp.scrapeableCompensationSalarySummary) ||
    cleanText(comp.compensationTierSummary) ||
    'Not mentioned'
  )
}

function getWorkMode(posting) {
  const workplaceType = cleanText(posting.workplaceType)
  if (/remote/i.test(workplaceType) || posting.isRemote) return 'Remote'
  if (/hybrid/i.test(workplaceType)) return 'Hybrid'
  if (/onsite|office/i.test(workplaceType)) return 'Onsite'
  return workplaceType || 'Not mentioned'
}

function inferExperience(title, description) {
  const lines = description.split('\n').map(cleanText).filter(Boolean)
  const experienceLine = lines.find((line) => {
    return (
      /\byears?\b/i.test(line) &&
      /experience/i.test(line) &&
      !/cumulative experience/i.test(line)
    )
  })

  if (experienceLine) {
    const exact = experienceLine.match(
      /\b(?:at least\s*)?\d+\s*(?:[-\u2013]\s*\d+|\+)?\s*years?(?:'|\u2019)?\s*(?:of\s+[^.\n]*?experience|experience)?/i
    )
    return cleanText(exact ? exact[0] : experienceLine)
  }

  if (/\bprincipal\b/i.test(title)) return 'Principal / experienced'
  if (/\bsenior\b/i.test(title)) return 'Senior / experienced'
  if (/\bstaff\b/i.test(title)) return 'Staff / experienced'
  if (/\blead\b/i.test(title)) return 'Lead / experienced'
  if (/\bengineer\s+ii\b/i.test(title)) return 'Engineer II'
  return 'Not mentioned'
}

function isHeading(line) {
  const text = cleanText(line)
  if (!text || text.length > 90) return false
  if (
    /^(key\s+)?responsibilities:?$/i.test(text) ||
    /^main responsibilities/i.test(text) ||
    /^what you.?ll do:?$/i.test(text) ||
    /^qualifications:?$/i.test(text) ||
    /^technical requirements:?$/i.test(text) ||
    /^essential skills and experience:?$/i.test(text) ||
    /^must haves:?$/i.test(text) ||
    /^what we.?re looking for:?$/i.test(text) ||
    /^nice-to-have:?$/i.test(text) ||
    /^about the role:?$/i.test(text) ||
    /^where this role fits:?$/i.test(text)
  ) {
    return true
  }

  const letters = text.replace(/[^a-z]/gi, '')
  if (letters.length >= 4 && letters === letters.toUpperCase()) return true
  return /:$/.test(text)
}

function extractSectionLines(description, headingPatterns) {
  const lines = description.split('\n').map(cleanText).filter(Boolean)
  const start = lines.findIndex((line) => {
    return isHeading(line) && headingPatterns.some((pattern) => pattern.test(line))
  })
  if (start < 0) return ['Not mentioned']

  const collected = []
  for (let i = start + 1; i < lines.length; i += 1) {
    if (isHeading(lines[i]) && collected.length > 0) break
    collected.push(lines[i].replace(/^[-*\u2022\u00b7]\s*/, ''))
  }

  const filtered = collected
    .map(cleanText)
    .filter((line) => {
      if (!line || headingPatterns.some((pattern) => pattern.test(line))) return false
      if (/^[A-Z][A-Za-z\s/&-]{1,30}:$/.test(line)) return false
      return true
    })
    .slice(0, 8)

  return filtered.length ? filtered : ['Not mentioned']
}

function extractResponsibilities(description) {
  return extractSectionLines(description, [
    /what you.?ll do/i,
    /responsibilit/i,
  ])
}

function extractQualifications(description) {
  return extractSectionLines(description, [
    /what you.?ll bring/i,
    /what we.?re looking for/i,
    /qualification/i,
    /requirement/i,
    /essential skills and experience/i,
    /must haves/i,
  ])
}

function extractTags(title, description) {
  const haystack = `${title}\n${description}`.toLowerCase()
  const known = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'React',
    'Node.js',
    'AWS',
    'GCP',
    'Kubernetes',
    'SQL',
    'AI',
    'Machine Learning',
    'Customer Success',
    'Implementation',
    'Support',
    'Platform',
    'Infrastructure',
  ]

  return known.filter((tag) => haystack.includes(tag.toLowerCase())).slice(0, 6)
}

function hasDuplicate(existingJobs, source, posting) {
  const urls = [posting.jobUrl, posting.applyUrl].filter(Boolean)
  return existingJobs.some((job) => {
    const serialized = JSON.stringify(job)
    return serialized.includes(source.postingId) || urls.some((url) => url && serialized.includes(url))
  })
}

async function fetchBoard(board) {
  const response = await fetch(
    `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}?includeCompensation=true`,
    { headers: { Accept: 'application/json' } }
  )

  if (!response.ok) {
    throw new Error(`Ashby board ${board} returned ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data.jobs) ? data.jobs : []
}

async function verifyApplyUrl(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 HiringstodayBot/1.0',
    },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`Apply URL ${url} returned ${response.status}`)
  }
}

function buildJobRecord({ id, companyId, source, posting }) {
  const description = cleanPlainText(posting.descriptionPlain)
  const title = cleanText(posting.title)
  const location = formatLocation(posting)
  const responsibilities = extractResponsibilities(description)
  const qualifications = extractQualifications(description)
  const workMode = getWorkMode(posting)
  const salary = getSalary(posting)
  const experience = inferExperience(title, description)
  const type = titleCaseEmploymentType(posting.employmentType)
  const tags = extractTags(title, description)
  const overview = `${source.company} is hiring for ${title} in ${location}. This listing was verified from the official Ashby application page on ${today}. Salary, deadline, responsibilities, and qualifications are shown only where the official posting mentions them.`

  return {
    id,
    companyId,
    postedAt: today,
    logoUrl: '',
    sourceType: 'Official application page',
    title,
    company: source.company,
    location,
    salary,
    experience,
    type,
    remote: workMode === 'Remote',
    workMode,
    tags,
    applyUrl: posting.applyUrl,
    description: overview,
    responsibilities,
    qualifications,
    sourceName: 'Official Ashby job posting',
    sourceUrl: posting.jobUrl,
    lastCheckedAt: today,
    applicationDeadline: 'Not mentioned',
    overview,
    responsibilitiesDetailed: {},
    eligibilityDetailed: {},
    skillsRequired: tags.map((tag) => ({
      name: tag,
      category: 'Official posting keyword',
      proficiencyLevel: 'Not mentioned',
      why: `${tag} appears in the official job posting for ${title}.`,
      howToBuild: 'Prepare examples from projects, internships, or work experience that match this keyword.',
    })),
    salaryInsights:
      salary === 'Not mentioned'
        ? 'Salary is not mentioned on the official job posting.'
        : `Official compensation mentioned on the job posting: ${salary}.`,
    whyApply: `${source.company} is hiring ${title} through its official Ashby job page. Review the official posting before applying.`,
    preparationTips: [
      {
        tip: 'Review the official job page',
        description: 'Match your resume to the responsibilities and qualifications stated on the official posting.',
        timeline: 'Before applying',
      },
    ],
    prepTips: [
      'Review the official job page and match your resume to the stated responsibilities and qualifications.',
    ],
    howToApply: [
      {
        step: 1,
        action: 'Open the official apply link',
        details: 'Use the official Ashby application link listed on this page.',
        estimatedTime: '5-10 minutes',
      },
      {
        step: 2,
        action: 'Submit the application',
        details: 'Fill the official application form carefully and save the confirmation if provided.',
        estimatedTime: '10-20 minutes',
      },
    ],
    applicationAdvice:
      'Apply only through the official application link. Do not pay money for job applications or interviews.',
    aboutCompany: {
      aboutCompany: `${source.company} is the hiring company listed on the official Ashby posting.`,
      foundedYear: 'Not mentioned',
      headquarters: 'Not mentioned',
      indianPresence: location,
      whyJoin: `Official active opening for ${title}.`,
    },
    faq: [
      {
        question: `Is the ${title} job at ${source.company} verified?`,
        answer: `Yes. This job was checked on ${today} using the official Ashby job application page.`,
      },
      {
        question: 'What is the last date to apply?',
        answer: 'Not mentioned on the official posting. Apply early because official links can close without notice.',
      },
      {
        question: 'What salary is mentioned?',
        answer: salary === 'Not mentioned' ? 'Not mentioned on the official posting.' : salary,
      },
    ],
    selectionProcess: ['Not mentioned'],
    documentsRequired: ['Not mentioned'],
    editorNote: `HiringsToday added this listing on ${today} from the official Ashby job posting only. Verify the apply link and details again before submitting personal information.`,
    whoShouldApply: qualifications,
    whoShouldSkip: [
      'Candidates who do not match the official job requirements.',
      'Anyone asked to pay money for registration, training, referral, or interview access.',
    ],
    officialDescription: description,
    officialPosting: {
      provider: 'Ashby',
      jobBoard: source.board,
      postingId: source.postingId,
      department: cleanText(posting.department),
      team: cleanText(posting.team),
      employmentType: cleanText(posting.employmentType),
      workplaceType: cleanText(posting.workplaceType),
      isListed: posting.isListed !== false,
      isRemote: Boolean(posting.isRemote),
      publishedAt: posting.publishedAt || 'Not mentioned',
      jobUrl: posting.jobUrl,
      applyUrl: posting.applyUrl,
      compensation: posting.compensation || null,
      descriptionPlain: description,
      fetchedAt: today,
    },
  }
}

async function main() {
  let jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  if (replaceExisting) {
    const selectedPostingIds = new Set(sources.map((source) => source.postingId))
    jobs = jobs.filter((job) => !selectedPostingIds.has(job.officialPosting?.postingId))
  }

  let nextId = Math.max(...jobs.map((job) => Number(job.id) || 0)) + 1
  let nextCompanyId = Math.max(...jobs.map((job) => Number(job.companyId) || 0)) + 1
  const added = []

  for (const source of sources) {
    const postings = await fetchBoard(source.board)
    const posting = postings.find((job) => job.id === source.postingId)
    if (!posting) {
      throw new Error(`Posting ${source.board}/${source.postingId} was not found`)
    }
    if (posting.isListed === false) {
      throw new Error(`Posting ${source.board}/${source.postingId} is not listed`)
    }
    if (hasDuplicate(jobs, source, posting)) {
      throw new Error(`Duplicate posting detected for ${source.board}/${source.postingId}`)
    }

    await verifyApplyUrl(posting.applyUrl)

    const record = buildJobRecord({
      id: nextId,
      companyId: nextCompanyId,
      source,
      posting,
    })

    jobs.push(record)
    added.push({
      id: record.id,
      title: record.title,
      company: record.company,
      location: record.location,
      applyUrl: record.applyUrl,
    })
    nextId += 1
    nextCompanyId += 1
  }

  fs.writeFileSync(inputPath, `${JSON.stringify(jobs, null, 2)}\n`)
  console.log(JSON.stringify({ added }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
