#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
const APPLY_TIMEOUT_MS = 12000
const CHECK_CONCURRENCY = Number(process.env.JOB_STATUS_CONCURRENCY || 8)

function cleanText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isOfficialJob(job) {
  return Boolean(getPrimaryUrl(job))
}

function getPrimaryUrl(job) {
  return cleanText(job.applyUrl || job.sourceUrl || job.link || job.applyLink)
}

function closedResult(reason) {
  return { status: 'closed', reason }
}

function activeResult(reason = 'Official posting is active') {
  return { status: 'active', reason }
}

function reviewNeededResult(reason) {
  return { status: 'review_needed', reason }
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), APPLY_TIMEOUT_MS)

  let response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'HiringstodayBot/1.0 (+https://hiringstoday.in)',
      },
      redirect: 'follow',
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

async function fetchHtml(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), APPLY_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'HiringstodayBot/1.0 (+https://hiringstoday.in)',
      },
      redirect: 'follow',
      signal: controller.signal,
    })

    const text = await response.text().catch(() => '')
    return { ok: response.ok, status: response.status, url: response.url || url, text }
  } finally {
    clearTimeout(timeout)
  }
}

function hasClosedLanguage(value) {
  const text = cleanText(value).toLowerCase()
  return [
    'job is no longer accepting applications',
    'no longer accepting applications',
    'this job is closed',
    'position has been filled',
    'position is no longer available',
    'job posting is no longer available',
    'job you are looking for is no longer available',
    'application is no longer available',
    'this opening is no longer available',
  ].some((phrase) => text.includes(phrase))
}

function hasUnavailableAshbyPosting(page) {
  return (
    /jobs\.ashbyhq\.com/i.test(page.url || '') &&
    /window\.__appData\s*=/.test(page.text || '') &&
    /"posting"\s*:\s*null/.test(page.text || '')
  )
}

async function checkAshby(job) {
  const posting = job.officialPosting || {}
  const board = cleanText(posting.jobBoard)
  const postingId = cleanText(posting.postingId)

  if (!board || !postingId) {
    return checkGeneric(job)
  }

  const jobs = await fetchJson(
    `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}?includeCompensation=true`
  ).then((data) => (Array.isArray(data.jobs) ? data.jobs : []))

  const current = jobs.find((item) => item.id === postingId)
  if (!current) return closedResult('Posting ID is no longer listed on the official Ashby board')
  if (current.isListed === false) return closedResult('Official Ashby posting is not listed')

  const applyUrl = current.applyUrl || job.applyUrl
  const page = await fetchHtml(applyUrl)
  if (!page.ok) return closedResult(`Official apply page returned HTTP ${page.status}`)
  if (hasUnavailableAshbyPosting(page)) return closedResult('Official Ashby posting data is not available')
  if (hasClosedLanguage(page.text)) return closedResult('Official apply page says applications are closed')

  job.applyUrl = applyUrl
  job.sourceUrl = current.jobUrl || job.sourceUrl
  job.officialPosting = {
    ...job.officialPosting,
    isListed: current.isListed !== false,
    applyUrl,
    jobUrl: current.jobUrl || job.officialPosting?.jobUrl,
  }

  return activeResult()
}

async function checkLever(job) {
  const posting = job.officialPosting || {}
  const company = cleanText(posting.company)
  const postingId = cleanText(posting.postingId)

  if (!company || !postingId) {
    return checkGeneric(job)
  }

  const current = await fetchJson(
    `https://api.lever.co/v0/postings/${encodeURIComponent(company)}/${encodeURIComponent(postingId)}?mode=json`
  ).catch((error) => {
    if (/HTTP 404/.test(error.message)) return null
    throw error
  })

  if (!current) return closedResult('Posting ID is no longer available on the official Lever board')

  const applyUrl = current.applyUrl || job.applyUrl || `${current.hostedUrl}/apply`
  const page = await fetchHtml(applyUrl)
  if (!page.ok) return closedResult(`Official apply page returned HTTP ${page.status}`)
  if (hasClosedLanguage(page.text)) return closedResult('Official apply page says applications are closed')

  job.applyUrl = applyUrl
  job.sourceUrl = current.hostedUrl || job.sourceUrl
  job.officialPosting = {
    ...job.officialPosting,
    applyUrl,
    hostedUrl: current.hostedUrl || job.officialPosting?.hostedUrl,
  }

  return activeResult()
}

