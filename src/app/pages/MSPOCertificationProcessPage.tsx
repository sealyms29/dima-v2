import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { CheckCircle2 } from 'lucide-react';

type ProcessTab = 'application' | 'planning' | 'decision' | 'surveillance' | 'recertification';

interface ProcessStep {
  title: string;
  description?: string;
  actions?: string[];
}

interface OverviewStep {
  number: string;
  title: string;
}

export function MSPOCertificationProcessPage() {
  const overviewRef = useRef(null);
  const processRef = useRef(null);
  const isOverviewInView = useInView(overviewRef, { once: true, amount: 0.2 });
  const isProcessInView = useInView(processRef, { once: true, amount: 0.2 });
  
  const [activeTab, setActiveTab] = useState<ProcessTab>('application');

  // 5-Step Process Overview
  const overviewSteps: OverviewStep[] = [
    {
      number: '01',
      title: 'Client submits application for initial certification'
    },
    {
      number: '02',
      title: 'Initial certification planning / conducting audits'
    },
    {
      number: '03',
      title: 'Initial certification decision'
    },
    {
      number: '04',
      title: 'Surveillance audit'
    },
    {
      number: '05',
      title: 'Recertification'
    }
  ];

  // Tab 1: Application Submission
  const applicationSteps: ProcessStep[] = [
    {
      title: 'Exchange of information between client and certification body',
      actions: [
        'The applicant completes and submits the Application Form and Questionnaire for Self-Assessment form to DMC.',
        'Acknowledgement of Application letter will send by DMC to applicant.'
      ]
    },
    {
      title: 'Review of application for certification',
      actions: [
        'Quotation & certification agreement will be prepare by DMC and send to the applicant for consideration.',
        'DMC will review the information given by the applicant and performs the quotation contract review.'
      ]
    },
    {
      title: 'Identification of areas of concern and request for additional information (if applicable)'
    },
    {
      title: 'Development of audit programme',
      actions: [
        'The audit programme will be prepare and attach with quotation & certification agreement.'
      ]
    },
    {
      title: 'Proposal for certification and confirmation of audit programme',
      actions: [
        'The quotation & certification agreement attach with audit programme will be send to client for consideration.'
      ]
    },
    {
      title: 'Client and certification body engage in formal arrangements for certification'
    }
  ];

  // Tab 2: Planning & Conducting Audits
  const planningSteps: ProcessStep[] = [
    {
      title: 'Select and appoint competent stage 1 team',
      actions: [
        'Upon received Quotation & Contact Agreement form, DMC will review using Quotation Contract Review to appoint an Audit Team and issue a Notification of Audit to indicate the composition of the audit team and communicate to respective auditors and clients.',
        'Pre-checklist audit will be send prior to auditing activity',
        'Public notification will be issue atleast 30 calendar days before initial'
      ]
    },
    {
      title: 'Planning stage 1',
      actions: [
        'The Audit Plan will be prepare and will be communicated to client.'
      ]
    },
    {
      title: 'Conduct Stage 1'
    },
    {
      title: 'Resolve stage 1 areas of concern (if applicable)'
    },
    {
      title: 'Confirm / appoint competent stage 2 team',
      actions: [
        'Issue a Notification of Audit to indicate the composition of the audit team and communicate to respective auditors and clients.',
        'Pre-checklist audit will be send prior to auditing activity',
        'Public notification will be issue atleast 30 calendar days before initial'
      ]
    },
    {
      title: 'Plan for stage 2',
      actions: [
        'The Audit Plan will be prepare and will be communicated to client.'
      ]
    },
    {
      title: 'Conduct stage 2'
    },
    {
      title: 'Resolve stage 2 areas of concern (if applicable)'
    },
    {
      title: 'Initial certification audit conclusions'
    }
  ];

  // Tab 3: Certification Decision
  const decisionSteps: ProcessStep[] = [
    {
      title: 'Granting of initial certification and issuance of certification documents'
    }
  ];

  // Tab 4: Surveillance Audit
  const surveillanceSteps: ProcessStep[] = [
    {
      title: 'Surveillance audits shall be conducted at least once a calendar year. The date of the first surveillance audit following initial certification shall not be more than 12 months from the certification decision date'
    },
    {
      title: 'Exchange of information between client and certification body (e.g. change of scope); determine if changes to audit programme required'
    },
    {
      title: 'Confirm audit programme and communicate to client'
    },
    {
      title: 'Confirm appoint competent audit team'
    },
    {
      title: 'Plan for surveillance audit'
    },
    {
      title: 'Conduct surveillance audit'
    },
    {
      title: 'Resolve surveillance audit areas of concern (if applicable)'
    },
    {
      title: 'Surveillance audit conclusions'
    },
    {
      title: 'Independent review of certification (if required)'
    }
  ];

  // Tab 5: Recertification
  const recertificationSteps: ProcessStep[] = [
    {
      title: 'Recertification activities to be completed before expiry of certification'
    },
    {
      title: 'Exchange of information between client and certification body (e.g. change of scope); determine if changes to audit programme required'
    },
    {
      title: 'Recertification audit planning'
    },
    {
      title: 'Confirm audit programme and communicate to client'
    },
    {
      title: 'Confirm appoint competent audit team'
    },
    {
      title: 'Plan for recertification audit'
    },
    {
      title: 'Conduct recertification audit'
    },
    {
      title: 'Resolve recertification audit areas of concern (if applicable)'
    },
    {
      title: 'Recertification audit conclusions'
    },
    {
      title: 'Recertification decision'
    },
    {
      title: 'Granting of recertification and issuance of certification documents'
    }
  ];

  const getActiveSteps = () => {
    switch (activeTab) {
      case 'application':
        return applicationSteps;
      case 'planning':
        return planningSteps;
      case 'decision':
        return decisionSteps;
      case 'surveillance':
        return surveillanceSteps;
      case 'recertification':
        return recertificationSteps;
      default:
        return applicationSteps;
    }
  };

  const tabs = [
    { id: 'application' as ProcessTab, label: 'Client submits application for initial certification' },
    { id: 'planning' as ProcessTab, label: 'Initial certification planning / conducting audits' },
    { id: 'decision' as ProcessTab, label: 'Initial Certification Decision' },
    { id: 'surveillance' as ProcessTab, label: 'Surveillance Audit' },
    { id: 'recertification' as ProcessTab, label: 'Recertification' }
  ];

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Process"
        title="MSPO Certification Process"
        subtitle="Your step-by-step journey to MSPO certification with DIMA"
      />

      {/* 5-Step Process Overview */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 to-white" ref={overviewRef}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isOverviewInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
              <span className="text-sm font-semibold text-[#d4af37] uppercase tracking-wide">
                Process Overview
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              MSPO Certification Process
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              High-level overview of the certification workflow
            </p>
          </motion.div>

          {/* Process Steps - Desktop Horizontal / Mobile Vertical */}
          <div className="relative">
            
            {/* Desktop: Horizontal Timeline */}
            <div className="hidden lg:block">
              {/* Connector Line */}
              <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-amber-500"
                  initial={{ width: '0%' }}
                  animate={isOverviewInView ? { width: '100%' } : {}}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-5 gap-4 relative">
                {overviewSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isOverviewInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="group"
                  >
                    {/* Step Number Circle */}
                    <div className="flex justify-center mb-8">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Outer Ring - Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        
                        {/* Main Circle */}
                        <div className="relative w-24 h-24 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center shadow-lg group-hover:border-[#d4af37] group-hover:shadow-2xl transition-all duration-300">
                          <span className="text-3xl font-bold text-slate-400 group-hover:text-[#d4af37] transition-colors duration-300">
                            {step.number}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md group-hover:shadow-2xl group-hover:border-[#d4af37] group-hover:-translate-y-2 transition-all duration-300">
                      <p className="text-slate-700 leading-relaxed text-center min-h-[80px] flex items-center justify-center">
                        {step.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="lg:hidden space-y-6">
              {overviewSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isOverviewInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="group relative"
                >
                  {/* Vertical Connector */}
                  {index < overviewSteps.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-8 bg-slate-200 group-hover:bg-[#d4af37] transition-colors" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-16 h-16 bg-white border-4 border-slate-200 rounded-2xl flex items-center justify-center shadow-md group-hover:border-[#d4af37] group-hover:shadow-xl transition-all">
                      <span className="text-xl font-bold text-slate-400 group-hover:text-[#d4af37] transition-colors">
                        {step.number}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md group-hover:shadow-xl group-hover:border-[#d4af37] transition-all">
                      <p className="text-slate-700 leading-relaxed">
                        {step.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Detailed Tabbed Process Section */}
      <section className="relative py-20 md:py-28 bg-white" ref={processRef}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
              <span className="text-sm font-semibold text-[#d4af37] uppercase tracking-wide">
                Detailed Workflow
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Process Details
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select a certification stage to view the complete detailed workflow
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            {/* Desktop Tabs */}
            <div className="hidden lg:grid grid-cols-5 bg-white rounded-2xl shadow-lg border border-slate-200 p-2 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-br from-[#d4af37] to-amber-500 text-white shadow-lg' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <span className="text-center leading-tight">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Tabs - Stacked */}
            <div className="lg:hidden space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full px-6 py-4 rounded-xl font-semibold text-base transition-all duration-300 text-left
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-br from-[#d4af37] to-amber-500 text-white shadow-lg' 
                      : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-[#d4af37]/50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Process Steps - Vertical Timeline */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            {/* Vertical Connector Line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

            {/* Steps */}
            <div className="space-y-6">
              {getActiveSteps().map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative flex items-start gap-6 md:gap-8 group"
                >
                  {/* Step Number Circle */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center shadow-md group-hover:border-[#d4af37] group-hover:shadow-xl transition-all duration-300">
                      <span className="text-lg md:text-xl font-bold text-slate-400 group-hover:text-[#d4af37] transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Step Content Card */}
                  <div className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 shadow-md group-hover:shadow-xl group-hover:border-[#d4af37]/50 transition-all duration-300 min-h-[80px] flex flex-col justify-center">
                    {/* Step Title */}
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed mb-3">
                      {step.title}
                    </h3>

                    {/* Step Description (if exists) */}
                    {step.description && (
                      <p className="text-slate-600 leading-relaxed mb-3">
                        {step.description}
                      </p>
                    )}

                    {/* Actions/Sub-steps */}
                    {step.actions && step.actions.length > 0 && (
                      <div className="mt-2 pl-4 border-l-2 border-[#d4af37]/30">
                        <ul className="space-y-2">
                          {step.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-3 text-sm text-slate-600">
                              <CheckCircle2 size={16} className="flex-shrink-0 text-[#d4af37] mt-0.5" />
                              <span className="flex-1">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#d4af37]/30 rounded-2xl p-6 md:p-8">
              <p className="text-slate-700 text-center leading-relaxed">
                <span className="font-semibold text-slate-900">Important: </span>
                Confirm or adjust audit programme and audit follow-up and surveillance activities including frequency and duration. Special audits must also be taken into consideration.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </PageLayout>
  );
}
