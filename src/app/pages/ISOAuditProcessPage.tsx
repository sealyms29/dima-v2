import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  Award,
  CheckCircle,
  FileText,
  ClipboardCheck,
  Eye,
  Send,
  Users,
  Target,
  BarChart,
  AlertCircle,
  RefreshCw,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type PhaseId = 'phase1' | 'phase2' | 'phase3' | 'phase4';

interface StepItem {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export function ISOAuditProcessPage() {
  const [openPhase, setOpenPhase] = useState<PhaseId | null>('phase1');
  const sectionRef = useRef(null);

  const toggle = (id: PhaseId) => {
    setOpenPhase((prev) => (prev === id ? null : id));
  };

  const preCertSteps: StepItem[] = [
    { title: 'Client Application', desc: 'Client submits application for initial certification', icon: Send },
    { title: 'Information Exchange', desc: 'Exchange of information between client and certification body', icon: FileText },
    { title: 'Application Review', desc: 'Review of application for certification', icon: Eye },
    { title: 'Identify Areas of Concern', desc: 'Identification of areas of concern and request for additional information (if applicable)', icon: AlertCircle },
    { title: 'Audit Programme Development', desc: 'Development of audit programme', icon: ClipboardCheck },
    { title: 'Certification Proposal', desc: 'Proposal for certification and confirmation of audit programme', icon: FileCheck },
  ];

  const initialCertSteps: StepItem[] = [
    { title: 'Stage 1 Team Selection', desc: 'Select and appoint competent Stage 1 team', icon: Users },
    { title: 'Stage 1 Planning', desc: 'Planning for Stage 1 audit', icon: Target },
    { title: 'Conduct Stage 1', desc: 'Conduct Stage 1 audit (documentation review and readiness assessment)', icon: Eye },
    { title: 'Resolve Stage 1 Concerns', desc: 'Resolve Stage 1 areas of concern (if applicable)', icon: AlertCircle },
    { title: 'Stage 2 Team Confirmation', desc: 'Confirm/appoint competent Stage 2 team', icon: Users },
    { title: 'Stage 2 Planning', desc: 'Plan for Stage 2 audit', icon: Target },
    { title: 'Conduct Stage 2', desc: 'Conduct Stage 2 audit (on-site evaluation of management system implementation)', icon: BarChart },
    { title: 'Resolve Stage 2 Concerns', desc: 'Resolve Stage 2 areas of concern (if applicable)', icon: AlertCircle },
    { title: 'Initial Certification Conclusion', desc: 'Completion of initial certification audit activities', icon: CheckCircle },
  ];

  const commonSurveillanceSteps = [
    'Exchange of information between client and certification body (e.g. change of scope); determine if changes to audit programme required',
    'Confirm audit programme and communicate to client',
    'Confirm appoint competent audit team',
  ];

  const surveillancePathSteps = [
    'Plan for surveillance audit',
    'Conduct surveillance audit',
    'Resolve surveillance audit areas of concern (if applicable)',
    'Surveillance audit conclusions',
    'Independent review of certification (if required)',
  ];

  const recertificationPathSteps = [
    'Recertification audit planning',
    'Conduct recertification audit',
    'Resolve recertification audit areas of concern (if applicable)',
    'Recertification audit conclusions',
    'Recertification decision',
    'Granting of recertification and issuance of certification documents',
  ];

