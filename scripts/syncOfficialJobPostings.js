#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const today = new Date().toISOString().slice(0, 10)
const DRY_RUN = process.argv.includes('--dry-run')
const REPORT_PATH = path.resolve(path.dirname(inputPath), 'official-sync-report.json')
const GENERIC_FETCH_TIMEOUT_MS = 5000
const GENERIC_CONCURRENCY = 8

const AGGREGATOR_HOST_PATTERNS = [
  /(^|\.)indeed\.com$/i,
  /(^|\.)linkedin\.com$/i,
  /(^|\.)naukri\.com$/i,
  /(^|\.)foundit\.in$/i,
  /(^|\.)unstop\.com$/i,
  /(^|\.)joinsuperset\.com$/i,
]

function cleanText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanPlainText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .split(/\r?\n/)
    .map(cleanText)
    .filter(Boolean)
    .join('\n')
}

function normalizeUrl(value) {
  return String(value || '').trim()
}

function getHost(rawUrl) {
  try {
    return new URL(normalizeUrl(rawUrl)).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function isKnownAggregator(rawUrl) {
  const host = getHost(rawUrl)
  return host ? AGGREGATOR_HOST_PATTERNS.some((pattern) => pattern.test(host)) : false
}

function toDateOnly(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function titleCaseEmploymentType(value) {
  const normalized = cleanText(value)
  const map = {
    FullTime: 'Full-time',
    PartTime: 'Part-time',
    Contract: 'Contract',
    Internship: 'Internship',
    Temporary: 'Temporary',
  }
  return map[normalized] || normalized || 'Not mentioned'
}

function formatLocation(posting) {
  const location = cleanText(posting.location)
  const country = cleanText(posting.address?.postalAddress?.addressCountry)
  if (!location) return country || 'Not mentioned'
  if (!country || location.toLowerCase().includes(country.toLowerCase())) return location
  return `${location}, ${country}`
}

function getPrimaryUrl(job) {
  return normalizeUrl(job.sourceUrl || job.applyUrl || job.link || job.applyLink)
}

function parseAshbyUrl(rawUrl) {
  const url = normalizeUrl(rawUrl)
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'jobs.ashbyhq.com') return null
    const parts = parsed.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null

    return {
      board: parts[0],
      postingId: parts[1],
    }
  } catch {
    return null
  }
}

function parseLeverUrl(rawUrl) {
  const url = normalizeUrl(rawUrl)
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (parsed.hostname !== 'jobs.lever.co') return null
    const parts = parsed.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null

    return {
      company: parts[0],
      postingId: parts[1],
    }
  } catch {
    return null
  }
}

function parseGreenhouseUrl(rawUrl) {
  const url = normalizeUrl(rawUrl)
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname
    const parts = parsed.pathname.split('/').filter(Boolean)

    if (host === 'boards.greenhouse.io' || host === 'job-boards.greenhouse.io') {
      if (parts[0] === 'embed' && parts[1] === 'job_app') {
        const board = parsed.searchParams.get('for')
        const jobId = parsed.searchParams.get('token')
        return board && jobId ? { board, jobId } : null
      }

      const jobsIndex = parts.indexOf('jobs')
      if (parts[0] && jobsIndex >= 0 && parts[jobsIndex + 1]) {
        return { board: parts[0], jobId: parts[jobsIndex + 1] }
      }
    }

    return null
  } catch {
    return null
  }
}

async function fetchAshbyBoard(board) {
  const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}?includeCompensation=true`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Ashby ${board} returned ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data.jobs) ? data.jobs : []
}

async function fetchLeverPosting(company, postingId) {
  const response = await fetch(`https://api.lever.co/v0/postings/${encodeURIComponent(company)}/${encodeURIComponent(postingId)}?mode=json`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Lever ${company}/${postingId} returned ${response.status}`)
  }

  return response.json()
}

async function fetchGreenhousePosting(board, jobId) {
  const response = await fetch(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(board)}/jobs/${encodeURIComponent(jobId)}?questions=false`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Greenhouse ${board}/${jobId} returned ${response.status}`)
  }

  return response.json()
}

