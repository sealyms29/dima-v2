import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import { useQuotation } from '../QuotationContext';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { 
  CheckCircle, 
  Award, 
  FileText, 
  Target, 
  Leaf, 
  Scale,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Recycle,
  BarChart,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
// Figma asset removed - use actual image file
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';

export function ISO14001Page() {
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, amount: 0.05 });
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();

  return (
    <PageLayout>
      <PageHero
        badge="Certification Standard"
        title="ISO 14001 Environmental Management Systems (EMS) Standard"
        subtitle="International standard for environmental management excellence"
        logo={imgISO14001Logo}
        logoAlt="ISO 14001 Environmental Management Systems"
      />

      <section className="relative py-16 md:py-24 bg-white" ref={contentRef}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Main Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200 p-8 md:p-10 shadow-sm">
              <p className="text-lg text-slate-800 leading-relaxed">
                <strong className="text-slate-900">ISO 14001</strong> is an international standard that provides a framework for organizations to create and maintain an <strong>Environmental Management System (EMS)</strong> to improve their environmental performance, ensure regulatory compliance, and promote sustainability. The standard helps businesses identify, manage, and reduce their environmental impacts by using a <strong>Plan-Do-Check-Act (PDCA)</strong> cycle to continuously improve their EMS and environmental outcomes.
              </p>
            </div>
          </motion.div>

          {/* What it is Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              What it is:
            </h2>

            <div className="space-y-6">
              {/* International Standard */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-green-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      An <strong className="text-slate-900">international standard</strong> for designing and implementing an EMS.
                    </p>
                  </div>
                </div>
              </div>

              {/* Framework */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-green-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      A <strong className="text-slate-900">framework</strong> for organizations to control their environmental aspects and impacts, such as resource usage, waste management, and pollution prevention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Flexible Standard */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-green-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      A <strong className="text-slate-900">flexible standard</strong> suitable for organizations of all sizes and sectors, from private to public, and for profit or non-profit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Goals and Benefits */}
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
              Key Goals and Benefits:
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Environmental Protection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Leaf className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Environmental Protection:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Minimized footprint, reduced waste, and efficient use of resources.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Legal Compliance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scale className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Legal Compliance:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Ensures adherence to relevant environmental laws and regulations.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Improved Performance */}
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
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Improved Performance:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Continuous improvement of environmental performance and processes.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stakeholder Trust */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Stakeholder Trust:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Builds credibility and trust with customers, employees, regulators, and the wider community.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Cost Savings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Cost Savings:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Can lead to reductions in waste, energy consumption, and raw material use.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Reputation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-amber-50 to-white border-2 border-[#d4af37] rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Enhanced Reputation:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Signals a commitment to environmental responsibility and can improve market perception.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* How it Works - PDCA Cycle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <RefreshCw className="text-white" size={24} />
              </div>
              How it Works (The PDCA Cycle):
            </h2>
            
            <p className="text-lg text-slate-700 mb-10 leading-relaxed">
              ISO 14001 employs the <strong>Plan-Do-Check-Act (PDCA)</strong> cycle for continuous improvement of the EMS.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Plan */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <h3 className="text-2xl font-bold">Plan</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Establish the environmental policy, identify environmental aspects and impacts, and set clear, measurable objectives and targets.
                </p>
              </motion.div>

              {/* Do */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <h3 className="text-2xl font-bold">Do</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Implement the processes and operational controls to achieve the environmental objectives.
                </p>
              </motion.div>

              {/* Check */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <h3 className="text-2xl font-bold">Check</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Monitor and measure performance against the established policies and objectives.
                </p>
              </motion.div>

              {/* Act */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                    4
                  </div>
                  <h3 className="text-2xl font-bold">Act</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Take corrective actions and implement improvements based on the performance evaluation.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Who is it for? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border-2 border-slate-300 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Target className="text-[#d4af37]" size={32} />
                Who is it for?
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                Any organization that wants to manage its environmental impact more effectively, <strong>regardless of its size or type.</strong>
              </p>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-300 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={32} />
                In Summary:
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong>ISO 14001</strong> is a globally recognized standard that provides a structured approach for organizations to manage their environmental responsibilities, leading to <strong>better environmental performance, legal compliance, and a stronger reputation.</strong>
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-12 text-center shadow-xl"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <img 
                  src={imgISO14001Logo} 
                  alt="ISO 14001 Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for ISO 14001 Certification?
              </h3>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Contact DIMA Certification to begin your journey toward environmental management excellence. Our experienced auditors will guide you through the entire certification process.
              </p>
              <button
                onClick={togglePanel}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
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