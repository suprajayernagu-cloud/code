import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://hiringstoday.in'
const JOBS_URL = 'https://suprajayernagu-cloud.github.io/Job-data/Jobdetails.json'
const LOCAL_JOBS_PATH = '../../Job-data/Jobdetails.json'
const STATIC_PATHS = [
  '/',
  '/jobs',
  '/blog',
  '/resources',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/disclaimer',
]

const JOB_FILTER_PATHS = [
  '/jobs/fresher',
  '/jobs/experienced',
  '/jobs/internship',
  '/jobs/remote',
  '/jobs/office',
  '/jobs/hybrid',
  '/jobs/walk-in',
  '/jobs/bangalore',
  '/jobs/hyderabad',
  '/jobs/pune',
  '/jobs/mumbai',
  '/jobs/delhi',
  '/jobs/chennai',
  '/jobs/noida',
  '/jobs/gurgaon',
  '/jobs/kolkata',
  '/jobs/btech',
  '/jobs/mca',
  '/jobs/mba',
  '/jobs/diploma',
  '/jobs/any-degree',
  '/jobs/india',
  '/jobs/2026',
  '/jobs/2025',
]

const RESOURCE_PATHS = [
  '/resources/resume-writing-guide',
  '/resources/interview-prep-guide',
  '/resources/salary-negotiation-guide',
  '/resources/job-search-strategy',
  '/resources/career-transition-guide',
  '/resources/remote-job-success',
]

function getJobPath(job) {
  return job?.id ? `/job/${encodeURIComponent(String(job.id))}` : ''
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

function escapeXml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function fetchJobs() {
  try {
    const response = await fetch(JOBS_URL)

    if (!response.ok) {
      throw new Error(`Unable to fetch jobs for sitemap generation: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const localPath = path.resolve(__dirname, LOCAL_JOBS_PATH)
    const data = JSON.parse(await fs.readFile(localPath, 'utf8'))
    return Array.isArray(data) ? data : []
  }
}

async function readBlogPaths() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const blogPath = path.join(__dirname, '..', 'src', 'data', 'blog.js')
  const source = await fs.readFile(blogPath, 'utf8')
  const slugs = [...source.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1])

  return [...new Set(slugs)].map((slug) => `/blog/${slug}`)
}

function toEntry(pathname, lastmod) {
  return {
    loc: pathname === '/' ? SITE_URL : `${SITE_URL}${pathname}`,
    lastmod,
  }
}

async function buildEntries(jobs) {
  const today = new Date().toISOString().slice(0, 10)
  const blogPaths = await readBlogPaths()
  const entries = [
    ...STATIC_PATHS,
    ...JOB_FILTER_PATHS,
    ...RESOURCE_PATHS,
    ...blogPaths,
  ].map((pathname) => toEntry(pathname, today))

  const dedupedJobs = new Map()

  jobs.forEach((job) => {
    const pathname = getJobPath(job)
    if (!pathname) return

    const loc = `${SITE_URL}${pathname}`
    const lastmod = formatDate(job.postedAt) || today
    const existing = dedupedJobs.get(loc)

    if (!existing || lastmod > existing.lastmod) {
      dedupedJobs.set(loc, { loc, lastmod })
    }
  })

  return [...entries, ...dedupedJobs.values()].sort((left, right) => left.loc.localeCompare(right.loc))
}

async function writeSitemap(entries) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const targetPath = path.join(__dirname, '..', 'public', 'sitemap.xml')

  const body = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

  await fs.writeFile(targetPath, xml, 'utf8')
}

async function main() {
  const jobs = await fetchJobs()
  const entries = await buildEntries(jobs)
  await writeSitemap(entries)
  console.log(`Generated sitemap with ${entries.length} URLs.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
