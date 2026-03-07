import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, FileText, Mail, AlertCircle, ChevronDown } from 'lucide-react';
import { useQuotation } from '../QuotationContext';
// Figma assets removed - use actual image files
const imgMSPOLogo = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';

interface DocInfo {
  title: string;
  file_path: string;
}

interface QuotationDocs {
  [programme: string]: {
    application_form?: DocInfo;
    questionnaire?: DocInfo;
  };
}

interface Certification {
  id: string;
  programmeKey: string;
  shortName: string;
  description: string;
  logo: string;
  quotationTitle: string;
}

const certifications: Certification[] = [
  {
    id: 'mspo',
    programmeKey: 'MSPO',
    shortName: 'MSPO',
    description: 'Malaysian Sustainable Palm Oil',
    logo: imgMSPOLogo,
    quotationTitle: 'Quotation – Malaysian Sustainable Palm Oil (MSPO) Standard',
  },
  {
    id: 'iso-9001',
    programmeKey: 'ISO9001',
    shortName: 'ISO 9001',
    description: 'Quality Management System',
    logo: imgISO9001Logo,
    quotationTitle: 'Quotation – ISO 9001 Quality Management System',
  },
  {
    id: 'iso-14001',
    programmeKey: 'ISO14001',
    shortName: 'ISO 14001',
    description: 'Environmental Management System',
    logo: imgISO14001Logo,
    quotationTitle: 'Quotation – ISO 14001 Environmental Management System',
  },
  {
    id: 'iso-45001',
    programmeKey: 'ISO45001',
    shortName: 'ISO 45001',
    description: 'Occupational Health & Safety',
    logo: imgISO45001Logo,
    quotationTitle: 'Quotation – ISO 45001 Occupational Health & Safety Management System',
  },
];