async function fetchHtmlPage(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), GENERIC_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 HiringstodayBot/1.0 (+https://hiringstoday.in)',
      },
      redirect: 'follow',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`returned ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error(`non-html content type ${contentType || 'unknown'}`)
    }

    return {
      finalUrl: response.url || url,
      html: await response.text(),
    }
  } finally {
    clearTimeout(timeout)
  }
}

function htmlToPlainText(value) {
  return cleanPlainText(
    String(value || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|ul|ol)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
  )
}

function extractMetaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escaped}["'][^>]*>`, 'i'),
  ]
  const match = patterns.map((pattern) => html.match(pattern)).find(Boolean)
  return match ? htmlToPlainText(match[1]) : ''
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? htmlToPlainText(match[1]) : ''
}

function parseJsonMaybe(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function flattenJsonLd(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd)
  if (typeof value !== 'object') return []

  const nodes = [value]
  if (Array.isArray(value['@graph'])) nodes.push(...value['@graph'])
  return nodes.flatMap((node) => {
    const nested = []
    if (Array.isArray(node.itemListElement)) nested.push(...node.itemListElement)
    if (node.mainEntity) nested.push(node.mainEntity)
    return [node, ...nested]
  })
}

function isJobPostingNode(node) {
  const type = node?.['@type']
  return Array.isArray(type)
    ? type.some((item) => String(item).toLowerCase() === 'jobposting')
    : String(type || '').toLowerCase() === 'jobposting'
}

function extractJsonLdJobPosting(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  for (const script of scripts) {
    const parsed = parseJsonMaybe(
      script[1]
        .replace(/<!--|-->/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
    )
    const posting = flattenJsonLd(parsed).find(isJobPostingNode)
    if (posting) return posting
  }
  return null
}

function schemaLocation(value) {
  const first = Array.isArray(value) ? value[0] : value
  const address = first?.address || first
  return cleanText([
    address?.addressLocality,
    address?.addressRegion,
    address?.addressCountry?.name || address?.addressCountry,
  ].filter(Boolean).join(', '))
}

function normalizeEmploymentType(value) {
  const raw = Array.isArray(value) ? value[0] : value
  return cleanText(String(raw || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()))
}

function genericDescriptionFromHtml(html) {
  const schema = extractJsonLdJobPosting(html)
  const schemaDescription = htmlToPlainText(schema?.description || '')
  if (schemaDescription.length >= 180) {
    return {
      source: 'json-ld',
      schema,
      description: schemaDescription,
    }
  }

  const metaDescription = extractMetaContent(html, 'description') || extractMetaContent(html, 'og:description')
  const bodyText = htmlToPlainText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
  )

  const chosen = bodyText.length > metaDescription.length ? bodyText : metaDescription
  return {
    source: schema ? 'json-ld-partial' : 'page-text',
    schema,
    description: chosen,
  }
}

function isUsefulJobDescription(description, job) {
  const text = cleanText(description)
  if (text.length < 220) return false
  const lower = text.toLowerCase()
  const titleWords = cleanText(job.title)
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((word) => word.length >= 4)
  const titleMatches = titleWords.filter((word) => lower.includes(word)).length
  const jobSignals = [
    /\bresponsibilit/i,
    /\bqualification/i,
    /\brequirement/i,
    /\bexperience/i,
    /\bapply/i,
    /\brole\b/i,
    /\bjob\b/i,
    /\bengineer\b/i,
    /\bdeveloper\b/i,
  ].filter((pattern) => pattern.test(text)).length

  return jobSignals >= 2 && (titleMatches >= 1 || lower.includes(cleanText(job.company).toLowerCase()))
}

function splitOfficialSections(description) {
  const sections = {}
  let current = ''

  String(description || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const normalized = line.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
      const isHeading =
        line.length <= 90 &&
        (
          line === line.toUpperCase() ||
          [
            'about the role',
            'what youll do',
            'what you ll do',
            'what were looking for',
            'what we re looking for',
            'requirements',
            'qualifications',
            'responsibilities',
            'bonus points',
            'why sarvam',
            'about sarvam',
          ].includes(normalized)
        )

      if (isHeading) {
        current = normalized
        sections[current] = sections[current] || []
        return
      }

      if (!current) current = 'summary'
      sections[current] = sections[current] || []
      sections[current].push(line)
    })

  return sections
}

