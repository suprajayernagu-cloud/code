import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

export const metadata = {
  title: 'Master Salary Negotiation - Complete Guide for Indian Professionals | HiringsToday',
  description: 'Learn proven salary negotiation strategies for Indian job market. Understand market rates, LPA ranges, benefits negotiation, and how to secure the compensation you deserve.',
}

export default function SalaryNegotiationGuide() {
  return (
    <article className="max-w-3xl mx-auto space-y-8 p-6 sm:p-8">
      <PageMeta
        title="Master Salary Negotiation - Complete Guide for Indian Professionals | HiringsToday"
        description="Learn proven salary negotiation strategies for Indian job market. Understand market rates, LPA ranges, benefits negotiation, and how to secure the compensation you deserve."
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">💰</span>
          <div>
            <span className="pill">Career Resources</span>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
              Master Salary Negotiation
            </h1>
          </div>
        </div>
        <p className="text-lg text-slate-600">
          Your salary negotiation skills can be worth lakhs over your career. Learn the strategies to confidently negotiate and secure the compensation package you deserve.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Why Salary Negotiation Matters: The Lifetime Cost of Not Negotiating</h2>
          <p>
            Many professionals accept the first salary offer without negotiation. This single decision can cost you millions over your career. If you're offered ₹15 LPA and negotiate just 8% higher to ₹16.2 LPA, that's an extra ₹1.2 lakh that year. Over 30 years of career growth, considering promotions and raises, that gap compounds significantly.
          </p>
          <p>
            In India's tech hub cities like Bangalore, Hyderabad, and Mumbai, a software engineer with 3-5 years of experience typically earns between ₹18-35 LPA depending on the company tier and domain. A Senior Software Engineer commands ₹45-75 LPA. Yet many professionals leave significant money on the table by not negotiating effectively at career transitions.
          </p>
          <p>
            Salary negotiation isn't aggressive or greedy—it's a normal professional conversation. Companies expect candidates to negotiate. If they didn't, they'd systematically underpay top talent. Your negotiation demonstrates your value and market awareness.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Research Your Market Value: Know the Real Numbers</h2>
          <p>
            Before any negotiation conversation, you must know your market value. Guessing will hurt you. If you ask for too much, you'll lose offers. If you ask for too little, you've already failed.
          </p>
          <p>
            <strong>Market Research Sources for India:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Levels.fyi India:</strong> Real salary data from Amazon, Google, Microsoft, Flipkart, and startups. Filter by city and experience level.</li>
            <li><strong>Blind India Community:</strong> Anonymous discussions from industry professionals. Take data with a grain of salt, but patterns are revealing.</li>
            <li><strong>LinkedIn Salary:</strong> Aggregated data for your city, company, and role. Less transparent than Levels.fyi but good for confirmation.</li>
            <li><strong>Glassdoor India:</strong> Salaries from current and former employees. Better coverage for large Indian companies.</li>
            <li><strong>Company Career Pages:</strong> Some companies (like Stripe, Google) publish salary bands publicly.</li>
            <li><strong>Your Network:</strong> Reach out to friends who recently negotiated at the same company or role. Direct data is invaluable.</li>
          </ul>
          <p>
            For a Product Manager role in Bangalore, market rates are typically ₹25-45 LPA at mid-level (5-8 years), ₹45-70 LPA for senior roles. At startups, top performers in Series B-D companies often earn ₹30-50 LPA as PM. But this varies wildly by company funding and growth stage.
          </p>
          <p>
            Create a research document: collect 10-15 data points for your exact role, location, and experience level. Identify the 25th, 50th, and 75th percentile. Your target is typically the 60-70th percentile—ambitious but defensible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Understand the Total Compensation Package</h2>
          <p>
            Most people focus only on base salary, but total compensation includes many components. A ₹50 LPA package might look very different depending on the breakdown.
          </p>
          <p>
            <strong>Typical Tech Company Breakdowns in India:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Base salary:</strong> Usually 50-60% of total. This is what your tax is calculated on and what counts toward provident fund.</li>
            <li><strong>Performance bonus:</strong> Typically 10-40% of base, usually paid in April. Can be 0-100% depending on performance and company health.</li>
            <li><strong>Stock options/ESOP:</strong> Common at startups and mature tech companies. ₹5-20L vesting over 4 years is typical. If the company exits, this could be worth significant money or nothing.</li>
            <li><strong>Restricted Stock Units (RSU):</strong> Tech giants like Amazon, Google offer RSUs instead of stock options. ₹5-30L annually, vesting over 4 years.</li>
            <li><strong>Sign-on bonus:</strong> ₹1-10L typically paid on day 1 or first paycheck. Helps offset equity vesting schedule at old job.</li>
            <li><strong>Relocation bonus:</strong> If moving cities, ₹1-5L is common for tech roles.</li>
            <li><strong>Health insurance:</strong> Typically ₹4-8L covered for you and family.</li>
            <li><strong>Leave balance:</strong> Most companies offer 18-21 days. Some offer unlimited with manager approval (rare in India).</li>
          </ul>
          <p>
            When evaluating offers, convert everything to annual value. If you're choosing between a ₹50 LPA base at a late-stage startup with ₹20L in RSU (1-year cliff, so actually valuable) versus ₹55 LPA base at an established company with ₹5L in stock, run the numbers carefully.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The Psychology of Negotiation: Anchoring and Framing</h2>
          <p>
            Salary negotiation is partly psychology. The first number mentioned becomes the anchor, influencing everything else. If they offer ₹20 LPA and you counter with ₹35 LPA, that massive gap makes ₹28 LPA feel like a compromise. But if you researched and know ₹30 LPA is fair market rate, you've just framed the conversation correctly.
          </p>
          <p>
            <strong>When they ask "What's your salary expectation?" at the interview stage:</strong> Deflect if possible. Say "I'm open to competitive compensation for the role" or "What's the budgeted range for this position?" This keeps you from anchoring too low. However, some companies require a number. In that case, provide a range (₹25-30 LPA) rather than a single number, and ensure it's data-backed and ambitious.
          </p>
          <p>
            <strong>When they give you an offer:</strong> Don't accept immediately, even if excited. Say "Thank you for the offer. I'm genuinely excited about this opportunity. Let me review the complete details and come back to you in 48 hours." This prevents emotional decisions and gives you time to think strategically.
          </p>
          <p>
            <strong>When you counter:</strong> Provide reasoning, not just a number. "Based on my research of market rates for a Senior Engineer with 6 years of experience in Bangalore, the 60-75th percentile is ₹60-68 LPA. Given my background in distributed systems and leadership experience, I'd like to propose ₹65 LPA plus the proposed sign-on bonus." This frames negotiation as collaborative, not confrontational.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Negotiation Scripts: What to Actually Say</h2>
          <p>
            Many people fear negotiation because they're unsure what to say. Here are word-for-word scripts you can adapt:
          </p>
          <p>
            <strong>Script 1: Polite Counter-Offer</strong><br/>
            "Thank you so much for the offer, and I'm really excited to join the team. The base salary of ₹20 LPA is lower than I was expecting. Based on my research of market rates and comparable roles in Bangalore, I was expecting something closer to ₹24 LPA. Could we discuss adjusting this?"
          </p>
          <p>
            <strong>Script 2: Requesting More Details First</strong><br/>
            "I appreciate the offer. Before I respond on the salary, can you clarify the bonus structure and any equity/ESOP details? I want to understand the complete package to have a productive conversation."
          </p>
          <p>
            <strong>Script 3: When They Say "That's Our Maximum"</strong><br/>
            "I understand you have budget constraints. Since salary is fixed, could we discuss other areas? For example, an additional sign-on bonus of ₹3L, or more RSU stock? Or perhaps we could revisit this in 6 months after I prove my value?"
          </p>
          <p>
            <strong>Script 4: Dealing with "We're Aligned on Your Worth, But Limited by Budget"</strong><br/>
            "I appreciate that. Let's look at the equity component then. I had expected ₹8L in stock options. Could we increase that to ₹12L to make up the gap?" Or: "Could we revisit salary after 6 months of strong performance?"
          </p>
          <p>
            The key: be polite but firm. Don't accept immediately. Provide reasoning. Offer alternatives. Leave room for the company to save face and find creative solutions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">When NOT to Negotiate and When to Walk Away</h2>
          <p>
            Negotiation isn't always appropriate. Don't negotiate if: You're early in your career (first 2 jobs), the offer is already above your expectation, you're pivoting to a new field, or the company explicitly states "This is a fixed offer with no negotiation."
          </p>
          <p>
            However, you should walk away if: The offer is 20%+ below market rate for your role, the company responds to negotiation with hostility or retracting the offer (red flag), you realize during the process that values don't align, or they're asking you to start immediately while you have non-compete clauses or pending vesting.
          </p>
          <p>
            Walking away is powerful. If you're confident in your market value, employers sense that. Sometimes they'll come back with a better offer if they truly want you. If they don't, you probably didn't want to work there anyway.
          </p>
          <p>
            For early-stage startup jobs offering equity instead of salary, be especially careful. Understand the dilution risk, funding runway, and realistic exit timeline. Many startups offering ₹15 LPA base plus "₹50L in equity" are using equity as a cheap retention tool when actual value is negligible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Special Considerations for Women and Underrepresented Professionals</h2>
          <p>
            Research shows that women in India negotiate less frequently and achieve smaller increases than male counterparts. This gap compounds over decades. If a male colleague negotiated 10% higher starting salary and you didn't, after 30 years with 8% annual raises, the gap is enormous.
          </p>
          <p>
            <strong>Practical strategies:</strong> First, know that you deserve negotiation as much as anyone else. Second, use more collaborative framing: "I'm really excited about this role. Let's make sure the compensation reflects the market value for someone with my background." This avoids aggressive positioning while staying firm. Third, bring data. Numbers are harder to dismiss as "too aggressive" than opinions.
          </p>
          <p>
            If you encounter discriminatory comments like "We don't pay women as much" or "You seem aggressive," recognize this as a red flag and report it, or seriously reconsider joining. Companies that negotiate gender-fairly are better employers overall.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Negotiating Beyond Salary: Equity, Leave, and Flexibility</h2>
          <p>
            Sometimes salary is truly fixed. In that case, negotiate everything else. At top tech companies, RSU/stock options often have more variability than base salary. A difference of ₹5-10L in annual equity is sometimes easier to secure than ₹5-10L in base.
          </p>
          <p>
            Other negotiable items: work-from-home flexibility, annual leave balance, professional development budget, performance review timeline, stock vesting acceleration, or a sabbatical option after a certain tenure.
          </p>
          <p>
            For roles at Tier 1 startups (Series C and beyond) in Bangalore, consider negotiating: ESOPs (₹10-50L over 4 years), sign-on bonus to offset old company's unvested stock, work-from-anywhere policy, and conference attendance budget.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">After Negotiation: Get It in Writing and Plan Ahead</h2>
          <p>
            Once you've negotiated, always get the updated offer in writing. Email HR or the recruiting team: "Thank you for accommodating my feedback. Just to confirm, the final offer includes: Base salary ₹65 LPA, performance bonus 20%, sign-on bonus ₹3L, ₹8L in RSU vesting over 4 years. Please confirm in writing." This prevents misunderstandings.
          </p>
          <p>
            Then plan ahead. If you know you'll likely change jobs in 3-5 years (typical for growth), negotiate accordingly. Long vesting RSU schedules are less valuable if you'll leave after 2 years. Startups with 1-year cliffs are better in that scenario.
          </p>
          <p>
            Finally, after one year in the role, start tracking your achievements quantitatively. This data becomes your anchor for your next negotiation. The best way to negotiate at your next role is to have concrete proof of impact at your current role.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-ink-900 mb-3">Master Your Career Growth</h3>
          <p className="text-slate-600 mb-4">
            Salary negotiation is just one part of building a successful career. Explore more guides to accelerate your growth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/resume-writing-guide" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
              Resume Writing Guide →
            </Link>
            <Link href="/resources/interview-prep-guide" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Interview Prep Guide →
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              All Resources →
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-ink-900 mb-2">Ready to Find Your Next Role?</h4>
          <p className="text-slate-600 text-sm mb-4">
            Start your job search with confidence. Browse opportunities matching your salary expectations.
          </p>
          <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
            View Job Openings →
          </Link>
        </div>
      </div>
    </article>
  )
}
