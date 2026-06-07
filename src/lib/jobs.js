import fs from 'fs/promises'
import path from 'path'
import { JOBS_URL, LOCAL_DATA_PATH, USE_LOCAL_DATA } from '@/src/config'

let cachedJobs = null
let cacheTimestamp = 0
let cacheSignature = null
const CACHE_DURATION = 3600000 // 1 hour in milliseconds
const COMPANY_LOGOS_CDN_BASE = 'https://cdn.jsdelivr.net/gh/suprajayernagu-cloud/Job-data@main/company-logos'

/**
 * Fetch all jobs from external source with caching
 * @param {boolean} includeDetails - Whether to include detailed fields
 * @param {Object} options - Loader options
 * @param {boolean} options.includeClosed - Whether to include closed/expired jobs
 * @returns {Promise<Array>} Array of job objects
 */
export async function getAllJobs(includeDetails = false, options = {}) {
  try {
    const localSignature = USE_LOCAL_DATA ? await getLocalJobsSignature().catch(() => null) : null

    // Check cache validity
    const now = Date.now()
    if (
      cachedJobs &&
      now - cacheTimestamp < CACHE_DURATION &&
      (!USE_LOCAL_DATA || cacheSignature === localSignature)
    ) {
      const jobs = filterJobsByStatus(cachedJobs, options)
      return includeDetails ? jobs : jobs.map(stripDetails)
    }

    const data = USE_LOCAL_DATA
      ? await readLocalJobs().catch(async (error) => {
          console.warn(`Local jobs data unavailable, falling back to remote source: ${error.message}`)
          return fetchRemoteJobs()
        })
      : await fetchRemoteJobs()

    const jobs = sortJobsByNewest(
      (await fillMissingLogoUrls(Array.isArray(data) ? data : [])).map(normalizeJobContent)
    )

    // Update cache
    cachedJobs = jobs
    cacheTimestamp = now
    cacheSignature = localSignature

    const visibleJobs = filterJobsByStatus(jobs, options)
    return includeDetails ? visibleJobs : visibleJobs.map(stripDetails)
  } catch (error) {
    console.error('Error fetching jobs from API:', error.message)
    throw error
  }
}

async function readLocalJobs() {
  const contents = await fs.readFile(getLocalDataPath(), 'utf8')
  return JSON.parse(contents)
}

function getLocalDataPath() {
  return path.isAbsolute(LOCAL_DATA_PATH)
    ? LOCAL_DATA_PATH
    : path.resolve(process.cwd(), LOCAL_DATA_PATH)
}

async function getLocalJobsSignature() {
  const stats = await fs.stat(getLocalDataPath())
  return `${stats.mtimeMs}:${stats.size}`
}

async function fillMissingLogoUrls(jobs) {
  const logoByCompany = new Map()

  for (const job of jobs) {
    if (!job.company || !job.logoUrl) continue
    const key = normalizeCompanyName(job.company)
    if (!logoByCompany.has(key)) {
      logoByCompany.set(key, job.logoUrl)
    }
  }

  const availableLogoSlugs = await getAvailableLogoSlugs().catch(() => new Set())

  return jobs.map((job) => {
    if (job.logoUrl || !job.company) return job

    const companyKey = normalizeCompanyName(job.company)
    const existingLogoUrl = logoByCompany.get(companyKey)
    if (existingLogoUrl) {
      return { ...job, logoUrl: existingLogoUrl }
    }

    const logoSlug = getCompanyLogoSlug(job.company)
    if (availableLogoSlugs.has(logoSlug)) {
      return { ...job, logoUrl: `${COMPANY_LOGOS_CDN_BASE}/${logoSlug}.webp` }
    }

    return job
  })
}

async function getAvailableLogoSlugs() {
  const logoDir = path.join(path.dirname(getLocalDataPath()), 'company-logos')
  const files = await fs.readdir(logoDir)

  return new Set(
    files
      .filter((file) => file.endsWith('.webp'))
      .map((file) => file.replace(/\.webp$/, ''))
  )
}

function normalizeCompanyName(company) {
  return String(company).trim().toLowerCase()
}

function getCompanyLogoSlug(company) {
  return String(company)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  }

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
    .filter((line) => line && !isBrokenScrapeLine(line))
    .join('\n')
}

function isBrokenScrape(value) {
  return /themeOptions|customTheme|pcsx-|data-up-|up-rich-text|__NEXT_DATA__|window\.__/i.test(
    decodeRepeatedly(value)
  )
}

