import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import LiquidEther from './LiquidEther';
import CountUp from './CountUp';
// Fallback hero image
const defaultHero = '/assets/db0b98702172835847b9489f50e24d27018ab779.png';
import { useQuotation } from '../QuotationContext';

interface HeroProps {
  onGetQuotation?: () => void;
  onViewProgrammes?: () => void;
}

export function Hero({ onGetQuotation, onViewProgrammes }: HeroProps) {
  const [imgHero, setImgHero] = useState(defaultHero);
  const navigate = useNavigate();
  const { togglePanel } = useQuotation();

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
    >
      {/* Mesh Gradient Overlay */}
      <div className="mesh-gradient absolute inset-0 opacity-40" />

      {/* Liquid Ether Background - optimized for performance */}
      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        resolution={0.2}
        mouseForce={15}
        cursorSize={80}
        isViscous={false}
        iterationsPoisson={8}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.4}
        autoIntensity={1.5}
        autoResumeDelay={3000}
        className="opacity-50 z-[5]"
        style={{ pointerEvents: 'auto' }}
      />
      
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
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={imgHero} 
          alt="Sustainable Solutions" 
          className="w-full h-full object-cover opacity-40"
        />
        {/* Dark overlay gradient - top darker to bottom lighter for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-slate-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-transparent to-slate-950/70"></div>
      </div>

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-24 lg:py-32">
        <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              {['Towards', 'Sustainable', 'Solutions'].map((word, i) => (
                <motion.span
                  key={word}
                  className={`inline-block mr-[0.3em] will-change-[transform,filter,opacity] ${word === 'Sustainable' ? 'text-gradient-gold' : ''}`}
                  initial={{ filter: 'blur(10px)', opacity: 0, y: -50 }}
                  animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Divider Line */}
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500/50 rounded-full mb-6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ transformOrigin: 'left' }}
            />

            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white/75 mb-10 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              Malaysia's trusted certification body providing professional ISO certifications and MSPO schemes
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              {/* Primary Button - Gold with shadow */}
              <motion.button
                onClick={handleGetQuotation}
                className="group relative h-13 min-h-[48px] px-7 bg-gradient-to-r from-[#d4af37] to-amber-500 text-slate-900 font-bold rounded-xl overflow-hidden text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
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
                <span className="relative z-10 flex items-center gap-2 justify-center py-3">
                  Get Quotation
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} aria-hidden="true" />
                </span>
              </motion.button>

              {/* Secondary Button - Glass/Outline */}
              <motion.button
                onClick={handleViewProgrammes}
                className="group relative h-13 min-h-[48px] px-7 bg-transparent text-white font-semibold rounded-xl overflow-hidden text-sm border border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.9)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <span className="relative z-10 flex items-center gap-2 justify-center py-3">
                  View Programmes
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={16} aria-hidden="true" />
                </span>
              </motion.button>
            </motion.div>

            {/* Stats - Glassmorphism Cards with CountUp */}
            <motion.div 
              className="grid grid-cols-2 gap-4 max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {/* Established Card */}
              <motion.div 
                className="rounded-xl py-5 px-5 text-center flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.2)'
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  borderColor: 'rgba(212, 175, 55, 0.3)'
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold mb-0.5 bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] bg-clip-text text-transparent">
                  <CountUp from={2018} to={new Date().getFullYear()} direction="down" duration={2.5} delay={0.8} />
                </div>
                <div className="text-xs text-white/70 font-medium uppercase tracking-wider">
                  Established
                </div>
              </motion.div>

              {/* MSPO Clients Card */}
              <motion.div 
                className="rounded-xl py-5 px-5 text-center flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.2)'
                }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -2,
                  borderColor: 'rgba(212, 175, 55, 0.3)'
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl md:text-3xl font-bold mb-0.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <CountUp to={100} from={0} duration={2.5} delay={1} /><span>+</span>
                </div>
                <div className="text-xs text-white/70 font-medium uppercase tracking-wider">
                  MSPO Clients
                </div>
              </motion.div>
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