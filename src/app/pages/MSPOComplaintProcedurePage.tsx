import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  MessageSquare,
  BookOpen,
  Target,
  Lock,
  ClipboardList,
  Phone,
  Send,
  Search,
  ShieldAlert,
  Eye,
  FileCheck,
  Mail,
  Globe,
  ChevronDown,
} from 'lucide-react';

/* ─── Step definitions ────────────────────────────────────────────────── */
const steps = [
  {
    n: 1,
    icon: ClipboardList,
    label: 'Recording',
    gradient: 'from-slate-700 to-slate-900',
    border: 'border-slate-200',
    bg: 'from-slate-50 to-white',
    accent: 'bg-slate-600',
    text: 'Complaints received from complainant shall be recorded.',
    custom: false,
  },
  {
    n: 2,
    icon: Phone,
    label: 'Verbal / Phone',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-200',
    bg: 'from-blue-50 to-white',
    accent: 'bg-blue-500',
    text: 'DIMA Certification Sdn Bhd may consider complaints received via verbal/phone. However, the complaint still has to submit written complaints and evidence.',
    custom: false,
  },
  {
    n: 3,
    icon: Send,
    label: 'Submission Channels',
    gradient: 'from-[#d4af37] to-amber-600',
    border: 'border-amber-200',
    bg: 'from-amber-50 to-white',
    accent: 'bg-[#d4af37]',
    text: null,
    custom: true,
  },
  {
    n: 4,
    icon: Search,
    label: 'Investigation',
    gradient: 'from-violet-600 to-indigo-700',
    border: 'border-violet-200',
    bg: 'from-violet-50 to-white',
    accent: 'bg-violet-500',
    text: 'After the complaint received, DIMA will proceed with investigation and complainant (and MSPO if needed) shall be notify until final outcome is known.',
    custom: false,
  },
  {
    n: 5,
    icon: ShieldAlert,
    label: 'Corrective Action',
    gradient: 'from-emerald-600 to-green-700',
    border: 'border-emerald-200',
    bg: 'from-emerald-50 to-white',
    accent: 'bg-emerald-500',
    text: 'If the complaint is valid, DIMA will take immediate corrective action and implement remedial measures within 30 days from the date of processing to prevent recurrence.',
    custom: false,
    highlight: '30 days',
  },
  {
    n: 6,
    icon: Eye,
    label: 'Disclosure',
    gradient: 'from-orange-500 to-orange-700',
    border: 'border-orange-200',
    bg: 'from-orange-50 to-white',
    accent: 'bg-orange-500',
    text: 'If disclosure is necessary, it should be discussed with the complainant.',
    custom: false,
  },
  {
    n: 7,
    icon: FileCheck,
    label: 'Reporting & Closure',
    gradient: 'from-teal-600 to-cyan-700',
    border: 'border-teal-200',
    bg: 'from-teal-50 to-white',
    accent: 'bg-teal-500',
    text: 'Results of investigation including action taken shall be reported to complainant (and MSPO if needed) and its status updated to ensure complainant is well informed on the status of the complaint.',
    custom: false,
  },
];

