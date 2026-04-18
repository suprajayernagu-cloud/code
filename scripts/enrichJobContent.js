#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Career advisor tone - generates unique, helpful content
const contentGenerator = {
  generateOverview: (job) => {
    const overviews = {
      "software_dev": `This ${job.experience} Software Developer role presents an exceptional opportunity to build your career in modern software engineering. You'll contribute to ${job.company}'s mission of creating scalable, high-impact technology solutions that reach millions globally. Working within a collaborative environment, you'll solve real-world problems using cutting-edge technologies while learning from seasoned engineers. The role emphasizes practical skill development, code quality, and architectural thinking—preparing you for long-term success in the tech industry. Whether you're fresh out of college or seeking your next challenge, this position offers the perfect blend of responsibility and mentorship to accelerate your professional growth in a world-class engineering culture.`,
      "fintech": `Join the rapidly growing fintech sector where innovation meets financial transformation. This role at ${job.company} puts you at the intersection of technology and global finance, working on systems that process critical transactions daily. You'll build secure, scalable payment platforms and financial solutions that impact millions of users. The fintech industry offers unparalleled learning opportunities—from understanding distributed ledger technology to mastering high-throughput systems. This position is ideal for engineers who want to make tangible business impact while working with cutting-edge technologies like real-time data processing and AI-driven risk assessment. Prepare for a dynamic career where your code directly influences financial inclusion and digital transformation across emerging markets.`,
      "consulting": `Step into a career where you'll drive digital transformation across diverse industries. At ${job.company}, consultants solve complex business problems by combining strategic thinking with technical expertise. You'll work on projects spanning cloud migration, AI implementation, and enterprise optimization—each project expanding your industry knowledge and client management skills. The consulting track offers exposure to Fortune 500 companies and unique technical challenges impossible to encounter in product roles. Your growth will be measured not just by code shipped, but by business outcomes delivered. This is where technical depth meets business acumen, creating leaders who understand both 'how' and 'why' behind enterprise technology decisions.`,
      "training": `This structured training program is your gateway to corporate engineering. ${job.company} invests heavily in developing fresh talent through intensive programs combining classroom learning with hands-on project work. Over ${job.experience === 'Fresher (2026)' ? '12 months' : '6 months'}, you'll master enterprise technologies, best practices, and industry standards. The program isn't just about technical skilling—it's about building professional maturity, communication abilities, and the resilience needed for long-term tech careers. You'll graduate as a confident engineer ready to contribute meaningfully to complex projects. Many trainees progress into specialized roles, leadership tracks, or their preferred technology domains within the organization. Join thousands of successful alumni who built thriving careers starting exactly where you are now.`,
      "internship": `This internship is your launchpad into the tech industry's premier companies. ${job.company}'s internship program is selective, intensive, and career-defining. You'll work on real production code, own meaningful projects, and collaborate with world-class engineers. Most importantly, top performers receive full-time offers (PPO), eliminating the uncertainty of campus hiring rounds. The internship experience teaches you industry practices that college labs simply cannot replicate—from code reviews and deployment pipelines to production debugging and performance optimization. Whether you convert to full-time or use this as your foundation for other opportunities, this three-month sprint will dramatically accelerate your engineering journey and open doors throughout the industry.`,
      "default": `This role at ${job.company} offers a unique opportunity to grow your career in ${job.tags?.[0] || 'technology'}. You'll work on meaningful projects that impact real users while developing skills crucial for long-term success in the tech industry. The position balances immediate responsibility with continuous learning, preparing you for leadership roles ahead. Join a team of passionate professionals committed to excellence, innovation, and personal growth.`
    };

    let key = 'default';
    if (job.title.toLowerCase().includes('software dev') || job.title.toLowerCase().includes('sde')) key = 'software_dev';
    else if (job.title.toLowerCase().includes('fintech') || job.title.toLowerCase().includes('payment')) key = 'fintech';
    else if (job.title.toLowerCase().includes('consultant') || job.title.toLowerCase().includes('analyst')) key = 'consulting';
    else if (job.title.toLowerCase().includes('trainee') || job.title.toLowerCase().includes('trainee')) key = 'training';
    else if (job.title.toLowerCase().includes('intern')) key = 'internship';

    return overviews[key];
  },

  generateResponsibilitiesDetailed: (job) => {
    const detailedResponsibilities = {};
    if (job.responsibilities && Array.isArray(job.responsibilities)) {
      job.responsibilities.forEach((resp, idx) => {
        const explanations = {
          "Develop": "Building software components means writing clean, maintainable code that follows industry best practices. You'll create features end-to-end, from design discussions to deployment. This includes unit testing, code documentation, and ensuring your code is readable for other team members.",
          "Collaborate": "Team collaboration is essential in modern engineering. You'll participate in design reviews, code reviews, and architectural discussions. Strong communication helps clarify requirements, resolve technical disagreements, and ensure everyone understands the big picture.",
          "Solve": "Problem-solving is the heart of engineering. You'll diagnose production issues, optimize slow queries, and architect solutions for scale. Each challenge teaches valuable lessons about system design, trade-offs, and business impact.",
          "Maintain": "Software isn't write-once. Maintenance involves fixing bugs, updating documentation, refactoring legacy code, and ensuring systems remain performant. This teaches you real-world engineering where perfection is impossible but excellence is achievable.",
          "Participate": "Active participation in ceremonies like standups, sprints, and retrospectives keeps teams aligned. You'll voice ideas, learn from colleagues, and contribute to a culture of continuous improvement.",
          "Work": "Working with tools, technologies, or teams expands your capabilities. Whether it's learning a new framework or mastering cloud services, exposure to diverse technologies makes you a more adaptable engineer.",
          "Support": "Supporting colleagues through mentorship, pair programming, or knowledge sharing builds team strength. Even juniors can support others in specific areas, fostering a culture of mutual growth.",
          "Assist": "Assisting senior engineers is how you learn fastest. You'll observe real-world problem-solving, ask thoughtful questions, and gradually take on bigger responsibilities as you gain confidence.",
          "Handle": "Handling high-volume or complex tasks builds resilience and time management skills. You'll learn to prioritize, multitask under pressure, and deliver consistently.",
          "Ensure": "Responsibility for quality, compliance, or standards teaches accountability. Whether it's ensuring security protocols or maintaining SLAs, this develops the ownership mindset essential for senior roles."
        };

        let explanation = explanations['default'] || "Understanding the specifics of this responsibility will help you prepare effectively for the role and contribute immediately from day one.";
        for (const [keyword, exp] of Object.entries(explanations)) {
          if (resp.includes(keyword)) {
            explanation = exp;
            break;
          }
        }

        detailedResponsibilities[`${idx + 1}`] = {
          responsibility: resp,
          whatItMeans: explanation,
          whyItMatters: "This responsibility directly contributes to team objectives and your professional development in critical areas."
        };
      });
    }
    return detailedResponsibilities;
  },

  generateEligibilityDetailed: (job) => {
    const detailedEligibility = {};
    if (job.qualifications && Array.isArray(job.qualifications)) {
      job.qualifications.forEach((qual, idx) => {
        const explanations = {
          "degree": "Your educational background provides the foundational knowledge for the role. The specific discipline mentioned aligns with job requirements.",
          "GPA": "Academic performance is an indicator of learning ability and dedication. Requirements are set based on typical performance levels needed for role success.",
          "backlog": "Active backlogs indicate incomplete coursework. Most companies prefer candidates who've finalized their education to focus fully on work.",
          "experience": "Prior experience demonstrates applied learning beyond academics. Even intern projects count—they show initiative and practical problem-solving.",
          "skills": "Technical skills are prerequisites. These form the foundation for immediate productivity without excessive onboarding time.",
          "CGPA": "Cumulative GPA reflects overall academic performance. While it's not everything, it helps predict learning velocity and attention to detail.",
          "languages": "Language proficiency matters for communication-heavy roles or location-specific requirements. It shows ability to work in diverse environments.",
          "certification": "Professional certifications prove commitment to specialization and staying current with industry standards.",
          "default": "This qualification ensures you have the foundational knowledge and capabilities to succeed in this role."
        };

        let explanation = explanations['default'];
        for (const [keyword, exp] of Object.entries(explanations)) {
          if (qual.toLowerCase().includes(keyword)) {
            explanation = exp;
            break;
          }
        }

        detailedEligibility[`${idx + 1}`] = {
          requirement: qual,
          whyRequired: explanation,
          howToMeet: "Ensure you meet this requirement before applying. If unsure, contact HR to clarify.",
          wouldTheyReject: "Companies typically reject candidates who don't meet core requirements, though they may consider borderline cases with exceptional portfolios."
        };
      });
    }
    return detailedEligibility;
  },

  generateSkillsRequired: (job) => {
    const skills = new Set();
    
    if (job.tags) {
      job.tags.forEach(tag => {
        if (!['Fresher', 'Trainee', '2026', 'Internship', 'Full-time', 'Remote'].includes(tag)) {
          skills.add(tag);
        }
      });
    }

    const skillMappings = {
      'Java': { category: 'Programming Language', level: 'Intermediate to Advanced', why: 'Core backend development language' },
      'Python': { category: 'Programming Language', level: 'Intermediate', why: 'Versatile for backends, data, and automation' },
      'C++': { category: 'Programming Language', level: 'Advanced', why: 'Performance-critical systems require deep memory understanding' },
      'JavaScript': { category: 'Web Technology', level: 'Intermediate', why: 'Modern web application development' },
      'React': { category: 'Frontend Framework', level: 'Intermediate', why: 'Industry-standard for building UIs' },
      'Node.js': { category: 'Runtime/Backend', level: 'Intermediate', why: 'JavaScript-based backend development' },
      'SQL': { category: 'Database', level: 'Intermediate', why: 'Data querying and management essential for all roles' },
      'AWS': { category: 'Cloud Platform', level: 'Intermediate', why: 'Cloud infrastructure and services' },
      'Kubernetes': { category: 'DevOps/Infrastructure', level: 'Advanced', why: 'Container orchestration for scalable systems' },
      'Machine Learning': { category: 'AI/ML', level: 'Intermediate to Advanced', why: 'Building intelligent systems and predictions' },
      'Product Engineering': { category: 'Domain', level: 'Intermediate', why: 'Building reliable, scalable software products' },
      'Data Structures': { category: 'Computer Science', level: 'Intermediate', why: 'Fundamental to efficient algorithm design' },
      'Algorithms': { category: 'Computer Science', level: 'Intermediate to Advanced', why: 'Core to competitive programming and system optimization' },
      'System Design': { category: 'Architecture', level: 'Advanced', why: 'Designing scalable, reliable systems' },
      'TypeScript': { category: 'Web Technology', level: 'Intermediate', why: 'Type-safe JavaScript development' },
      'DevOps': { category: 'Infrastructure', level: 'Intermediate to Advanced', why: 'Infrastructure automation and deployment' },
    };

    const requiredSkills = [];
    skills.forEach(skill => {
      const skillInfo = skillMappings[skill] || {
        category: 'Technical Skill',
        level: 'Intermediate',
        why: `${skill} is directly required for this role`
      };
      requiredSkills.push({
        name: skill,
        category: skillInfo.category,
        proficiencyLevel: skillInfo.level,
        why: skillInfo.why,
        howToBuild: `Learn through online courses, projects, and hands-on practice. Most companies provide training for niche technologies.`
      });
    });

    // Add soft skills
    requiredSkills.push(
      {
        name: 'Problem-Solving',
        category: 'Soft Skill',
        proficiencyLevel: 'Essential',
        why: 'Engineering is fundamentally about solving complex problems creatively',
        howToBuild: 'Practice coding challenges on LeetCode/HackerRank. Solve real problems through projects.'
      },
      {
        name: 'Communication',
        category: 'Soft Skill',
        proficiencyLevel: 'Essential',
        why: 'Clear communication prevents bugs and ensures team alignment',
        howToBuild: 'Document your projects, explain code to peers, practice presenting ideas clearly.'
      },
      {
        name: 'Teamwork',
        category: 'Soft Skill',
        proficiencyLevel: 'Important',
        why: 'Most engineering work happens in teams; collaboration is non-negotiable',
        howToBuild: 'Work on group projects, participate in hackathons, contribute to open source.'
      },
      {
        name: 'Continuous Learning',
        category: 'Soft Skill',
        proficiencyLevel: 'Essential',
        why: 'Tech evolves rapidly; successful engineers never stop learning',
        howToBuild: 'Follow tech blogs, experiment with new technologies, read open source code.'
      }
    );

    return requiredSkills;
  },

  generateSalaryInsights: (job) => {
    const salary = job.salary;
    const experience = job.experience;
    
    return `Understanding your compensation is crucial for career decisions. The salary range offered reflects market standards, your experience level, and the company's scale. For ${experience === 'Fresher (2026)' ? 'freshers' : experience === 'Internship (2026 Batch)' ? 'interns' : 'professionals'} in India's tech industry, this range is competitive. Beyond base salary, consider the total package: bonus structure, stock options (at startups), PF contributions, health insurance, and relocation support. Early-career offers often include performance bonuses that can significantly increase take-home. At ${job.company}, career progression typically leads to 20-40% raises within 2-3 years. Negotiate thoughtfully—most companies have flexibility beyond the listed range, especially for strong candidates. Remember: career growth and learning opportunities often matter more than initial salary for long-term success.`;
  },

  generateWhyApply: (job) => {
    const reasons = [
      `This is a unique opportunity at a company that's actively shaping the ${job.tags?.[0] || 'tech'} landscape.`,
      `You'll work on problems that matter—${job.company}'s products impact millions globally.`,
      `The learning curve here is steep. Within months, you'll gain experience that takes years elsewhere.`,
      `${job.company} invests in employee growth through training, mentorship, and internal mobility opportunities.`,
      `Your code reaches production immediately. No endless meetings or bureaucratic processes.`,
      `The team is passionate and collaborative—you'll grow faster surrounded by excellent engineers.`,
      `Career acceleration is real here. Strong performers progress to senior roles, leadership tracks, or specialized domains within 3-5 years.`,
      `The tech stack is modern and in-demand. Skills you build here are valuable across the industry.`,
      `Company stability + startup energy. ${job.company} has resources but maintains the agility of growth-stage companies.`,
      `Networking at this level opens doors for your entire career.`
    ];

    return reasons.slice(0, 5).join('\n\n');
  },

  generatePreparationTips: (job) => {
    return [
      {
        tip: 'Master Data Structures & Algorithms',
        description: 'Most tech interviews test DS&A fundamentals. Spend 4-6 weeks on LeetCode medium-level problems. Focus on arrays, linked lists, trees, graphs, and sorting algorithms. Being able to optimize both time and space complexity is crucial.',
        timeline: '4-6 weeks before interview'
      },
      {
        tip: 'Build a Strong Project Portfolio',
        description: `Create 2-3 projects using technologies relevant to ${job.company}. They should solve real problems or demonstrate learning. GitHub commits matter—interviewers check your actual code. Include projects that show: full-stack thinking, performance optimization, or clever problem-solving.`,
        timeline: 'Ongoing, showcase latest 3-6 months before interview'
      },
      {
        tip: `Study ${job.company} Tech Stack`,
        description: `Research what technologies ${job.company} uses (check their engineering blog, GitHub, job descriptions). Deep dive into 1-2 key technologies. Be ready to discuss why certain tech choices make sense for their business. This shows genuine interest and domain knowledge.`,
        timeline: '2 weeks before interview'
      },
      {
        tip: 'Practice System Design (if applicable)',
        description: 'For mid-to-senior roles, expect system design questions. Understand trade-offs in scaling: SQL vs NoSQL, monolithic vs microservices, caching strategies. Practice designing real systems (Twitter feed, Netflix recommendation).',
        timeline: '3 weeks before interview'
      },
      {
        tip: 'Prepare Your Story',
        description: 'Articulate why you want this role, what excites you, and what problems you want to solve. Practice talking about your projects—why you built them, what you learned, what you\'d do differently. Behavioral questions reveal cultural fit as much as technical skills.',
        timeline: '1 week before interview'
      },
      {
        tip: 'Mock Interviews Are Game-Changers',
        description: 'Interview.io, Pramp, or peer mocks reduce anxiety and expose gaps. You\'ll discover time management issues, communication blind spots, and areas needing deeper study. Do at least 3-5 mocks.',
        timeline: '2 weeks before interview'
      },
      {
        tip: 'Ask Smart Questions',
        description: 'Prepare thoughtful questions about team dynamics, technical challenges, growth opportunities, and company culture. Questions like "What\'s the biggest technical debt your team faces?" or "How do you measure success for this role?" show intellectual curiosity.',
        timeline: 'Prepare 5-7 questions in advance'
      },
      {
        tip: 'Sleep Well Before Interview',
        description: 'Your cognitive performance drops 30% with poor sleep. Interview preparation is 90% done the night before. Sleep 8 hours, eat breakfast, and trust your preparation.',
        timeline: 'Night before interview'
      }
    ];
  },

  generateHowToApply: (job) => {
    return [
      {
        step: 1,
        action: 'Review Full Requirements',
        details: `Read the job description thoroughly. Identify 3-5 key requirements matching your strengths. Having 80% match is good enough—don't skip applying because you lack one technology. Companies value potential and learning ability.`,
        estimatedTime: '10-15 minutes'
      },
      {
        step: 2,
        action: 'Prepare Your Materials',
        details: `Update your resume to highlight relevant projects, internships, and achievements. Include quantifiable metrics. Your GitHub profile should be active with 3+ meaningful projects. LinkedIn should be complete and professional. Many ATS (Applicant Tracking Systems) scan these.`,
        estimatedTime: '30-45 minutes'
      },
      {
        step: 3,
        action: 'Customize Your Cover Letter (if applicable)',
        details: `Write a brief, compelling cover letter addressing why this role excites you and how your background fits. Generic letters get skipped. Mention specific products or challenges from ${job.company}. Keep it to 3-4 paragraphs.`,
        estimatedTime: '20-30 minutes'
      },
      {
        step: 4,
        action: 'Apply via Official Channels',
        details: `Use the company's career portal or job board link provided. Referrals bypass the first filter—ask alumni or LinkedIn connections if they can refer you. A referral increases your chances by 5-10x. Fill out the form honestly; they'll verify during interviews.`,
        estimatedTime: '5-10 minutes'
      },
      {
        step: 5,
        action: 'Follow Up (Strategically)',
        details: `If you don't hear back in 2 weeks, find the hiring manager or recruiter on LinkedIn and send a polite message expressing your interest. Don't be pushy. A single, thoughtful follow-up shows persistence without being annoying.`,
        estimatedTime: '5 minutes'
      },
      {
        step: 6,
        action: 'Prepare for Interviews',
        details: `Once you receive an interview invite, spend 2-3 weeks preparing. Practice coding problems, mock interviews, and storytelling. Know your projects inside-out. Research interviewers on LinkedIn. Be ready to discuss why this role fits your career goals.`,
        estimatedTime: '20-30 hours over 3 weeks'
      },
      {
        step: 7,
        action: 'Attend Interviews Confidently',
        details: `Show up 10 minutes early (virtually, log in early). Dress professionally. Make eye contact. Be honest about what you don't know. Interview them too—ask about their biggest challenges and team culture. Remember: interviews are a two-way street.`,
        estimatedTime: '1-3 hours total across interview rounds'
      },
      {
        step: 8,
        action: 'Negotiate and Close',
        details: `If you get an offer, take 24-48 hours to negotiate. Research market rates and discuss base salary, bonus, stock options, and benefits. Thank them for the opportunity, and join with enthusiasm. You've earned it.`,
        estimatedTime: '1-2 hours'
      }
    ];
  },

  generateAboutCompany: (job) => {
    const companyInfo = {
      'Amazon': {
        aboutCompany: `Amazon, founded by Jeff Bezos in 1994, has evolved from an online bookstore into a $1.5 trillion technology and e-commerce powerhouse. Amazon's engineering culture is legendary—they pioneered practices like two-pizza teams and have a famous document culture where ideas are debated rigorously. In India, Amazon is hiring aggressively for AWS, retail tech, fintech, and logistics. The company values long-term thinking ("We are willing to be misunderstood for long periods") and customer obsession. Working here means solving problems at scale—your code impacts millions daily.`,
        foundedYear: 1994,
        headquarters: 'Seattle, USA',
        indianPresence: 'Strong—Bengaluru, Hyderabad, Chennai, Delhi',
        whyJoin: 'Scale, learning opportunity, career growth trajectory is steep'
      },
      'Google': {
        aboutCompany: `Google, a subsidiary of Alphabet Inc., is the world's leading search and advertising company. Google's engineering excellence is legendary—their interview process is rigorous, their internal tools are best-in-class, and their engineering culture emphasizes technical excellence. Google India is hiring for Search, Android, Cloud, AI/ML, and infrastructure roles. The company gives engineers freedom to spend 20% time on personal projects, leading to innovations like Gmail and Google News. Working at Google means working on products used by billions globally.`,
        foundedYear: 1998,
        headquarters: 'Mountain View, USA',
        indianPresence: 'Bengaluru, Hyderabad, Gurugram',
        whyJoin: 'Prestige, technical excellence, global impact'
      },
      'Microsoft': {
        aboutCompany: `Microsoft, founded by Bill Gates and Paul Allen, is a diversified technology company with a presence in cloud computing (Azure), productivity software (Office 365), gaming (Xbox), and AI. Under Satya Nadella's leadership, Microsoft has transformed into a cloud-first company. Microsoft India is rapidly hiring for Azure, AI, and enterprise solutions. The company has a strong commitment to engineering excellence and continuous learning. Microsoft projects span from infrastructure to consumer products, offering diverse learning opportunities.`,
        foundedYear: 1975,
        headquarters: 'Redmond, USA',
        indianPresence: 'Hyderabad, Bengaluru, Noida',
        whyJoin: 'Enterprise scale, cloud expertise, diverse tech stacks'
      },
      'Zoho': {
        aboutCompany: `Zoho Corporation is a self-funded, Chennai-based SaaS giant with an impressive footprint across 180+ countries. Unlike Silicon Valley companies, Zoho bootstrapped its growth without VC funding—proving Indian companies can scale globally. Zoho's engineering culture emphasizes ownership, continuous learning, and building products that last decades. The company operates across diverse domains: CRM, HR, finance, marketing, and infrastructure. For engineers, this means exposure to different problem domains within a single company. Zoho hiring focuses on core engineering skills and problem-solving ability.`,
        foundedYear: 1996,
        headquarters: 'Chennai, India',
        indianPresence: 'Significant—Chennai, Tenkasi, other Indian cities',
        whyJoin: 'Indian success story, global scale, diverse product portfolio, strong engineering'
      },
      'TCS': {
        aboutCompany: `Tata Consultancy Services (TCS) is India's largest IT services company and a global leader in digital transformation. TCS serves 500+ Fortune companies across industries. Unlike product companies, TCS offers consulting and implementation expertise—you'll work on diverse projects, industries, and clients. TCS has structured training programs for freshers, clear career progressions, and significant emphasis on employee development. For freshers seeking stability, clear growth paths, and exposure to enterprise technology, TCS is ideal. The company is investing heavily in AI, cloud, and emerging technologies.`,
        foundedYear: 1968,
        headquarters: 'Mumbai, India',
        indianPresence: 'Pan-India presence, major office in Pune, Hyderabad, Bengaluru',
        whyJoin: 'Stability, clear growth path, diverse project exposure, client list'
      },
      'Infosys': {
        aboutCompany: `Infosys, founded by Narayana Murthy, is an Indian IT services leader with global operations. Known for pioneering practices in software development and quality management, Infosys is a role model for Indian tech companies. The company serves global Fortune 500 companies. Infosys offers structured career paths, strong training programs (like the Specialist Programmer program for top talent), and clear progression to leadership roles. The company emphasizes continuous learning and has significant investments in emerging technologies like AI, blockchain, and cloud.`,
        foundedYear: 1981,
        headquarters: 'Bengaluru, India',
        indianPresence: 'Pan-India, headquarters in Bengaluru',
        whyJoin: 'Pioneer in Indian tech, clear career path, diverse projects, emphasis on learning'
      },
      'Wipro': {
        aboutCompany: `Wipro Limited is a diversified IT services and products company headquartered in Bengaluru. The company is known for its National Talent Hunt (NTH) and elite hiring programs targeting top talent. Wipro offers roles across IT services, software products, and infrastructure management. The company has a strong commitment to employee development, with multiple career tracks and training academies. Wipro's culture emphasizes integrity, customer focus, and continuous innovation. For engineers, the appeal is the combination of stability with growth opportunities and exposure to emerging technologies.`,
        foundedYear: 1980,
        headquarters: 'Bengaluru, India',
        indianPresence: 'Pan-India presence, major offices nationwide',
        whyJoin: 'Established company, clear career paths, diverse domains, strong training'
      },
      'Cisco': {
        aboutCompany: `Cisco Systems is a global networking and cybersecurity giant, known for inventions in networking. Cisco India (Bangalore) has a strong engineering team working on routing, switching, security, and cloud-native networking. Cisco's engineering culture emphasizes innovation—the company files hundreds of patents annually. Working at Cisco means solving infrastructure problems at global scale. The company offers opportunities in hardware, embedded systems, cloud infrastructure, and security. For engineers interested in low-level systems, networking, or cybersecurity, Cisco is an exceptional choice.`,
        foundedYear: 1984,
        headquarters: 'San Jose, USA',
        indianPresence: 'Bengaluru (strong engineering center)',
        whyJoin: 'Networking expertise, infrastructure scale, security focus'
      },
      'SBI': {
        aboutCompany: `State Bank of India (SBI), established in 1955, is India's largest bank and a crucial player in the financial system. SBI is actively modernizing its technology infrastructure, recruiting heavily for banking tech, cybersecurity, and digital transformation. Working for SBI as an officer or technologist means contributing to India's financial inclusion and digital revolution. The bank offers job security, government benefits, structured career progression, and the satisfaction of building India's critical infrastructure. For specialists, SBI offers roles in technology where you can shape the future of banking.`,
        foundedYear: 1955,
        headquarters: 'Mumbai, India',
        indianPresence: 'Pan-India (largest bank network)',
        whyJoin: 'Stability, government benefits, impact on millions, career security'
      },
      'default': {
        aboutCompany: `${job.company} is a leader in the ${job.tags?.[0] || 'technology'} domain. The company is known for innovation, employee development, and building world-class products. Working here offers exposure to interesting technical challenges, a collaborative team environment, and opportunities for career growth. The company values engineering excellence, continuous learning, and meritocracy—your hard work and skills directly impact your career trajectory.`,
        foundedYear: 'Unknown',
        headquarters: job.location || 'Various',
        indianPresence: job.location || 'India-based',
        whyJoin: 'Innovation, learning, growth, meaningful work'
      }
    };

    return companyInfo[job.company] || companyInfo['default'];
  },

  generateFAQ: (job) => {
    return [
      {
        question: 'Is a prior experience necessary for this role?',
        answer: `The role is categorized as "${job.experience}". If it explicitly says "Fresher" or "Internship", no prior experience is required—your learning potential and problem-solving skills matter more. If it requires X years of experience, prioritize that, though companies sometimes make exceptions for exceptional candidates. When in doubt, apply anyway. The worst they can say is no.`
      },
      {
        question: 'How long is the interview process?',
        answer: `Most tech companies have a 2-4 round interview process: initial screening (phone/video), technical interview(s), and sometimes a manager/cultural fit round. The entire process typically takes 2-6 weeks. Each round usually lasts 45-60 minutes. Come prepared with examples of your projects and problem-solving approach.`
      },
      {
        question: 'What if I don\'t know all the technologies they mention?',
        answer: `Don't let this discourage you. Companies know that learning ability matters more than current skills. If you know 70-80% of the stack, apply confidently. In the interview, be honest about what you know vs. what you can learn. Demonstrate learning ability through past examples. Many companies provide training for niche technologies.`
      },
      {
        question: 'How competitive is this role?',
        answer: `Tech roles at established companies attract 200-500+ applications. However, most applications are from candidates who don't meet basic criteria. If you meet 80%+ of requirements and your resume stands out, your chances are much higher. Referrals significantly improve odds. Focus on making your application memorable rather than on raw competition numbers.`
      },
      {
        question: 'What should I negotiate in the offer?',
        answer: `Typical negotiation points: base salary (usually ±15%), bonus structure, stock options (startups), joining bonus, remote work flexibility, and additional leave. Salary is the easiest to negotiate—companies typically have a 15-25% range for each role. Research market rates on levels.fyi before negotiating. Ask for everything in writing once agreed.`
      },
      {
        question: 'How do I prepare for behavioral questions?',
        answer: `Behavioral questions assess teamwork, conflict resolution, and learning ability. Use the STAR method (Situation, Task, Action, Result) to structure answers. Prepare 5-7 stories from your projects or internships. Examples: "Tell about a time you failed and what you learned", "Describe a conflict with a peer and how you resolved it", "Give an example of learning something new quickly". Be genuine—interviewers can spot rehearsed answers.`
      },
      {
        question: 'Should I accept the first offer or negotiate?',
        answer: `Almost always negotiate—even politely. It shows confidence and self-awareness. However, be reasonable and do research. Negotiations happen after the offer, not before. If ${job.company} is your dream company, the offer is already competitive. Negotiate thoughtfully, thank them, and join with enthusiasm. Starting relationship with a company should never sour over salary discussions handled professionally.`
      },
      {
        question: `What's the typical career trajectory at ${job.company}?`,
        answer: `For tech roles, typical progression is 2-3 years in one role before the next level. Most companies have 4-5 engineering levels (junior → mid → senior → staff → principal). With strong performance, you can progress faster. Side learning (open source, personal projects) accelerates growth. Career conversations with managers help align your growth with company needs. Many engineers progress to tech leadership or specialized roles.`
      }
    ];
  }
};

