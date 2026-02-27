import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import { useQuotation } from '../QuotationContext';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { CheckCircle, Award, FileText, Target, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
// Figma assets removed - use actual image files
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO9001Cert = '/assets/2eb1364916b9dd93f2e9fd97b3c02f820f92061f.png';

export function ISO9001Page() {
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, amount: 0.05 });
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();

  return (
    <PageLayout>
      <PageHero
        badge="Certification Standard"
        title="ISO 9001 Quality Management Systems (QMS) Standard"
        subtitle="International standard for quality management excellence"
        logo={imgISO9001Logo}
        logoAlt="ISO 9001 Quality Management Systems"
      />

      <section className="relative py-16 md:py-24 bg-white" ref={contentRef}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* ISO 9001 Certification Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-16"
          >
            
          </motion.div>

          {/* Main Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border-2 border-slate-200 p-8 md:p-10 shadow-sm">
              <p className="text-lg text-slate-800 leading-relaxed mb-4">
                <strong className="text-slate-900">ISO 9001</strong> is <strong>the internationally recognized standard for Quality Management Systems (QMS)</strong>, providing a framework for organizations to consistently produce quality products and services, meet customer and regulatory requirements, and continually improve their performance. The current version, ISO 9001:2015, helps organizations enhance efficiency, customer satisfaction, and competitiveness by focusing on customer focus, leadership, risk management, and continuous improvement processes. It is applicable to any organization, regardless of size or sector.
              </p>
            </div>
          </motion.div>

          {/* What is ISO 9001? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              What is ISO 9001?
            </h2>

            <div className="space-y-6">
              {/* International Standard */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">International Standard:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Published by the <a href="https://www.iso.org" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline font-semibold">International Organization for Standardization (ISO)</a>, it's a globally accepted standard for quality management.
                    </p>
                  </div>
                </div>
              </div>

              {/* Framework for QMS */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Framework for QMS:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      It specifies the requirements for an organization's QMS, providing a structure for managing processes and ensuring consistent quality.
                    </p>
                  </div>
                </div>
              </div>

              {/* Focus on Customer Satisfaction */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Focus on Customer Satisfaction:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      The primary goal is to meet and exceed customer expectations by delivering products and services that are fit for purpose and meet all relevant requirements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Principles */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Key Principles:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      It is built on principles such as customer focus, strong leadership, the process approach, and <a href="https://en.wikipedia.org/wiki/Continual_improvement_process" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:underline font-semibold">continual improvement</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
                <Award className="text-white" size={24} />
              </div>
              Key Benefits of Implementing ISO 9001
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Enhanced Customer Satisfaction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Enhanced Customer Satisfaction:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      By focusing on customer needs and consistently meeting requirements, the standard helps to improve customer loyalty.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Improved Efficiency */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Improved Efficiency:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      A well-implemented QMS leads to more efficient processes and reduced product failures.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Increased Competitiveness */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Increased Competitiveness:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Certification demonstrates a commitment to quality, which can enhance an organization's reputation and market position.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Regulatory Compliance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Regulatory Compliance:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      It ensures that an organization's products and services meet all applicable statutory and regulatory requirements.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Continuous Improvement */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="md:col-span-2 bg-gradient-to-br from-amber-50 to-white border-2 border-[#d4af37] rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Continuous Improvement:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      The QMS framework encourages a culture of continuous improvement, leading to better business performance over time.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-12 text-center shadow-xl"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <img 
                  src={imgISO9001Logo} 
                  alt="ISO 9001 Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for ISO 9001:2015 Certification?
              </h3>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Contact DIMA Certification to begin your journey toward ISO 9001 quality management excellence. Our experienced auditors will guide you through the entire certification process.
              </p>
              <button
                onClick={togglePanel}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>Request Quotation</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}