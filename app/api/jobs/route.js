import { JOBS_URL } from '@/src/config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 300 // Fetch all jobs (278+)
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0

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
      return Response.json(
        { error: 'Failed to fetch jobs' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Ensure data is an array
    const jobs = Array.isArray(data) ? data : []
    
    // Check if request is for full details or just list
    const includeDetails = searchParams.get('details') === 'true'
    
    // Apply pagination - return only needed fields to reduce size
    const paginatedJobs = jobs.slice(offset, offset + limit).map(job => {
      const baseJob = {
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
      
      // Only include detailed fields if requested (for detail page)
      if (includeDetails) {
        baseJob.responsibilitiesDetailed = job.responsibilitiesDetailed
        baseJob.skillsRequired = job.skillsRequired
        baseJob.salaryInsights = job.salaryInsights
        baseJob.whyApply = job.whyApply
      }
      
      return baseJob
    })

    return Response.json(paginatedJobs, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'X-Total-Count': jobs.length.toString(),
      },
    })
  } catch (error) {
    console.error('API /jobs error:', error)
    return Response.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
