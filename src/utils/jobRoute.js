function toSlug(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCompanySlug(company) {
  return toSlug(company) || 'company'
}

export function getJobTitleSlug(title) {
  return toSlug(title) || 'role'
}

export function getJobPath(job) {
  return `/jobs/${encodeURIComponent(getCompanySlug(job?.company))}/${encodeURIComponent(getJobTitleSlug(job?.title))}`
}

export function hasCompanySlug(job, slugParam = '') {
  let decodedSlug = slugParam
  try {
    decodedSlug = decodeURIComponent(slugParam)
  } catch {
    decodedSlug = slugParam
  }

  return getCompanySlug(job?.company) === decodedSlug.toLowerCase()
}

export function hasJobSlugs(job, companySlugParam = '', titleSlugParam = '') {
  let decodedCompanySlug = companySlugParam
  let decodedTitleSlug = titleSlugParam

  try {
    decodedCompanySlug = decodeURIComponent(companySlugParam)
  } catch {
    decodedCompanySlug = companySlugParam
  }

  try {
    decodedTitleSlug = decodeURIComponent(titleSlugParam)
  } catch {
    decodedTitleSlug = titleSlugParam
  }

  return (
    getCompanySlug(job?.company) === decodedCompanySlug.toLowerCase() &&
    getJobTitleSlug(job?.title) === decodedTitleSlug.toLowerCase()
  )
}