async function checkGreenhouse(job) {
  const posting = job.officialPosting || {}
  const board = cleanText(posting.board || posting.jobBoard)
  const jobId = cleanText(posting.jobId || posting.postingId)

  if (!board || !jobId) {
    return checkGeneric(job)
  }

  const current = await fetchJson(
    `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(board)}/jobs/${encodeURIComponent(jobId)}?questions=false`
  ).catch((error) => {
    if (/HTTP 404/.test(error.message)) return null
    throw error
  })

  if (!current) return closedResult('Posting ID is no longer available on the official Greenhouse board')

  const page = await fetchHtml(job.applyUrl || job.sourceUrl)
  if (!page.ok) return closedResult(`Official apply page returned HTTP ${page.status}`)
  if (hasClosedLanguage(page.text)) return closedResult('Official apply page says applications are closed')

  return activeResult()
}

async function checkGeneric(job) {
  const url = getPrimaryUrl(job)
  if (!url) return closedResult('No official apply URL is available')

  const page = await fetchHtml(url)
  if (!page.ok) {
    return closedResult(`Official page returned HTTP ${page.status}`)
  }
  if (hasUnavailableAshbyPosting(page)) return closedResult('Official Ashby posting data is not available')
  if (hasClosedLanguage(page.text)) return closedResult('Official page says applications are closed')

  return activeResult('Official page is reachable')
}

async function checkJob(job) {
  const provider = cleanText(job.officialPosting?.provider).toLowerCase()
  if (provider === 'ashby') return checkAshby(job)
  if (provider === 'lever') return checkLever(job)
  if (provider === 'greenhouse') return checkGreenhouse(job)
  return checkGeneric(job)
}

function updateStatusFields(job, result) {
  job.status = result.status
  job.lastCheckedAt = today
  job.expiredReason = result.status === 'closed' ? result.reason : 'Not mentioned'

  if (result.status === 'closed') {
    job.closedAt = job.closedAt || today
    job.editorNote = `HiringsToday checked this listing on ${today}. The official apply page appears closed: ${result.reason}.`
    return
  }

  if (result.status === 'active' || result.status === 'review_needed') {
    delete job.closedAt
  }

  if (result.status === 'review_needed') {
    job.verificationNote = result.reason
    return
  }

  delete job.verificationNote
  if (job.editorNote && /appears closed/i.test(job.editorNote)) {
    job.editorNote = `HiringsToday checked this listing on ${today}. The official apply page is active.`
  }
}

async function main() {
  const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  const report = []
  const candidates = jobs.filter(isOfficialJob)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < candidates.length) {
      const job = candidates[nextIndex]
      nextIndex += 1

      try {
        const result = await checkJob(job)
        updateStatusFields(job, result)
        report.push({ id: job.id, title: job.title, company: job.company, status: result.status, reason: result.reason })
      } catch (error) {
        const result = reviewNeededResult(`Could not verify official apply page: ${error.message}`)
        updateStatusFields(job, result)
        report.push({ id: job.id, title: job.title, company: job.company, status: result.status, reason: result.reason })
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(CHECK_CONCURRENCY, candidates.length)) }, worker)
  )

  report.sort((a, b) => Number(a.id) - Number(b.id))

  fs.writeFileSync(inputPath, `${JSON.stringify(jobs, null, 2)}\n`)

  const summary = report.reduce(
    (acc, item) => {
      acc[item.status] += 1
      return acc
    },
    { active: 0, closed: 0, review_needed: 0 }
  )

  console.log(JSON.stringify({ checked: report.length, ...summary, report }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
