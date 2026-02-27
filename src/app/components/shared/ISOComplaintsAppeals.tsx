import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  AlertTriangle,
  MessageSquareWarning,
  Building2,
  UsersRound,
  Gavel,
  ClipboardList,
  SearchCheck,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

const caseTypes = [
  {
    id: 'case-a',
    label: 'Case A',
    title: 'General Complaints (Staff, Service, or Quality)',
    icon: MessageSquareWarning,
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-200',
    bg: 'from-blue-50 to-white',
    accent: 'bg-blue-500',
    bullets: [
      { heading: 'Investigation:', text: 'The Operation Manager investigates the root cause.' },
      { heading: 'Action:', text: 'If valid, the Manager implements immediate correction and remedial action to prevent recurrence.' },
      { heading: 'Reporting:', text: 'Results and status updates are reported to the client. Complaints about a certified client are referred to that client within 30 days.' },
    ],
  },
  {
    id: 'case-b',
    label: 'Case B',
    title: 'Complaints Against Certified Clients',
    icon: Building2,
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-200',
    bg: 'from-emerald-50 to-white',
    accent: 'bg-emerald-500',
    bullets: [
      { heading: 'Referral:', text: 'DIMA refers the complaint to the certified client in question within 30 days.' },
      { heading: 'Public Disclosure:', text: 'DIMA, the client, and the complainant determine if and how the resolution is made public.' },
    ],
  },
  {
    id: 'case-c',
    label: 'Case C',
    title: 'Complaints Against Top Management',
    icon: UsersRound,
    gradient: 'from-purple-500 to-purple-600',
    border: 'border-purple-200',
    bg: 'from-purple-50 to-white',
    accent: 'bg-purple-500',
    bullets: [
      { heading: 'Referral:', text: 'Any complaint against the Top Management is referred to the Advisory Board Committee.' },
      { heading: 'Governing Document:', text: 'Refer to DIMA CERTIFICATION M012 for these specific proceedings.' },
    ],
  },
  {
    id: 'case-d',
    label: 'Case D',
    title: 'Appeals Against Certification Decisions',
    icon: Gavel,
    gradient: 'from-[#d4af37] to-amber-500',
    border: 'border-[#d4af37]/30',
    bg: 'from-amber-50 to-white',
    accent: 'bg-[#d4af37]',
    bullets: [
      { heading: 'Committee Formation:', text: 'The Appeals Committee is convened to handle the matter impartially. Appeals Committee Findings & Decision (DMC/ISO/ACF)' },
      { heading: 'Hearing:', text: 'For extremely confidential issues, the appellant may present their case directly to the Committee.' },
      { heading: 'Final Decision:', text: "The Committee's decision is final. The client is informed of the findings and the outcome." },
    ],
  },
];

const processSteps = [
  {
    id: 'step-1',
    step: 1,
    title: 'Receipt and Registration',
    icon: ClipboardList,
    gradient: 'from-blue-500 to-blue-600',
    items: [
      'All complaints (verbal or official) are recorded in the Customer Complaint-Appeal Form (DMC/ISO/CCA).',
      'The Administrator logs the entry in the Complaint and Appeals Log (DMC/ISO/CAL).',
      'A confirmation and progress report is issued to the client until the outcome is known.',
    ],
  },
  {
    id: 'step-2',
    step: 2,
    title: 'Validation & Team Appointment',
    icon: SearchCheck,
    gradient: 'from-emerald-500 to-emerald-600',
    items: [
      'Validation: The Operation Manager investigates the validity of the complaint.',
      'Appointment: The Operation Manager formally appoints a team using the Investigation Team Appointment (DMC/ISO/ITA) form.',
      'Impartiality: DIMA ensures that persons engaged in the process are different from those who carried out the audits or made certification decisions.',
    ],
  },
  {
    id: 'step-3',
    step: 3,
    title: 'Investigation',
    icon: ShieldCheck,
    gradient: 'from-purple-500 to-purple-600',
    items: [
      'Confidentiality: All complaints are treated as confidential, and complainant details are not exposed.',
      'Discrimination: Investigations shall not result in discriminatory actions against the complainant.',
      'Timeline: Complaints about a certified client are referred to that client within 30 days.',
    ],
  },
  {
    id: 'step-4',
    step: 4,
    title: 'Resolution & Reporting',
    icon: CheckCircle2,
    gradient: 'from-[#d4af37] to-amber-500',
    items: [
      'Correction: If valid, the Certification Manager implements immediate correction and remedial action.',
      'Appeals Hearing: For appeals, the Appeals Committee convenes to handle the matter impartially. Appellants may present cases directly if issues are extremely confidential.',
    ],
  },
];

