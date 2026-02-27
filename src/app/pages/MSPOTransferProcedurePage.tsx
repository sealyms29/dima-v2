import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  ShieldCheck,
  ClipboardList,
  GitBranch,
  FileSearch,
  FolderOpen,
  BadgeCheck,
  RefreshCcw,
  ScanSearch,
  Award,
  ChevronDown,
  Send,
  CheckCircle,
} from 'lucide-react';

/* ─── Step data ──────────────────────────────────────────────────────── */
type StepType = 'list' | 'split' | 'plain' | 'bullets' | 'completion';

interface Step {
  number: number;
  title: string;
  icon: React.ElementType;
  accent: string;           // Tailwind gradient classes for icon bg
  accentBorder: string;     // border color
  accentText: string;       // text color for number
  type: StepType;
  content?: string;
  bullets?: string[];
  items?: { label: string; text: string }[];
  left?: string;
  right?: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Transfer Eligibility',
    icon: ShieldCheck,
    accent: 'from-[#d4af37] to-amber-500',
    accentBorder: 'border-amber-300',
    accentText: 'text-amber-600',
    type: 'bullets',
    bullets: [
      'Transfer of certificates is only allowed between accredited CBs and once within the certificate cycle (5 years).',
      'For transfer within the same certificate cycle, the written approval from scheme owner is required.',
    ],
  },
  {
    number: 2,
    title: 'Applicant Requirements',
    icon: ClipboardList,
    accent: 'from-blue-600 to-blue-700',
    accentBorder: 'border-blue-300',
    accentText: 'text-blue-600',
    type: 'items',
    items: [
      { label: 'a)', text: 'Currently holds an accredited certificate issued by accredited registrar' },
      { label: 'b)', text: 'Has no outstanding major non-conformances' },
      { label: 'c)', text: 'Management system as sampled is following local Legislative Regulatory requirements' },
      { label: 'd)', text: 'Is not engaged in legal representations with statutory bodies' },
    ],
  } as any,
  {
    number: 3,
    title: 'Certification Decision Path',
    icon: GitBranch,
    accent: 'from-purple-600 to-indigo-700',
    accentBorder: 'border-purple-300',
    accentText: 'text-purple-600',
    type: 'split',
    left: 'The certification decision will arrange for certification granting once the transferred client meets the requirements.',
    right: "Transfer visit should be performed for client that does not meet criteria (b, c & d). Where the visit is deemed satisfactory, DMC shall recommend registration.",
  },
  {
    number: 4,
    title: 'Transfer Review Process',
    icon: FileSearch,
    accent: 'from-teal-600 to-cyan-700',
    accentBorder: 'border-teal-300',
    accentText: 'text-teal-600',
    type: 'plain',
    content: 'Transfer Review Checklist is used for the transfer process.',
  },
  {
    number: 5,
    title: 'Application Submission',
    icon: FolderOpen,
    accent: 'from-orange-500 to-amber-600',
    accentBorder: 'border-orange-300',
    accentText: 'text-orange-600',
    type: 'plain',
    content: 'Transfer client is given Application Form attached with the Transfer Review Checklist.',
  },
  {
    number: 6,
    title: 'Verification & Approval',
    icon: BadgeCheck,
    accent: 'from-emerald-600 to-green-700',
    accentBorder: 'border-emerald-300',
    accentText: 'text-emerald-600',
    type: 'bullets',
    bullets: [
      'DMC request for client transfer via MSPO Trace System from previous CBs and required approval from scheme owner',
      'The process takes within 15 working days',
    ],
  },
  {
    number: 7,
    title: 'Certification Cycle Continuity',
    icon: RefreshCcw,
    accent: 'from-sky-600 to-blue-700',
    accentBorder: 'border-sky-300',
    accentText: 'text-sky-600',
    type: 'plain',
    content: "The initial certificate issuance and expiry date shall follow the previous CB's cycle.",
  },
  {
    number: 8,
    title: 'Site Audit Requirement',
    icon: ScanSearch,
    accent: 'from-rose-600 to-red-700',
    accentBorder: 'border-rose-300',
    accentText: 'text-rose-600',
    type: 'plain',
    content: 'Site visit audit need be carry out within 12 months from the previous CB last site visit.',
  },
  {
    number: 9,
    title: 'Completion',
    icon: Award,
    accent: 'from-[#d4af37] to-amber-500',
    accentBorder: 'border-amber-400',
    accentText: 'text-amber-600',
    type: 'completion',
    content: 'New Certification issued to the transfer client',
  },
];

