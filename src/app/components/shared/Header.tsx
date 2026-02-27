import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Facebook, Youtube } from 'lucide-react';
// Figma asset removed - use actual image file
const imgDimaLogo = "";
import { useQuotation } from '../../QuotationContext';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isAuditDropdownOpen, setIsAuditDropdownOpen] = useState(false);
  const location = useLocation();
  const { isOpen: isQuotationOpen, togglePanel } = useQuotation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-lg' 
          : 'bg-white/60 backdrop-blur-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={imgDimaLogo} 
                alt="DIMA Logo" 
                className="h-14 lg:h-20 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link to="/">
              <motion.div
                className={`relative px-4 xl:px-5 py-2.5 font-semibold text-base rounded-xl transition-colors ${
                  isActive('/') ? 'text-[#d4af37]' : 'text-slate-900 hover:text-[#d4af37]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Home</span>
              </motion.div>
            </Link>
            
            {/* About Us with Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <Link to="/about">
                <motion.div
                  className={`relative px-4 xl:px-5 py-2.5 font-semibold text-base rounded-xl transition-colors flex items-center gap-1 ${
                    isActive('/about') || isActive('/certification-mark') || isActive('/quality-policy') || isActive('/quality-objectives') 
                      ? 'text-[#d4af37]' 
                      : 'text-slate-900 hover:text-[#d4af37]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">About Us</span>
                  <motion.div
                    animate={{ rotate: isAboutDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} className="relative z-10" />
                  </motion.div>
                </motion.div>
              </Link>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {[
                        { label: 'Name, Mark or Logo Usage Right', path: '/certification-mark' },
                        { label: 'Quality Policy', path: '/quality-policy' },
                        { label: 'Policy on Impartiality', path: '/impartiality-policy' },
                        { label: 'Quality Objectives', path: '/quality-objectives' }
                      ].map((item, index) => (
                        <Link key={item.path} to={item.path}>
                          <motion.div
                            className="w-full text-left px-5 py-3 text-slate-900 hover:bg-amber-50 hover:text-[#d4af37] rounded-xl transition-colors font-medium text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            {item.label}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsAuditDropdownOpen(true)}
              onMouseLeave={() => setIsAuditDropdownOpen(false)}
            >
              <Link to="/services">
                <motion.div
                  className={`relative px-4 xl:px-5 py-2.5 font-semibold text-base rounded-xl transition-colors flex items-center gap-1 ${
                    isActive('/services') || isActive('/iso-overview') || isActive('/iso-audit-process') || isActive('/iso-complaints-appeals') || isActive('/iso-9001') || isActive('/iso-14001') || isActive('/iso-45001') 
                      ? 'text-[#d4af37]' 
                      : 'text-slate-900 hover:text-[#d4af37]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Audit Programmes</span>
                  <motion.div
                    animate={{ rotate: isAuditDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} className="relative z-10" />
                  </motion.div>
                </motion.div>
              </Link>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAuditDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-96 bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {[
                        { label: 'Malaysian Sustainable Palm Oil (MSPO) Standard', path: '/services/mspo' },
                        { label: 'International Organization for Standardization (ISO)', path: '/iso-overview' }
                      ].map((item, index) => (
                        <Link key={item.path} to={item.path}>
                          <motion.div
                            className="w-full text-left px-5 py-3 text-[#d4af37] hover:bg-amber-50 rounded-xl transition-colors font-medium text-sm leading-relaxed"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            {item.label}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/contact">
              <motion.div
                className={`relative px-4 xl:px-5 py-2.5 font-semibold text-base rounded-xl transition-colors ${
                  isActive('/contact') ? 'text-[#d4af37]' : 'text-slate-900 hover:text-[#d4af37]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Contact Us</span>
              </motion.div>
            </Link>
          </nav>

          {/* Desktop Right — Social + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Social Icons — desktop only, monochrome, no background */}
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DIMA Certification on Facebook"
                className="text-slate-400 hover:text-[#d4af37] transition-colors duration-200"
              >
                <Facebook size={19} strokeWidth={1.75} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DIMA Certification on YouTube"
                className="text-slate-400 hover:text-[#d4af37] transition-colors duration-200"
              >
                <Youtube size={20} strokeWidth={1.75} />
              </a>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => {
                togglePanel();
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 relative px-6 xl:px-8 py-3 xl:py-3.5 font-bold rounded-2xl shadow-lg overflow-hidden group transition-all duration-200 ${
                isQuotationOpen
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white ring-2 ring-[#d4af37] ring-offset-2'
                  : 'bg-gradient-to-r from-[#d4af37] to-amber-500 text-black'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">
                {isQuotationOpen ? 'Close Quotation' : 'Get Quotation'}
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-slate-900 hover:bg-slate-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="lg:hidden border-t border-slate-200 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-2 py-6">
                <Link to="/">
                  <motion.div
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${
                      isActive('/') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Home
                  </motion.div>
                </Link>
                <Link to="/about">
                  <motion.div
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${
                      isActive('/about') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    About Us
                  </motion.div>
                </Link>
                <Link to="/services">
                  <motion.div
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${
                      isActive('/services') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Audit Programmes
                  </motion.div>
                </Link>
                <Link to="/contact">
                  <motion.div
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors ${
                      isActive('/contact') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Us
                  </motion.div>
                </Link>
                <motion.button
                  onClick={() => {
                    togglePanel();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`relative mt-2 w-full px-6 py-4 font-bold rounded-2xl shadow-lg text-center overflow-hidden ${
                    isQuotationOpen
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                      : 'bg-gradient-to-r from-[#d4af37] to-amber-500 text-black'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {isQuotationOpen ? 'Close Quotation' : 'Get Quotation'}
                  </span>
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}