function CertificationCard({
  cert,
  isSelected,
  onClick,
}: {
  cert: Certification;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full text-left rounded-2xl border-2 overflow-hidden transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
        isSelected
          ? 'border-[#d4af37] bg-amber-50 shadow-xl'
          : 'border-slate-200 bg-white hover:border-[#d4af37]/50 hover:bg-amber-50/30 shadow-md hover:shadow-xl'
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-pressed={isSelected}
    >
      {/* Gold accent bar at top when selected */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isSelected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 0 }}
      />

      <div className="p-6 flex flex-col items-center gap-4 min-h-[200px] justify-center">
        {/* Logo */}
        <motion.div
          className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-slate-100"
          animate={{ scale: isSelected ? 1.08 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={cert.logo}
            alt={`${cert.shortName} Logo`}
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>

        {/* Text */}
        <div className="text-center">
          <h4
            className={`text-xl font-bold mb-1 transition-colors duration-200 ${
              isSelected ? 'text-[#d4af37]' : 'text-slate-900'
            }`}
          >
            {cert.shortName}
          </h4>
          <p
            className={`text-sm leading-relaxed transition-colors duration-200 ${
              isSelected ? 'text-amber-700' : 'text-slate-500'
            }`}
          >
            {cert.description}
          </p>
        </div>

        {/* Indicator */}
        <motion.div
          className="flex items-center gap-1.5"
          animate={{ opacity: isSelected ? 1 : 0.4 }}
        >
          <motion.div
            animate={{ rotate: isSelected ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown
              size={18}
              className={isSelected ? 'text-[#d4af37]' : 'text-slate-400'}
            />
          </motion.div>
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              isSelected ? 'text-[#d4af37]' : 'text-slate-400'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </span>
        </motion.div>
      </div>
    </motion.button>
  );
}

function ExpandedContent({ cert, docs }: { cert: Certification; docs: QuotationDocs }) {
  const progDocs = docs[cert.programmeKey];
  const appForm = progDocs?.application_form;
  const questionnaire = progDocs?.questionnaire;

  return (
    <motion.div
      key={cert.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-2xl border-2 border-[#d4af37]/30 shadow-lg overflow-hidden"
    >
      {/* Header Strip */}
      <div className="bg-gradient-to-r from-[#d4af37] to-amber-500 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-white" />
        </div>
        <h3 className="text-white font-bold text-base md:text-lg leading-snug">
          {cert.quotationTitle}
        </h3>
      </div>

      <div className="p-6 md:p-8">
        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {appForm ? (
            <motion.a
              href={appForm.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-semibold rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Download size={20} />
              </motion.div>
              <span>Application Form</span>
            </motion.a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed">
              <Download size={20} />
              <span>Application Form (Coming Soon)</span>
            </div>
          )}

          {questionnaire ? (
            <motion.a
              href={questionnaire.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-[#d4af37] text-[#b8973a] font-semibold rounded-xl hover:bg-amber-50 transition-colors duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <FileText size={20} />
              </motion.div>
              <span>Questionnaire for Self Assessment</span>
            </motion.a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-200 text-slate-400 font-semibold rounded-xl cursor-not-allowed">
              <FileText size={20} />
              <span>Questionnaire (Coming Soon)</span>
            </div>
          )}
        </div>

        {/* Divider with animation */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />

        {/* Instruction Text */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center">
            <Mail size={18} className="text-[#d4af37]" />
          </div>
          <div>
            <p className="text-slate-700 text-base leading-relaxed">
              Please fill in both forms and email the completed forms to our official email address{' '}
              <a
                href="mailto:dimacertification@gmail.com"
                className="font-semibold text-[#d4af37] hover:text-amber-600 underline underline-offset-2 transition-colors"
              >
                dimacertification@gmail.com
              </a>
              , we will prepare the quotation as per the details given and we will send them over as soon as possible.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <motion.div
          className="mt-6 flex gap-3 items-start p-4 bg-amber-50 border border-amber-200/60 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            Please ensure all required fields in both forms are completely and accurately filled before submission to avoid delays in processing your quotation.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function QuotationPanel() {
  const { isOpen, closePanel } = useQuotation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quotationDocs, setQuotationDocs] = useState<QuotationDocs>({});

  // Fetch quotation documents
  useEffect(() => {
    const apiBase = import.meta.env.BASE_URL;
    fetch(`${apiBase}api/public-quotation-docs.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setQuotationDocs(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Reset selection when panel closes
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => setSelectedId(null), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closePanel]);

  const selectedCert = certifications.find((c) => c.id === selectedId) || null;

  const handleCardClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closePanel}
          />

          {/* Panel — sits directly below sticky header (h-20 mobile / h-24 lg) */}
          <motion.div
            className="fixed left-0 right-0 z-40 bg-white shadow-2xl border-b-2 border-slate-100 overflow-y-auto top-20 lg:top-24"
            style={{ maxHeight: 'calc(100vh - 5rem)' }}
            initial={{ y: '-110%' }}
            animate={{ y: 0 }}
            exit={{ y: '-110%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Inner content */}
            <div className="relative">
              {/* Top gold line */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

              {/* Close Button */}
              <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
                <motion.button
                  onClick={closePanel}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Close quotation panel"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-12">
                {/* Section Header */}
                <motion.div
                  className="text-center mb-10 md:mb-12"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#d4af37]/10 to-amber-500/10 border border-[#d4af37]/25 rounded-full mb-5">
                    <div className="w-2 h-2 bg-[#d4af37] rounded-full" />
                    <span className="text-[#d4af37] text-sm font-semibold tracking-wide uppercase">
                      Certification Quotation
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    Get your quotation now<span className="text-[#d4af37]">!</span>
                  </h2>
                  <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                    We appreciate your trust and will do our best to continue giving you the kind of service you deserve.
                  </p>
                </motion.div>

                {/* Cards Grid - Mobile: Stack with inline expanded content */}
                <motion.div
                  className="sm:hidden flex flex-col gap-5 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                >
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <CertificationCard
                        cert={cert}
                        isSelected={selectedId === cert.id}
                        onClick={() => handleCardClick(cert.id)}
                      />
                      {/* Expanded content directly below clicked card on mobile */}
                      <AnimatePresence mode="wait">
                        {selectedId === cert.id && selectedCert && (
                          <motion.div
                            key={`mobile-${cert.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="pt-4">
                              <ExpandedContent cert={selectedCert} docs={quotationDocs} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>

                {/* Cards Grid - Tablet/Desktop: Grid with expanded content below */}
                <motion.div
                  className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                >
                  {certifications.map((cert) => (
                    <CertificationCard
                      key={cert.id}
                      cert={cert}
                      isSelected={selectedId === cert.id}
                      onClick={() => handleCardClick(cert.id)}
                    />
                  ))}
                </motion.div>

                {/* Expanded Accordion Content - Only for tablet/desktop */}
                <div className="hidden sm:block">
                  <AnimatePresence mode="wait">
                    {selectedCert && (
                      <motion.div
                        key={selectedCert.id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="pb-2">
                          <ExpandedContent cert={selectedCert} docs={quotationDocs} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom helper text */}
                {!selectedCert && (
                  <motion.p
                    className="text-center text-sm text-slate-400 mt-2 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Select a certification above to view the required forms and instructions.
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}