import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  logo?: string;
  logoAlt?: string;
}

export function PageHero({ badge, title, subtitle, children, logo, logoAlt }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-[#d4af37]/15 via-amber-500/8 to-transparent rounded-full blur-3xl" />
      </motion.div>
      
      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          {/* Badge */}
          {badge && (
            null
          )}
          
          {/* Certificate/Document Preview Card */}
          {logo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex justify-center mb-12"
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src={logo} 
                  alt={logoAlt || 'Certification Document'} 
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            </motion.div>
          )}
          
          {/* Title */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: logo ? 0.2 : 0.1 }}
          >
            {title}
          </motion.h1>
          
          {/* Subtitle */}
          {subtitle && (
            <motion.p 
              className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: logo ? 0.3 : 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
          
          {/* Children */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}