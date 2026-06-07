import fs from 'fs/promises'
import path from 'path'
import { JOBS_URL, LOCAL_DATA_PATH, USE_LOCAL_DATA } from '@/src/config'

let cachedJobs = null
let cacheTimestamp = 0
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

/**
 * Fetch all jobs from external source with caching
 * @param {boolean} includeDetails - Whether to include detailed fields
 * @param {Object} options - Loader options
 * @param {boolean} options.includeClosed - Whether to include closed/expired jobs
 * @returns {Promise<Array>} Array of job objects
 */
export async function getAllJobs(includeDetails = false, options = {}) {
  try {
    // Check cache validity
    const now = Date.now()
    if (cachedJobs && now - cacheTimestamp < CACHE_DURATION) {
      const jobs = filterJobsByStatus(cachedJobs, options)
      return includeDetails ? jobs : jobs.map(stripDetails)
    }

    const data = USE_LOCAL_DATA
      ? await readLocalJobs().catch(async (error) => {
          console.warn(`Local jobs data unavailable, falling back to remote source: ${error.message}`)
          return fetchRemoteJobs()
        })
      : await fetchRemoteJobs()

    const jobs = Array.isArray(data) ? data : []

    // Update cache
    cachedJobs = jobs
    cacheTimestamp = now

    const visibleJobs = filterJobsByStatus(jobs, options)
    return includeDetails ? visibleJobs : visibleJobs.map(stripDetails)
  } catch (error) {
    console.error('Error fetching jobs from API:', error.message)
    throw error
  }
}

async function readLocalJobs() {
  const localPath = path.isAbsolute(LOCAL_DATA_PATH)
    ? LOCAL_DATA_PATH
    : path.resolve(process.cwd(), LOCAL_DATA_PATH)
  const contents = await fs.readFile(localPath, 'utf8')
  return JSON.parse(contents)
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