function bulletItems(lines) {
  return (lines || [])
    .map((line) => cleanText(line).replace(/^[-*]\s+/, '').replace(/^\u2022\s*/, ''))
    .filter(Boolean)
}

function firstNonEmpty(...lists) {
  return lists.find((list) => Array.isArray(list) && list.length > 0) || []
}

function firstParagraph(lines) {
  return cleanText((lines || []).find((line) => !line.match(/^[-*\u2022]\s*/)) || '')
}

function inferExperience(description) {
  const text = cleanText(description)
  const match = text.match(/(\d+\s*[–-]\s*\d+\s*years|\d+\+?\s*years)/i)
  return match ? match[1].replace(/\s+/g, ' ') : ''
}

function inferTags(description) {
  const checks = [
    ['Python', /\bpython\b/i],
    ['Node.js', /\bnode\.?js\b/i],
    ['React', /\breact\b/i],
    ['Next.js', /\bnext\.?js\b/i],
    ['AI/ML', /\bai\/ml\b|\bai\b|\bml\b|machine learning/i],
    ['REST APIs', /\brestful?\s+apis?\b/i],
    ['System Design', /system design/i],
    ['Cloud', /\baws\b|\bgcp\b|\bazure\b|cloud/i],
    ['EdTech', /\bedtech\b|education/i],
  ]

  return checks
    .filter(([, pattern]) => pattern.test(description))
    .map(([tag]) => tag)
    .slice(0, 8)
}

function compensationLabel(compensation) {
  if (!compensation) return 'Not mentioned'
  return cleanText(
    compensation.scrapeableCompensationSalarySummary ||
    compensation.compensationTierSummary ||
    ''
  ) || 'Not mentioned'
}

function updateFromAshbyPosting(job, posting, board, postingId) {
  const officialDescription = cleanPlainText(posting.descriptionPlain)
  const sections = splitOfficialSections(posting.descriptionPlain)
  const responsibilities = firstNonEmpty(
    bulletItems(sections['what youll do']),
    bulletItems(sections['what you ll do']),
    bulletItems(sections.responsibilities)
  )
  const qualifications = firstNonEmpty(
    bulletItems(sections['what were looking for']),
    bulletItems(sections['what we re looking for']),
    bulletItems(sections.requirements),
    bulletItems(sections.qualifications)
  )
  const aboutRole = firstParagraph(sections['about the role']) || firstParagraph(sections.summary)
  const location = formatLocation(posting)
  const sourceUrl = posting.jobUrl || `https://jobs.ashbyhq.com/${board}/${postingId}`

  const tags = inferTags(posting.descriptionPlain)

  return {
    ...job,
    title: cleanText(posting.title) || job.title,
    company: job.company,
    location,
    salary: compensationLabel(posting.compensation),
    experience: inferExperience(posting.descriptionPlain) || job.experience || 'Not mentioned',
    type: titleCaseEmploymentType(posting.employmentType) || job.type,
    remote: Boolean(posting.isRemote),
    tags: tags.length ? tags : job.tags,
    applyUrl: posting.applyUrl || sourceUrl,
    sourceName: 'Official Ashby job posting',
    sourceType: 'Official application page',
    sourceUrl,
    lastCheckedAt: today,
    postedAt: toDateOnly(posting.publishedAt) || job.postedAt,
    applicationDeadline: 'Not mentioned',
    description: aboutRole || officialDescription.slice(0, 240) || job.description,
    overview: aboutRole || job.overview,
    responsibilities: responsibilities.length ? responsibilities : job.responsibilities,
    qualifications: qualifications.length ? qualifications : job.qualifications,
    officialDescription,
    officialPosting: {
      provider: 'Ashby',
      jobBoard: board,
      postingId,
      department: posting.department || '',
      team: posting.team || '',
      employmentType: posting.employmentType || '',
      workplaceType: posting.workplaceType || '',
      isListed: Boolean(posting.isListed),
      isRemote: Boolean(posting.isRemote),
      publishedAt: posting.publishedAt || '',
      jobUrl: sourceUrl,
      applyUrl: posting.applyUrl || '',
      compensation: posting.compensation || null,
      descriptionPlain: officialDescription,
      fetchedAt: today,
    },
    editorNote: `HiringsToday checked this ${job.company || 'company'} job against the official Ashby posting on ${today}. Use the official apply button for the latest instructions.`,
  }
}

