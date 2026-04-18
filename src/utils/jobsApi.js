import { USE_LOCAL_DATA, LOCAL_DATA_PATH, JOBS_URL } from '../config'

let cachedJobs = null

/**
 * Fetch jobs from local enriched data or remote source
 * Caches results for performance
 */
export async function fetchJobs() {
  // Return cached data if available
  if (cachedJobs) {
    return cachedJobs
  }

  try {
    let data

    if (USE_LOCAL_DATA) {
      // Try to load from local enriched JSON
      try {
        const response = await fetch(LOCAL_DATA_PATH)
        if (response.ok) {
          data = await response.json()
          console.log(`✓ Loaded ${data.length} jobs from local enriched data`)
        } else {
          throw new Error('Local data not found, falling back to remote')
        }
      } catch (error) {
        console.warn('Failed to load local data, trying remote URL:', error.message)
        const response = await fetch(JOBS_URL)
        if (!response.ok) throw new Error('Failed to fetch remote jobs')
        data = await response.json()
        console.log(`✓ Loaded ${data.length} jobs from remote source`)
      }
    } else {
      // Load from remote source
      const response = await fetch(JOBS_URL)
      if (!response.ok) throw new Error('Failed to fetch remote jobs')
      data = await response.json()
      console.log(`✓ Loaded ${data.length} jobs from remote source`)
    }

    // Validate and normalize data
    if (!Array.isArray(data)) {
      throw new Error('Invalid jobs data format')
    }

    // Cache the data
    cachedJobs = data

    return data
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

/**
 * Get a single job by ID
 */
export async function getJobById(jobId) {
  const jobs = await fetchJobs()
  return jobs.find(job => job.id === parseInt(jobId))
}

/**
 * Search jobs by criteria
 */
export async function searchJobs(filters = {}) {
  let jobs = await fetchJobs()

  if (filters.company) {
    jobs = jobs.filter(j => j.company?.toLowerCase().includes(filters.company.toLowerCase()))
  }

  if (filters.location) {
    jobs = jobs.filter(j => j.location?.toLowerCase().includes(filters.location.toLowerCase()))
  }

  if (filters.title) {
    jobs = jobs.filter(j => j.title?.toLowerCase().includes(filters.title.toLowerCase()))
  }

  if (filters.minSalary) {
    jobs = jobs.filter(j => {
      const salary = parseInt(j.salary?.toString().replace(/\D/g, '') || 0)
      return salary >= filters.minSalary
    })
  }

  if (filters.tags) {
    jobs = jobs.filter(j => filters.tags.some(tag => (j.tags || []).includes(tag)))
  }

  return jobs
}

/**
 * Get related jobs based on company or skills
 */
export async function getRelatedJobs(currentJobId, limit = 5) {
  const jobs = await fetchJobs()
  const currentJob = jobs.find(j => j.id === parseInt(currentJobId))

  if (!currentJob) return []

  const scored = jobs
    .filter(j => j.id !== parseInt(currentJobId))
    .map(job => {
      let score = 0

      // Same company (high priority)
      if (job.company === currentJob.company) score += 100

      // Same location
      if (job.location === currentJob.location) score += 50

      // Shared tags/skills
      const currentTags = currentJob.tags || []
      const jobTags = job.tags || []
      const sharedTags = jobTags.filter(t => currentTags.includes(t)).length
      score += sharedTags * 10

      return { ...job, _score: score }
    })
    .sort((a, b) => b._score - a._score)
    .map(({ _score, ...job }) => job)
    .slice(0, limit)

  return scored
}

/**
 * Get job statistics
 */
export async function getJobStats() {
  const jobs = await fetchJobs()

  const stats = {
    totalJobs: jobs.length,
    companies: new Set(jobs.map(j => j.company)).size,
    locations: new Set(jobs.map(j => j.location)).size,
    averageSalary: Math.round(
      jobs.reduce((sum, j) => {
        const salary = parseInt(j.salary?.toString().replace(/\D/g, '') || 0)
        return sum + salary
      }, 0) / jobs.length
    ),
    tags: [...new Set(jobs.flatMap(j => j.tags || []))],
  }

  return stats
}
