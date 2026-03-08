import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Facebook, Youtube } from 'lucide-react';
// Figma asset removed - use actual image file
const imgDimaLogo = '/assets/1ae5d991da6738c83fb07a529bc85bd58b9805a2.png';
import { useQuotation } from '../../QuotationContext';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isAuditDropdownOpen, setIsAuditDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileAuditOpen, setMobileAuditOpen] = useState(false);
  const location = useLocation();
  const { isOpen: isQuotationOpen, togglePanel, closePanel } = useQuotation();
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const auditDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileAboutOpen(false);
    setMobileAuditOpen(false);
    closePanel();
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setIsAboutDropdownOpen(false);
      }
      if (auditDropdownRef.current && !auditDropdownRef.current.contains(event.target as Node)) {
        setIsAuditDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard handler for dropdowns
  const handleDropdownKeyDown = (
    e: React.KeyboardEvent,
    isOpen: boolean,
    setOpen: (open: boolean) => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

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
              ref={aboutDropdownRef}
              onMouseEnter={() => setIsAboutDropdownOpen(true)}
              onMouseLeave={() => setIsAboutDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                onKeyDown={(e) => handleDropdownKeyDown(e, isAboutDropdownOpen, setIsAboutDropdownOpen)}
                aria-expanded={isAboutDropdownOpen}
                aria-haspopup="true"
                className={`relative px-4 xl:px-5 py-3 min-h-[44px] font-semibold text-base rounded-xl transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${
                  isActive('/about') || isActive('/certification-mark') || isActive('/quality-policy') || isActive('/quality-objectives') || isActive('/certification-agreement') 
                    ? 'text-[#d4af37]' 
                    : 'text-slate-900 hover:text-[#d4af37]'
                }`}
              >
                <span className="relative z-10">About Us</span>
                <motion.div
                  animate={{ rotate: isAboutDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="relative z-10" aria-hidden="true" />
                </motion.div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-elevated overflow-hidden z-50"
                    role="menu"
                    aria-label="About Us submenu"
                  >
                    <div className="p-2">
                      {[
                        { label: 'About DIMA', path: '/about' },
                        { label: 'Name, Mark or Logo Usage Right', path: '/certification-mark' },
                        { label: 'Quality Policy', path: '/quality-policy' },
                        { label: 'Policy on Impartiality', path: '/impartiality-policy' },
                        { label: 'Quality Objectives', path: '/quality-objectives' },
                        { label: 'Certification Terms', path: '/certification-agreement' }
                      ].map((item, index) => (
                        <Link key={item.path} to={item.path}>
                          <motion.div
                            className="w-full text-left px-5 py-3 min-h-[44px] flex items-center text-slate-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent hover:text-[#d4af37] rounded-xl transition-all font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset"
                            role="menuitem"
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
              ref={auditDropdownRef}
              onMouseEnter={() => setIsAuditDropdownOpen(true)}
              onMouseLeave={() => setIsAuditDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsAuditDropdownOpen(!isAuditDropdownOpen)}
                onKeyDown={(e) => handleDropdownKeyDown(e, isAuditDropdownOpen, setIsAuditDropdownOpen)}
                aria-expanded={isAuditDropdownOpen}
                aria-haspopup="true"
                className={`relative px-4 xl:px-5 py-3 min-h-[44px] font-semibold text-base rounded-xl transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${
                  isActive('/services') || isActive('/iso-overview') || isActive('/iso-audit-process') || isActive('/iso-complaints-appeals') || isActive('/iso-9001') || isActive('/iso-14001') || isActive('/iso-45001') 
                    ? 'text-[#d4af37]' 
                    : 'text-slate-900 hover:text-[#d4af37]'
                }`}
              >
                <span className="relative z-10">Audit Programmes</span>
                <motion.div
                  animate={{ rotate: isAuditDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} className="relative z-10" aria-hidden="true" />
                </motion.div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isAuditDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-elevated overflow-hidden z-50"
                    role="menu"
                    aria-label="Audit Programmes submenu"
                  >
                    <div className="p-2">
                      {[
                        { label: 'Malaysian Sustainable Palm Oil (MSPO) Standard', path: '/services/mspo' },
                        { label: 'ISO Management System Certifications', path: '/iso-overview' }
                      ].map((item, index) => (
                        <Link key={item.path} to={item.path}>
                          <motion.div
                            className="w-full text-left px-5 py-3 min-h-[44px] flex items-center text-[#d4af37] hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent rounded-xl transition-all font-semibold text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset"
                            role="menuitem"
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
            <Link to="/contact" className="focus-visible:outline-none">
              <motion.div
                className={`relative px-4 xl:px-5 py-3 min-h-[44px] flex items-center font-semibold text-base rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${
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
                href="https://www.facebook.com/p/DIMA-Certification-Sdn-Bhd-100088593112131/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DIMA Certification on Facebook"
                className="text-slate-400 hover:text-[#d4af37] transition-colors duration-200 p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-lg"
              >
                <Facebook size={19} strokeWidth={1.75} />
              </a>
              <a
                href="https://www.youtube.com/@dimadmcsb458"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DIMA Certification on YouTube"
                className="text-slate-400 hover:text-[#d4af37] transition-colors duration-200 p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-lg"
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
              className={`flex items-center gap-2 relative px-6 xl:px-8 py-3 xl:py-3.5 min-h-[44px] font-bold rounded-2xl shadow-lg overflow-hidden group transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${
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
            className="lg:hidden p-3 min-w-[44px] min-h-[44px] rounded-xl text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
            whileTap={{ scale: 0.9 }}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
                  <X size={24} aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              id="mobile-navigation"
              className="lg:hidden border-t border-slate-200 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col space-y-2 py-6">
                <Link to="/" className="focus-visible:outline-none">
                  <motion.div
                    className={`w-full text-left px-4 py-3 min-h-[44px] flex items-center rounded-xl font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset ${
                      isActive('/') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Home
                  </motion.div>
                </Link>
                
                {/* Mobile About Us Dropdown */}
                <div>
                  <button
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className={`w-full text-left px-4 py-3 min-h-[44px] rounded-xl font-semibold transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset ${
                      isActive('/about') || isActive('/certification-mark') || isActive('/quality-policy') || isActive('/quality-objectives') || isActive('/certification-agreement') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    aria-expanded={mobileAboutOpen}
                  >
                    <span>About Us</span>
                    <motion.div animate={{ rotate: mobileAboutOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} aria-hidden="true" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        {[
                          { label: 'About DIMA', path: '/about' },
                          { label: 'Name, Mark or Logo Usage Right', path: '/certification-mark' },
                          { label: 'Quality Policy', path: '/quality-policy' },
                          { label: 'Policy on Impartiality', path: '/impartiality-policy' },
                          { label: 'Quality Objectives', path: '/quality-objectives' },
                          { label: 'Certification Terms', path: '/certification-agreement' }
                        ].map((item) => (
                          <Link key={item.path} to={item.path} className="focus-visible:outline-none">
                            <motion.div
                              className="w-full text-left px-4 py-3 min-h-[44px] flex items-center text-slate-700 hover:text-[#d4af37] rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset"
                              whileTap={{ scale: 0.98 }}
                            >
                              {item.label}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Mobile Audit Programmes Dropdown */}
                <div>
                  <button
                    onClick={() => setMobileAuditOpen(!mobileAuditOpen)}
                    className={`w-full text-left px-4 py-3 min-h-[44px] rounded-xl font-semibold transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset ${
                      isActive('/services') || isActive('/iso-overview') ? 'bg-amber-50 text-[#d4af37]' : 'text-slate-900 hover:bg-amber-50 hover:text-[#d4af37]'
                    }`}
                    aria-expanded={mobileAuditOpen}
                  >
                    <span>Audit Programmes</span>
                    <motion.div animate={{ rotate: mobileAuditOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} aria-hidden="true" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {mobileAuditOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                      >
                        {[
                          { label: 'Malaysian Sustainable Palm Oil (MSPO) Standard', path: '/services/mspo' },
                          { label: 'ISO Management System Certifications', path: '/iso-overview' }
                        ].map((item) => (
                          <Link key={item.path} to={item.path} className="focus-visible:outline-none">
                            <motion.div
                              className="w-full text-left px-4 py-3 min-h-[44px] flex items-center text-[#d4af37] hover:bg-amber-50 rounded-lg text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset"
                              whileTap={{ scale: 0.98 }}
                            >
                              {item.label}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Link to="/contact" className="focus-visible:outline-none">
                  <motion.div
                    className={`w-full text-left px-4 py-3 min-h-[44px] flex items-center rounded-xl font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-inset ${
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
                  className={`relative mt-2 w-full px-6 py-4 min-h-[48px] font-bold rounded-2xl shadow-lg text-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 ${
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