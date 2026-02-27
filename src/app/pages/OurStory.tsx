import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Award, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
// Figma asset removed - use actual image file
const imgDimaLogo = '/assets/1ae5d991da6738c83fb07a529bc85bd58b9805a2.png';

export function OurStory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header with Back Button */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-900 font-semibold hover:text-[#d4af37] rounded-xl hover:bg-slate-100 transition-all"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </motion.button>
            
            <motion.img 
              src={imgDimaLogo} 
              alt="DIMA Logo" 
              className="h-14 lg:h-20 w-auto"
              whileHover={{ scale: 1.05 }}
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-20">
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold text-[#d4af37] bg-amber-50 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles size={16} />
              Our Journey
            </motion.span>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Our Story
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the journey of DIMA Certification and our commitment to excellence
            </motion.p>
          </div>

          {/* Main Content Card */}
          <motion.div 
            className="relative mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-amber-500/5 to-transparent rounded-[2rem] blur-2xl" />
            
            <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-[2rem] p-10 md:p-16 shadow-2xl">
              <div className="space-y-12 text-slate-700 text-lg leading-relaxed">
                {/* Section 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center">
                      <Award className="text-white" size={24} />
                    </div>
                    Established in 2018
                  </h2>
                  <p>
                    <strong className="text-slate-900 font-semibold">DIMA Certification Sdn Bhd</strong> (referred to as DMC) was established in 2018 by a team of experienced professionals who recognized the growing need for quality certification services in Sarawak and across Malaysia. Based in Kuching, Sarawak, DMC serves as a trusted local certification body, providing ISO certifications and other certification schemes, such as the Malaysian Sustainable Palm Oil (MSPO).
                  </p>
                </motion.div>

                {/* Section 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
                  <p>
                    From the very beginning, our mission has been clear: to provide professional, approachable, and reliable certification services that add genuine value to organizations. We believe that quality certification should be accessible to all businesses, from large corporations to small and medium enterprises, at competitive prices without compromising on excellence.
                  </p>
                </motion.div>

                {/* Key Strengths Grid */}
                <motion.div 
                  className="grid md:grid-cols-3 gap-6 my-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  {[
                    { 
                      icon: TrendingUp, 
                      title: "Growing Client Base", 
                      desc: "Steadily increasing certifications in palm oil and beyond",
                      gradient: "from-blue-500 to-blue-600"
                    },
                    { 
                      icon: Users, 
                      title: "Skilled Team", 
                      desc: "Management professionals and expert auditors",
                      gradient: "from-green-500 to-emerald-600"
                    },
                    { 
                      icon: Award, 
                      title: "Strong Resources", 
                      desc: "Solid financial backing ensuring stability",
                      gradient: "from-purple-500 to-purple-600"
                    }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="group relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity`} />
                      
                      <div className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-8 text-center h-full shadow-lg group-hover:shadow-xl transition-shadow">
                        <motion.div 
                          className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <item.icon className="text-white" size={28} />
                        </motion.div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* More Sections */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.7 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Commitment to Excellence</h2>
                  <p>
                    Our team brings together decades of combined experience in auditing, quality management, and industry standards. We understand the unique challenges faced by businesses in Malaysia and Southeast Asia, particularly in the palm oil sector, and we've tailored our services to meet these specific needs.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.9 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Approach</h2>
                  <p>
                    What sets DIMA apart is our commitment to being more than just auditors. We see ourselves as partners in your journey toward quality and sustainability. Our approach is collaborative, transparent, and focused on helping you achieve genuine improvements in your operations, not just compliance on paper.
                  </p>
                </motion.div>

                {/* Quote Section */}
                <motion.div 
                  className="relative my-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 2.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 via-amber-500/10 to-[#d4af37]/20 rounded-3xl blur-xl" />
                  
                  <div className="relative bg-gradient-to-r from-amber-50 via-white to-amber-50 border-l-8 border-[#d4af37] rounded-3xl p-10 md:p-12">
                    <Sparkles className="text-[#d4af37] mb-4" size={32} />
                    <p className="text-2xl md:text-3xl font-semibold text-slate-900 italic leading-relaxed">
                      "At DMC, we pride ourselves on offering professional and approachable services as your partner in quality, providing added value to your organization at competitive prices."
                    </p>
                    <p className="text-right text-slate-600 mt-6 font-semibold">— DIMA Certification Team</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 2.3 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Looking Forward</h2>
                  <p className="mb-4">
                    As we continue to grow, our focus remains on maintaining the highest standards of integrity, professionalism, and service quality. We are constantly investing in our team's development, staying updated with the latest industry standards, and expanding our capabilities to serve our clients better.
                  </p>
                  <p>
                    We invite you to partner with us on your certification journey. Whether you're seeking MSPO certification, ISO standards compliance, or guidance on quality management systems, DIMA Certification is here to support you every step of the way.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <p className="text-2xl font-semibold text-slate-900 mb-8">Ready to start your certification journey?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/#quotation')}
                className="group relative px-8 py-5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2 justify-center text-lg">
                  Get a Quotation
                  <ArrowRight size={20} />
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/')}
                className="group px-8 py-5 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl shadow-lg hover:border-[#d4af37] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2 justify-center text-lg">
                  Return to Homepage
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}