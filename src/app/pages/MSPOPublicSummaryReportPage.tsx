import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { FileText, Calendar, Download, Award, CheckCircle, Clock } from 'lucide-react';

interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  year: number;
  month: number | null;
  audit_status: string | null;
  file_path: string;
  created_at: string;
  updated_at: string;
}

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function MSPOPublicSummaryReportPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Fetch documents from API
  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const res = await fetch('/api/public-documents.php?category=' + encodeURIComponent('MSPO Public Report Summary'));
        const json = await res.json();
        if (json.success) {
          setDocuments(json.data || []);
          const years = [...new Set((json.data || []).map((d: Document) => String(d.year)))].sort((a, b) => Number(b) - Number(a));
          setAvailableYears(years.length > 0 ? years : [String(new Date().getFullYear())]);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Filter by year
  const currentYearDocs = documents.filter(d => String(d.year) === selectedYear);

  // Get available months for selected year
  const availableMonths = [...new Set(currentYearDocs.map(d => d.month))].sort((a, b) => (a || 0) - (b || 0));

  // Filter by selected month
  const displayDocs = selectedMonth !== null
    ? currentYearDocs.filter(d => {
        const monthNum = selectedMonth === '0' ? null : Number(selectedMonth);
        return monthNum === null ? d.month === null : d.month === monthNum;
      })
    : [];

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Transparency"
        title="Public Summary Report"
        subtitle="Comprehensive audit summary reports for all MSPO certifications"
      />

      <section className="relative py-20 md:py-28 bg-gradient-to-b from-white to-slate-50" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-amber-500/10 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-10 md:p-12 shadow-xl">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-3xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-white" size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      MSPO Audit Summary Reports
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                      Access comprehensive public summary reports for all completed MSPO certification audits. These reports provide transparency and detailed information about certification outcomes, compliance status, and audit findings.
                    </p>
                    <p className="text-slate-600">
                      All reports are published following the completion of the certification process and decision-making by DIMA Certification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Certified</h3>
              <p className="text-slate-600">Successful MSPO Certifications</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Transparent</h3>
              <p className="text-slate-600">Public Access to Reports</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Detailed</h3>
              <p className="text-slate-600">Comprehensive Information</p>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-slate-600 text-lg">Loading reports...</p>
            </motion.div>
          )}

          {!loading && (
            <>
              {/* Year Selector */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12"
              >
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <span className="text-slate-600 font-semibold mr-2">Select Year:</span>
                    {availableYears.map((year, index) => (
                      <motion.button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setSelectedMonth(null);
                        }}
                        className={`px-6 py-3 rounded-xl font-bold text-base transition-all shadow-md ${
                          selectedYear === year
                            ? 'bg-gradient-to-r from-[#d4af37] to-amber-500 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                        whileHover={{ scale: selectedYear === year ? 1.05 : 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {year}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Page Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-8"
              >
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  Public Summary Report ({selectedYear})
                </h3>
              </motion.div>

              {/* Month Selection Buttons */}
              {selectedMonth === null && availableMonths.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="space-y-4"
                >
                  {availableMonths.map((month, index) => (
                    <motion.button
                      key={month ?? 'no-month'}
                      onClick={() => setSelectedMonth(month === null ? '0' : String(month))}
                      className="w-full max-w-md px-10 py-5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all uppercase"
                      initial={{ opacity: 0, x: -30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {month ? MONTH_NAMES[month] : 'General'} {selectedYear}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Back Button and Report List */}
              {selectedMonth !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors mb-8"
                  >
                    ← Back to Month Selection
                  </button>

                  {/* Report Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-bold text-slate-900">
                      Public Summary Report ({selectedMonth === '0' ? 'General' : MONTH_NAMES[Number(selectedMonth)]}) {selectedYear}
                    </h3>
                  </div>

                  {displayDocs.length > 0 && (
                    <>
                      {/* PDF Report List */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-lg mb-12"
                      >
                        <div className="space-y-1">
                          {displayDocs.map((doc, index) => (
                            <motion.a
                              key={doc.id}
                              href={doc.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left group block"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center gap-3 py-3 border-b border-slate-100 hover:border-[#d4af37] transition-colors">
                                <FileText className="text-[#d4af37] flex-shrink-0 mt-0.5" size={20} />
                                <span className="text-[#d4af37] hover:text-amber-600 font-medium transition-colors text-lg flex-1">
                                  {doc.title}
                                </span>
                                <Download className="text-slate-400 group-hover:text-[#d4af37] transition-colors flex-shrink-0" size={18} />
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>

                      {/* Detailed Report Cards */}
                      <h3 className="text-2xl font-bold text-slate-900 mb-6">Report Details</h3>
                      <div className="space-y-6">
                        {displayDocs.map((doc, index) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all">
                              <div className="flex items-start justify-between gap-6 mb-6">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Award className="text-white" size={32} />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                      <h4 className="text-xl font-bold text-slate-900 flex-1">
                                        {doc.title}
                                      </h4>
                                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold whitespace-nowrap">
                                        ✓ Published
                                      </span>
                                    </div>
                                    
                                    {doc.description && (
                                      <p className="text-slate-600 mb-4 leading-relaxed">
                                        {doc.description}
                                      </p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="text-[#d4af37]" size={16} />
                                        <span>{doc.month ? `${MONTH_NAMES[doc.month]} ${doc.year}` : doc.year}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="text-[#d4af37]" size={16} />
                                        <span>Published {new Date(doc.created_at).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t-2 border-slate-100 pt-6">
                                <a
                                  href={doc.file_path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                                >
                                  <Download size={18} />
                                  Download PDF
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Empty state for selected month */}
                  {displayDocs.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-20"
                    >
                      <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-slate-400" size={48} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        No Reports Available
                      </h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        No reports found for {selectedMonth === '0' ? 'General' : MONTH_NAMES[Number(selectedMonth)]} {selectedYear}.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Empty State when no reports for entire year */}
              {selectedMonth === null && availableMonths.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="text-slate-400" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No Reports Available
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    No public summary reports are currently available for {selectedYear}. Check back later for updates.
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Information Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white">
              <div className="flex items-start gap-6">
                <FileText className="text-[#d4af37] flex-shrink-0" size={40} />
                <div>
                  <h3 className="text-2xl font-bold mb-4">About Public Summary Reports</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    These public summary reports are published in accordance with MSPO transparency requirements. Each report provides a comprehensive overview of the audit findings, certification scope, compliance status, and certification decision.
                  </p>
                  <p className="text-white/60 text-sm">
                    For detailed inquiries about specific certification reports or to request additional information, please contact DIMA Certification directly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </PageLayout>
  );
}
