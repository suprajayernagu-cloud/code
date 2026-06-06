#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const REVIEW_DATE = '2026-06-06'

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.])/g, '$1')
    .trim()
}

function cleanMarketingText(value) {
  return cleanText(value)
    .replace(/world-class/gi, 'high-quality')
    .replace(/cutting-edge/gi, 'modern')
    .replace(/exceptional opportunity/gi, 'opening')
    .replace(/career-defining/gi, 'useful')
    .replace(/millions globally/gi, 'real users')
}

function cleanFragment(value) {
  return cleanMarketingText(value).replace(/[.。]+$/g, '')
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(cleanText).filter(Boolean) : []
}

function getTagName(tag) {
  return typeof tag === 'string' ? tag : tag?.name
}

function getTags(job) {
  return asArray((job.tags || []).map(getTagName)).slice(0, 6)
}

function sentenceList(items, fallback) {
  const cleanItems = asArray(items)
  if (!cleanItems.length) return fallback
  if (cleanItems.length === 1) return cleanItems[0]
  return `${cleanItems.slice(0, -1).join(', ')} and ${cleanItems.at(-1)}`
}

function inferWorkMode(job) {
  const location = cleanText(job.location).toLowerCase()
  const type = cleanText(job.type).toLowerCase()

  if (job.remote === true || location.includes('remote')) return 'remote'
  if (type.includes('intern')) return 'internship'
  return 'office or company-decided'
}

function inferExperienceLabel(job) {
  const text = `${job.experience || ''} ${job.title || ''} ${getTags(job).join(' ')}`.toLowerCase()
  if (text.includes('intern')) return 'students or early-career candidates'
  if (text.includes('fresh')) return 'freshers and recent graduates'
  if (text.match(/[3-9]\+?\s*(year|yr)|senior|lead|manager|ii\b/)) return 'experienced candidates'
  return 'candidates who match the listed skills'
}

function inferBatch(job) {
  const text = `${job.title || ''} ${job.experience || ''} ${job.eligibleBatch || ''} ${getTags(job).join(' ')}`
  const years = [...new Set((text.match(/20[2-3][0-9]/g) || []))]
  return years.length ? years.join(', ') : null
}

function inferDeadline(job) {
  return cleanText(job.applicationDeadline || job.lastDateToApply || job.walkInDate || 'Not mentioned')
}

function sourceNameFor(job) {
  const url = cleanText(job.applyUrl || job.link || job.applyLink)
  const sourceType = cleanText(job.sourceType)
  if (sourceType) {
    if (sourceType.toLowerCase() === 'official') return 'Official application page'
    return sourceType
  }
  if (!url) return 'Application source not listed'
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host.includes('indeed')) return 'Indeed application page'
    if (host.includes('linkedin')) return 'LinkedIn job page'
    if (host.includes('naukri')) return 'Naukri job page'
    if (host.includes('careers') || host.includes('greenhouse') || host.includes('lever')) {
      return 'Company careers page'
    }
    return `${host} application page`
  } catch {
    return 'Application page'
  }
}

function buildOverview(job) {
  const company = cleanText(job.company) || 'The company'
  const title = cleanText(job.title) || 'this role'
  const location = cleanText(job.location) || 'the listed location'
  const experience = cleanText(job.experience) || inferExperienceLabel(job)
  const tags = getTags(job)
  const skillsText = sentenceList(tags.slice(0, 4), 'the listed skills')
  const firstResponsibility = cleanFragment(asArray(job.responsibilities)[0])
  const firstQualification = cleanFragment(asArray(job.qualifications)[0])
  const batch = inferBatch(job)
  const workMode = inferWorkMode(job)

  const lines = [
    `${company} is hiring for ${title} in ${location}. The opening is listed for ${experience}${batch ? `, especially the ${batch} batch where applicable` : ''}.`,
    firstResponsibility
      ? `Expected work includes: ${firstResponsibility}. Candidates should be ready to discuss related project, internship, or previous work experience.`
      : `Candidates should read the official application page carefully and match their resume to the role requirements before applying.`,
    firstQualification
      ? `The main eligibility point to check first is: ${firstQualification}.`
      : `The role is best suited for applicants who can clearly show relevant education, skills, and availability for the hiring process.`,
    `Useful focus areas before applying: ${skillsText}. Work mode is marked as ${workMode}.`,
  ]

  return lines.join(' ')
}

function buildDescription(job) {
  const company = cleanText(job.company) || 'The company'
  const title = cleanText(job.title) || 'this role'
  const location = cleanText(job.location) || 'the listed location'
  const tags = sentenceList(getTags(job).slice(0, 3), 'the listed skills')

  return `${company} is hiring for ${title} in ${location}. Candidates should review the eligibility, responsibilities, salary or stipend details, and apply link before submitting the form. Key focus areas include ${tags}.`
}

