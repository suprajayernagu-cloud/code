import { getAllJobs } from '@/src/lib/jobs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 300
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : 0
    const details = searchParams.get('details') === 'true'

    // Fetch jobs from centralized lib
    const jobs = await getAllJobs(details)

    // Apply pagination
    const paginatedJobs = jobs.slice(offset, offset + limit)

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
