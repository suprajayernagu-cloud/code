#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), '../Job-data/Jobdetails.json')

const postedAt = '2026-06-07'

const officialJobs = [
  {
    title: 'Software Developer',
    company: 'UptimeAI',
    location: 'Bangalore, India',
    salary: 'Not mentioned',
    experience: '2+ years',
    type: 'Full-time',
    remote: false,
    tags: ['Full Stack', 'JavaScript', 'Angular', 'Node.js', 'MongoDB', 'PostgreSQL'],
    applyUrl: 'https://jobs.ashbyhq.com/uptimeai/6897d2e2-5f78-400a-a5c7-c69cb4068302',
    description: 'UptimeAI is hiring a Software Developer for a full-stack engineering role in Bangalore.',
    responsibilities: [
      'Build and maintain full-stack web application features',
      'Work on frontend, backend, database, and integration tasks',
      'Collaborate with engineering and product teams to deliver reliable product updates',
    ],
    qualifications: [
      'Professional experience in full-stack or web application development',
      'Working knowledge of JavaScript, Angular or similar frontend tools, Node.js, and databases',
      'Bachelor’s degree in Computer Science or a related field, or equivalent practical experience',
    ],
  },
  {
    title: 'Software Engineer, AI Applications',
    company: 'Ema',
    location: 'Bengaluru, Karnataka',
    salary: 'Not mentioned',
    experience: '3+ years',
    type: 'Full-time',
    remote: false,
    tags: ['AI Applications', 'Backend', 'Integrations', 'Enterprise Software', 'APIs'],
    applyUrl: 'https://jobs.ashbyhq.com/ema/d2f5e7c4-04cd-496a-9b06-8f1ee08da954',
    description: 'Ema is hiring a Software Engineer for AI application and enterprise workflow engineering in Bengaluru.',
    responsibilities: [
      'Build production-grade AI application workflows for enterprise customers',
      'Work with integrations, backend systems, and customer-facing product requirements',
      'Collaborate with engineering and customer teams to deliver measurable business outcomes',
    ],
    qualifications: [
      '3+ years of production software engineering experience',
      'Experience building backend services, APIs, integrations, or customer-facing applications',
      'Ability to work with enterprise requirements, reliability expectations, and cross-functional teams',
    ],
  },
  {
    title: 'Software Engineer, Backend - India',
    company: 'Ema',
    location: 'Bengaluru, Karnataka',
    salary: 'Not mentioned',
    experience: 'Experienced',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Python', 'Go', 'PostgreSQL', 'Redis', 'GCP'],
    applyUrl: 'https://jobs.ashbyhq.com/ema/eb62df31-0370-447f-8cc6-707e79cbc9fa',
    description: 'Ema is hiring a backend software engineer in India for enterprise software and AI platform work.',
    responsibilities: [
      'Develop and maintain backend services, APIs, and enterprise software components',
      'Build scalable systems using backend languages and cloud services',
      'Work with product, design, and engineering teams on platform features',
    ],
    qualifications: [
      'Experience in backend development using Python, Go, or similar languages',
      'Understanding of databases, APIs, cloud platforms, and distributed systems',
      'Strong problem-solving skills and ability to work with global teams',
    ],
  },
  {
    title: 'Staff Software Engineer',
    company: 'Kognitos',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Staff / Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Python', 'AWS', 'Serverless', 'Microservices'],
    applyUrl: 'https://jobs.ashbyhq.com/Kognitos/e5953056-43ba-4e0d-a777-8c25e10d50d6/',
    description: 'Kognitos is hiring a Staff Software Engineer in Bengaluru for backend infrastructure and cloud platform work.',
    responsibilities: [
      'Develop and maintain backend infrastructure and platform services',
      'Design scalable microservices and cloud-based architecture',
      'Improve reliability, scalability, and performance of backend systems',
    ],
    qualifications: [
      'Strong backend engineering experience with Python or similar languages',
      'Experience with cloud services, serverless architecture, and microservices',
      'Ability to own technical design and mentor other engineers',
    ],
  },
  {
    title: 'Full Stack AI Engineer',
    company: 'Sarvam',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: '3 - 5 years',
    type: 'Full-time',
    remote: false,
    tags: ['Full Stack', 'AI', 'Python', 'Node.js', 'React', 'Cloud'],
    applyUrl: 'https://jobs.ashbyhq.com/sarvam/325c7d1b-963d-42a8-b2b8-a4c5c6705c54/',
    description: 'Sarvam is hiring a Full Stack AI Engineer in Bengaluru for AI product and education platform work.',
    responsibilities: [
      'Build full-stack product features that integrate AI models and APIs',
      'Work on backend services, frontend experiences, and cloud infrastructure',
      'Collaborate across product, engineering, and business teams',
    ],
    qualifications: [
      '3-5 years of full-stack engineering experience',
      'Experience with backend development, frontend frameworks, APIs, and cloud platforms',
      'Interest or experience in AI/ML model integration and product development',
    ],
  },
  {
    title: 'Software Engineer, Infrastructure',
    company: 'Granica',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Experienced',
    type: 'Full-time',
    remote: true,
    tags: ['Infrastructure', 'Kubernetes', 'CI/CD', 'Cloud', 'AI Workloads'],
    applyUrl: 'https://jobs.ashbyhq.com/granica/7aaa13dc-df48-446f-8df6-1554158b84f1',
    description: 'Granica is hiring a Software Engineer for infrastructure engineering work in Bengaluru or remote India.',
    responsibilities: [
      'Design and operate cloud infrastructure for large-scale data and AI workloads',
      'Manage Kubernetes clusters, CI/CD pipelines, and deployment automation',
      'Improve reliability, developer experience, and operational visibility',
    ],
    qualifications: [
      'Experience with cloud infrastructure, Kubernetes, and automation',
      'Strong understanding of reliable systems, deployment pipelines, and observability',
      'Ability to work on deep infrastructure problems with engineering teams',
    ],
  },
  {
    title: 'Senior Engineer Software Development',
    company: 'NETGEAR',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Full Stack', 'Networking', 'Cloud', 'Architecture', 'Enterprise Software'],
    applyUrl: 'https://jobs.ashbyhq.com/netgear/8a5a3dcf-b3fa-46a1-87db-9bb45e76bc38',
    description: 'NETGEAR is hiring a Senior Engineer Software Development in Bengaluru for cloud-based network management platform work.',
    responsibilities: [
      'Design and develop cloud-based network management platform features',
      'Work on architecture, integrations, performance, and enterprise product requirements',
      'Collaborate with engineering teams to build scalable software for network systems',
    ],
    qualifications: [
      'Senior software engineering experience in enterprise or cloud products',
      'Understanding of networking, full-stack systems, cloud platforms, or analytics',
      'Ability to lead technical design and deliver complex engineering work',
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'Hinge Health',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Data Systems', 'Product Engineering', 'Healthcare Tech'],
    applyUrl: 'https://jobs.ashbyhq.com/hinge-health/8390aad0-ade1-4875-92d1-28a7ff4676a1',
    description: 'Hinge Health is hiring a Senior Software Engineer in Bengaluru for product and data systems engineering.',
    responsibilities: [
      'Design and deliver product capabilities for healthcare technology workflows',
      'Build scalable data and backend systems that support member experiences',
      'Collaborate with product and engineering teams across India and global offices',
    ],
    qualifications: [
      'Senior software engineering experience with backend or data systems',
      'Ability to own large-scale projects and technical strategy',
      'Comfort collaborating across time zones and product teams',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Almabase',
    location: 'Bangalore, India',
    salary: 'Not mentioned',
    experience: 'Early career',
    type: 'Full-time',
    remote: false,
    tags: ['Software Engineering', 'Backend', 'Frontend', 'Production Systems', 'CRM Integrations'],
    applyUrl: 'https://jobs.ashbyhq.com/almabase/71f033a9-4183-4df9-900f-1fb354267618',
    description: 'Almabase is hiring Software Engineers in Bangalore for early-career product engineering work.',
    responsibilities: [
      'Build and maintain backend, frontend, and integration features',
      'Work with developers, product managers, and designers on product improvements',
      'Learn production engineering practices through guided ownership and mentorship',
    ],
    qualifications: [
      'Early-career software engineering background or strong project experience',
      'Interest in backend, frontend, integrations, and production systems',
      'Curiosity, hands-on learning ability, and good collaboration skills',
    ],
  },
  {
    title: 'Software Engineer, Platform (India)',
    company: 'Cartesia',
    location: 'Bangalore, India / Remote',
    salary: '₹70L - ₹90L',
    experience: '3 - 5 years',
    type: 'Full-time',
    remote: true,
    tags: ['Platform Engineering', 'Go', 'Python', 'AI', 'Distributed Systems', 'Next.js'],
    applyUrl: 'https://jobs.ashbyhq.com/cartesia/9d9c6cc0-218c-4fd4-a478-3e4b37de1d76',
    description: 'Cartesia is hiring a Software Engineer, Platform in India for AI platform and model serving infrastructure work.',
    responsibilities: [
      'Build low-latency model inference, serving, and data processing systems',
      'Work with research and product engineers to move AI systems into production',
      'Improve reliability, performance, and observability of platform services',
    ],
    qualifications: [
      '3-5 years of software, product, or ML platform engineering experience',
      'Strong engineering skills with Go, Python, distributed systems, or frontend/backend product work',
      'Experience with scalable systems, performance, reliability, or AI/ML platforms',
    ],
  },
  {
    title: 'Staff Software Engineer - Backend',
    company: 'Acceldata',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Staff / Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Java', 'Microservices', 'Distributed Systems', 'APIs'],
    applyUrl: 'https://jobs.lever.co/acceldata/d527fc32-5f61-4c3e-9e55-1294681ff03a',
    description: 'Acceldata is hiring a Staff Software Engineer for backend and distributed systems work in Bengaluru.',
    responsibilities: [
      'Design and build scalable backend systems using Java and microservices',
      'Develop APIs and services with high availability and low latency',
      'Contribute to architecture reviews, technical decisions, and performance improvements',
    ],
    qualifications: [
      'Strong backend engineering experience with Java and microservices',
      'Experience designing distributed systems and production APIs',
      'Ability to work with product, data, DevOps, and engineering teams',
    ],
  },
  {
    title: 'Software Engineer - AI/ML',
    company: 'Neuron7',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: '3 - 5 years',
    type: 'Full-time',
    remote: false,
    tags: ['AI/ML', 'Python', 'Backend', 'Integrations', 'Enterprise SaaS'],
    applyUrl: 'https://jobs.lever.co/neuron7/925f2386-8c06-43e7-ac25-358e58fa81df',
    description: 'Neuron7 is hiring a Software Engineer for AI/ML and backend implementation work in Bengaluru.',
    responsibilities: [
      'Build and integrate backend solutions for AI-driven enterprise workflows',
      'Work with customer success, ML, backend, and product teams on deployments',
      'Support onboarding, integrations, and reliable customer delivery',
    ],
    qualifications: [
      '3-5 years of software engineering experience',
      'Experience with Python, backend systems, integrations, or AI/ML workflows',
      'Ability to work with customer-facing technical delivery and enterprise systems',
    ],
  },
  {
    title: 'Senior Software Development Engineer - Backend',
    company: 'JioStar',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Payments', 'Distributed Systems', 'Subscriptions', 'High Scale'],
    applyUrl: 'https://jobs.lever.co/jiostar/a6d4b7c6-0bfa-4987-b3a5-fb554b707722',
    description: 'JioStar is hiring a Senior Software Development Engineer for backend systems in Bengaluru.',
    responsibilities: [
      'Design and develop backend systems for subscriptions, payments, and monetization workflows',
      'Own large-scale engineering projects from design to delivery',
      'Build reliable systems for high-throughput, low-latency product requirements',
    ],
    qualifications: [
      'Senior backend engineering experience with distributed systems',
      'Experience building scalable payment, subscription, or platform services is useful',
      'Ability to mentor engineers and own technical architecture decisions',
    ],
  },
  {
    title: 'Senior Frontend Engineer - React & JavaScript',
    company: 'Vendavo',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Frontend', 'React', 'JavaScript', 'UI Architecture', 'Enterprise Software'],
    applyUrl: 'https://jobs.lever.co/vendavo/5ce3f78a-fc46-4612-9526-a9b13c7c9105',
    description: 'Vendavo is hiring a Senior Frontend Engineer in Bengaluru for React and enterprise product UI work.',
    responsibilities: [
      'Design and maintain complex frontend functionality for enterprise products',
      'Translate UX and business requirements into scalable frontend solutions',
      'Collaborate with backend engineers, product managers, designers, and architects',
    ],
    qualifications: [
      'Senior frontend engineering experience with React and JavaScript',
      'Experience building scalable, maintainable, and high-performance user interfaces',
      'Ability to contribute to frontend architecture and engineering standards',
    ],
  },
  {
    title: 'Backend Engineer - Distributed Systems',
    company: 'Onehouse',
    location: 'Bangalore, India',
    salary: 'Not mentioned',
    experience: '3+ years',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Distributed Systems', 'Java', 'Kubernetes', 'gRPC', 'Cloud'],
    applyUrl: 'https://jobs.lever.co/Onehouse/2e0958a7-d86e-4b9e-9f81-b18bdf47f157',
    description: 'Onehouse is hiring a Backend Engineer in Bangalore for distributed systems and cloud platform work.',
    responsibilities: [
      'Build scalable platform services and backend APIs',
      'Work on microservices, database abstractions, infrastructure tooling, and integrations',
      'Own product features from design through implementation and operations',
    ],
    qualifications: [
      '3+ years of backend engineering experience in distributed environments',
      'Experience with Kubernetes, gRPC, Java, and cloud platforms',
      'Strong understanding of availability, monitoring, testing, and release management',
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'Fluxon',
    location: 'Hyderabad, India / Remote',
    salary: 'Not mentioned',
    experience: 'Senior',
    type: 'Full-time',
    remote: true,
    tags: ['Full Stack', 'Product Engineering', 'Remote', 'Client Engineering'],
    applyUrl: 'https://boards.greenhouse.io/embed/job_app?for=fluxon&token=4235634005',
    description: 'Fluxon is hiring a Senior Software Engineer for remote product development work from Hyderabad, India.',
    responsibilities: [
      'Drive end-to-end product implementations with engineering teams',
      'Work with clients and internal teams on requirements, demos, and production issues',
      'Collaborate with product and design teams on technical solutions',
    ],
    qualifications: [
      'Senior software engineering experience with full-stack or product development',
      'Ability to work in remote teams and communicate with clients',
      'Strong implementation, debugging, and delivery ownership skills',
    ],
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Revefi',
    location: 'Bangalore, India',
    salary: 'Not mentioned',
    experience: 'Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Frontend', 'React', 'UI/UX', 'Data Products', 'SaaS'],
    applyUrl: 'https://jobs.lever.co/revefi/1b4b9d5c-a623-469e-b440-e82c1ee72207',
    description: 'Revefi is hiring a Senior Frontend Engineer in Bangalore for AI data product UI development.',
    responsibilities: [
      'Build responsive and high-performance frontend components and workflows',
      'Collaborate with design, product, and backend teams on data-driven UI features',
      'Lead frontend feature development from design to production deployment',
    ],
    qualifications: [
      'Senior frontend engineering experience with React or similar frameworks',
      'Experience building scalable user interfaces for SaaS or data products',
      'Ability to own frontend features and contribute to design system evolution',
    ],
  },
  {
    title: 'Backend Developer - Node.js / Golang',
    company: 'Cambium Networks',
    location: 'Bengaluru, Karnataka',
    salary: 'Not mentioned',
    experience: 'Experienced',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Node.js', 'Golang', 'Cloud', 'Networking'],
    applyUrl: 'https://jobs.lever.co/cambiumnetworks/b6a225b5-6160-4c0c-b9ee-37937634fbcd',
    description: 'Cambium Networks is hiring a Backend Developer in Bengaluru for Node.js, Golang, and cloud networking software work.',
    responsibilities: [
      'Build scalable and secure backend services',
      'Work on cloud-managed networking product features and integrations',
      'Collaborate with engineering teams on performance, reliability, and maintainability',
    ],
    qualifications: [
      'Backend development experience with Node.js, Golang, or similar technologies',
      'Understanding of cloud services, APIs, and scalable backend design',
      'Interest or experience in networking, wireless systems, or device management platforms',
    ],
  },
  {
    title: 'Backend Engineer',
    company: 'zaimler',
    location: 'Bengaluru, India',
    salary: 'Not mentioned',
    experience: 'Experienced',
    type: 'Full-time',
    remote: false,
    tags: ['Backend', 'Microservices', 'Knowledge Graphs', 'AI Infrastructure', 'APIs'],
    applyUrl: 'https://jobs.lever.co/zaimler/31008cbb-9ba9-422b-89d9-5589a345f708',
    description: 'zaimler is hiring a Backend Engineer in Bengaluru for microservices and AI infrastructure work.',
    responsibilities: [
      'Design and implement microservices for document ingestion, extraction, and graph systems',
      'Build robust APIs and service boundaries for an AI and data platform',
      'Work with founding engineering teams on backend architecture and product foundations',
    ],
    qualifications: [
      'Backend engineering experience with microservices and distributed systems',
      'Comfort working with APIs, data-intensive systems, and ambiguous technical problems',
      'Exposure to knowledge graphs, embeddings, search, or AI infrastructure is useful',
    ],
  },
  {
    title: 'Software Engineer - ImplantBase',
    company: 'openDoctor',
    location: 'India Team / Remote',
    salary: '₹17L - ₹24L',
    experience: '10+ years',
    type: 'Full-time',
    remote: true,
    tags: ['Software Engineering', 'Groovy', 'Grails', 'Java', 'MySQL', 'React Native'],
    applyUrl: 'https://jobs.ashbyhq.com/opendr/c2d9a62f-bf2f-4706-ba4e-d691c787dd33/',
    description: 'openDoctor is hiring a Software Engineer for ImplantBase product engineering work with the India team.',
    responsibilities: [
      'Develop and maintain web and mobile application features',
      'Work on APIs, integrations, databases, and customer-reported issues',
      'Collaborate with QA, product, and global engineering teams',
    ],
    qualifications: [
      '10+ years of professional software development experience',
      'Experience with Java, Groovy on Grails, MySQL, integrations, or mobile development',
      'Bachelor’s degree in Computer Science, IT, related field, or equivalent experience',
    ],
  },
  {
    title: 'Software Engineer - Data Platform',
    company: 'Granica',
    location: 'India / Remote',
    salary: 'Not mentioned',
    experience: '5+ years',
    type: 'Full-time',
    remote: true,
    tags: ['Data Platform', 'Python', 'PySpark', 'Airflow', 'Terraform', 'Cloud'],
    applyUrl: 'https://jobs.ashbyhq.com/granica/ddca09b6-a77b-4d05-9a50-a8007f1a70f3/',
    description: 'Granica is hiring a Software Engineer for remote India data platform and backend infrastructure work.',
    responsibilities: [
      'Build backend APIs and scalable data pipelines',
      'Work with lakehouse, warehouse, orchestration, and infrastructure-as-code tools',
      'Improve reliability, monitoring, cost efficiency, and customer integrations',
    ],
    qualifications: [
      '5+ years of software, data engineering, or infrastructure experience',
      'Strong Python skills and experience building scalable data pipelines',
      'Experience with Spark, Airflow, cloud platforms, monitoring, or infrastructure tools',
    ],
  },
  {
    title: 'Software Engineer (India)',
    company: 'Acai Travel',
    location: 'Pune, India / Remote India',
    salary: '₹15L - ₹22L',
    experience: '2 - 4 years',
    type: 'Full-time',
    remote: true,
    tags: ['Backend', 'Go', 'gRPC', 'MongoDB', 'AI Automation', 'Product Engineering'],
    applyUrl: 'https://jobs.ashbyhq.com/acai/4c4a0fee-e46e-4327-9aa7-d866b8b1f476',
    description: 'Acai Travel is hiring a Software Engineer in India for backend and AI automation product work.',
    responsibilities: [
      'Build backend services and AI automation workflows',
      'Work across product-driven systems, integrations, and customer requirements',
      'Collaborate with global engineering, product, and customer teams',
    ],
    qualifications: [
      '2-4 years of backend engineering experience',
      'Experience or interest in Go, gRPC, MongoDB, cloud platforms, and AI automation',
      'Bachelor’s degree in Computer Science or related field from a reputed institution is preferred',
    ],
  },
  {
    title: 'Forward Deployed Engineer',
    company: 'realfast.ai',
    location: 'India / Bengaluru / Remote',
    salary: 'Not mentioned',
    experience: '2 - 5 years',
    type: 'Full-time',
    remote: true,
    tags: ['Full Stack', 'AI Tools', 'Backend', 'Frontend', 'Customer Engineering'],
    applyUrl: 'https://jobs.ashbyhq.com/realfast/bb71c050-ec2a-4484-808d-2a1b9d7c9edc/',
    description: 'realfast.ai is hiring a Forward Deployed Engineer in India for full-stack and AI-assisted delivery work.',
    responsibilities: [
      'Build across frontend, backend, data pipelines, and AI-assisted workflows',
      'Work with customers and internal teams to deliver production-ready software quickly',
      'Make practical engineering trade-offs while maintaining code quality',
    ],
    qualifications: [
      '2-5 years of software engineering experience',
      'Strong coding ability across one or more programming languages',
      'Comfort working in terminals, AI-assisted development workflows, and ambiguous product environments',
    ],
  },
  {
    title: 'Lead Software Engineer',
    company: 'RapidAI',
    location: 'Bangalore, India',
    salary: 'Not mentioned',
    experience: 'Lead / Senior',
    type: 'Full-time',
    remote: false,
    tags: ['Software Engineering', 'Technical Leadership', 'Healthcare AI', 'Backend'],
    applyUrl: 'https://jobs.lever.co/rapidai/408becda-5697-4f65-a5dd-1ef158263b41',
    description: 'RapidAI is hiring a Lead Software Engineer in Bangalore for healthcare AI platform engineering.',
    responsibilities: [
      'Provide technical leadership and write maintainable production code',
      'Design and build technical solutions through the full development lifecycle',
      'Lead engineering projects, planning, execution, and delivery',
    ],
    qualifications: [
      'Senior or lead software engineering experience',
      'Ability to design, build, and own production engineering solutions',
      'Comfort working with engineering teams across different time zones when required',
    ],
  },
  {
    title: 'Software Engineer (6+ years experience)',
    company: 'Builder.io',
    location: 'Remote - India',
    salary: 'Not mentioned',
    experience: '6+ years',
    type: 'Full-time',
    remote: true,
    tags: ['Full Stack', 'Frontend', 'APIs', 'Product Engineering', 'Remote'],
    applyUrl: 'https://boards.greenhouse.io/embed/job_app?for=builder&token=5191588004',
    description: 'Builder.io is hiring a remote Software Engineer in India for full-stack product engineering work.',
    responsibilities: [
      'Design and build product features across frontend, APIs, testing, and deployment',
      'Own features from requirements and implementation through feedback and delivery',
      'Work with engineers, designers, and team leads on technical decisions',
    ],
    qualifications: [
      '6+ years of software engineering experience',
      'Full-stack product engineering experience with frontend, APIs, testing, or deployment',
      'Ability to work remotely from India with strong ownership and communication',
    ],
  },
]

function normalizeUrl(url) {
  return String(url || '').replace(/[?#].*$/, '').replace(/\/$/, '')
}

function main() {
  const jobs = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  if (!Array.isArray(jobs)) throw new Error(`Expected an array in ${inputPath}`)

  const existingUrls = new Set(jobs.map((job) => normalizeUrl(job.applyUrl || job.sourceUrl)))
  const existingTitles = new Set(jobs.map((job) => `${job.company}::${job.title}`.toLowerCase()))
  let nextId = Math.max(...jobs.map((job) => Number(job.id) || 0)) + 1
  let added = 0

  officialJobs.forEach((job) => {
    const urlKey = normalizeUrl(job.applyUrl)
    const titleKey = `${job.company}::${job.title}`.toLowerCase()
    if (existingUrls.has(urlKey) || existingTitles.has(titleKey)) return

    jobs.push({
      id: nextId,
      companyId: nextId,
      postedAt,
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=1e40af&color=fff&size=128`,
      sourceType: 'Official application page',
      ...job,
    })

    existingUrls.add(urlKey)
    existingTitles.add(titleKey)
    nextId += 1
    added += 1
  })

  fs.writeFileSync(inputPath, `${JSON.stringify(jobs, null, 2)}\n`)
  console.log(`Added ${added} official-source software jobs. Total jobs: ${jobs.length}`)
}

main()
