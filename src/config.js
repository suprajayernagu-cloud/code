// Hiringstoday runtime configuration

export const JOBS_URL = 'https://suprajayernagu-cloud.github.io/Job-data/Jobdetails.json'
export const COMPANIES_URL = 'https://suprajayernagu-cloud.github.io/Job-data/companies.json'

export const SITE_URL = 'https://hiringstoday.in'
export const CONTACT_EMAIL = 'hiringstoday7@gmail.com'
export const ADSENSE_CLIENT_ID = 'ca-pub-7664393734940549'
export const ENABLE_ADSENSE_SCRIPT = import.meta.env.VITE_ENABLE_ADSENSE_SCRIPT === 'true'
export const PRIVACY_MESSAGE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_PRIVACY_MESSAGE_SCRIPT_URL || import.meta.env.VITE_GOOGLE_FC_SCRIPT_URL || ''
