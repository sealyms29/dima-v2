import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Sparkles } from 'lucide-react';
// Figma asset removed - use actual image file
const imgHero = '/assets/db0b98702172835847b9489f50e24d27018ab779.png';
import { useQuotation } from '../QuotationContext';

interface HeroProps {
  onGetQuotation?: () => void;
  onViewProgrammes?: () => void;
}

export function Hero({ onGetQuotation, onViewProgrammes }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
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
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
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
          className="w-full h-full object-cover scale-110 opacity-30"
          style={{
            x: offsetX,
            y: offsetY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90"></div>
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
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="text-[#d4af37]" size={16} />
            <span className="text-sm font-medium text-white/90">Accredited Certification Body</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            Towards{' '}
            <span className="bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 bg-clip-text text-transparent">
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
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleGetQuotation}
              className="group relative px-8 py-5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-semibold rounded-2xl shadow-2xl shadow-[#d4af37]/20 overflow-hidden text-lg"
              whileHover={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Get Quotation
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={handleViewProgrammes}
              className="group relative px-8 py-5 backdrop-blur-sm border-2 text-white font-semibold rounded-2xl shadow-xl overflow-hidden text-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
              whileHover={{ 
                scale: 1.02, 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(212, 175, 55, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                View Programmes
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { label: 'Established', value: '2018' },
              { label: 'Certifications', value: '100+' },
              { label: 'Expert Auditors', value: '25+' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#d4af37] to-amber-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <motion.div 
            className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mx-auto"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}