function responsibilityNote(text, index, job) {
  const lower = cleanMarketingText(text).toLowerCase()
  const role = cleanText(job.title) || 'this role'

  if (lower.includes('test') || lower.includes('quality')) {
    return `For ${role}, this means checking work carefully, reporting issues clearly, and making sure fixes are verified before they move ahead.`
  }
  if (lower.includes('develop') || lower.includes('code') || lower.includes('build')) {
    return `This is the core delivery part of the job. Be ready to explain how you write, test, debug, and improve code in a practical project.`
  }
  if (lower.includes('collaborat') || lower.includes('team')) {
    return `This is about working with managers, engineers, and other teams without losing track of requirements and timelines.`
  }
  if (lower.includes('support') || lower.includes('assist')) {
    return `This usually involves taking direction, documenting updates, and closing assigned tasks reliably.`
  }
  if (lower.includes('debug') || lower.includes('issue')) {
    return `Interviewers may check how you find the root cause of a problem and explain the fix in simple terms.`
  }

  return `This responsibility is part of the role's regular work. Prepare one example from your projects or previous experience that shows you can handle it.`
}

function buildResponsibilitiesDetailed(job) {
  return asArray(job.responsibilities).reduce((acc, responsibility, index) => {
    acc[String(index + 1)] = {
      responsibility: cleanMarketingText(responsibility),
      whatItMeans: responsibilityNote(responsibility, index, job),
      whyItMatters: `It helps ${cleanText(job.company) || 'the hiring team'} understand whether you can contribute to ${cleanText(job.title) || 'the role'} from the first few months.`,
    }
    return acc
  }, {})
}

function qualificationNote(text) {
  const lower = text.toLowerCase()
  if (lower.includes('degree') || lower.includes('b.tech') || lower.includes('b.e') || lower.includes('mca')) {
    return 'This is used to confirm that your education matches the minimum role criteria.'
  }
  if (lower.includes('202')) {
    return 'Batch requirements are usually strict in fresher drives, so check your passing year before applying.'
  }
  if (lower.includes('60') || lower.includes('cgpa') || lower.includes('aggregate')) {
    return 'Academic cutoffs are often checked during screening and document verification.'
  }
  if (lower.includes('skill') || lower.includes('knowledge') || lower.includes('proficiency')) {
    return 'This should be visible through projects, internships, coursework, or interview answers.'
  }
  if (lower.includes('experience')) {
    return 'Experience requirements are usually reviewed through resume details and interview discussion.'
  }
  return 'This point should be checked against your resume before submitting the application.'
}

function buildEligibilityDetailed(job) {
  return asArray(job.qualifications).reduce((acc, requirement, index) => {
    acc[String(index + 1)] = {
      requirement: cleanFragment(requirement),
      whyRequired: qualificationNote(requirement),
      howToMeet: 'Keep proof ready through your resume, certificates, marksheets, project links, or previous work details as applicable.',
      wouldTheyReject: 'If this is a mandatory requirement in the official listing, the recruiter may reject mismatched profiles during screening.',
    }
    return acc
  }, {})
}

function classifySkill(skill) {
  const lower = skill.toLowerCase()
  if (['java', 'python', 'c++', 'c', 'javascript', 'typescript', 'c#', 'sql'].includes(lower)) return 'Technical skill'
  if (lower.includes('communication') || lower.includes('team') || lower.includes('problem')) return 'Workplace skill'
  if (lower.includes('aws') || lower.includes('azure') || lower.includes('cloud')) return 'Cloud skill'
  if (lower.includes('react') || lower.includes('node') || lower.includes('spring')) return 'Framework or tool'
  return 'Role skill'
}

function buildSkillsRequired(job) {
  const baseSkills = getTags(job)
  const extraSkills = ['Communication', 'Problem solving']
  return [...new Set([...baseSkills, ...extraSkills])].map((skill) => ({
    name: skill,
    category: classifySkill(skill),
    proficiencyLevel: skill.match(/communication|problem solving/i) ? 'Important' : 'Role dependent',
    why: `${skill} appears relevant for ${cleanText(job.title) || 'this opening'}.`,
    howToBuild: `Prepare one small example showing how you used ${skill} in a project, internship, coursework, or previous job.`,
  }))
}

function buildSalaryInsights(job) {
  const salary = cleanText(job.salary)
  const company = cleanText(job.company) || 'the company'
  const title = cleanText(job.title) || 'this role'

  if (!salary) {
    return `Salary for ${title} at ${company} is not mentioned in the available listing details. Check the application page before applying and avoid assuming a package unless the employer has published it.`
  }

  const label = salary.toLowerCase().includes('stipend') ? 'stipend' : 'compensation'
  return `Listed ${label} for ${title}: ${salary}. Treat this as the published or collected range for the opening, and verify it again on the application page because companies may revise salary, stipend, joining bonus, or benefits during the hiring process.`
}

