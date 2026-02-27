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
  Shield,
  Heart,
  TrendingUp,
  Users,
  DollarSign,
  Scale,
  Eye,
  Brain,
  Layers,
  UserCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
// Figma assets removed - use actual image files
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';
const imgCertificate = '/assets/99a39943a371b93c2fa3c63a28e4f3aab89d43ae.png';

export function ISO45001Page() {
  const contentRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, amount: 0.05 });
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();

  return (
    <PageLayout>
      <PageHero
        badge="Certification Standard"
        title="ISO 45001 Occupational Health & Safety Management Systems (OHSMS) Standard"
        subtitle="International standard for workplace health and safety excellence"
        logo={imgISO45001Logo}
        logoAlt="ISO 45001 Occupational Health & Safety"
      />

      <section className="relative py-16 md:py-24 bg-white" ref={contentRef}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* ISO 45001 Logo with Dynamic Certificate Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-16 relative"
          >
            {/* Animated Certificate Background */}
            

            {/* Main Logo */}
            <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-orange-200 shadow-xl p-8">
              <motion.img 
                src={imgISO45001Logo} 
                alt="ISO 45001 Occupational Health & Safety" 
                className="w-full max-w-[200px] h-auto mx-auto"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  backgroundColor: 'rgba(251, 146, 60, 0.3)',
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>

          {/* Main Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border-2 border-orange-200 p-8 md:p-10 shadow-sm">
              <p className="text-lg text-slate-800 leading-relaxed">
                <strong className="text-slate-900">ISO 45001</strong> is an international standard for <strong>occupational health and safety (OH&S) management systems</strong> that helps organizations provide a safe and healthy workplace by managing risks and improving performance. Published by the International Organization for Standardization (ISO) in <strong>2018</strong>, it offers a framework for all types of organizations to establish, implement, and maintain an OH&S system, proactively preventing work-related injuries and diseases and promoting worker well-being. The standard's requirements are integrated into an organization's overall business processes and can be integrated with other ISO standards like <strong>ISO 9001</strong> and <strong>ISO 14001</strong>.
              </p>
            </div>
          </motion.div>

          {/* Key Aspects Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              Key Aspects of ISO 45001
            </h2>

            <div className="space-y-6">
              {/* Purpose */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Purpose:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      To prevent work-related injuries and ill health by providing a framework for managing OH&S risks and opportunities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Proactive Approach */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Brain className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Proactive Approach:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      It moves beyond just managing hazards (like its predecessor, OHSAS 18001) to encompass psychosocial risks, such as mental health and wellbeing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Framework */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Layers className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Framework:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      It uses a 10-clause structure, including requirements for an OH&S policy, risk assessment, legal compliance, and continual improvement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Leadership Commitment */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Leadership Commitment:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Requires commitment from top management to establish and maintain an effective OH&S management system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Worker Participation */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <UserCheck className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Worker Participation:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Encourages active participation from workers in the OH&S management system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk-Based Thinking */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Risk-Based Thinking:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Emphasizes risk identification and management to reduce fatal accidents and occupational risks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Integration */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8 hover:border-orange-400 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <Layers className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Integration:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Designed to be compatible and integrated with other major ISO management system standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benefits Section */}
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
              Benefits of ISO 45001
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Reduced Accidents */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Reduced Accidents:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Helps significantly reduce the number of occupational risks and fatal accidents.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Improved Health and Well-being */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Improved Health and Well-being:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Promotes employee health and well-being by providing a safe and healthy work environment.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Productivity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Enhanced Productivity:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      A safe workplace can lead to increased worker productivity.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Legal Compliance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scale className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Legal Compliance:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Ensures compliance with legal and regulatory requirements related to OH&S.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Credibility */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Credibility:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Certification demonstrates a strong commitment to safety and can improve public image and credibility.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Cost Reduction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isContentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-amber-50 to-white border-2 border-[#d4af37] rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Cost Reduction:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Minimizing injuries and illnesses can lead to significant cost savings.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Who Can Use It? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border-2 border-slate-300 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Users className="text-[#d4af37]" size={32} />
                Who Can Use It?
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong>ISO 45001</strong> is a generic standard applicable to <strong>any organization, regardless of its size, type, sector, or industry.</strong>
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-12 text-center shadow-xl"
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <img 
                  src={imgISO45001Logo} 
                  alt="ISO 45001 Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for ISO 45001 Certification?
              </h3>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Contact DIMA Certification to begin your journey toward occupational health and safety excellence. Our experienced auditors will guide you through the entire certification process.
              </p>
              <button
                onClick={togglePanel}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
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