function isBrokenScrapeLine(line) {
  if (/themeOptions|customTheme|pcsx-|data-up-|up-rich-text|window\.__|__NEXT_DATA__/i.test(line)) return true
  if (/^\{.*\}$/.test(line) && line.length > 120) return true
  if (/^[-*•"'}\]]+$/.test(line)) return true
  return false
}

function normalizeTextField(value) {
  if (!value || typeof value !== 'string') return value
  if (isBrokenScrape(value)) return ''
  return htmlToPlainText(value).replace(/\n{3,}/g, '\n\n')
}

function isLowValueSummaryLine(line) {
  const clean = String(line || '').trim()
  if (!clean) return true

  const normalized = clean.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  if (/^p\d+$/i.test(clean)) return true
  if (/^\d+\.$/.test(clean)) return true

  return new Set([
    'job level',
    'employee role',
    'individual contributor',
    'job description',
    'key responsibilities',
    'requirements',
    'qualifications',
    'what you ll do',
    'what youll do',
    'what you need to succeed',
    'bonus qualifications',
    'internal opportunities',
    'put your best foot forward',
  ]).has(normalized)
}

function compactText(value) {
  return htmlToPlainText(value)
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateAtWord(value, maxLength = 220) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text

  const trimmed = text.slice(0, maxLength).replace(/\s+\S*$/, '').trim()
  return `${trimmed}...`
}

export function getJobSummary(job, maxLength = 220) {
  const fallback = `${job.company || 'This company'} is hiring for ${job.title || 'this role'}. Review the official application page for the latest eligibility, location, salary, and application instructions.`
  const candidates = [
    job.description,
    job.overview,
    job.officialDescription,
    job.officialPosting?.descriptionPlain,
    job.sourceDescription,
  ]

  for (const candidate of candidates) {
    const lines = htmlToPlainText(candidate)
      .split(/\r?\n/)
      .map((line) => line.replace(/^-+\s*/, '').trim())
      .filter((line) => line.length >= 55 && !isLowValueSummaryLine(line))

    if (lines.length) {
      return truncateAtWord(lines[0], maxLength)
    }
  }

  for (const candidate of candidates) {
    const text = compactText(candidate)
    if (text.length >= 55) return truncateAtWord(text, maxLength)
  }

  return truncateAtWord(fallback, maxLength)
}

function normalizeJobContent(job) {
  const normalized = {
    ...job,
    description: normalizeTextField(job.description),
    overview: normalizeTextField(job.overview),
    officialDescription: normalizeTextField(job.officialDescription),
    sourceDescription: normalizeTextField(job.sourceDescription),
  }

  if (job.officialPosting && typeof job.officialPosting === 'object') {
    normalized.officialPosting = {
      ...job.officialPosting,
      descriptionPlain: normalizeTextField(job.officialPosting.descriptionPlain),
    }
  }

  return normalized
}

export function sortJobsByNewest(jobs) {
  return [...jobs].sort((a, b) => {
    const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0
    const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0

    if (dateB !== dateA) {
      return dateB - dateA
    }

    return getJobSortId(b) - getJobSortId(a)
  })
}

function getJobSortId(job) {
  const numericId = Number(job.id)
  if (Number.isFinite(numericId)) return numericId

  return 0
}

async function fetchRemoteJobs() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(JOBS_URL, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`)
    }

    return response.json()
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Get a single job by ID with full details
 * @param {string|number} id - The job ID
 * @returns {Promise<Object|null>} Job object or null if not found
 */
export async function getJobById(id) {
  try {
    const jobs = await getAllJobs(true, { includeClosed: true })
    return jobs.find(j => String(j.id) === String(id)) ?? null
  } catch (error) {
    console.error(`Error fetching job ${id}:`, error.message)
    throw error
  }
}

/**
 * Strip detailed fields from job for list view
 * @param {Object} job - Full job object
 * @returns {Object} Job object with only list view fields
 */
function stripDetails(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    remote: job.remote,
    experience: job.experience,
    workMode: job.workMode,
    postedAt: job.postedAt,
    salary: job.salary,
    overview: getJobSummary(job),
    link: job.link || job.applyUrl || job.applyLink,
    logoUrl: job.logoUrl,
    tags: job.tags,
    status: job.status || 'active',
    closedAt: job.closedAt,
  }
}

function isInactiveJob(job) {
  const status = String(job.status || '').toLowerCase()
  return status === 'closed' || status === 'review_needed' || Boolean(job.closedAt)
}

function filterJobsByStatus(jobs, options = {}) {
  if (options.includeClosed) return jobs
  return jobs.filter((job) => !isInactiveJob(job))
}

/**
 * Get jobs with pagination
 * @param {number} limit - Number of jobs to return
 * @param {number} offset - Number of jobs to skip
 * @param {boolean} includeDetails - Whether to include detailed fields
 * @returns {Promise<Array>} Paginated job objects
 */
export async function getJobsWithPagination(limit = 300, offset = 0, includeDetails = false) {
  try {
    const jobs = await getAllJobs(includeDetails)
    return jobs.slice(offset, offset + limit)
  } catch (error) {
    console.error('Error fetching paginated jobs:', error.message)
    throw error
  }
}
