import { PageLayout } from '../components/shared/PageLayout';
import { Hero } from '../components/Hero';
import { QuotationCTA } from '../components/QuotationCTA';
import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar } from 'lucide-react';
// Figma assets removed - use actual image files
const imgTeamPhoto = '/assets/96ff7a0755cc20b25bbf7b4dd3c95cef7add2941.png';
const imgOffice1 = '/assets/c5cb03644bd86d72dab99e848ae8f9b1512ef00d.png';
const imgOffice2 = '/assets/f803cd79b767f951e7f7ac21c263a4aa722e6bee.png';
const imgMSPO = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgAccreditation = '/assets/d592e4a60fc48dd30356faa8a70601227c755ba1.png';
const imgAuditVisit = '/assets/75de96ee0834675ede75a8ff86e49d03c12883ed.png';

export function HomePage() {
  const ref = useRef(null);
  const galleryRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isGalleryInView = useInView(galleryRef, { once: true, amount: 0.2 });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Gallery images - using available images as examples
  const galleryImages = [
    { src: imgAuditVisit, alt: "DIMA Audit Visit Team" },
    { src: imgTeamPhoto, alt: "Professional Team Meeting" },
    { src: imgOffice1, alt: "Audit Site Inspection" },
    { src: imgOffice2, alt: "Client Consultation" },
    { src: imgAuditVisit, alt: "Documentation Review" },
    { src: imgTeamPhoto, alt: "Team Collaboration" }
  ];

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
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

      {/* Gallery Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 to-white overflow-hidden" ref={galleryRef}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block px-6 py-2 bg-gradient-to-r from-[#d4af37]/10 to-amber-500/10 border border-[#d4af37]/20 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isGalleryInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[#d4af37] font-semibold">Gallery</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              DIMA Audit Visit For MSPO
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Witness our professional audit team in action during MSPO certification visits
            </p>
          </motion.div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isGalleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImage(index)}
              >
                {/* Image */}
                <motion.img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-semibold text-lg">{image.alt}</p>
                    <div className="mt-2 flex items-center gap-2 text-white/80">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full" />
                      <span className="text-sm">Click to view</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
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