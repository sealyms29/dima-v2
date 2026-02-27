import { motion } from 'motion/react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { Target, Clock, FileCheck, AlertCircle, TrendingUp } from 'lucide-react';

export function QualityObjectivesPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Performance Standards"
        title="Quality Objectives"
        subtitle="Measurable commitments driving our certification excellence"
      />

      <section className="relative py-16 md:py-20 lg:py-24 bg-slate-50">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
          
          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-10 md:mb-12"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 md:px-10 py-6 md:py-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-lg flex items-center justify-center">
                    <Target className="text-white" size={22} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Our Commitment
                  </h2>
                </div>
              </div>
              <div className="px-8 md:px-10 py-8 md:py-9">
                <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                  DIMA has established the following objectives and shall not continuously strive towards its achievement. We are committed:
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quality Objectives Grid */}
          <div className="space-y-6 mb-10 md:mb-12">
            
            {/* Objective 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden group">
                <div className="flex items-start gap-6 md:gap-8 p-8 md:p-10">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 transition-colors duration-300">
                        <Clock className="text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wide mb-2">
                          Audit Report Review Timeline
                        </h3>
                        <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                          To ensure that audit reports are completely reviewed (Peer Reviewer) within two (2) weeks upon audit completion and within one (1) week approval by the Operation Manager before issuance of certificate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom Accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#d4af37] to-amber-500"></div>
              </div>
            </motion.div>

            {/* Objective 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden group">
                <div className="flex items-start gap-6 md:gap-8 p-8 md:p-10">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 transition-colors duration-300">
                        <FileCheck className="text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wide mb-2">
                          Certificate Issuance Timeline
                        </h3>
                        <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                          To ensure certificates are issued within four (4) – six (6) weeks upon receipt of complete audit package.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom Accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#d4af37] to-amber-500"></div>
              </div>
            </motion.div>

            {/* Objective 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden group">
                <div className="flex items-start gap-6 md:gap-8 p-8 md:p-10">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 transition-colors duration-300">
                        <AlertCircle className="text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wide mb-2">
                          Client Complaint Target
                        </h3>
                        <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                          To ensure official client complaint are less than 3 cases per year.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom Accent */}
                <div className="h-1.5 bg-gradient-to-r from-[#d4af37] to-amber-500"></div>
              </div>
            </motion.div>

          </div>

          {/* KPI Monitoring Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-lg overflow-hidden">
              <div className="relative px-8 md:px-10 py-8 md:py-10">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-bl-full"></div>
                
                <div className="relative flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                      <TrendingUp className="text-white" size={26} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                      Performance Monitoring
                    </h2>
                    <p className="text-[1.0625rem] text-slate-200 leading-[1.85]">
                      These quantifiable targets serve as Key Performance Indicators (KPI) and shall be periodically monitored and reviewed during Management Review to ensure its continuing suitability and effectiveness.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Bottom Accent Strip */}
              <div className="h-2 bg-gradient-to-r from-[#d4af37] via-amber-500 to-[#d4af37]"></div>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}