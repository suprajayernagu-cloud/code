// Hiringstoday runtime configuration

// Data source configuration
// Uses local enriched JSON for better SEO and content quality
// Falls back to remote URL if needed
export const USE_LOCAL_DATA = true
export const LOCAL_DATA_PATH = '/src/Untitled-1.json'
export const JOBS_URL = 'https://suprajayernagu-cloud.github.io/Job-data/Jobdetails.json'
export const COMPANIES_URL = 'https://suprajayernagu-cloud.github.io/Job-data/companies.json'

export const SITE_URL = 'https://hiringstoday.in'
export const CONTACT_EMAIL = 'hiringstoday7@gmail.com'
export const ADSENSE_CLIENT_ID = 'ca-pub-7664393734940549'
export const ENABLE_ADSENSE_SCRIPT = import.meta.env.VITE_ENABLE_ADSENSE_SCRIPT === 'true'
export const PRIVACY_MESSAGE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_PRIVACY_MESSAGE_SCRIPT_URL || import.meta.env.VITE_GOOGLE_FC_SCRIPT_URL || ''

// SEO & Meta defaults
export const DEFAULT_META = {
  title: 'HiringsToday - Premium Job Board for Tech Professionals',
  description: 'Discover curated job opportunities at leading tech companies. Find roles matching your skills with detailed company insights, salary info, and interview preparation guides.',
  keywords: 'jobs, hiring, tech jobs, software engineer, india jobs, career',
}

// Feature flags
export const FEATURES = {
  ENHANCED_JOB_DETAILS: true,
  BLOG_SECTION: true,
  RELATED_JOBS: true,
  INTERNAL_LINKING: true,
}