export function ISOComplaintsAppeals() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  return (
    <div ref={sectionRef} className="mb-16">
      {/* Main Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 flex items-center gap-3"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
          <AlertTriangle className="text-white" size={24} />
        </div>
        ISO Complaints and Appeals
      </motion.h2>

      {/* ─── Section 1: Type of Complaints / Appeal ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Type of Complaints / Appeal
        </h3>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-14">
        {caseTypes.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className={`bg-gradient-to-br ${c.bg} border-2 ${c.border} rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group relative overflow-hidden`}
            >
              {/* Decorative corner accent */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${c.gradient} opacity-[0.07] rounded-bl-[60px]`}
              />

              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <Icon className="text-white" size={26} />
                </div>
                <div>
                  <span
                    className={`inline-block text-xs font-bold tracking-widest uppercase text-white px-3 py-1 rounded-full bg-gradient-to-r ${c.gradient} mb-1`}
                  >
                    {c.label}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">
                    {c.title}
                  </h4>
                </div>
              </div>

              {/* Bullets */}
              <ul className="space-y-3">
                {c.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-2 h-2 ${c.accent} rounded-full mt-2.5`} />
                    <p className="text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">{b.heading}</strong> {b.text}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Section Divider ─── */}
      <div className="flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* ─── Section 2: Complaints / Appeal Process ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mb-10"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
          Complaints / Appeal Process
        </h3>
      </motion.div>

      {/* Process Flow Timeline */}
      <div className="relative">
        {/* Vertical connector line (desktop) */}
        <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-[#d4af37]" />

        <div className="space-y-6 md:space-y-0">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === processSteps.length - 1;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.12 }}
                className="relative md:pl-24 md:pb-10"
              >
                {/* Step number circle (desktop) */}
                <div className="hidden md:flex absolute left-0 top-0 z-10">
                  <div
                    className={`w-[78px] h-[78px] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}
                    style={{
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div className="text-center">
                      <div className="text-white/70 text-[10px] font-bold tracking-widest uppercase leading-none mb-0.5">
                        Step
                      </div>
                      <div className="text-white text-2xl font-bold leading-none">
                        {step.step}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector arrow (desktop, between steps) */}
                {!isLast && (
                  <div className="hidden md:flex absolute left-[31px] bottom-[-2px] z-10">
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                )}

                {/* Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-slate-300 hover:shadow-lg transition-all">
                  {/* Mobile step badge */}
                  <div className="md:hidden flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md`}
                    >
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">{step.title}</h4>
                  </div>

                  {/* Desktop title with icon */}
                  <div className="hidden md:flex items-center gap-3 mb-5">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center`}
                      style={{ opacity: 0.15 }}
                    />
                    <div className={`-ml-[46px] w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <Icon
                        size={22}
                        className="text-slate-700"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">{step.title}</h4>
                  </div>

                  {/* Numbered items */}
                  <ol className="space-y-3 md:pl-2">
                    {step.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${step.gradient} text-white text-xs font-bold flex items-center justify-center mt-0.5`}
                        >
                          {j + 1}
                        </span>
                        <p className="text-slate-700 leading-relaxed">{item}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Final Decision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="relative md:pl-24 mt-6 md:mt-0"
        >
          {/* Final circle (desktop) */}
          <div className="hidden md:flex absolute left-0 top-0 z-10">
            <div
              className="w-[78px] h-[78px] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-xl"
              style={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              }}
            >
              <Gavel className="text-[#d4af37]" size={28} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="md:hidden w-10 h-10 rounded-lg bg-[#d4af37]/20 flex items-center justify-center">
                <Gavel className="text-[#d4af37]" size={20} />
              </div>
              <h4 className="text-xl font-bold text-white">Final Decision</h4>
            </div>
            <p className="text-white/80 leading-relaxed">
              <strong className="text-[#d4af37]">Decision:</strong> Once the Appeals Committee makes a decision, it is final, and the results are recorded in the Appeals Committee Findings (DMC/ISO/ACF).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
