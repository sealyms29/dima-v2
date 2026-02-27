import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { Shield, CheckCircle, ExternalLink, Building2, FileText, Award } from 'lucide-react';

export function MSPOLogoUsagePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Guidelines"
        title="MSPO Logo Usage"
        subtitle="Guidelines for proper usage of MSPO certification marks"
      />

      <section className="relative py-20 md:py-28 bg-white" ref={ref}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-10 md:p-12 shadow-lg">
              
              {/* Header Section */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    MSPO LICENSES OF LOGO USAGE RIGHTS
                  </h2>
                </div>
              </div>

              {/* Introduction */}
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Organisations or companies applying for use of the MSPO Logo must:
              </p>

              {/* Requirements List */}
              <div className="space-y-6 mb-10">
                {/* Requirement 1 */}
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-8 h-8 bg-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 text-lg leading-relaxed">
                      Be a legal entity, such as a company, business or society
                    </p>
                  </div>
                </motion.div>

                {/* Requirement 2 */}
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="w-8 h-8 bg-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 text-lg leading-relaxed mb-4">
                      Sign an agreement (MSPO Logo Usage License Agreement) that allows the public presentation on an Internet-based database, of the organisation's, company's or other legal entity's identification data. This data includes:
                    </p>
                    
                    {/* Sub-items */}
                    <div className="ml-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-[#d4af37] font-bold text-lg">1.</span>
                        <p className="text-slate-700 flex-1">Organisation's contact and location details</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#d4af37] font-bold text-lg">2.</span>
                        <p className="text-slate-700 flex-1">Organisation's certificate number and expiry date</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#d4af37] font-bold text-lg">3.</span>
                        <p className="text-slate-700 flex-1">Accredited certification body's contact details</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Link Section */}
              <motion.div
                className="mt-12 pt-8 border-t-2 border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <a
                  href="https://www.mpocc.org.my/mspo-logo-license-issuance-procedure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[#d4af37] hover:text-amber-600 font-semibold text-xl transition-colors group"
                >
                  <ExternalLink className="group-hover:translate-x-1 transition-transform" size={24} />
                  <span className="border-b-2 border-[#d4af37] group-hover:border-amber-600 transition-colors">
                    MSPO Logo License Issuance Procedure
                  </span>
                </a>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}