  // Renders a step card grid
  const renderStepGrid = (steps: StepItem[], highlightLast = false) => (
    <div className="grid md:grid-cols-2 gap-4">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isHighlighted = highlightLast && idx === steps.length - 1;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className={`rounded-2xl p-5 transition-all group ${
              isHighlighted
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#d4af37] shadow-md md:col-span-2'
                : 'bg-white border-2 border-slate-200 hover:border-[#d4af37] hover:shadow-lg'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-[#d4af37] to-amber-500'
                    : 'bg-slate-100 group-hover:bg-amber-50'
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isHighlighted
                      ? 'text-white'
                      : 'text-slate-600 group-hover:text-[#d4af37] transition-colors'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step {idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 mb-0.5">{step.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const phases: {
    id: PhaseId;
    num: number;
    title: string;
    subtitle: string;
    headerGradient: string;
    numBg: string;
    stepCount: number;
  }[] = [
    {
      id: 'phase1',
      num: 1,
      title: 'Pre-Certification Activities',
      subtitle: 'Application & Programme Development',
      headerGradient: 'from-slate-800 to-slate-900',
      numBg: 'bg-[#d4af37]',
      stepCount: 7,
    },
    {
      id: 'phase2',
      num: 2,
      title: 'Initial Certification',
      subtitle: 'Planning & Conducting Audits (Stage 1 & Stage 2)',
      headerGradient: 'from-slate-800 to-slate-900',
      numBg: 'bg-[#d4af37]',
      stepCount: 9,
    },
    {
      id: 'phase3',
      num: 3,
      title: 'Initial Certification Decision',
      subtitle: 'Granting of Certification',
      headerGradient: 'from-[#d4af37] to-amber-500',
      numBg: 'bg-white/20',
      stepCount: 1,
    },
    {
      id: 'phase4',
      num: 4,
      title: 'Ongoing Surveillance Activities',
      subtitle: 'Surveillance & Recertification',
      headerGradient: 'from-blue-500 to-blue-600',
      numBg: 'bg-white/20',
      stepCount: 14,
    },
  ];

  const renderPhaseContent = (id: PhaseId) => {
    switch (id) {
      case 'phase1':
        return (
          <>
            {renderStepGrid(preCertSteps)}
            {/* Milestone */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-5 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-5 text-white shadow-lg"
            >
              <div className="flex items-center gap-4">
                <CheckCircle size={26} className="flex-shrink-0" />
                <p className="font-semibold">
                  Client and certification body engage in formal arrangements for certification
                </p>
              </div>
            </motion.div>
          </>
        );
      case 'phase2':
        return renderStepGrid(initialCertSteps, true);
      case 'phase3':
        return (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-2 border-[#d4af37] rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center shadow-md">
                <Award className="text-white" size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Granting of Initial Certification
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Upon successful completion of the audit process, the certification body makes the
                  final decision to grant ISO certification and issues the official certification
                  documents to the client organization.
                </p>
              </div>
            </div>
          </motion.div>
        );
      case 'phase4':
        return (
          <>
            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 mb-6"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="flex-shrink-0 text-blue-600 mt-1" size={22} />
                <p className="text-slate-800 leading-relaxed text-sm">
                  <strong>Surveillance audits shall be conducted at least once a calendar year.</strong>{' '}
                  The first surveillance audit following initial certification shall be more than 12
                  months from the certification decision date.
                </p>
              </div>
            </motion.div>

            {/* Common Steps */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-7 h-7 bg-slate-200 rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-slate-700" />
                </div>
                Common Steps for All Surveillance Activities
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {commonSurveillanceSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                    className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed pt-1">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dual Path */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Surveillance Path */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Surveillance Path</h4>
                    <p className="text-xs text-slate-600">Annual monitoring activities</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {surveillancePathSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-blue-200 rounded-xl p-3.5 hover:border-[#d4af37] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recertification Path */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-3xl p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <RefreshCw className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Recertification Path</h4>
                    <p className="text-xs text-slate-600">
                      Activities to be completed before expiry of certification
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {recertificationPathSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-amber-200 rounded-xl p-3.5 hover:border-[#d4af37] hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <PageHero
        badge="ISO Certification Process"
        title="DMC ISO Audit Process"
        subtitle="A comprehensive certification workflow ensuring thorough assessment and ongoing compliance"
      />

      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white" ref={sectionRef}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* ── Certification Cycle Banner ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 md:p-10 text-white text-center shadow-xl"
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <Award size={40} />
              <h2 className="text-2xl md:text-3xl font-bold">
                Three (3) Years Certification Cycle
              </h2>
            </div>
            <p className="text-lg text-white/90">
              Initial Certification Decision / Recertification Decision → Expiry of Certification
            </p>
          </motion.div>

          {/* ── Accordion Phases ── */}
          <div className="space-y-4">
            {phases.map((phase, phaseIdx) => {
              const isOpen = openPhase === phase.id;
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: phaseIdx * 0.08 }}
                  className="rounded-2xl overflow-hidden shadow-md"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggle(phase.id)}
                    className={`w-full bg-gradient-to-r ${phase.headerGradient} p-5 md:p-6 flex items-center gap-4 text-left transition-all hover:opacity-95 cursor-pointer`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 ${phase.numBg} rounded-xl flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {phase.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                        {phase.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-0.5">{phase.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-xs font-semibold text-white/50 bg-white/10 px-3 py-1.5 rounded-lg">
                        {phase.stepCount} {phase.stepCount === 1 ? 'step' : 'steps'}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"
                      >
                        <ChevronDown className="text-white" size={22} />
                      </motion.div>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-50 border-x-2 border-b-2 border-slate-200 rounded-b-2xl p-5 md:p-8">
                          {renderPhaseContent(phase.id)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ── Important Note ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 bg-white border-2 border-orange-400 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="flex-shrink-0 text-orange-500 mt-1" size={26} />
              <div>
                <p className="font-bold text-slate-900 mb-2">Note:</p>
                <p className="text-slate-700 leading-relaxed">
                  Confirm or adjust audit programme and appropriate audit follow up and surveillance
                  activities including frequency and duration. Special audits must also be taken into
                  consideration.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