function updateFromLeverPosting(job, posting, company, postingId) {
  const lists = Array.isArray(posting.lists) ? posting.lists : []
  const officialDescription = cleanPlainText([
    htmlToPlainText(posting.descriptionPlain || posting.description),
    ...lists.map((list) => [
      cleanText(list.text),
      ...bulletItems(list.content?.split(/\r?\n/) || [htmlToPlainText(list.content)]).map((item) => `• ${item}`),
    ].filter(Boolean).join('\n')),
    htmlToPlainText(posting.additionalPlain || posting.additional),
  ].filter(Boolean).join('\n\n'))

  const responsibilities = firstNonEmpty(
    ...lists
      .filter((list) => /responsibil|what|do|role/i.test(cleanText(list.text)))
      .map((list) => bulletItems(htmlToPlainText(list.content).split(/\r?\n/)))
  )
  const qualifications = firstNonEmpty(
    ...lists
      .filter((list) => /qualif|require|looking|skills|experience/i.test(cleanText(list.text)))
      .map((list) => bulletItems(htmlToPlainText(list.content).split(/\r?\n/)))
  )
  const categories = posting.categories || {}
  const location = cleanText(categories.location) || job.location || 'Not mentioned'
  const sourceUrl = posting.hostedUrl || `https://jobs.lever.co/${company}/${postingId}`
  const applyUrl = posting.applyUrl || `${sourceUrl}/apply`
  const tags = inferTags(officialDescription)

  return {
    ...job,
    title: cleanText(posting.text) || job.title,
    location,
    type: cleanText(categories.commitment) || job.type || 'Not mentioned',
    remote: /remote/i.test(`${location} ${categories.workplaceType || ''}`),
    tags: tags.length ? tags : job.tags,
    applyUrl,
    sourceName: 'Official Lever job posting',
    sourceType: 'Official application page',
    sourceUrl,
    lastCheckedAt: today,
    postedAt: toDateOnly(posting.createdAt) || job.postedAt,
    applicationDeadline: 'Not mentioned',
    description: cleanText(posting.descriptionPlain || htmlToPlainText(posting.description)) || job.description,
    overview: cleanText(posting.descriptionPlain || htmlToPlainText(posting.description)) || job.overview,
    responsibilities: responsibilities.length ? responsibilities : job.responsibilities,
    qualifications: qualifications.length ? qualifications : job.qualifications,
    officialDescription,
    officialPosting: {
      provider: 'Lever',
      company,
      postingId,
      department: cleanText(categories.department),
      team: cleanText(categories.team),
      location,
      commitment: cleanText(categories.commitment),
      workplaceType: cleanText(categories.workplaceType),
      hostedUrl: sourceUrl,
      applyUrl,
      fetchedAt: today,
      descriptionPlain: officialDescription,
    },
    editorNote: `HiringsToday checked this ${job.company || 'company'} job against the official Lever posting on ${today}. Use the official apply button for the latest instructions.`,
  }
}