/* ─── Step card component ─────────────────────────────────────────────── */
function StepCard({
  step,
  isOpen,
  onToggle,
  isLast,
  inView,
  index,
}: {
  step: Step;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
  inView: boolean;
  index: number;
}) {
  const Icon = step.icon;
  const isCompletion = step.type === 'completion';

  if (isCompletion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: index * 0.07 }}
        className="relative flex gap-5"
      >
        {/* Left spine — last step so no line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.accent} flex items-center justify-center shadow-lg ring-4 ring-amber-100 z-10`}>
            <Icon className="text-white" size={22} />
          </div>
        </div>

        {/* Completion card */}
        <div className="flex-1 mb-0">
          <div className="bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl p-8 shadow-xl text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CheckCircle className="text-white" size={36} />
              </div>
            </div>
            <div className="inline-block px-3 py-1 bg-white/25 rounded-full text-white text-sm font-semibold mb-3">
              Step {step.number} — Final
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
            <p className="text-white/90 text-lg font-medium">{step.content}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className="relative flex gap-5"
    >
      {/* Left spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.accent} flex items-center justify-center shadow-lg z-10 cursor-pointer`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
        >
          <Icon className="text-white" size={22} />
        </motion.div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 mb-0 bg-gradient-to-b from-slate-300 to-slate-100 min-h-[1.5rem]" />
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-6 border-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden ${isOpen ? step.accentBorder : 'border-slate-200'}`}>
        {/* Header — always visible */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-6 py-5 text-left group"
        >
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-sm font-bold ${step.accentText}`}>
              {step.number}
            </span>
            <span className="font-bold text-slate-900 text-lg group-hover:text-slate-700 transition-colors">
              {step.title}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 ml-4"
          >
            <ChevronDown className={`transition-colors ${isOpen ? step.accentText : 'text-slate-400'}`} size={20} />
          </motion.div>
        </button>

        {/* Expandable body */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className={`px-6 pb-6 pt-0 border-t-2 ${step.accentBorder}`}>
                <StepBody step={step} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Step body variants ─────────────────────────────────────────────── */
function StepBody({ step }: { step: Step }) {
  if (step.type === 'plain') {
    return (
      <p className="text-slate-700 leading-relaxed pt-4">{step.content}</p>
    );
  }

  if (step.type === 'bullets') {
    return (
      <ul className="pt-4 space-y-3">
        {step.bullets?.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="text-slate-700 leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (step.type === 'items') {
    const s = step as any;
    return (
      <ul className="pt-4 space-y-3">
        {s.items?.map((item: { label: string; text: string }, i: number) => (
          <li key={i} className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold flex-shrink-0 mt-0.5">
              {item.label}
            </span>
            <span className="text-slate-700 leading-relaxed">{item.text}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (step.type === 'split') {
    return (
      <div className="pt-4 grid sm:grid-cols-2 gap-4">
        {/* Left — meets requirements */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="text-emerald-600 flex-shrink-0" size={18} />
            <span className="font-bold text-emerald-800 text-sm uppercase tracking-wide">Meets Requirements</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">{step.left}</p>
        </div>

        {/* Right — does not meet */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ScanSearch className="text-amber-600 flex-shrink-0" size={18} />
            <span className="font-bold text-amber-800 text-sm uppercase tracking-wide">Transfer Visit Required</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">{step.right}</p>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Main page ──────────────────────────────────────────────────────── */
export function MSPOTransferProcedurePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const navigate = useNavigate();

  // All steps start closed; step 1 open by default
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([1]));

  const toggle = (n: number) => {
    setOpenSteps(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const expandAll = () => setOpenSteps(new Set(steps.map(s => s.number)));
  const collapseAll = () => setOpenSteps(new Set());

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Transfer"
        title="Procedures on Transfer Certification"
        subtitle="Clear step-by-step guidance for transferring accredited certificates."
      />

      <section className="relative py-20 md:py-28 bg-white" ref={ref}>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Intro banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 flex items-start gap-5 shadow-xl"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg mb-1">Transfer of Certificates</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)' }} className="text-sm leading-relaxed">
                Follow the 9-step procedure below to transfer your accredited MSPO certificate to DIMA Certification. Click each step to expand the details.
              </p>
            </div>
          </motion.div>

          {/* Expand / Collapse controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-between mb-8"
          >
            <p className="text-sm text-slate-500">{steps.length} steps total</p>
            <div className="flex gap-3">
              <button
                onClick={expandAll}
                className="text-sm text-[#d4af37] font-semibold hover:underline"
              >
                Expand all
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={collapseAll}
                className="text-sm text-slate-500 font-semibold hover:underline"
              >
                Collapse all
              </button>
            </div>
          </motion.div>

          {/* Steps */}
          <div>
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                isOpen={openSteps.has(step.number)}
                onToggle={() => toggle(step.number)}
                isLast={index === steps.length - 1}
                inView={isInView}
                index={index}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">
                Ready to Transfer Your Certification?
              </h3>
              <p className="mb-7 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Contact our team today to begin your transfer process. We'll guide you through every step.
              </p>
              <motion.button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
                <span>Get in Touch</span>
              </motion.button>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
