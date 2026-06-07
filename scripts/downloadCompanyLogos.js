#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const dataDir = path.dirname(inputPath)
const logoDir = path.join(dataDir, 'company-logos')
const tmpDir = path.resolve(process.cwd(), '.tmp-company-logos')
const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/suprajayernagu-cloud/Job-data@main/company-logos'

const DOMAIN_OVERRIDES = {
  '3M India': '3m.com',
  'ADP India': 'adp.com',
  Aabasoft: 'aabasoft.com',
  'Acai Travel': 'acaitravel.com',
  Acceldata: 'acceldata.io',
  Accenture: 'accenture.com',
  'Accenture India': 'accenture.com',
  Adobe: 'adobe.com',
  Almabase: 'almabase.com',
  Amazon: 'amazon.jobs',
  'Amazon India': 'amazon.jobs',
  'Amazon (AMZL Finance)': 'amazon.jobs',
  'Amazon (MGM Studios)': 'amazon.jobs',
  'Amdocs India': 'amdocs.com',
  'American Express': 'americanexpress.com',
  Apple: 'apple.com',
  'Apple India': 'apple.com',
  Arcesium: 'arcesium.com',
  'Auctech Marcom': 'auctechit.com',
  'Bank of America': 'bankofamerica.com',
  'Bank of Baroda': 'bankofbaroda.in',
  'Becton Dickinson (BD)': 'bd.com',
  'Big Oh Notation': 'bigohtech.com',
  'Boeing India': 'boeing.com',
  'C-DAC': 'cdac.in',
  'CMA CGM': 'cma-cgm.com',
  CRED: 'cred.club',
  Calix: 'calix.com',
  'Cambium Networks': 'cambiumnetworks.com',
  'Capgemini India': 'capgemini.com',
  Cartesia: 'cartesia.ai',
  Caterpillar: 'caterpillar.com',
  'Central Bank of India': 'centralbankofindia.co.in',
  Chargebee: 'chargebee.com',
  Cisco: 'cisco.com',
  Citi: 'citi.com',
  ClearFeed: 'clearfeed.ai',
  Cloudangles: 'cloudangles.com',
  Cognizant: 'cognizant.com',
  Deloitte: 'deloitte.com',
  'Deloitte India': 'deloitte.com',
  'Deloitte USI': 'deloitte.com',
  'Digital India (MyGov)': 'mygov.in',
  Ditto: 'joinditto.in',
  DrinkPrime: 'drinkprime.in',
  'EY GDS': 'ey.com',
  'EY India': 'ey.com',
  Ema: 'ema.co',
  FamPay: 'fampay.in',
  Flipkart: 'flipkart.com',
  Fluxon: 'fluxon.com',
  'Fractal Analytics': 'fractal.ai',
  Freshworks: 'freshworks.com',
  Genpact: 'genpact.com',
  GlobalData: 'globaldata.com',
  GlobalLogic: 'globallogic.com',
  Google: 'google.com',
  'Google India': 'google.com',
  Granica: 'granica.ai',
  HCLTech: 'hcltech.com',
  'HDFC Bank': 'hdfcbank.com',
  HSBC: 'hsbc.com',
  'Hindustan Aeronautics Limited (HAL)': 'hal-india.co.in',
  'Hinge Health': 'hingehealth.com',
  'Hitachi Energy': 'hitachienergy.com',
  'ICICI Bank': 'icicibank.com',
  'IIT Hyderabad': 'iith.ac.in',
  'IMC Financial Markets': 'imc.com',
  ION: 'iongroup.com',
  IREDA: 'ireda.in',
  'India Post': 'indiapost.gov.in',
  'Indian Army': 'joinindianarmy.nic.in',
  Infosys: 'infosys.com',
  'Infosys (Power Programmer)': 'infosys.com',
  Interface: 'interface.ai',
  Intuit: 'intuit.com',
  'JPMorgan Chase': 'jpmorganchase.com',
  'JPMorgan Chase & Co.': 'jpmorganchase.com',
  JioStar: 'jiostar.com',
  'KPMG India': 'kpmg.com',
  Kognitos: 'kognitos.com',
  'Kuehne+Nagel': 'kuehne-nagel.com',
  'Larsen & Toubro (L&T)': 'larsentoubro.com',
  Mastercard: 'mastercard.com',
  'MeitY (STPI)': 'stpi.in',
  Microsoft: 'microsoft.com',
  'Microsoft India': 'microsoft.com',
  Mindtree: 'mindtree.com',
  NETGEAR: 'netgear.com',
  'NTPC Limited': 'ntpc.co.in',
  'NTT DATA': 'nttdata.com',
  NVIDIA: 'nvidia.com',
  Netflix: 'netflix.com',
  Neuron7: 'neuron7.ai',
  'Nobl Q': 'noblq.com',
  Onehouse: 'onehouse.ai',
  Oracle: 'oracle.com',
  'Oracle India': 'oracle.com',
  PayPal: 'paypal.com',
  Paytm: 'paytm.com',
  PhonePe: 'phonepe.com',
  Polycab: 'polycab.com',
  'Polycab India': 'polycab.com',
  'Publicis Sapient': 'publicissapient.com',
  'PwC India': 'pwc.in',
  Qualcomm: 'qualcomm.com',
  RapidAI: 'rapidai.com',
  Razorpay: 'razorpay.com',
  RealPage: 'realpage.com',
  'Reliance Industries': 'ril.com',
  'Reliance Jio': 'jio.com',
  Revefi: 'revefi.com',
  'S&P Global': 'spglobal.com',
  SAP: 'sap.com',
  Salesforce: 'salesforce.com',
  Sarvam: 'sarvam.ai',
  ServiceNow: 'servicenow.com',
  'Siemens Healthineers': 'siemens-healthineers.com',
  'State Bank of India (SBI)': 'sbi.co.in',
  Sutherland: 'sutherlandglobal.com',
  Swiggy: 'swiggy.com',
  TCS: 'tcs.com',
  'TCS (Lateral Drive)': 'tcs.com',
  Tesco: 'tesco.com',
  Tesla: 'tesla.com',
  TestVagrant: 'testvagrant.com',
  Thinkitive: 'thinkitive.com',
  Uber: 'uber.com',
  'Uber India': 'uber.com',
  UptimeAI: 'uptimeai.com',
  Vendavo: 'vendavo.com',
  Vercel: 'vercel.com',
  'Walmart Global Tech India': 'walmart.com',
  'Wells Fargo': 'wellsfargo.com',
  Wipro: 'wipro.com',
  Zalaris: 'zalaris.com',
  'Zoho Corporation': 'zoho.com',
  Zomato: 'zomato.com',
  openDoctor: 'opendr.com',
  'realfast.ai': 'realfast.ai',
  zaimler: 'zaimler.com',
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function guessDomain(company) {
  const cleaned = String(company)
    .replace(/\([^)]*\)/g, '')
    .replace(/\b(india|pvt|private|limited|ltd|inc|co|corporation|solutions|technologies|technology|consulting|services)\b/gi, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()

  return cleaned ? `${cleaned}.com` : ''
}

function absoluteUrl(url, base) {
  try {
    return new URL(url, base).toString()
  } catch {
    return ''
  }
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 HiringsToday logo fetcher',
      accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  const bytes = Buffer.from(await response.arrayBuffer())
  if (!contentType.includes('image') && !url.match(/\.(png|jpe?g|webp|svg|ico)(\?|$)/i)) {
    throw new Error(`Not image: ${contentType}`)
  }
  if (bytes.length < 200) throw new Error('Image too small')
  return bytes
}

async function getIconCandidates(domain) {
  const candidates = [
    `https://${domain}/apple-touch-icon.png`,
    `https://${domain}/favicon.ico`,
    `https://www.${domain}/apple-touch-icon.png`,
    `https://www.${domain}/favicon.ico`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`,
  ]

  return [...new Set(candidates.filter(Boolean))]
}

function convertToWebp(inputPath, outputPath) {
  execFileSync('magick', [
    inputPath,
    '-resize',
    '160x160',
    '-background',
    'white',
    '-alpha',
    'background',
    '-quality',
    '82',
    outputPath,
  ], { stdio: 'ignore' })
}

async function downloadLogo(company, domain) {
  const slug = slugify(company)
  const outputPath = path.join(logoDir, `${slug}.webp`)
  const tmpPath = path.join(tmpDir, `${slug}`)

  if (fs.existsSync(outputPath)) return `${CDN_BASE_URL}/${slug}.webp`

  const candidates = await getIconCandidates(domain)
  for (let index = 0; index < candidates.length; index += 1) {
    const url = candidates[index]
    try {
      const bytes = await fetchBuffer(url)
      const sourcePath = `${tmpPath}-${index}`
      fs.writeFileSync(sourcePath, bytes)
      convertToWebp(sourcePath, outputPath)
      if (fs.statSync(outputPath).size > 100) {
        return `${CDN_BASE_URL}/${slug}.webp`
      }
    } catch {}
  }

  return ''
}

async function main() {
  fs.mkdirSync(logoDir, { recursive: true })
  fs.mkdirSync(tmpDir, { recursive: true })

  const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  const companies = [...new Set(jobs.map((job) => job.company).filter(Boolean))].sort()
  const logoByCompany = new Map()
  let downloaded = 0
  let skipped = 0

  for (const company of companies) {
    const domain = DOMAIN_OVERRIDES[company]
    const existingLogo = `${CDN_BASE_URL}/${slugify(company)}.webp`
    const existingLogoPath = path.join(logoDir, `${slugify(company)}.webp`)

    if (!domain && fs.existsSync(existingLogoPath)) {
      logoByCompany.set(company, existingLogo)
      downloaded += 1
      console.log(`ok ${company} -> ${existingLogo}`)
      continue
    }

    if (!domain) {
      skipped += 1
      continue
    }

    const logoUrl = await downloadLogo(company, domain)
    if (logoUrl) {
      logoByCompany.set(company, logoUrl)
      downloaded += 1
      console.log(`ok ${company} -> ${logoUrl}`)
    } else {
      skipped += 1
      console.log(`skip ${company}`)
    }
  }

  jobs.forEach((job) => {
    const logoUrl = logoByCompany.get(job.company)
    if (logoUrl) job.logoUrl = logoUrl
  })

  fs.writeFileSync(inputPath, `${JSON.stringify(jobs, null, 2)}\n`)
  fs.rmSync(tmpDir, { recursive: true, force: true })

  console.log(`Downloaded ${downloaded} logos. Skipped ${skipped}. Updated ${jobs.filter((job) => String(job.logoUrl || '').startsWith(CDN_BASE_URL)).length} jobs.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