/* ─── Highlight a keyword inside text ────────────────────────────────── */
function HighlightedText({ text, keyword }: { text: string; keyword?: string }) {
  if (!keyword) return <>{text}</>;
  const parts = text.split(keyword);
  return (
    <>
      {parts[0]}
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md mx-1 font-bold">
        {keyword}
      </span>
      {parts[1]}
    </>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export function MSPOComplaintProcedurePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [contactEmail, setContactEmail] = useState('dimacertification@gmail.com');

  // Fetch contact email from admin settings
  useEffect(() => {
    fetch('/api/public-contact-settings.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.email_1) {
          setContactEmail(data.data.email_1);
        }
      })
      .catch(() => { /* keep default */ });
  }, []);

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Complaints"
        title="Procedures on Complaint"
        subtitle="Formal complaint handling procedures for MSPO certification activities"
      />

      <section className="relative py-16 md:py-24 overflow-hidden" ref={ref}
        style={{
          background: 'linear-gradient(135deg, #f8f7f4 0%, #fdfcf9 60%, #f3f0e8 100%)',
        }}
      >
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 80% 10%, rgba(212,175,55,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 90%, rgba(99,102,241,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* ── Definition & Purpose ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              {/* Definition */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl px-7 py-6 hover:shadow-xl transition-all hover:border-slate-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 opacity-[0.05] rounded-bl-[60px]" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 mb-2">
                      Definition
                    </span>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      A complaint is an expression of dissatisfaction with a product, service, or process.
                    </p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-2xl px-7 py-6 hover:shadow-xl transition-all hover:border-[#d4af37]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#d4af37] to-amber-500 opacity-[0.07] rounded-bl-[60px]" />
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <Target className="text-white" size={20} />
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-amber-500 mb-2">
                      Purpose
                    </span>
                    <p className="text-amber-900 text-sm leading-relaxed">
                      It aims to address and resolve issues related to service quality, behavior, or operational problems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidentiality note */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl px-6 py-4 shadow-lg">
              <Lock className="flex-shrink-0" size={17} style={{ color: '#d4af37' }} />
              <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.8)' }}>
                These processes shall be subject to confidentiality requirements.
              </p>
            </div>
          </motion.div>

          {/* ── Section heading ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
              <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                Complaint Procedure — {steps.length} Steps
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>

          {/* ── Steps timeline ────────────────────────────────────── */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-slate-400 via-[#d4af37] to-teal-500" />

            <div className="space-y-0">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isLast = idx === steps.length - 1;

                return (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.35 + idx * 0.09 }}
                    className="relative md:pl-24 md:pb-8"
                  >
                    {/* Step number box (desktop) */}
                    <div className="hidden md:flex absolute left-0 top-0 z-10">
                      <div
                        className={`w-[78px] h-[78px] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}
                        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                      >
                        <div className="text-center">
                          <div className="text-white/70 text-[10px] font-bold tracking-widest uppercase leading-none mb-0.5">
                            Step
                          </div>
                          <div className="text-white text-2xl font-bold leading-none">
                            {step.n}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow between steps */}
                    {!isLast && (
                      <div className="hidden md:flex absolute left-[31px] bottom-[-2px] z-10">
                        <ChevronDown size={16} className="text-slate-400" />
                      </div>
                    )}

                    {/* Card */}
                    <div
                      className={`group relative overflow-hidden bg-gradient-to-br ${step.bg} border-2 ${step.border} rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all hover:-translate-y-0.5`}
                    >
                      {/* Decorative corner accent */}
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.gradient} opacity-[0.07] rounded-bl-[60px]`}
                      />

                      {/* Mobile step badge */}
                      <div className="md:hidden flex items-center gap-3 mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md`}
                        >
                          <span className="text-white font-bold text-lg">{step.n}</span>
                        </div>
                        <div>
                          <span className={`inline-block text-xs font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full bg-gradient-to-r ${step.gradient} mb-1`}>
                            Step {step.n}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 leading-snug">{step.label}</h4>
                        </div>
                      </div>

                      {/* Desktop title with icon */}
                      <div className="hidden md:flex items-center gap-3 mb-5">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          style={{ opacity: 0.15 }}
                        />
                        <div className="-ml-[46px] w-10 h-10 rounded-lg flex items-center justify-center">
                          <Icon size={22} className="text-slate-700" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{step.label}</h4>
                      </div>

                      {/* Body */}
                      <div className="md:pl-2">
                        {step.custom ? (
                          <p className="text-slate-700 leading-relaxed text-sm">
                            The compliant can be sent directly through email{' '}
                            <a
                              href={`mailto:${contactEmail}`}
                              className="inline-flex items-center gap-1 font-semibold text-slate-900 underline underline-offset-2 decoration-[#d4af37] hover:text-[#d4af37] transition-colors"
                            >
                              <Mail size={13} />
                              {contactEmail}
                            </a>{' '}
                            or DIMA website{' '}
                            <a
                              href="https://www.dima.my/complaint-appeal/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
                            >
                              <Globe size={13} />
                              dima.my/complaint-appeal
                            </a>
                            .
                          </p>
                        ) : (step as any).highlight ? (
                          <p className="text-slate-700 leading-relaxed text-sm">
                            <HighlightedText
                              text={step.text!}
                              keyword={(step as any).highlight}
                            />
                          </p>
                        ) : (
                          <p className="text-slate-700 leading-relaxed text-sm">{step.text}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── CTA ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-14"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(to right, #d4af37, #f59e0b, #d4af37)' }}
              />
              {/* Decorative glow */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15), transparent 70%)' }}
              />

              <div className="relative flex flex-col sm:flex-row items-center gap-6 px-8 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                  <MessageSquare className="text-white" size={28} />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-white text-lg mb-1">Submit a Complaint</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Email us at <span className="text-[#d4af37] font-semibold">{contactEmail}</span> or use the portal.
                  </p>
                </div>

                <Link
                  to="/complaint-appeal"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm flex-shrink-0"
                >
                  <MessageSquare size={16} />
                  Submit Complaint
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
