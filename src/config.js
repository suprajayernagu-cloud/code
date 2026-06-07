// Hiringstoday runtime configuration

// Data source configuration
// Uses local enriched JSON for better SEO and content quality
// Falls back to remote URL if needed
export const USE_LOCAL_DATA = true
export const LOCAL_DATA_PATH = '../Job-data/Jobdetails.json'
export const JOBS_URL = 'https://suprajayernagu-cloud.github.io/Job-data/Jobdetails.json'
export const COMPANIES_URL = 'https://suprajayernagu-cloud.github.io/Job-data/companies.json'

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
