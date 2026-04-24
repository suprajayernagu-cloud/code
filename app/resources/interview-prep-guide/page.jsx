import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

export const metadata = {
  title: 'Complete Interview Preparation Guide | Hiringstoday',
  description: 'Master interviews with our comprehensive guide. Learn how to handle common questions, use the STAR method, and present yourself confidently.',
}

export default function InterviewPrepGuide() {
  return (
    <article className="max-w-3xl mx-auto space-y-8 p-6 sm:p-8">
      <PageMeta
        title="Complete Interview Preparation Guide | Hiringstoday"
        description="Master interviews with our comprehensive guide. Learn how to handle common questions, use the STAR method, and present yourself confidently."
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎤</span>
          <div>
            <span className="pill">Career Resources</span>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
              Interview Preparation Guide
            </h1>
          </div>
        </div>
        <p className="text-lg text-slate-600">
          Interviews aren't won by luck—they're won by preparation. Master this guide and you'll walk into every interview with confidence.
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The Truth About Interview Anxiety</h2>
          <p>
            Most people walk into interviews underprepared. They memorize answers to potential questions, but when an unexpected question comes up or the interviewer goes off-script, they panic. The reality: 90% of interview success comes from preparation and practice, not raw talent or quick thinking.
          </p>
          <p>
            The best interviewees don't have all the answers—they know how to think through problems clearly, communicate confidently, and tell coherent stories about their experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The 4-Week Interview Prep Timeline</h2>
          
          <h3 className="text-lg font-semibold text-ink-900">Week 1: Research & Self-Preparation</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Research the company deeply: mission, values, recent news, products, competitors</li>
            <li>Prepare 3-4 stories about your achievements using the STAR method</li>
            <li>Write down 5-10 thoughtful questions to ask the interviewer</li>
            <li>Review your resume and be ready to discuss every role and achievement in detail</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">Week 2: Practice Common Questions</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Practice 20+ common interview questions out loud (not just in your head)</li>
            <li>Record yourself answering and listen back—be honest about what sounds canned</li>
            <li>Work on timing—most answers should be 1-2 minutes maximum</li>
            <li>Prepare for technical questions if applicable to your role</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">Week 3: Mock Interviews</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Do at least 2-3 mock interviews with a friend or mentor</li>
            <li>Conduct them formally—over video call, dressed professionally</li>
            <li>Ask for honest feedback and iteration</li>
            <li>Practice handling tough or unexpected questions</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">Week 4: Polish & Final Prep</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Refine your story based on feedback</li>
            <li>Prepare what to wear and test your setup (if remote interview)</li>
            <li>Plan logistics: route to office, parking, arrival time (arrive 10 min early)</li>
            <li>Get good sleep and light practice only—don't cram the night before</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">The STAR Method: Your Secret Weapon</h2>
          <p>
            STAR stands for Situation, Task, Action, Result. It's the most effective framework for answering behavioral interview questions.
          </p>
          <p>
            <strong>Example Question:</strong> "Tell me about a time you failed and how you handled it."
          </p>
          <p>
            <strong>STAR Response:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Situation:</strong> "I was leading a feature release for our mobile app with a tight 2-week deadline."</li>
            <li><strong>Task:</strong> "I underestimated the complexity of backend integration and didn't communicate this to my manager until day 10."</li>
            <li><strong>Action:</strong> "I immediately flagged the issue, proposed a phased release plan, and worked with the team to deprioritize non-critical features. I also set up daily sync meetings to prevent similar surprises."</li>
            <li><strong>Result:</strong> "We launched 80% of the feature on time, with the remaining 20% delivered 5 days later. The project taught me the importance of early communication and risk identification."</li>
          </ul>
          <p>
            Notice: it's honest, shows problem-solving, and ends with a learning. That's what interviewers want to see.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Top 25 Interview Questions & How to Answer Them</h2>
          
          <h3 className="text-lg font-semibold text-ink-900">About You</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>"Tell me about yourself"</strong> → 90-second career summary: background → current role → why you're interested in this position</li>
            <li><strong>"Why do you want to join us?"</strong> → Specific company details + how your skills align + genuine interest (not just "career growth")</li>
            <li><strong>"What are your strengths?"</strong> → Give 2-3 with specific examples and results</li>
            <li><strong>"What are your weaknesses?"</strong> → Real weakness + concrete steps you've taken to improve</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">Technical/Competency</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>"Walk me through a project you built"</strong> → Problem → approach → challenges → results (focus on your role)</li>
            <li><strong>"How do you handle disagreement with colleagues?"</strong> → Show you listen, explain your perspective, prioritize outcomes over ego</li>
            <li><strong>"Describe a situation where you led a team"</strong> → Use STAR: focus on impact and how you enabled others</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">Behavioral/Situational</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>"Tell me about a time you failed"</strong> → STAR format + what you learned</li>
            <li><strong>"Describe a challenging deadline"</strong> → How you prioritized, communicated, executed</li>
            <li><strong>"Give an example of going above and beyond"</strong> → Initiative + impact + sustainable approach</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">For Technical Roles: Coding Interviews</h2>
          <p>
            If you're interviewing for a tech role, prepare for coding problems. Here's the approach:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Clarify the problem</strong> before you start coding (edge cases, constraints, examples)</li>
            <li><strong>Think out loud</strong> - interviewers want to hear your thought process</li>
            <li><strong>Write clean code</strong> - readable, commented, error-handled</li>
            <li><strong>Test your solution</strong> with the provided examples and edge cases</li>
            <li><strong>Discuss time/space complexity</strong> if there's time</li>
          </ul>
          <p>
            Spend 80% of your preparation time on medium-difficulty problems, not hard ones. Most interviews use medium-level coding problems.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">On The Day: Execution</h2>
          
          <h3 className="text-lg font-semibold text-ink-900">15 Minutes Before</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Use the bathroom (seriously—one less distraction)</li>
            <li>Do some deep breathing or light stretches</li>
            <li>Review your 3-4 key stories one more time</li>
            <li>Check your appearance and that your space (if remote) is clean</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">First 5 Minutes</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Firm handshake, eye contact, smile (sets the tone)</li>
            <li>Thank them for the opportunity</li>
            <li>Brief light conversation to build rapport</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">Body Language</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Sit upright, lean slightly forward (shows engagement)</li>
            <li>Maintain eye contact but don't stare</li>
            <li>Speak at a measured pace—not too fast (nervousness), not too slow (confusion)</li>
            <li>Use hand gestures naturally (don't keep hands in pockets or arms crossed)</li>
          </ul>

          <h3 className="text-lg font-semibold text-ink-900">If You Don't Know An Answer</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>"That's a great question, let me think through it..."</li>
            <li>Take 5-10 seconds to gather your thoughts</li>
            <li>If you genuinely don't know, say "I'm not certain, but here's how I'd approach it..."</li>
            <li>Never make up an answer—interviewers can tell</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Close Strong: Questions for the Interviewer</h2>
          <p>
            When asked "Do you have any questions for me?", always say yes. This is your chance to gather real information and show genuine interest.
          </p>
          <p>
            <strong>Good questions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>"What does success look like in this role after 6 months?"</li>
            <li>"What are the biggest challenges this team is facing right now?"</li>
            <li>"How do you measure performance in this position?"</li>
            <li>"What's the team structure and who would I be working with?"</li>
            <li>"What attracted you to join this company?"</li>
          </ul>
          <p>
            <strong>Bad questions:</strong> Anything you could have googled. Anything about salary/vacation (save for HR round). "Do you have any other questions for me?" (flips the dynamic).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">After The Interview: The Follow-Up</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Send a thank you email within 2 hours (professional, brief, personalized)</li>
            <li>Reference something specific from the conversation</li>
            <li>Restate your interest and how your skills align</li>
            <li>Wait 1 week before following up if you haven't heard back</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Interview Checklist</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>✓ Thoroughly researched the company</li>
            <li>✓ Prepared 3-4 STAR stories relevant to the role</li>
            <li>✓ Practiced common questions out loud</li>
            <li>✓ Done at least 2 mock interviews</li>
            <li>✓ Know the name, title, and background of interviewers</li>
            <li>✓ Prepared thoughtful questions to ask</li>
            <li>✓ Tested tech setup (if remote interview)</li>
            <li>✓ Know the dress code and arrive 10 minutes early</li>
            <li>✓ Have copies of resume printed (for in-person interviews)</li>
            <li>✓ Planned thank you email template</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-ink-900">Final Thought</h2>
          <p>
            Interviews are conversations, not interrogations. The interviewer isn't your enemy—they're looking for someone who can do the job and be a good team member. If you've prepared well, you'll be able to relax and let your genuine self come through. And that's when you shine.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-ink-900 mb-3">Continue Your Interview Preparation</h3>
          <p className="text-slate-600 mb-4">
            Paired with your resume and research, master these guides to become a top candidate.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/resume-writing-guide" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
              Resume Writing Guide →
            </Link>
            <Link href="/resources/salary-negotiation-guide" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Salary Negotiation →
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              All Resources →
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-ink-900 mb-2">Ready to Apply?</h4>
          <p className="text-slate-600 text-sm mb-4">
            With this preparation, you're ready to ace your interviews. Start applying to roles that match your skills and interests.
          </p>
          <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
            Browse Jobs Now →
          </Link>
        </div>
      </div>
    </article>
  )
}
