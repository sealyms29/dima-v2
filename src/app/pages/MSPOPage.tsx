import { useInView, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuotation } from '../QuotationContext';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { CheckCircle, Award, FileText, Target, ExternalLink, Download, ChevronRight, AlertCircle, Info, ArrowRight } from 'lucide-react';
// Figma assets removed - use actual image files
const imgMSPOLogo = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgCertificationProcess = '/assets/8b0a42e6244300ecb961c6328ff453830a735dd6.png';

export function MSPOPage() {
  const ref = useRef(null);
  const scopeRef = useRef(null);
  const docsRef = useRef(null);
  const proceduresRef = useRef(null);
  const announcementRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isScopeInView = useInView(scopeRef, { once: true, amount: 0.2 });
  const isDocsInView = useInView(docsRef, { once: true, amount: 0.2 });
  const isProceduresInView = useInView(proceduresRef, { once: true, amount: 0.2 });
  const isAnnouncementInView = useInView(announcementRef, { once: true, amount: 0.2 });
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();
  const [hoveredDoc, setHoveredDoc] = useState<number | null>(null);

  const accreditationScope = [
    "Part 2: MS 2530-2-1",
    "Part 2: MS 2530-2-2",
    "Part 3: MS 2530-3-1",
    "Part 3: MS 2530-3-2",
    "Part 4.1: MS 2530-4-1",
    "Part 4.2: MS 2530-4-2",
    "Part 4.3: MS 2530-4-3"
  ];

  const publicDocuments = [
    {
      title: "MSPO Public Notification",
      description: "View our latest MSPO public notifications and announcements",
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      action: () => navigate('/mspo-public-notification')
    },
    {
      title: "MSPO Public Summary Report",
      description: "Access comprehensive summary reports of MSPO certifications",
      icon: FileText,
      gradient: "from-green-500 to-emerald-600",
      action: () => navigate('/mspo-public-summary-report')
    },
    {
      title: "MSPO Logo Usage",
      description: "Guidelines for proper usage of MSPO certification marks",
      icon: Award,
      gradient: "from-amber-500 to-orange-600",
      action: () => navigate('/mspo-logo-usage')
    }
  ];

  const procedureDocuments = [
    {
      title: "MSPO Certification Process",
      description: "Step-by-step guide through the MSPO certification journey",
      image: imgCertificationProcess,
      gradient: "from-slate-700 to-slate-900",
      action: () => navigate('/mspo-certification-process')
    },
    {
      title: "Procedures on Transfer of MSPO Certification",
      description: "Guidelines for transferring MSPO certification to DIMA",
      gradient: "from-blue-600 to-cyan-700",
      action: () => navigate('/mspo-transfer-procedure')
    },
    {
      title: "Procedures on Complaint (MSPO)",
      description: "How to file and resolve complaints related to MSPO certification",
      gradient: "from-orange-600 to-red-700",
      action: () => navigate('/mspo-complaint-procedure')
    },
    {
      title: "Procedures on Appeal (MSPO)",
      description: "Process for appealing MSPO certification decisions",
      gradient: "from-green-600 to-teal-700",
      action: () => navigate('/mspo-appeal-procedure')
    }
  ];

  return (
    <PageLayout>
      <PageHero
        badge="Certification Standard"
        title="Malaysian Sustainable Palm Oil (MSPO)"
        subtitle="Promoting sustainable practices in palm oil production across Malaysia"
        logo={imgMSPOLogo}
        logoAlt="Malaysian Sustainable Palm Oil"
      />

      {/* Main Content */}
      <section className="relative py-20 md:py-28 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* MSPO Logo & Description */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
                <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-12">
                  <img 
                    src={imgMSPOLogo} 
                    alt="MSPO Logo" 
                    className="w-full max-w-sm h-auto mx-auto"
                  />
                  <p className="text-center text-sm text-slate-600 mt-4 font-semibold">MSPO/4-2-0014</p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span 
                className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-green-700 bg-green-50 rounded-full border border-green-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
              >
                National Certification Scheme
              </motion.span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Malaysian Sustainable Palm Oil
              </h2>
              
              <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-6">
                The <strong>Malaysian Sustainable Palm Oil</strong> (MSPO) Standard is a national certification initiative designed to promote sustainable practices in palm oil production across Malaysia.
              </p>
              
              <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                It ensures that palm oil is produced in an environmentally friendly, socially responsible, and economically viable way by addressing key issues like ecosystem protection, fair labor practices, and adherence to local laws. MSPO certification promotes traceability, transparency, and compliance with sustainability standards, helping Malaysia meet international market demands while reducing environmental impacts and supporting responsible industry growth.
              </p>
            </motion.div>
          </div>

          {/* Accreditation Scope & Public Documents Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* Accreditation Scope */}
            <motion.div
              ref={scopeRef}
              initial={{ opacity: 0, y: 30 }}
              animate={isScopeInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-shadow">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Accreditation Scope</h3>
                <ul className="space-y-3">
                  {accreditationScope.map((scope, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isScopeInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{scope}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Public Documents */}
            <motion.div
              ref={docsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={isDocsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {publicDocuments.map((doc, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isDocsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredDoc(index)}
                  onMouseLeave={() => setHoveredDoc(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${doc.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity`} />
                  
                  <motion.button
                    onClick={doc.action}
                    className={`relative w-full bg-gradient-to-r ${doc.gradient} text-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all text-left`}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <doc.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{doc.title}</h4>
                          <p className="text-white/80 text-sm">{doc.description}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={hoveredDoc === index ? { x: 4 } : { x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={24} />
                      </motion.div>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Procedures & Resources Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 to-white overflow-hidden" ref={proceduresRef}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isProceduresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              MSPO Procedures & Resources
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to know about MSPO certification with DIMA
            </p>
          </motion.div>

          {/* Procedure Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {procedureDocuments.map((doc, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isProceduresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Gradient Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${doc.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity`} />

                {/* Card */}
                <motion.div
                  className="relative bg-white border-2 border-slate-200 rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ y: -8 }}
                  onClick={doc.action}
                >
                  {/* Image or Gradient Header */}
                  {doc.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={doc.image} 
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${doc.gradient} opacity-60`} />
                    </div>
                  ) : (
                    <div className={`h-48 bg-gradient-to-br ${doc.gradient}`} />
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {doc.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      {doc.description}
                    </p>
                    
                    <motion.div
                      className="inline-flex items-center gap-2 text-[#d4af37] font-semibold group-hover:gap-3 transition-all"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={18} />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MSPO 2022 Announcement */}
      <section className="relative py-20 md:py-28 bg-white" ref={announcementRef}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isAnnouncementInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 rounded-[2rem] blur-2xl" />
            
            <div className="relative bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 rounded-[2rem] p-10 md:p-16 shadow-2xl">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 rounded-full mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isAnnouncementInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                <AlertCircle className="text-red-600" size={20} />
                <span className="text-red-700 font-semibold">Important Update</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-6 italic">
                APPLY NOW WITH US!
              </h2>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
                Implementation of MSPO 2022 Standards (MS2530:2022)
              </h3>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left Content */}
                <div className="space-y-6">
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Dear Valued Client,</strong>
                  </p>
                  
                  <p className="text-slate-700 leading-relaxed">
                    In line with the Malaysian Sustainable Palm Oil (MSPO) requirements, we wish to inform you that DIMA Certification Sdn Bhd will fully adopt the MSPO 2022 Standards (MS2530:2022) starting from <strong>1 January 2025</strong>.
                  </p>

                  <p className="text-slate-700 leading-relaxed">
                    We are also pleased to share that DIMA Certification Sdn Bhd has granted a new scope of accreditation from the Department of Standards Malaysia (DSM), effective immediately. This accreditation includes the following updated MSPO Certification Scheme standards:
                  </p>
                </div>

                {/* Right Content - New Standards */}
                <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-slate-900 mb-4">Updated Certification Schemes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                      <span className="text-slate-700">MSPO Certification Scheme Part 3 (MS 2530-3-1:2022 & MS 2530-3-2:2022)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                      <span className="text-slate-700">MSPO Certification Scheme Part 4 (MS 2530-4-1:2022)</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-6 border-t border-amber-200">
                    <p className="text-sm text-slate-600 mb-2">
                      We truly value your continued support and look forward to our ongoing partnership. If you have any questions or require further clarification, please feel free to reach out to us.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={togglePanel}
                className="mt-10 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply for MSPO 2022 Certification
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for MSPO Certification?
            </h3>
            <p className="text-xl text-white/80 mb-8">
              Contact us today to learn how DIMA can guide your organization through the MSPO certification process
            </p>
            <motion.button
              onClick={togglePanel}
              className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}