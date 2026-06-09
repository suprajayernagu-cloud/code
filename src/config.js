// Hiringstoday runtime configuration

// Data source configuration
// During development, fetch from GitHub API (private repo)
// In production, can switch to local if needed
export const USE_LOCAL_DATA = process.env.USE_LOCAL_DATA === 'true' // Default: false (fetch from GitHub)
export const LOCAL_DATA_PATH = '../Job-data/Jobdetails.json'

// GitHub API URLs for private repository access
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
export const GITHUB_API_BASE = 'https://api.github.com/repos/suprajayernagu-cloud/Job-data/contents'
export const GITHUB_API_HEADERS = GITHUB_TOKEN ? {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3.raw'
} : {}

// Legacy URLs (kept for reference, now using GitHub API for private repo)
export const JOBS_URL = `${GITHUB_API_BASE}/Jobdetails.json`
export const COMPANIES_URL = `${GITHUB_API_BASE}/companies.json`

export const SITE_URL = 'https://hiringstoday.in'
export const CONTACT_EMAIL = 'hiringstoday7@gmail.com'
export const ADSENSE_CLIENT_ID = 'ca-pub-7664393734940549'
export const ENABLE_ADSENSE_SCRIPT = process.env.NEXT_PUBLIC_ENABLE_ADSENSE_SCRIPT === 'true'
export const PRIVACY_MESSAGE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PRIVACY_MESSAGE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_FC_SCRIPT_URL || ''

// SEO & Meta defaults
export const DEFAULT_META = {
  title: 'Hiringstoday - Daily Job Updates and Career Blog',
  description: 'Find daily updated jobs in India and read practical career advice for interviews, fresher jobs, salary negotiation, and job search planning.',
  keywords: 'daily jobs, job updates, career blog, jobs, hiring, tech jobs, software engineer, india jobs, interview tips, salary negotiation',
}

// Feature flags
export const FEATURES = {
  ENHANCED_JOB_DETAILS: true,
  BLOG_SECTION: true,
  RELATED_JOBS: true,
  INTERNAL_LINKING: true,
}
