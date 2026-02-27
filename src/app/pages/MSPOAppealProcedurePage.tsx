import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  Scale,
  BookOpen,
  Target,
  Lock,
  ClipboardList,
  Send,
  FolderInput,
  UserCog,
  Users,
  CheckCircle,
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
    text: 'Appeal received from appellant shall be recorded.',
    custom: false,
  },
  {
    n: 2,
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
    n: 3,
    icon: FolderInput,
    label: 'Forwarding',
    gradient: 'from-blue-600 to-blue-800',
    border: 'border-blue-200',
    bg: 'from-blue-50 to-white',
    accent: 'bg-blue-500',
    text: 'The documented appeal will be forwarded to Certification Unit.',
    custom: false,
  },
  {
    n: 4,
    icon: UserCog,
    label: 'Certification Unit Review',
    gradient: 'from-violet-600 to-indigo-700',
    border: 'border-violet-200',
    bg: 'from-violet-50 to-white',
    accent: 'bg-violet-500',
    text: 'Certification Unit will inform Operation Manager which shall convene and handle the matter in a fair and impartial manner.',
    custom: false,
    highlight: 'fair and impartial manner',
  },
  {
    n: 5,
    icon: Users,
    label: 'Management Discussion',
    gradient: 'from-emerald-600 to-green-700',
    border: 'border-emerald-200',
    bg: 'from-emerald-50 to-white',
    accent: 'bg-emerald-500',
    text: 'Operation Manager will discuss the matter with the management to make a final decision.',
    custom: false,
  },
  {
    n: 6,
    icon: CheckCircle,
    label: 'Final Outcome',
    gradient: 'from-[#d4af37] to-amber-500',
    border: 'border-[#d4af37]/30',
    bg: 'from-amber-50 to-white',
    accent: 'bg-[#d4af37]',
    text: 'The appellant will be informed of the findings, results, and the outcome of the appeal, which will be final.',
    custom: false,
    highlight: 'final',
    isFinal: true,
  },
];

/* ─── Highlight keyword in text ──────────────────────────────────────── */
function HighlightedText({ text, keyword }: { text: string; keyword: string }) {
  const idx = text.indexOf(keyword);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md mx-0.5 font-bold">
        {keyword}
      </span>
      {text.slice(idx + keyword.length)}
    </>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export function MSPOAppealProcedurePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Appeal"
        title="Procedures on Appeal"
        subtitle="Formal appeal handling procedures for MSPO certification decisions"
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
                      An appeal is a formal request to reconsider a decision, usually made by a higher authority.
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
                      It is made when someone disagrees with a decision and seeks to change or reverse it.
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

          {/* ── Section label ─────────────────────────────────────── */}
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
                Appeal Procedure — {steps.length} Steps
              </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>

          {/* ── Steps timeline ────────────────────────────────────── */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-slate-400 via-[#d4af37] to-amber-500" />

            <div className="space-y-0">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isLast = idx === steps.length - 1;
                const isFinal = (step as any).isFinal;

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
                      className={`group relative overflow-hidden border-2 ${step.border} rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all hover:-translate-y-0.5 ${
                        isFinal
                          ? 'bg-gradient-to-br from-amber-50 to-white'
                          : `bg-gradient-to-br ${step.bg}`
                      }`}
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
                        {isFinal && (
                          <span className="ml-auto text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                            Final
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="md:pl-2">
                        {step.custom ? (
                          <p className="text-slate-700 leading-relaxed text-sm">
                            The appeal can be submitted through email{' '}
                            <a
                              href="mailto:dimacertification@gmail.com"
                              className="inline-flex items-center gap-1 font-semibold text-slate-900 underline underline-offset-2 decoration-[#d4af37] hover:text-[#d4af37] transition-colors"
                            >
                              <Mail size={13} />
                              dimacertification@gmail.com
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
            transition={{ duration: 0.6, delay: 1.0 }}
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
                  <Scale className="text-white" size={28} />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-white text-lg mb-1">Submit an Appeal</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Reach us by email or through the DIMA website portal below.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <a
                    href="mailto:dimacertification@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                  >
                    <Mail size={16} />
                    Email Us
                  </a>
                  <a
                    href="https://www.dima.my/complaint-appeal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all text-sm"
                  >
                    <Globe size={16} />
                    Online Portal
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
