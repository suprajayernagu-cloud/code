import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE_URL = 'https://hiringstoday.in'
const JOBS_URL = 'https://suprajayernagu-cloud.github.io/Job-data/Jobdetails.json'
const STATIC_PATHS = ['/', '/about', '/contact', '/privacy', '/disclaimer']

function toSlug(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getJobPath(job) {
  const companySlug = toSlug(job?.company) || 'company'
  const titleSlug = toSlug(job?.title) || 'role'
  return `/jobs/${encodeURIComponent(companySlug)}/${encodeURIComponent(titleSlug)}`
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
  const response = await fetch(JOBS_URL)

  if (!response.ok) {
    throw new Error(`Unable to fetch jobs for sitemap generation: ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

function buildEntries(jobs) {
  const today = new Date().toISOString().slice(0, 10)
  const entries = STATIC_PATHS.map((pathname) => ({
    loc: pathname === '/' ? SITE_URL : `${SITE_URL}${pathname}`,
    lastmod: today,
  }))

  const dedupedJobs = new Map()

  jobs.forEach((job) => {
    const pathname = getJobPath(job)
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
  const entries = buildEntries(jobs)
  await writeSitemap(entries)
  console.log(`Generated sitemap with ${entries.length} URLs.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
