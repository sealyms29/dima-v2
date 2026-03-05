import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
// Fallback hero image
const defaultHero = '/assets/db0b98702172835847b9489f50e24d27018ab779.png';
import { useQuotation } from '../QuotationContext';

interface HeroProps {
  onGetQuotation?: () => void;
  onViewProgrammes?: () => void;
}

export function Hero({ onGetQuotation, onViewProgrammes }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [imgHero, setImgHero] = useState(defaultHero);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();

  const offsetX = useTransform(mouseX, [0, 1000], [-20, 20]);
  const offsetY = useTransform(mouseY, [0, 1000], [-20, 20]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch hero image from database
  useEffect(() => {
    fetch('/api/public-gallery.php?section=hero')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setImgHero(data.data[0].file_path);
        }
      })
      .catch(() => { /* keep default */ });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleGetQuotation = () => {
    if (onGetQuotation) {
      onGetQuotation();
    } else {
      togglePanel();
    }
  };

  const handleViewProgrammes = () => {
    if (onViewProgrammes) {
      onViewProgrammes();
    } else {
      navigate('/services');
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      onMouseMove={handleMouseMove}
    >
      {/* Mesh Gradient Overlay */}
      <div className="mesh-gradient absolute inset-0 opacity-40" />
      
      {/* Noise texture for depth */}
      <div className="noise-overlay" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-[#d4af37]/20 rounded-3xl"
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          y: [0, -20, 0, 20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-40 right-1/3 w-20 h-20 border border-white/10 rounded-2xl"
        animate={{ 
          rotate: [360, 270, 180, 90, 0],
          scale: [1, 1.1, 1, 0.9, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/3 left-10 w-16 h-16 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-sm"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{
          y: scrollY * 0.5,
        }}
      >
        <motion.img 
          src={imgHero} 
          alt="Sustainable Solutions" 
          className="w-full h-full object-cover scale-110 opacity-40"
          style={{
            x: offsetX,
            y: offsetY,
          }}
        />
        {/* Dark overlay gradient - top darker to bottom lighter for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-slate-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-transparent to-slate-950/70"></div>
      </motion.div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 100%)'
        }}
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 100%)'
        }}
        animate={{
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-32">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 glass border border-[#d4af37]/30 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(212, 175, 55, 0.5)' }}
          >
            <Sparkles className="text-[#d4af37]" size={16} />
            <span className="text-sm font-semibold text-white/90 tracking-wide">Accredited Certification Body</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-[1.05] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            Towards{' '}
            <span className="text-gradient-gold">
              Sustainable
            </span>
            <br />Solutions
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 leading-relaxed font-light max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            Malaysia's trusted certification body providing professional ISO certifications and MSPO schemes
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            {/* Primary Button - Gold with shadow */}
            <motion.button
              onClick={handleGetQuotation}
              className="group relative h-14 px-8 bg-gradient-to-r from-[#d4af37] to-amber-500 text-slate-900 font-bold rounded-xl overflow-hidden text-base"
              style={{
                boxShadow: '0 4px 20px -4px rgba(212, 175, 55, 0.4), 0 8px 32px -8px rgba(212, 175, 55, 0.3)'
              }}
              whileHover={{ 
                scale: 1.02, 
                boxShadow: '0 8px 32px -4px rgba(212, 175, 55, 0.5), 0 16px 48px -8px rgba(212, 175, 55, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Get Quotation
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
              </span>
            </motion.button>

            {/* Secondary Button - Glass/Outline */}
            <motion.button
              onClick={handleViewProgrammes}
              className="group relative h-14 px-8 bg-transparent text-white font-semibold rounded-xl overflow-hidden text-base border border-white/80"
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 1)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                View Programmes
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
              </span>
            </motion.button>
          </motion.div>

          {/* Stats - Glassmorphism Cards */}
          <motion.div 
            className="grid grid-cols-2 gap-5 mt-16 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { label: 'Established', value: '2018' },
              { label: 'Certifications', value: '100+' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="rounded-2xl py-6 px-6 text-center flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -3,
                  boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/90 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-xs text-white/40 uppercase tracking-widest font-medium">Scroll</span>
        <motion.div 
          className="w-6 h-10 border-2 border-white/20 rounded-full p-1 glass"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-gradient-to-b from-[#d4af37] to-amber-500 rounded-full mx-auto"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}