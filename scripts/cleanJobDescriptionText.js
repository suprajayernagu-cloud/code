#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const namedEntities = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

function decodeHtmlEntities(value) {
  return String(value || '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
    const normalized = code.toLowerCase()
    if (normalized.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16))
    }
    if (normalized.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10))
    }
    return namedEntities[normalized] || entity
  })
}

function decodeRepeatedly(value) {
  let text = String(value || '')
  for (let i = 0; i < 3; i += 1) {
    const decoded = decodeHtmlEntities(text)
    if (decoded === text) break
    text = decoded
  }
  return text
}

function isBrokenScrape(value) {
  return /themeOptions|customTheme|pcsx-|data-up-|up-rich-text|__NEXT_DATA__|window\.__/i.test(
    decodeRepeatedly(value)
  )
}

function isBrokenScrapeLine(line) {
  if (!line || /^[-*•]+$/.test(line)) return true
  if (/themeOptions|customTheme|pcsx-|data-up-|up-rich-text|window\.__|__NEXT_DATA__/i.test(line)) return true
  if (/^\{.*\}$/.test(line) && line.length > 120) return true
  if (/^["'}\]]+$/.test(line)) return true
  return false
}

function htmlToPlainText(value) {
  return decodeRepeatedly(value)
    .replace(/\\r\\n|\\n|\\t/g, '\n')
    .replace(/<script[\s\S]*?<\/script>/gi, '\n')
    .replace(/<style[\s\S]*?<\/style>/gi, '\n')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/?(ul|ol)\b[^>]*>/gi, '\n')
    .replace(/<\/?(p|div|br|h[1-6]|section|article|tr|table)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => !isBrokenScrapeLine(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function shortPlainText(value) {
  return htmlToPlainText(value).replace(/\s+/g, ' ').trim()
}

function normalizeTextField(value) {
  if (!value || typeof value !== 'string') return value
  if (isBrokenScrape(value)) return ''
  return htmlToPlainText(value)
}

function hasBadMarkup(value) {
  return /[<&]lt;|<\/?[a-z][\s\S]*?>|themeOptions|data-up-|up-rich-text/i.test(String(value || ''))
}

function fallbackOverview(job) {
  return `${job.company || 'This company'} has a job listing on its official careers page. Review the employer page for the latest role details, eligibility, location, and application instructions before applying.`
}

function cleanJob(job) {
  const cleaned = { ...job }
  const changedFields = []

  for (const field of ['description', 'overview', 'officialDescription', 'sourceDescription']) {
    if (!hasBadMarkup(cleaned[field])) continue
    const nextValue = normalizeTextField(cleaned[field])
    if (nextValue !== cleaned[field]) {
      cleaned[field] = nextValue
      changedFields.push(field)
    }
  }

  if (cleaned.officialPosting && typeof cleaned.officialPosting === 'object') {
    const officialPosting = { ...cleaned.officialPosting }
    if (hasBadMarkup(officialPosting.descriptionPlain)) {
      officialPosting.descriptionPlain = normalizeTextField(officialPosting.descriptionPlain)
      changedFields.push('officialPosting.descriptionPlain')
    }
    cleaned.officialPosting = officialPosting
  }

  if (!shortPlainText(cleaned.description) || shortPlainText(cleaned.description).length < 30) {
    const fallback = fallbackOverview(cleaned)
    if (cleaned.description !== fallback) {
      cleaned.description = fallback
      changedFields.push('description')
    }
  }

  if (!shortPlainText(cleaned.overview) || shortPlainText(cleaned.overview).length < 30) {
    const fallback = cleaned.description || fallbackOverview(cleaned)
    if (cleaned.overview !== fallback) {
      cleaned.overview = fallback
      changedFields.push('overview')
    }
  }

  if (
    !shortPlainText(cleaned.officialDescription) &&
    cleaned.officialPosting &&
    !shortPlainText(cleaned.officialPosting.descriptionPlain)
  ) {
    if (Object.prototype.hasOwnProperty.call(cleaned, 'officialDescription')) {
      delete cleaned.officialDescription
      changedFields.push('officialDescription')
    }
    if (Object.prototype.hasOwnProperty.call(cleaned.officialPosting, 'descriptionPlain')) {
      delete cleaned.officialPosting.descriptionPlain
      changedFields.push('officialPosting.descriptionPlain')
    }
  }

  return { cleaned, changedFields }
}

const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
let changedJobs = 0
const changed = []

const nextJobs = jobs.map((job) => {
  const result = cleanJob(job)
  if (result.changedFields.length) {
    changedJobs += 1
    changed.push({ id: job.id, company: job.company, title: job.title, fields: result.changedFields })
  }
  return result.cleaned
})

fs.writeFileSync(inputPath, `${JSON.stringify(nextJobs, null, 2)}\n`)

console.log(`Cleaned ${changedJobs} jobs in ${inputPath}`)
changed.forEach((job) => {
  console.log(`- #${job.id} ${job.company} - ${job.title}: ${job.fields.join(', ')}`)
})
