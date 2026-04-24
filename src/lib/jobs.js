import { JOBS_URL, SITE_URL } from '@/src/config'

let cachedJobs = null
let cacheTimestamp = 0
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

/**
 * Fetch all jobs from external source with caching
 * @param {boolean} includeDetails - Whether to include detailed fields
 * @returns {Promise<Array>} Array of job objects
 */
export async function getAllJobs(includeDetails = false) {
  try {
    // Check cache validity
    const now = Date.now()
    if (cachedJobs && now - cacheTimestamp < CACHE_DURATION) {
      return includeDetails ? cachedJobs : cachedJobs.map(stripDetails)
    }

    // Fetch from external URL with timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(JOBS_URL, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`)
    }

    const data = await response.json()
    const jobs = Array.isArray(data) ? data : []

    // Update cache
    cachedJobs = jobs
    cacheTimestamp = now

    return includeDetails ? jobs : jobs.map(stripDetails)
  } catch (error) {
    console.error('Error fetching jobs from API:', error.message)
    throw error
  }
}

/**
 * Get a single job by ID with full details
 * @param {string|number} id - The job ID
 * @returns {Promise<Object|null>} Job object or null if not found
 */
export async function getJobById(id) {
  try {
    const jobs = await getAllJobs(true)
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
  }
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