function buildWhyApply(job) {
  const company = cleanText(job.company) || 'this company'
  const title = cleanText(job.title) || 'this role'
  const location = cleanText(job.location) || 'the listed location'
  const tags = sentenceList(getTags(job).slice(0, 3), 'the role skills')
  const experience = inferExperienceLabel(job)

  return [
    `${company} is worth considering if you are looking for ${title} work in ${location}.`,
    `The role matches ${experience} who can show practical comfort with ${tags}.`,
    `Apply only after checking the eligibility points, location, work mode, and application deadline on the source page.`,
  ].join('\n\n')
}

function buildPreparationTips(job) {
  const tags = getTags(job).slice(0, 4)
  const responsibilities = asArray(job.responsibilities).map(cleanFragment)
  const tips = []

  if (tags.length) {
    tips.push({
      tip: `Revise ${sentenceList(tags.slice(0, 2), tags[0])}`,
      description: `Prepare short notes and one project example around ${sentenceList(tags.slice(0, 3), tags[0])}. Keep the explanation simple enough to discuss in an interview.`,
      timeline: 'Before applying or before the first interview',
    })
  }

  if (responsibilities.length) {
    tips.push({
      tip: 'Map your resume to the role',
      description: `Highlight experience related to "${responsibilities[0]}". If you are a fresher, use academic projects, internships, hackathons, or lab work.`,
      timeline: 'Same day as application',
    })
  }

  tips.push({
    tip: 'Keep proof documents ready',
    description: 'Keep resume, marksheets, ID proof, certificates, portfolio links, and GitHub or LinkedIn profile ready if the company asks during screening.',
    timeline: 'Before submitting the form',
  })

  return tips
}

function buildHowToApply(job) {
  const company = cleanText(job.company) || 'the company'
  return [
    {
      step: 1,
      action: 'Check eligibility',
      details: `Review the qualification, batch, experience, location, and skill requirements for ${company} before opening the application form.`,
      estimatedTime: '5-10 minutes',
    },
    {
      step: 2,
      action: 'Update resume',
      details: 'Keep the resume short and role-focused. Add matching projects, internships, tools, achievements, and contact details.',
      estimatedTime: '20-30 minutes',
    },
    {
      step: 3,
      action: 'Apply through the listed link',
      details: 'Use the application link on this page and fill the form carefully. Do not pay money for job applications.',
      estimatedTime: '10-20 minutes',
    },
    {
      step: 4,
      action: 'Save confirmation',
      details: 'Save the application confirmation, job ID, email receipt, or screenshot so you can track follow-up messages.',
      estimatedTime: '2-5 minutes',
    },
  ]
}

function buildApplicationAdvice(job) {
  const company = cleanText(job.company) || 'the company'
  const title = cleanText(job.title) || 'this role'
  const firstQualification = cleanFragment(asArray(job.qualifications)[0])
  const firstResponsibility = cleanFragment(asArray(job.responsibilities)[0])
  const tags = getTags(job).slice(0, 3)

  const parts = [
    `Before applying for ${title} at ${company}, update your resume around the exact role title and location.`,
  ]

  if (firstQualification) {
    parts.push(`Check this eligibility point first: ${firstQualification}.`)
  }

  if (firstResponsibility) {
    parts.push(`Add one resume bullet or project example related to: ${firstResponsibility}.`)
  }

  if (tags.length) {
    parts.push(`Prepare to discuss ${sentenceList(tags, tags[0])} in simple interview language.`)
  }

  return parts.join(' ')
}

function buildAboutCompany(job) {
  const company = cleanText(job.company) || 'The company'
  const location = cleanText(job.location) || 'India'
  const tags = sentenceList(getTags(job).slice(0, 3), 'the listed domain')

  return {
    aboutCompany: `${company} is the hiring organization listed for this opening. Based on the job details available here, the role is connected with ${tags} and is located in ${location}. Candidates should verify company details, office location, and application instructions on the source page before applying.`,
    foundedYear: 'Not mentioned',
    headquarters: 'Not mentioned in this listing',
    indianPresence: location,
    whyJoin: `Relevant opening for candidates matching ${cleanText(job.title) || 'the listed role'} requirements`,
  }
}

