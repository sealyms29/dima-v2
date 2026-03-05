import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock, Facebook, Youtube } from 'lucide-react';
const imgDimaLogoWhite = '/assets/921f344b23c883dea1da9542d93d3fc5b508f755.png';

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-16 md:py-24 overflow-hidden" ref={ref}>
      {/* Mesh Gradient */}
      <div className="mesh-gradient absolute inset-0 opacity-30" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.img 
              src={imgDimaLogoWhite} 
              alt="DIMA Logo" 
              className="h-16 lg:h-20 w-auto mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <p className="text-slate-300 leading-relaxed text-base mb-8 max-w-md">
              Malaysia's trusted certification body providing professional ISO certifications and MSPO schemes.
            </p>

            {/* Connect With Us */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Connect With Us
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.facebook.com/p/DIMA-Certification-Sdn-Bhd-100088593112131/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DIMA Certification on Facebook"
                  className="inline-flex items-center gap-3 text-slate-400 hover:text-[#d4af37] transition-colors duration-200 group w-fit"
                >
                  <Facebook size={22} strokeWidth={1.6} className="flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-[#d4af37] transition-colors duration-200">
                    Facebook
                  </span>
                </a>
                <a
                  href="https://www.youtube.com/@dimadmcsb458"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DIMA Certification on YouTube"
                  className="inline-flex items-center gap-3 text-slate-400 hover:text-[#d4af37] transition-colors duration-200 group w-fit"
                >
                  <Youtube size={24} strokeWidth={1.6} className="flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-[#d4af37] transition-colors duration-200">
                    YouTube
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Audit Programmes', path: '/services' }
              ].map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                >
                  <Link to={item.path}>
                    <motion.div
                      className="group inline-flex items-center gap-2 text-slate-300 hover:text-[#d4af37] transition-colors text-left"
                      whileHover={{ x: 5 }}
                    >
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Our Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['MSPO Standard', 'ISO 9001 (QMS)', 'ISO 14001 (EMS)', 'ISO 45001 (OHSMS)'].map((item, index) => (
                <motion.div 
                  key={item}
                  className="glass-dark inline-flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl text-slate-300 text-sm hover:border-[#d4af37]/40 transition-all cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(212, 175, 55, 0.5)' }}
                >
                  <div className="w-2 h-2 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-full" />
                  <span className="font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div 
          className="border-t border-white/10 pt-12 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-white">Contact Us</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: 'Address', content: 'Kuching, Sarawak\nMalaysia' },
              { icon: Phone, title: 'Phone', content: '+60 12-345 6789' },
              { icon: Mail, title: 'Email', content: 'info@dima.com.my' },
              { icon: Clock, title: 'Hours', content: 'Mon - Fri: 9:00 AM - 5:00 PM' }
            ].map((item, index) => (
              <motion.div 
                key={item.title}
                className="group glass-dark rounded-2xl p-5 border border-white/10 hover:border-[#d4af37]/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(212, 175, 55, 0.4)' }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center shadow-gold"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="text-slate-900" size={20} />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-center items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <p className="text-slate-400 text-sm text-center">
            © {new Date().getFullYear()} DIMA Certification Body. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}