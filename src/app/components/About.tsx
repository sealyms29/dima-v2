import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Award, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import BlurText from './BlurText';
// Figma assets removed - use actual image files
const imgTeamPhoto = '/assets/96ff7a0755cc20b25bbf7b4dd3c95cef7add2941.png';
const imgOffice1 = '/assets/c5cb03644bd86d72dab99e848ae8f9b1512ef00d.png';
const imgOffice2 = '/assets/f803cd79b767f951e7f7ac21c263a4aa722e6bee.png';
const imgMSPO = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgAccreditation = '/assets/d592e4a60fc48dd30356faa8a70601227c755ba1.png';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="about" className="relative py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-b from-white to-slate-50" ref={ref}>
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-[#d4af37] bg-amber-50 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            About DIMA
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Who We Are
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Your trusted partner in quality certification and sustainable practices
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 md:mb-20">
          {/* Left: Image Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-4 md:gap-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Large Image */}
            <motion.div 
              className="col-span-2 relative overflow-hidden rounded-2xl md:rounded-3xl group h-64 md:h-80"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src={imgTeamPhoto} 
                alt="Team Photo" 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full">
                  <Award className="text-[#d4af37]" size={16} />
                  <span className="text-xs md:text-sm font-semibold text-white">Our Professional Team</span>
                </div>
              </div>
            </motion.div>
            
            {/* Small Images */}
            {[imgOffice1, imgOffice2].map((img, index) => (
              <motion.div 
                key={index}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl group h-48 md:h-64"
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src={img} 
                  alt={`Office ${index + 1}`} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 to-[#d4af37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Company Info */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Est. 2018 Card */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl md:rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-gradient-to-br from-[#d4af37]/90 to-amber-500/90 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg">
                <div className="flex items-center gap-4 md:gap-6">
                  <motion.div 
                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    2018
                  </motion.div>
                  <div className="h-12 md:h-16 w-1 bg-white/30 rounded-full flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                      Established
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
                      Based in Sarawak,<br />Malaysia
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Text Card */}
            <motion.div 
              className="relative group"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl md:rounded-3xl blur opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative backdrop-blur-xl bg-white/80 border border-slate-200 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl">
                <div className="space-y-4 md:space-y-5 text-slate-700 text-sm md:text-base leading-relaxed">
                  <p>
                    <strong className="text-slate-900 font-semibold">DIMA Certification Sdn Bhd</strong> is a local certification body based in Sarawak, Malaysia. Incorporated in November 2018, we provide professional ISO certifications and MSPO schemes.
                  </p>
                  <p>
                    Our experienced team of management professionals, technical experts, and competent auditors has certified numerous organizations across the palm oil industry.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission & Slogan Section */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 via-amber-500/10 to-[#d4af37]/20 rounded-2xl md:rounded-[2rem] blur-2xl" />
            
            <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-2xl">
              <div className="text-center mb-10 md:mb-12">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 mb-4 md:mb-6 text-sm font-semibold text-[#d4af37] bg-amber-50 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Sparkles size={16} />
                  Our Slogan
                </motion.div>
                <BlurText
                  text='"Towards Sustainable Solution"'
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-6 md:mb-8 italic justify-center"
                />
              </div>

              <motion.div 
                className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                  We're committed to quality, approachability, and affordability—providing exceptional value to exceed our clients' expectations.
                </p>
              </motion.div>

              {/* Key Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {[
                  { label: "Quality", desc: "Excellence in every certification" },
                  { label: "Approachable", desc: "Professional & friendly service" },
                  { label: "Affordable", desc: "Competitive pricing" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-5 md:p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl md:rounded-2xl border border-slate-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-xl md:text-2xl font-bold text-[#d4af37] mb-2">{item.label}</div>
                    <div className="text-xs md:text-sm text-slate-600">{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tax Deduction Info */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-2xl md:rounded-[2rem] blur-xl" />
            
            <div className="relative backdrop-blur-sm bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-8 md:p-10 lg:p-12 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8">
                <motion.div
                  className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle className="text-white" size={24} />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                    Tax Benefits for Companies
                  </h3>
                  <p className="text-sm md:text-base text-slate-600">Income Tax Act 1967 - Paragraph 34(6)(ma)</p>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4 text-slate-700 text-sm md:text-base leading-relaxed bg-white/50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-200">
                <p>
                  <strong className="text-slate-900">Under paragraph 34(6)(ma), Income Tax Act 1967</strong>, companies can claim double deduction for expenses incurred in obtaining certification from accredited bodies.
                </p>
                <p>
                  Companies must maintain copies of accredited certificates and payment receipts from Standards Malaysia accredited certification bodies.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Accreditation Section */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Accredited & Certified
          </h3>
          <p className="text-base md:text-lg text-slate-600 mb-10 md:mb-12 max-w-2xl mx-auto">
            Recognized by leading national and international certification bodies
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-24">
            {[imgMSPO, imgAccreditation].map((img, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg group-hover:shadow-2xl transition-shadow">
                  <img 
                    src={img} 
                    alt={index === 0 ? "MSPO Certification" : "Accreditation Body"} 
                    className="h-24 md:h-32 lg:h-40 w-auto object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Soft CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="inline-flex flex-col items-center gap-4 px-8 md:px-10 py-6 md:py-8 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all">
            <div className="text-center">
              <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                Want to know more about our journey?
              </h4>
              <p className="text-sm md:text-base text-slate-600 mb-4">
                Discover our mission, values, and commitment to sustainable solutions
              </p>
            </div>
            <motion.button
              onClick={() => {
                const element = document.getElementById('programmes');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm md:text-base">Explore Our Programmes</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
