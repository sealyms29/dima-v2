import { PageLayout } from '../components/shared/PageLayout';
import { Hero } from '../components/Hero';
import { QuotationCTA } from '../components/QuotationCTA';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar, Play, Pause } from 'lucide-react';
// Static assets for company overview & accreditation (not admin-managed)
const imgTeamPhoto = '/assets/96ff7a0755cc20b25bbf7b4dd3c95cef7add2941.png';
const imgOffice1 = '/assets/c5cb03644bd86d72dab99e848ae8f9b1512ef00d.png';
const imgOffice2 = '/assets/f803cd79b767f951e7f7ac21c263a4aa722e6bee.png';
const imgMSPO = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgAccreditation = '/assets/d592e4a60fc48dd30356faa8a70601227c755ba1.png';
const imgAuditVisit = '/assets/75de96ee0834675ede75a8ff86e49d03c12883ed.png';

// Fallback gallery if no images uploaded yet
const fallbackGallery = [
  { src: imgAuditVisit, alt: "DIMA Audit Visit Team" },
  { src: imgTeamPhoto, alt: "Professional Team Meeting" },
  { src: imgOffice1, alt: "Audit Site Inspection" },
  { src: imgOffice2, alt: "Client Consultation" },
  { src: imgAuditVisit, alt: "Documentation Review" },
  { src: imgTeamPhoto, alt: "Team Collaboration" }
];

interface GalleryImage {
  src: string;
  alt: string;
}

export function HomePage() {
  const ref = useRef(null);
  const galleryRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isGalleryInView = useInView(galleryRef, { once: true, amount: 0.2 });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(fallbackGallery);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlaying || galleryImages.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, galleryImages.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Fetch gallery images from database
  useEffect(() => {
    fetch('/api/public-gallery.php?section=gallery')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setGalleryImages(data.data.map((img: any) => ({
            src: img.file_path,
            alt: img.alt_text || img.title || 'Gallery image'
          })));
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev! + 1));
  };

  return (
    <PageLayout>
      <Hero />
      
      {/* Company Overview Section */}
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
              {/* Enhanced Established Badge */}
              <motion.div
                className="relative inline-flex items-center gap-3 mb-6 group"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                
                {/* Main Badge */}
                <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-full shadow-lg">
                  {/* Sparkle Icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="text-white" size={18} />
                  </motion.div>
                  
                  {/* Text */}
                  <div className="flex items-center gap-2">
                    <Calendar className="text-white" size={16} />
                    <span className="text-white font-bold text-base tracking-wide">
                      Established 2018
                    </span>
                  </div>
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                {/* Years Badge */}
                <motion.div
                  className="relative px-4 py-2 bg-white border-2 border-[#d4af37] rounded-full shadow-md"
                  animate={{
                    y: [0, -3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-[#d4af37] font-bold text-sm">
                    7+ Years
                  </span>
                </motion.div>
              </motion.div>
              
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

          {/* Accreditation Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
              Accredited & Certified
            </h3>
            <p className="text-base md:text-lg text-slate-600 mb-10 md:mb-12 max-w-2xl mx-auto">
              Recognized by leading national and international certification bodies
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-24">
              {[imgMSPO, imgAccreditation].map((img, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg group-hover:shadow-2xl transition-shadow">
                    <img 
                      src={img} 
                      alt={index === 0 ? "MSPO Certification" : "Accreditation Body"} 
                      className="h-24 md:h-32 lg:h-40 w-auto object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Slideshow Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden" ref={galleryRef}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2 mb-6 rounded-full"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isGalleryInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="text-[#d4af37]" size={16} />
              <span className="text-[#d4af37] font-semibold text-sm">Gallery</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              DIMA Audit Visit For MSPO
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Witness our professional audit team in action during MSPO certification visits
            </p>
          </motion.div>

          {/* Main Slideshow */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Image Container */}
            <div 
              className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={currentSlide}
                  src={galleryImages[currentSlide]?.src}
                  alt={galleryImages[currentSlide]?.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ 
                    opacity: 0,
                    x: direction > 0 ? 100 : -100,
                    scale: 1.1
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0,
                    x: direction > 0 ? -100 : 100,
                    scale: 0.95
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </AnimatePresence>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-slate-900/50" />

              {/* Image Caption */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {galleryImages[currentSlide]?.alt}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {currentSlide + 1} / {galleryImages.length}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <motion.button
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center z-10"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
              >
                <ChevronLeft className="text-white" size={24} />
              </motion.button>
              <motion.button
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center z-10"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
              >
                <ChevronRight className="text-white" size={24} />
              </motion.button>

              {/* Play/Pause Button */}
              <motion.button
                className="absolute top-4 md:top-6 right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? (
                  <Pause className="text-white" size={18} />
                ) : (
                  <Play className="text-white ml-0.5" size={18} />
                )}
              </motion.button>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              {galleryImages.map((image, index) => (
                <motion.button
                  key={index}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all ${
                    index === currentSlide ? 'ring-2 ring-[#d4af37] ring-offset-2 ring-offset-slate-900' : 'opacity-50 hover:opacity-80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToSlide(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {index === currentSlide && (
                    <motion.div
                      className="absolute inset-0 bg-[#d4af37]/20"
                      layoutId="activeThumb"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Progress Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {galleryImages.map((_, index) => (
                <motion.button
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-[#d4af37]' 
                      : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </motion.div>

          {/* Expand Button */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={isGalleryInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                borderColor: 'rgba(212, 175, 55, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedImage(currentSlide)}
            >
              <span>View Full Gallery</span>
              <ChevronRight size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => prev === null ? null : (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
            >
              <ChevronLeft size={28} />
            </motion.button>

            {/* Next Button */}
            <motion.button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => prev === null ? null : (prev + 1) % galleryImages.length);
              }}
            >
              <ChevronRight size={28} />
            </motion.button>

            {/* Main Image */}
            <motion.div
              className="relative max-w-6xl max-h-[90vh] w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="w-full h-full object-contain rounded-2xl"
              />
              
              {/* Image Caption */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-white text-xl font-semibold">{galleryImages[selectedImage].alt}</p>
                <p className="text-white/70 text-sm mt-1">Image {selectedImage + 1} of {galleryImages.length}</p>
              </motion.div>
            </motion.div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-lg rounded-full p-2">
              {galleryImages.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === selectedImage ? 'bg-[#d4af37] w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </section>

      <QuotationCTA />
    </PageLayout>
  );
}