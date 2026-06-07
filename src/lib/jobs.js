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

    const jobs = sortJobsByNewest(await fillMissingLogoUrls(Array.isArray(data) ? data : []))

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
    overview: job.overview,
    link: job.link || job.applyUrl || job.applyLink,
    logoUrl: job.logoUrl,
    tags: job.tags,
    status: job.status || 'active',
    closedAt: job.closedAt,
  }
}

function isClosedJob(job) {
  return String(job.status || '').toLowerCase() === 'closed' || Boolean(job.closedAt)
}

function filterJobsByStatus(jobs, options = {}) {
  if (options.includeClosed) return jobs
  return jobs.filter((job) => !isClosedJob(job))
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
