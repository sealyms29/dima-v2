import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { Award, Users, TrendingUp, Sparkles, Target, Eye } from 'lucide-react';
// Figma assets removed - use actual image files
const imgTeamPhoto = '/assets/96ff7a0755cc20b25bbf7b4dd3c95cef7add2941.png';
const imgOffice1 = '/assets/c5cb03644bd86d72dab99e848ae8f9b1512ef00d.png';
const imgOffice2 = '/assets/f803cd79b767f951e7f7ac21c263a4aa722e6bee.png';

export function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <PageLayout>
      <PageHero
        badge="About DIMA Certification"
        title="Your Trusted Certification Partner"
        subtitle="Leading the way in quality certification and sustainable practices across Malaysia"
      />

      {/* Company Overview */}
      <section className="relative py-20 md:py-28 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            {/* Image Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="col-span-2 relative overflow-hidden rounded-3xl h-80"
                whileHover={{ scale: 1.02 }}
              >
                <img src={imgTeamPhoto} alt="Team" className="w-full h-full object-cover" />
              </motion.div>
              {[imgOffice1, imgOffice2].map((img, i) => (
                <motion.div 
                  key={i}
                  className="relative overflow-hidden rounded-3xl h-64"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={img} alt={`Office ${i + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-[#d4af37] bg-amber-50 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
              >
                Established 2018
              </motion.span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                DIMA Certification Sdn Bhd
              </h2>
              
              <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
                <p>
                  <strong className="text-slate-900">DIMA Certification Sdn Bhd</strong> (DMC) is a local-based certification body in Malaysia, specifically in the state of Sarawak. Our company is Bumiputera wholly owned and was incorporated in November 2018.
                </p>
                <p>
                  DMC is managed by an experienced team of management professionals, technical experts, and competent auditors. Since our establishment, we have certified numerous organizations across the palm oil industry, and our client base continues to grow at a steady pace.
                </p>
                <p>
                  Based in Kuching, Sarawak, we provide professional ISO certifications and MSPO schemes to corporate clients, plantations, and SMEs across Malaysia.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {[
              {
                icon: Target,
                title: "Our Mission",
                content: "To provide professional, approachable, and reliable certification services that add genuine value to organizations at competitive prices without compromising on excellence.",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Eye,
                title: "Our Vision",
                content: "To be the leading certification body in Malaysia, recognized for our commitment to quality, sustainability, and exceptional client service.",
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity`} />
                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-lg group-hover:shadow-2xl transition-shadow">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="text-white" size={28} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{item.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Our Slogan */}
          <motion.div
            className="relative mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/20 via-amber-500/10 to-[#d4af37]/20 rounded-[2rem] blur-2xl" />
            
            <div className="relative bg-white border border-slate-200 rounded-[2rem] p-10 md:p-16 shadow-2xl text-center">
              <Sparkles className="text-[#d4af37] mx-auto mb-6" size={40} />
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 italic">
                "Towards Sustainable Solution"
              </h3>
              <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-12">
                Through our commitment to quality, approachability, and affordability, we aim to exceed our clients' expectations.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Quality", desc: "Excellence in every certification" },
                  { label: "Approachable", desc: "Professional & friendly service" },
                  { label: "Affordable", desc: "Competitive pricing" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="text-2xl font-bold text-[#d4af37] mb-2">{item.label}</div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Strengths */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Strengths</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              What sets DIMA apart as your certification partner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: TrendingUp, 
                title: "Growing Client Base", 
                desc: "Steadily increasing certifications across palm oil and other industries",
                gradient: "from-blue-500 to-blue-600"
              },
              { 
                icon: Users, 
                title: "Skilled Team", 
                desc: "Experienced management professionals and expert auditors",
                gradient: "from-green-500 to-emerald-600"
              },
              { 
                icon: Award, 
                title: "Strong Foundation", 
                desc: "Solid financial backing and resources ensuring stability",
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="text-white" size={32} />
                </motion.div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}