function buildFaq(job) {
  const company = cleanText(job.company) || 'the company'
  const title = cleanText(job.title) || 'this role'
  const deadline = inferDeadline(job)
  const salary = cleanText(job.salary) || 'Not mentioned'
  const location = cleanText(job.location) || 'Not mentioned'
  const experience = cleanText(job.experience) || inferExperienceLabel(job)

  return [
    {
      question: `Who can apply for ${title} at ${company}?`,
      answer: `Candidates should match the listed experience level (${experience}) and the qualification points shown in this job post. If your batch, degree, or skill set does not match, check the official application page before applying.`,
    },
    {
      question: `What is the job location for this opening?`,
      answer: `The location listed for this opening is ${location}. If the role is remote, hybrid, or office-based, confirm the final work mode during application or interview.`,
    },
    {
      question: `What salary or stipend is mentioned?`,
      answer: `The listed salary or stipend detail is: ${salary}. Treat it as a reference and verify the final offer details with the recruiter or official listing.`,
    },
    {
      question: `What is the last date to apply?`,
      answer: deadline === 'Not mentioned'
        ? 'The last date is not mentioned in the available job details. Apply early because job links can close without notice.'
        : `The listed deadline or important date is ${deadline}. Recheck the source page before applying.`,
    },
    {
      question: 'Is this job verified?',
      answer: 'The details have been structured for readability from the available listing data. Applicants should verify the source link, company name, role, and eligibility before submitting personal information.',
    },
  ]
}

function buildDocumentsRequired(job) {
  const docs = ['Updated resume', 'Government ID or college ID', 'Educational marksheets or certificates if requested']
  const tags = getTags(job).join(' ').toLowerCase()
  if (tags.match(/java|python|react|node|sql|c\+\+|javascript|developer|software/)) {
    docs.push('Project links, GitHub profile, or portfolio if available')
  }
  return docs
}

function buildWhoShouldApply(job) {
  const items = []
  const batch = inferBatch(job)
  const tags = getTags(job).slice(0, 3)
  const location = cleanText(job.location)

  if (batch) items.push(`${batch} batch candidates who match the qualification criteria`)
  else items.push(`${inferExperienceLabel(job)} with the listed qualification`)
  if (tags.length) items.push(`Applicants with project or work exposure in ${sentenceList(tags, tags[0])}`)
  if (location) items.push(`Candidates comfortable with the listed location: ${location}`)
  return items
}

function buildWhoShouldSkip(job) {
  const items = []
  const qualification = asArray(job.qualifications)[0]
  if (qualification) items.push(`Candidates who do not meet this key requirement: ${qualification}`)
  if (!job.remote && cleanText(job.location)) items.push('Applicants looking only for permanent remote work, unless the company confirms remote flexibility')
  items.push('Anyone asked to pay money for registration, training, referral, or interview access')
  return items
}

function buildSelectionProcess(job) {
  const existing = asArray(job.selectionProcess)
  if (existing.length) return existing

  const title = cleanText(job.title).toLowerCase()
  const process = ['Application screening']
  if (title.match(/developer|engineer|software|data|analyst|qa|test|technical/)) {
    process.push('Technical assessment or technical interview')
  } else {
    process.push('Role-based interview or assessment')
  }
  process.push('HR discussion and document verification if shortlisted')
  return process
}

function rewriteJob(job) {
  const company = cleanText(job.company) || 'this company'
  const title = cleanText(job.title) || 'this role'

  return {
    ...job,
    responsibilities: asArray(job.responsibilities).map(cleanMarketingText),
    qualifications: asArray(job.qualifications).map(cleanMarketingText),
    sourceName: sourceNameFor(job),
    sourceUrl: job.sourceUrl || job.applyUrl || job.link || job.applyLink || '',
    lastCheckedAt: job.lastCheckedAt || REVIEW_DATE,
    applicationDeadline: inferDeadline(job),
    description: buildDescription(job),
    overview: buildOverview(job),
    responsibilitiesDetailed: buildResponsibilitiesDetailed(job),
    eligibilityDetailed: buildEligibilityDetailed(job),
    skillsRequired: buildSkillsRequired(job),
    salaryInsights: buildSalaryInsights(job),
    whyApply: buildWhyApply(job),
    preparationTips: buildPreparationTips(job),
    prepTips: buildPreparationTips(job).map((tip) => tip.description),
    howToApply: buildHowToApply(job),
    applicationAdvice: buildApplicationAdvice(job),
    aboutCompany: buildAboutCompany(job),
    faq: buildFaq(job),
    selectionProcess: buildSelectionProcess(job),
    documentsRequired: buildDocumentsRequired(job),
    editorNote: `HiringsToday structured this ${company} ${title} listing on ${REVIEW_DATE} using the available job details. Please verify the apply link, eligibility, deadline, and company instructions before submitting your application.`,
    whoShouldApply: buildWhoShouldApply(job),
    whoShouldSkip: buildWhoShouldSkip(job),
  }
}

function main() {
  const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  if (!Array.isArray(jobs)) {
    throw new Error(`Expected an array in ${inputPath}`)
  }

  const rewritten = jobs.map(rewriteJob)
  fs.writeFileSync(inputPath, `${JSON.stringify(rewritten, null, 2)}\n`)

  console.log(`Rewrote ${rewritten.length} jobs in ${inputPath}`)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
