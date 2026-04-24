import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

export const metadata = {
  title: 'How to Write a Winning Resume - Complete Guide | Hiringstoday',
  description: 'Master resume writing with our comprehensive guide. Learn ATS optimization, action verbs, formatting tips, and strategies to get your resume noticed by recruiters.',
}

export default function ResumeWritingGuide() {
  return (
    <article className="max-w-3xl mx-auto space-y-8 p-6 sm:p-8">
      <PageMeta
        title="How to Write a Winning Resume - Complete Guide | Hiringstoday"
        description="Master resume writing with our comprehensive guide. Learn ATS optimization, action verbs, formatting tips, and strategies to get your resume noticed by recruiters."
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📄</span>
          <div>
            <span className="pill">Career Resources</span>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
              How to Write a Winning Resume
            </h1>
          </div>
        </div>
        <p className="text-lg text-slate-600">
          Your resume is your first impression. Learn the proven strategies to stand out, get past ATS systems, and land interviews.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Why Your Resume Matters More Than Ever</h2>
          <p>
            Your resume is often the only opportunity you get to make a first impression. Whether it's reviewed by a recruiter for 6 seconds or scanned by an Applicant Tracking System (ATS), it needs to communicate your value clearly and quickly. A well-crafted resume can be the difference between landing an interview and being rejected before a human ever sees it.
          </p>
          <p>
            In India's competitive job market, especially in tech, finance, and management sectors, recruiters receive hundreds of applications daily. Your resume needs to cut through the noise and prove that you're worth 30 minutes of an interviewer's time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The Resume Length Question</h2>
          <p>
            <strong>For entry-level professionals (0-3 years):</strong> Keep it to one page. You don't have enough experience to justify more, and recruiters will appreciate the conciseness.
          </p>
          <p>
            <strong>For mid-career professionals (3-8 years):</strong> One to two pages is ideal. Focus on relevant achievements, not every job you've had.
          </p>
          <p>
            <strong>For senior professionals (8+ years):</strong> Two pages maximum. Tempting as it is to include everything, prioritize recent and relevant experience.
          </p>
          <p>
            The length isn't about fitting everything in—it's about fitting in the things that matter for the position you're applying to.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Master the ATS: How to Get Past The Scanning Robots</h2>
          <p>
            Before your resume reaches a human, it likely passes through an Applicant Tracking System (ATS). These systems scan for keywords, formatting, and specific information. If your resume doesn't format well or lacks relevant keywords, it gets filtered out automatically.
          </p>
          <p>
            <strong>ATS-Friendly Formatting Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Use simple formatting: no columns, text boxes, or graphics</li>
            <li>Stick to standard fonts: Arial, Calibri, or Times New Roman</li>
            <li>Save as PDF (unless the job posting specifically asks for .docx)</li>
            <li>Use standard section headings: Work Experience, Education, Skills</li>
            <li>Include keywords from the job description naturally throughout</li>
            <li>Avoid headers and footers if possible</li>
            <li>Use bullet points instead of paragraphs for readability</li>
          </ul>
          <p>
            The goal: make your resume readable for both machines and humans.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Quantify Everything—Make Your Impact Visible</h2>
          <p>
            This is where most resumes fail. Saying "managed a team" is forgettable. Saying "managed a team of 7 across 3 time zones, achieving 95% project delivery on time" is memorable.
          </p>
          <p>
            <strong>Instead of:</strong> "Responsible for social media marketing"<br/>
            <strong>Write:</strong> "Grew Instagram following from 50K to 250K (400% increase) in 6 months, increasing monthly revenue from social by ₹15L"
          </p>
          <p>
            Quantify using:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Percentages: 40% improvement, 250% growth</li>
            <li>Numbers: 50+ clients, 12 countries, ₹5Cr revenue</li>
            <li>Time: reduced from 3 months to 2 weeks</li>
            <li>Money: saved ₹20L, generated ₹50L</li>
            <li>Scale: 1000+ users, 5 major clients</li>
          </ul>
          <p>
            If a metric isn't available, describe the impact another way: "Pioneered the company's first mobile-first customer support system, reducing resolution time and improving customer satisfaction."
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Action Verbs That Make Recruiters Take Notice</h2>
          <p>
            Instead of passive language, use strong action verbs that communicate leadership and initiative.
          </p>
          <p>
            <strong>Weak:</strong> "Was part of the team that launched the new product"<br/>
            <strong>Strong:</strong> "Spearheaded cross-functional product launch, coordinating with 5 departments and achieving $2M in first-month revenue"
          </p>
          <p>
            Power action verbs for tech roles: Built, Architected, Engineered, Optimized, Scaled, Deployed<br/>
            Power action verbs for business roles: Led, Grew, Transformed, Accelerated, Managed, Negotiated<br/>
            Power action verbs for creative roles: Designed, Developed, Created, Conceptualized, Executed
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The Skills Section: Tailor, Don't Overload</h2>
          <p>
            Your skills section should be short, relevant, and directly aligned with the job description. Instead of listing every tool you've ever used, pick 8-12 that are most relevant to the position.
          </p>
          <p>
            <strong>Pro tip:</strong> Mirror keywords from the job description. If they ask for "Python, React, and AWS," ensure those exact terms appear in your resume.
          </p>
          <p>
            Organize skills by category if you have many:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Languages:</strong> Python, Java, C++</li>
            <li><strong>Frontend:</strong> React, Vue, HTML/CSS</li>
            <li><strong>Databases:</strong> PostgreSQL, MongoDB, Firebase</li>
            <li><strong>Tools:</strong> Git, Docker, Jenkins</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The Work Experience Section: Tell a Story</h2>
          <p>
            Each bullet point should follow this formula: <strong>Action + Task + Result</strong>
          </p>
          <p>
            Example: "Architected microservices migration for payment processing system, reducing latency by 60% and enabling processing of 10,000+ transactions/hour"
          </p>
          <p>
            <strong>Better to include:</strong> Recent roles, relevant roles, roles where you had impact<br/>
            <strong>Okay to exclude:</strong> Internships (after 2 years of work experience), retail jobs (unless they're recent and you have few roles)
          </p>
          <p>
            For each role, include 3-5 of your strongest achievements. Quality over quantity—one amazing bullet beats three mediocre ones.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Education & Certifications: Know What to Include</h2>
          <p>
            <strong>Include:</strong> Degree, institution, graduation date, relevant honors (GPA above 3.5, Dean's List)<br/>
            <strong>Exclude:</strong> High school (unless it's your highest qualification), GPA below 3.5, irrelevant coursework
          </p>
          <p>
            For certifications, include only those relevant to the role. If you have many, prioritize recent and prestigious ones (AWS Certified, Google Cloud Certified, Kubernetes Certified, etc.).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Common Resume Mistakes to Avoid</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Generic objective statements:</strong> "Seeking a challenging position..." Skip this. Use that space for skills or accomplishments.</li>
            <li><strong>Personal pronouns:</strong> "I designed..." becomes "Designed...". Resumes are personal documents—you don't need to keep saying "I."</li>
            <li><strong>Typos and grammar errors:</strong> These are deal-breakers. Proofread 3 times. Use Grammarly.</li>
            <li><strong>Inconsistent formatting:</strong> If some dates are "Jan 2023" and others are "January 2023," it looks careless.</li>
            <li><strong>Unexplained gaps:</strong> If there's a gap of more than 3 months, briefly explain it on your resume or in your cover letter.</li>
            <li><strong>Irrelevant information:</strong> Your hobbies usually don't belong here unless they're directly relevant to the role.</li>
            <li><strong>Outdated references:</strong> Remove jobs from 10+ years ago unless they're very relevant.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Final Resume Checklist</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>✓ One page (if you have less than 5 years experience) or max two pages</li>
            <li>✓ No grammatical errors or typos</li>
            <li>✓ Consistent date format and font</li>
            <li>✓ Each bullet includes a quantifiable result or clear achievement</li>
            <li>✓ Uses strong action verbs</li>
            <li>✓ Keywords from the job description are included naturally</li>
            <li>✓ Skills section includes relevant tools and languages</li>
            <li>✓ Contact information is clear and up-to-date</li>
            <li>✓ Tested with an ATS resume checker (free tools available online)</li>
            <li>✓ Reviewed by a friend or mentor for clarity</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The 80/20 Rule: Focus on Impact, Not Length</h2>
          <p>
            A one-page resume with strong quantified achievements will beat a two-page resume with generic descriptions every time. Focus on making each line count. Every sentence should answer: "Why should the recruiter care?"
          </p>
          <p>
            Remember: your resume gets 6 seconds of initial scanning. Make those 6 seconds count by leading with your strongest achievements and most relevant skills.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-ink-900 mb-3">Found this guide helpful?</h3>
          <p className="text-slate-600 mb-4">
            Check out our other career guides to master interviews, salary negotiation, and job search strategies.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/interview-prep-guide" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
              Interview Prep Guide →
            </Link>
            <Link href="/resources/salary-negotiation-guide" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Salary Negotiation Guide →
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              All Resources →
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-ink-900 mb-2">Browse the Latest Job Openings</h4>
          <p className="text-slate-600 text-sm mb-4">
            Ready to apply? Check out current job openings for your role and experience level.
          </p>
          <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
            View All Jobs →
          </Link>
        </div>
      </div>
    </article>
  )
}