function updateFromGreenhousePosting(job, posting, board, jobId) {
  const officialDescription = htmlToPlainText(posting.content)
  const sourceUrl = posting.absolute_url || `https://boards.greenhouse.io/${board}/jobs/${jobId}`
  const location = cleanText(posting.location?.name) || job.location || 'Not mentioned'
  const tags = inferTags(officialDescription)

  return {
    ...job,
    title: cleanText(posting.title) || job.title,
    location,
    remote: /remote/i.test(location),
    tags: tags.length ? tags : job.tags,
    applyUrl: sourceUrl,
    sourceName: 'Official Greenhouse job posting',
    sourceType: 'Official application page',
    sourceUrl,
    lastCheckedAt: today,
    postedAt: toDateOnly(posting.updated_at) || job.postedAt,
    applicationDeadline: 'Not mentioned',
    description: officialDescription.split('\n').find(Boolean) || job.description,
    overview: officialDescription.split('\n').find(Boolean) || job.overview,
    officialDescription,
    officialPosting: {
      provider: 'Greenhouse',
      board,
      postingId: String(jobId),
      location,
      updatedAt: posting.updated_at || '',
      hostedUrl: sourceUrl,
      applyUrl: sourceUrl,
      fetchedAt: today,
      descriptionPlain: officialDescription,
    },
    editorNote: `HiringsToday checked this ${job.company || 'company'} job against the official Greenhouse posting on ${today}. Use the official apply button for the latest instructions.`,
  }
}

function updateFromGenericOfficialPage(job, page, extracted) {
  const url = page.finalUrl || getPrimaryUrl(job)
  const host = getHost(url)
  const schema = extracted.schema || {}
  const officialDescription = cleanPlainText(extracted.description)
  const tags = inferTags(officialDescription)
  const title = cleanText(schema.title || extractTitle(page.html).replace(/\s*\|\s*.*/, '')) || job.title
  const location = schemaLocation(schema.jobLocation) || job.location || 'Not mentioned'
  const applyUrl = cleanText(schema.url) || url

  return {
    ...job,
    title,
    location,
    type: normalizeEmploymentType(schema.employmentType) || job.type || 'Not mentioned',
    remote: job.remote === true || /remote/i.test(officialDescription) || /remote/i.test(location),
    tags: tags.length ? tags : job.tags,
    applyUrl,
    sourceName: `Official company job posting (${host})`,
    sourceType: 'Official application page',
    sourceUrl: url,
    lastCheckedAt: today,
    postedAt: toDateOnly(schema.datePosted) || job.postedAt,
    applicationDeadline: toDateOnly(schema.validThrough) || job.applicationDeadline || 'Not mentioned',
    description: officialDescription.split('\n').find(Boolean) || job.description,
    overview: officialDescription.split('\n').find(Boolean) || job.overview,
    officialDescription,
    officialPosting: {
      provider: 'OfficialPage',
      host,
      extraction: extracted.source,
      url,
      applyUrl,
      fetchedAt: today,
      descriptionPlain: officialDescription,
    },
    editorNote: `HiringsToday checked this ${job.company || 'company'} job against the official company posting on ${today}. Use the official apply button for the latest instructions.`,
  }
}

async function syncAshbyJobs(jobs) {
  const ashbyRefs = jobs
    .map((job, index) => ({ job, index, ref: parseAshbyUrl(getPrimaryUrl(job)) }))
    .filter((item) => item.ref)

  const boards = new Map()
  ashbyRefs.forEach(({ ref }) => {
    if (!boards.has(ref.board)) boards.set(ref.board, null)
  })

  for (const board of boards.keys()) {
    boards.set(board, await fetchAshbyBoard(board))
  }

  let updated = 0
  const nextJobs = [...jobs]

  ashbyRefs.forEach(({ job, index, ref }) => {
    const postings = boards.get(ref.board) || []
    const posting = postings.find((item) => item.id === ref.postingId)
    if (!posting) {
      console.warn(`No Ashby posting found for job ${job.id}: ${ref.board}/${ref.postingId}`)
      return
    }

    nextJobs[index] = updateFromAshbyPosting(job, posting, ref.board, ref.postingId)
    updated += 1
  })

  return { jobs: nextJobs, updated, candidates: ashbyRefs.length }
}

async function syncLeverJobs(jobs) {
  const leverRefs = jobs
    .map((job, index) => ({ job, index, ref: parseLeverUrl(getPrimaryUrl(job)) }))
    .filter((item) => item.ref)

  let updated = 0
  const nextJobs = [...jobs]

  for (const { job, index, ref } of leverRefs) {
    try {
      const posting = await fetchLeverPosting(ref.company, ref.postingId)
      nextJobs[index] = updateFromLeverPosting(job, posting, ref.company, ref.postingId)
      updated += 1
    } catch (error) {
      console.warn(`No Lever posting found for job ${job.id}: ${ref.company}/${ref.postingId} (${error.message})`)
    }
  }

  return { jobs: nextJobs, updated, candidates: leverRefs.length }
}