// Main transformation function
function enrichJob(job) {
  const enrichedJob = { ...job };
  
  // Add new fields
  enrichedJob.overview = contentGenerator.generateOverview(job);
  enrichedJob.responsibilitiesDetailed = contentGenerator.generateResponsibilitiesDetailed(job);
  enrichedJob.eligibilityDetailed = contentGenerator.generateEligibilityDetailed(job);
  enrichedJob.skillsRequired = contentGenerator.generateSkillsRequired(job);
  enrichedJob.salaryInsights = contentGenerator.generateSalaryInsights(job);
  enrichedJob.whyApply = contentGenerator.generateWhyApply(job);
  enrichedJob.preparationTips = contentGenerator.generatePreparationTips(job);
  enrichedJob.howToApply = contentGenerator.generateHowToApply(job);
  enrichedJob.aboutCompany = contentGenerator.generateAboutCompany(job);
  enrichedJob.faq = contentGenerator.generateFAQ(job);

  return enrichedJob;
}

// Read, transform, and save
function main() {
  const inputPath = path.join(__dirname, '../src/Untitled-1.json');
  
  try {
    console.log('📖 Reading original job data...');
    const rawData = fs.readFileSync(inputPath, 'utf-8');
    const jobs = JSON.parse(rawData);
    
    console.log(`✨ Found ${jobs.length} jobs. Starting enrichment process...`);
    
    const enrichedJobs = jobs.map((job, idx) => {
      console.log(`   [${idx + 1}/${jobs.length}] Enriching: ${job.title} at ${job.company}`);
      return enrichJob(job);
    });
    
    // Save enriched data
    console.log('\n💾 Saving enriched content...');
    fs.writeFileSync(inputPath, JSON.stringify(enrichedJobs, null, 2), 'utf-8');
    
    // Calculate total words
    let totalWords = 0;
    enrichedJobs.forEach(job => {
      const words = (
        (job.overview || '').split(' ').length +
        (job.salaryInsights || '').split(' ').length +
        JSON.stringify(job.responsibilitiesDetailed || {}).split(' ').length +
        JSON.stringify(job.eligibilityDetailed || {}).split(' ').length
      );
      totalWords += words;
    });
    
    console.log(`\n✅ Transformation complete!`);
    console.log(`   📊 Total jobs enriched: ${enrichedJobs.length}`);
    console.log(`   📝 Total content words added: ${totalWords.toLocaleString()}`);
    console.log(`   ⏱️  Average words per job: ${Math.round(totalWords / enrichedJobs.length)}`);
    console.log(`   💾 Saved to: ${inputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
