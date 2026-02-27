import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import svgPaths from "@/imports/svg-dcugllt9hp";
// Figma assets removed - use actual image files
const imgMSPOLogo = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';

function MSPOLogoIcon() {
  return (
    <div className="relative w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgMSPOLogo} 
        alt="MSPO Logo" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

function ISO9001LogoIcon() {
  return (
    <div className="relative w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgISO9001Logo} 
        alt="ISO 9001 Logo" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

function ISO14001LogoIcon() {
  return (
    <div className="relative w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgISO14001Logo} 
        alt="ISO 14001 Logo" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

function ISO45001LogoIcon() {
  return (
    <div className="relative w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-3 border border-slate-200">
      <img 
        src={imgISO45001Logo} 
        alt="ISO 45001 Logo" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

function GlobeIcon() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl"></div>
      <svg className="absolute inset-[8px] w-12 h-12" fill="none" preserveAspectRatio="none" viewBox="0 0 53.8577 53.1238">
        <path d={svgPaths.p2432e000} fill="url(#paint0_radial_globe)" />
        <path d={svgPaths.p3f85c100} fill="#7ADD8A" />
        <defs>
          <radialGradient id="paint0_radial_globe" cx="0" cy="0" gradientTransform="matrix(25.3419 31.5913 -23.5517 18.894 18.1913 10.9443)" gradientUnits="userSpaceOnUse" r="1">
            <stop offset="0.506" stopColor="#17A1F3" />
            <stop offset="0.767" stopColor="#1B7FFA" />
            <stop offset="0.962" stopColor="#1366F0" />
            <stop offset="1" stopColor="#1160EE" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function SettingsIcon() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl"></div>
      <svg className="absolute inset-[8px] w-12 h-12" fill="none" preserveAspectRatio="none" viewBox="0 0 44.7541 46.6643">
        <path d={svgPaths.p26a7600} fill="url(#paint0_linear_settings)" />
        <defs>
          <linearGradient id="paint0_linear_settings" gradientUnits="userSpaceOnUse" x1="33.5628" x2="7.47377" y1="44.8583" y2="4.207">
            <stop stopColor="#70777D" />
            <stop offset="1" stopColor="#B9C0C7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function ShieldIcon() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl"></div>
      <svg className="absolute inset-[8px] w-12 h-12" fill="none" preserveAspectRatio="none" viewBox="0 0 38 47.5">
        <path d={svgPaths.p5261440} fill="#0D99FF" />
      </svg>
    </div>
  );
}

interface ProgrammeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  gradient: string;
}

function ProgrammeCard({ icon, title, description, index, gradient }: ProgrammeCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div 
      ref={ref}
      className="group relative h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
      
      {/* Card */}
      <div className="relative h-full backdrop-blur-sm bg-white border border-slate-200 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] opacity-50" />
        
        {/* Icon */}
        <motion.div 
          className="mb-6 relative z-10"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-[#d4af37] transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6 text-base lg:text-lg">
            {description}
          </p>
          
          {/* CTA */}
          <motion.button 
            className="group/btn inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-[#d4af37] transition-colors"
            whileHover={{ x: 5 }}
          >
            Learn More
            <ArrowUpRight className="group-hover/btn:rotate-45 transition-transform" size={20} />
          </motion.button>
        </div>

        {/* Hover Line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export function AuditProgrammes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const programmes = [
    {
      icon: <MSPOLogoIcon />,
      title: "MSPO Standard",
      description: "Malaysian Sustainable Palm Oil certification ensuring sustainable practices in palm oil production and supply chain management.",
      gradient: "from-green-400 to-emerald-600"
    },
    {
      icon: <ISO9001LogoIcon />,
      title: "QMS Standard",
      description: "Quality Management System (ISO 9001) certification to enhance your organization's quality processes and customer satisfaction.",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: <ISO14001LogoIcon />,
      title: "EMS Standard",
      description: "Environmental Management System (ISO 14001) certification to improve environmental performance and regulatory compliance.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: <ISO45001LogoIcon />,
      title: "OHSMS Standard",
      description: "Occupational Health & Safety Management System (ISO 45001) certification to ensure workplace safety and reduce risks.",
      gradient: "from-cyan-400 to-cyan-600"
    }
  ];

  return (
    <section id="programmes" className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-slate-50 to-white" ref={ref}>
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.05),transparent_50%)]" />
      
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
            Our Services
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Certification Programmes
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive standards tailored to your industry needs
          </p>
        </motion.div>

        {/* Programmes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {programmes.map((programme, index) => (
            <ProgrammeCard
              key={index}
              index={index}
              icon={programme.icon}
              title={programme.title}
              description={programme.description}
              gradient={programme.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}