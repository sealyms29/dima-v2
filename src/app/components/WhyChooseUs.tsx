import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Award, Users, Shield, Clock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  color: string;
}

function FeatureCard({ icon, title, description, index, color }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -10 }}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Card */}
      <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-lg group-hover:shadow-2xl transition-all duration-500 h-full">
        {/* Icon Container */}
        <motion.div 
          className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
          whileHover={{ 
            rotate: 360,
            scale: 1.1
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>
        
        {/* Content */}
        <motion.h3 
          className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-[#d4af37] transition-colors"
        >
          {title}
        </motion.h3>
        
        <p className="text-slate-600 leading-relaxed text-base lg:text-lg">
          {description}
        </p>

        {/* Number Badge */}
        <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-2xl font-bold text-slate-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} rounded-b-3xl`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <Award size={32} />,
      title: "Accredited Excellence",
      description: "Fully accredited certification body recognized by national and international standards organizations.",
      color: "from-amber-400 to-orange-500"
    },
    {
      icon: <Users size={32} />,
      title: "Expert Team",
      description: "Skilled professionals, technical experts, and competent auditors with years of industry experience.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Shield size={32} />,
      title: "Trusted Partner",
      description: "Professional and approachable services, committed to your organization's quality and compliance.",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: <Clock size={32} />,
      title: "Efficient Process",
      description: "Streamlined certification process with competitive pricing and timely delivery of results.",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white to-slate-50" ref={ref}>
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.05),transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
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
            Why Choose DIMA
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Your Certification Partner
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Delivering quality and professionalism in every engagement
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl shadow-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to get certified?
              </h3>
              <p className="text-slate-300">
                Let's discuss your certification needs
              </p>
            </div>
            <motion.button
              onClick={() => {
                const element = document.getElementById('quotation');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-semibold rounded-2xl shadow-xl overflow-hidden whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Get Started</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
