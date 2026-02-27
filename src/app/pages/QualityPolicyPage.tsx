import { motion } from 'motion/react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { Award, Shield } from 'lucide-react';

export function QualityPolicyPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Corporate Policy"
        title="Quality Policy Statement"
        subtitle="Our commitment to excellence in certification and related services"
      />

      <section className="relative py-16 md:py-20 lg:py-24 bg-slate-50">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Main Policy Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              
              {/* Header Section */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 md:px-12 lg:px-14 py-8 md:py-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-white leading-tight">
                      Quality Policy Statement
                    </h1>
                  </div>
                </div>
              </div>

              {/* Primary Policy Statement - Featured */}
              <div className="relative bg-gradient-to-br from-amber-50 via-amber-50/50 to-white">
                {/* Left Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#d4af37] to-amber-600"></div>
                
                <div className="px-8 md:px-12 lg:px-14 py-10 md:py-12">
                  <div className="flex items-start gap-5 md:gap-6">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-lg flex items-center justify-center">
                        <Shield className="text-white" size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#d4af37] uppercase tracking-wide mb-3">
                        Core Commitment
                      </p>
                      <p className="text-[1.1875rem] text-slate-900 leading-[1.85] font-medium">
                        DIMA Certification Sdn Bhd is resolved to be perceived by all business segments as focal point of brilliant for the arrangement of third party certification and related services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>

              {/* Supporting Policy Content */}
              <div className="bg-white px-8 md:px-12 lg:px-14 py-10 md:py-12">
                <div className="flex gap-5 md:gap-6">
                  {/* Vertical Accent Line */}
                  <div className="flex-shrink-0 w-1 bg-gradient-to-b from-slate-300 to-slate-200 rounded-full"></div>
                  
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-5">
                      Access & Non-Discrimination Policy
                    </h2>
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      All organization shall have access to its services/administrations, there shall not be undue financial or other conditions and DIMA procedures shall be carried out in a non-discriminatory manner. In addition, access to all certification services shall not be restricted on the grounds that the applicant does not apply for other services or is not a member of particular group or affiliation. DIMA also does not practice hidden discrimination by speeding or deferring application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="bg-slate-900 border-t border-slate-800 px-8 md:px-12 lg:px-14 py-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                    <p className="text-sm text-slate-300 font-semibold">
                      Official Policy Document
                    </p>
                  </div>
                  <p className="text-sm text-slate-400">
                    DIMA Certification Sdn Bhd
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}