import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import svgPaths from "../../imports/svg-dcugllt9hp";
// Figma assets removed - use actual image files
const imgMSPOLogo = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';



function MSPOLogoIcon() {
  return (
    <div className="relative w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgMSPOLogo} 
        alt="MSPO Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function ISO9001LogoIcon() {
  return (
    <div className="relative w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgISO9001Logo} 
        alt="ISO 9001 Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function ISO14001LogoIcon() {
  return (
    <div className="relative w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgISO14001Logo} 
        alt="ISO 14001 Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function ISO45001LogoIcon() {
  return (
    <div className="relative w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgISO45001Logo} 
        alt="ISO 45001 Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function ServicesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const services = [
    {
      icon: <MSPOLogoIcon />,
      title: "MSPO Standard",
      subtitle: "Malaysian Sustainable Palm Oil",
      description: "Certification for sustainable palm oil production, ensuring environmental compliance and supply chain traceability for the Malaysian palm oil industry.",
      gradient: "from-green-400 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      path: "/services/mspo"
    },
    {
      icon: <ISO9001LogoIcon />,
      title: "ISO 9001",
      subtitle: "Quality Management System",
      description: "Enhance your organization's quality processes, improve customer satisfaction, and achieve global recognition through standardized quality management.",
      gradient: "from-purple-400 to-purple-600",
      bgColor: "from-purple-50 to-violet-50",
      path: "/services/iso-9001"
    },
    {
      icon: <ISO14001LogoIcon />,
      title: "ISO 14001",
      subtitle: "Environmental Management System",
      description: "Demonstrate environmental commitment, reduce your ecological footprint, and ensure compliance with environmental regulations and sustainability goals.",
      gradient: "from-blue-400 to-blue-600",
      bgColor: "from-blue-50 to-cyan-50",
      path: "/services/iso-14001"
    },
    {
      icon: <ISO45001LogoIcon />,
      title: "ISO 45001",
      subtitle: "Occupational Health and Safety",
      description: "Create a safer workplace by managing health and safety risks, protecting employees, and building a strong safety culture in your organization.",
      gradient: "from-red-400 to-red-600",
      bgColor: "from-red-50 to-orange-50",
      path: "/services/iso-45001"
    }
  ];

  return (
    <PageLayout>
      <PageHero
        badge="Audit Programmes"
        title="Certification Programmes"
        subtitle="Comprehensive audit and certification solutions tailored to your industry needs"
      />

      {/* Services Grid */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden" ref={ref}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Interactive Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient Glow */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-br ${service.gradient} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  animate={hoveredCard === index ? { scale: 1.05 } : { scale: 1 }}
                />

                {/* Card */}
                <motion.div
                  className={`relative bg-gradient-to-br ${service.bgColor} border-2 border-slate-200/50 rounded-[2rem] p-8 lg:p-10 overflow-hidden`}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    className="absolute top-0 right-0 w-64 h-64 opacity-5"
                    animate={hoveredCard === index ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${service.gradient} rounded-full blur-3xl`} />
                  </motion.div>

                  {/* Logo Icon with Parallax */}
                  <motion.div
                    className="relative z-10 mb-6"
                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {service.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Title */}
                    <motion.h3
                      className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2"
                      animate={hoveredCard === index ? { x: 4 } : { x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.title}
                    </motion.h3>

                    {/* Subtitle */}
                    <motion.p
                      className="text-base lg:text-lg font-semibold mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${service.gradient.includes('green') ? '#10b981' : service.gradient.includes('purple') ? '#a855f7' : service.gradient.includes('blue') ? '#3b82f6' : '#ef4444'}, #d4af37)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {service.subtitle}
                    </motion.p>

                    {/* Description */}
                    <motion.p
                      className="text-slate-700 text-base lg:text-lg leading-relaxed mb-6"
                      animate={hoveredCard === index ? { opacity: 1 } : { opacity: 0.8 }}
                    >
                      {service.description}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => navigate(service.path)}
                      className={`group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button Shine Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10">Get Certified</span>
                      <motion.div
                        animate={hoveredCard === index ? { x: 4 } : { x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight size={20} className="relative z-10" />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* Decorative Corner Elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ borderColor: service.gradient.includes('green') ? '#10b981' : service.gradient.includes('purple') ? '#a855f7' : service.gradient.includes('blue') ? '#3b82f6' : '#ef4444' }}
                    animate={hoveredCard === index ? { scale: 1.1 } : { scale: 1 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 opacity-0 group-hover:opacity-20 transition-opacity"
                    style={{ borderColor: service.gradient.includes('green') ? '#10b981' : service.gradient.includes('purple') ? '#a855f7' : service.gradient.includes('blue') ? '#3b82f6' : '#ef4444' }}
                    animate={hoveredCard === index ? { scale: 1.1 } : { scale: 1 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
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
              Need Help Choosing the Right Certification?
            </h3>
            <p className="text-xl text-white/80 mb-8">
              Our team of experts is ready to guide you through the certification process
            </p>
            <motion.button
              onClick={() => navigate('/contact')}
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