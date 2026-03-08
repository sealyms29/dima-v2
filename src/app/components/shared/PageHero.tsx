import { motion } from 'motion/react';
import { ReactNode } from 'react';
import BlurText from '../BlurText';
import LiquidEther from '../LiquidEther';

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  logo?: string;
  logoAlt?: string;
  logoCaption?: string;
}

export function PageHero({ badge, title, subtitle, children, logo, logoAlt, logoCaption }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700">
      {/* Mesh Gradient */}
      <div className="mesh-gradient absolute inset-0 opacity-40" />

      {/* Liquid Ether Background */}
      <LiquidEther
        colors={['#0f172a', '#1e40af', '#06b6d4']}
        resolution={0.4}
        mouseForce={15}
        cursorSize={80}
        autoDemo={true}
        autoSpeed={0.3}
        autoIntensity={1.8}
        className="opacity-45 z-[5]"
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 right-16 w-24 h-24 border border-[#d4af37]/20 rounded-2xl"
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          y: [0, -15, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-16 left-16 w-16 h-16 border border-white/10 rounded-xl"
        animate={{ 
          rotate: [360, 270, 180, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
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
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
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
                {logoCaption && (
                  <p className="text-center text-sm text-slate-600 mt-4 font-semibold">{logoCaption}</p>
                )}
              </motion.div>
            </motion.div>
          )}
          
          {/* Title with gradient highlight */}
          <BlurText
            text={title}
            delay={150}
            animateBy="words"
            direction="top"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl mx-auto justify-center"
          />
          
          {/* Subtitle */}
          {subtitle && (
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light"
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