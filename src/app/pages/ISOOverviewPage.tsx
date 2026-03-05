import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import { useQuotation } from '../QuotationContext';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { 
  ArrowRight, 
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
// Figma assets removed - use actual image files
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';

export function ISOOverviewPage() {
  const ref = useRef(null);
  const resourcesRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isResourcesInView = useInView(resourcesRef, { once: true, amount: 0.1 });
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();

  const standards = [
    {
      code: 'ISO 9001',
      title: 'Quality Management Systems (QMS)',
      description: 'Establish consistent quality processes to meet customer requirements and enhance satisfaction through continuous improvement.',
      logo: imgISO9001Logo,
      gradient: 'from-blue-500 to-blue-600',
      path: '/services/iso-9001'
    },
    {
      code: 'ISO 14001',
      title: 'Environmental Management Systems (EMS)',
      description: 'Demonstrate environmental responsibility by managing environmental impacts and meeting compliance obligations.',
      logo: imgISO14001Logo,
      gradient: 'from-green-500 to-emerald-600',
      path: '/services/iso-14001'
    },
    {
      code: 'ISO 45001',
      title: 'Occupational Health & Safety Management Systems (OHSMS)',
      description: 'Protect workers and visitors by proactively managing workplace health and safety risks.',
      logo: imgISO45001Logo,
      gradient: 'from-orange-500 to-amber-600',
      path: '/services/iso-45001'
    }
  ];

  return (
    <PageLayout>
      <PageHero
        badge="ISO Certification"
        title="International Organization for Standardization (ISO)"
        subtitle="Internationally recognized management system certifications to enhance operational excellence"
      />

      <section className="relative py-20 md:py-28 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              ISO Management System Certifications
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              DIMA Certification is an accredited certification body authorized to audit and certify organizations against internationally recognized ISO management system standards.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our ISO certification services help organizations establish robust management systems, improve operational efficiency, ensure regulatory compliance, and demonstrate commitment to quality, environmental stewardship, and workplace safety.
            </p>
          </motion.div>

          {/* Standards Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {standards.map((standard, index) => (
              <motion.div
                key={standard.code}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-8 h-full flex flex-col shadow-lg group-hover:shadow-2xl group-hover:border-[#d4af37] transition-all">
                  {/* Logo */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${standard.gradient} rounded-2xl flex items-center justify-center mb-6 p-3`}>
                    <img 
                      src={standard.logo} 
                      alt={`${standard.code} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {standard.code}
                  </h3>
                  <h4 className="text-lg font-semibold text-slate-700 mb-4">
                    {standard.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                    {standard.description}
                  </p>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => navigate(standard.path)}
                    className="w-full px-6 py-3 bg-slate-100 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-amber-500 text-slate-900 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Request Certification CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-12 text-center"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Get ISO Certified?
            </h3>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Contact DIMA Certification to begin your ISO certification journey. Our experienced auditors will guide you through the entire process.
            </p>
            <button
              onClick={togglePanel}
              className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all inline-flex items-center gap-3"
            >
              <span>Request Quotation</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ISO Resources Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 to-white" ref={resourcesRef}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isResourcesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              ISO Procedures & Resources
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Access detailed information about our audit process and formal complaint & appeal procedures
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* DMC ISO Audit Process Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isResourcesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              onClick={() => navigate('/iso-audit-process')}
              className="group cursor-pointer relative overflow-hidden"
            >
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 md:p-10 h-full flex flex-col group-hover:border-[#d4af37] group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#d4af37] to-amber-500 opacity-[0.07] rounded-bl-[80px] group-hover:opacity-[0.12] transition-opacity" />

                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <ClipboardCheck className="text-white" size={30} />
                </div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  DMC ISO Audit Process
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  A comprehensive step-by-step guide through the entire ISO certification lifecycle — from pre-certification activities and initial audits to surveillance and recertification within the three-year certification cycle.
                </p>

                {/* Key highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Pre-Certification', 'Stage 1 & 2 Audits', 'Surveillance', 'Recertification'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#d4af37] font-bold group-hover:gap-3 transition-all">
                  <span>View Full Audit Process</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* ISO Complaints & Appeals Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isResourcesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              onClick={() => navigate('/iso-complaints-appeals')}
              className="group cursor-pointer relative overflow-hidden"
            >
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 md:p-10 h-full flex flex-col group-hover:border-slate-800 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-900 opacity-[0.07] rounded-bl-[80px] group-hover:opacity-[0.12] transition-opacity" />

                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <AlertTriangle className="text-[#d4af37]" size={30} />
                </div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  ISO Complaints & Appeals
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  Formal procedures for filing and resolving complaints and appeals under ISO certification schemes — including complaint types, investigation procedures, and the appeals committee process.
                </p>

                {/* Key highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['General Complaints', 'Certified Client', 'Top Management', 'Appeals'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-slate-800 font-bold group-hover:gap-3 transition-all">
                  <span>View Complaints & Appeals</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>
    </PageLayout>
  );
}