async function syncGreenhouseJobs(jobs) {
  const greenhouseRefs = jobs
    .map((job, index) => ({ job, index, ref: parseGreenhouseUrl(getPrimaryUrl(job)) }))
    .filter((item) => item.ref)

  let updated = 0
  const nextJobs = [...jobs]

  for (const { job, index, ref } of greenhouseRefs) {
    try {
      const posting = await fetchGreenhousePosting(ref.board, ref.jobId)
      nextJobs[index] = updateFromGreenhousePosting(job, posting, ref.board, ref.jobId)
      updated += 1
    } catch (error) {
      console.warn(`No Greenhouse posting found for job ${job.id}: ${ref.board}/${ref.jobId} (${error.message})`)
    }
  }

  return { jobs: nextJobs, updated, candidates: greenhouseRefs.length }
}

async function syncGenericOfficialPages(jobs) {
  const nextJobs = [...jobs]
  const skipped = []
  let updated = 0
  const candidates = []

  jobs.forEach((job, index) => {
    if (job.officialDescription) return

    const url = getPrimaryUrl(job)
    if (!url) {
      skipped.push({ id: job.id, reason: 'missing-url', title: job.title, company: job.company })
      return
    }

    if (parseAshbyUrl(url) || parseLeverUrl(url) || parseGreenhouseUrl(url)) return

    if (isKnownAggregator(url)) {
      skipped.push({ id: job.id, reason: 'aggregator-not-official', title: job.title, company: job.company, url })
      return
    }

    candidates.push({ job, index, url })
  })

  async function processCandidate(candidate) {
    const { job, index, url } = candidate
    try {
      const page = await fetchHtmlPage(url)
      const extracted = genericDescriptionFromHtml(page.html)
      if (!isUsefulJobDescription(extracted.description, job)) {
        skipped.push({ id: job.id, reason: 'not-enough-job-text', title: job.title, company: job.company, url })
        return
      }

      nextJobs[index] = updateFromGenericOfficialPage(job, page, extracted)
      updated += 1
    } catch (error) {
      skipped.push({ id: job.id, reason: `fetch-failed: ${error.message}`, title: job.title, company: job.company, url })
    }
  }

  for (let start = 0; start < candidates.length; start += GENERIC_CONCURRENCY) {
    await Promise.all(candidates.slice(start, start + GENERIC_CONCURRENCY).map(processCandidate))
  }

  return { jobs: nextJobs, updated, candidates: candidates.length, skipped }
}

async function main() {
  const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  if (!Array.isArray(jobs)) throw new Error(`Expected an array in ${inputPath}`)

  const ashby = await syncAshbyJobs(jobs)
  const lever = await syncLeverJobs(ashby.jobs)
  const greenhouse = await syncGreenhouseJobs(lever.jobs)
  const generic = await syncGenericOfficialPages(greenhouse.jobs)

  if (!DRY_RUN) {
    fs.writeFileSync(inputPath, `${JSON.stringify(generic.jobs, null, 2)}\n`)
    fs.writeFileSync(REPORT_PATH, `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      inputPath,
      counts: {
        ashby: ashby.updated,
        lever: lever.updated,
        greenhouse: greenhouse.updated,
        genericOfficialPage: generic.updated,
      },
      skipped: generic.skipped,
    }, null, 2)}\n`)
  }

  const action = DRY_RUN ? 'Checked' : 'Synced'
  console.log(`${action} official postings in ${inputPath}`)
  console.log(`Ashby: ${ashby.updated}/${ashby.candidates}`)
  console.log(`Lever: ${lever.updated}/${lever.candidates}`)
  console.log(`Greenhouse: ${greenhouse.updated}/${greenhouse.candidates}`)
  console.log(`Generic official pages: ${generic.updated}/${generic.candidates}`)
  console.log(`Report: ${REPORT_PATH}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
