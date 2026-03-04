import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { Calendar, Bell, Search, Download, Clock, FileText } from 'lucide-react';

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

export function MSPOPublicNotificationPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Fetch documents from API
  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        const res = await fetch('/api/public-documents.php?category=' + encodeURIComponent('MSPO Public Notifications'));
        const json = await res.json();
        if (json.success) {
          setDocuments(json.data || []);
          // Extract unique years
          const years = [...new Set((json.data || []).map((d: Document) => String(d.year)))].sort((a, b) => Number(b) - Number(a));
          setAvailableYears(years.length > 0 ? years : [String(new Date().getFullYear())]);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  // Filter by year
  const currentYearDocs = documents.filter(d => String(d.year) === selectedYear);

  // Filter by search
  const filteredDocs = currentYearDocs.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get available months for selected year
  const availableMonths = [...new Set(filteredDocs.map(d => d.month))].sort((a, b) => (a || 0) - (b || 0));

  // Filter by selected month
  const displayDocs = selectedMonth !== null
    ? filteredDocs.filter(d => {
        const monthNum = selectedMonth === '0' ? null : Number(selectedMonth);
        return monthNum === null ? d.month === null : d.month === monthNum;
      })
    : [];

  const getAuditStatusColor = (status: string | null) => {
    switch (status) {
      case 'Upcoming Audit':
        return 'from-orange-500 to-amber-600';
      case 'Past Audit':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getAuditStatusBadge = (status: string | null) => {
    switch (status) {
      case 'Upcoming Audit':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🔜' };
      case 'Past Audit':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: '✅' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', icon: '📋' };
    }
  };

  return (
    <PageLayout>
      <PageHero
        badge="MSPO Transparency"
        title="Public Notification"
        subtitle="Transparent audit scheduling for stakeholder awareness and participation"
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
                    <Bell className="text-white" size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                      Audit Announcement Policy
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                      We will make a public announcement/notification on our official website on the following at least <span className="font-bold text-[#d4af37]">30 calendar days before the start date</span> of the field audit for <span className="font-bold">initial and re-certification audits</span>, whereas <span className="font-bold text-[#d4af37]">15 calendar days</span> for <span className="font-bold">surveillance audits</span>.
                    </p>
                    <p className="text-slate-600">
                      In case there is a change of the audit date, the public announcement/notification shall be updated accordingly.
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
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">30 Days</h3>
              <p className="text-slate-600">Initial & Re-certification Audits</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">15 Days</h3>
              <p className="text-slate-600">Surveillance Audits</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Real-time</h3>
              <p className="text-slate-600">Updates & Changes</p>
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
              <p className="text-slate-600 text-lg">Loading notifications...</p>
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
                        onClick={() => { setSelectedYear(year); setSelectedMonth(null); }}
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

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
                  <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#d4af37] transition-colors shadow-lg text-lg"
                  />
                </div>
              </motion.div>

              {/* Notifications Count */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-8"
              >
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  Public Notification ({selectedYear})
                </h3>
              </motion.div>

              {/* Month Selection Buttons */}
              {availableMonths.length > 0 && !selectedMonth && (
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
                      className="w-full max-w-xs px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                      initial={{ opacity: 0, x: -30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {month ? MONTH_NAMES[month] : 'General'}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Back Button and Month Display */}
              {selectedMonth !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors mb-6"
                  >
                    ← Back to Month Selection
                  </button>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {selectedMonth === '0' ? 'General' : MONTH_NAMES[Number(selectedMonth)]} {selectedYear}
                      <span className="ml-3 text-lg font-normal text-slate-600">
                        ({displayDocs.length} {displayDocs.length === 1 ? 'notification' : 'notifications'})
                      </span>
                    </h3>
                  </div>
                </motion.div>
              )}

              {/* Notifications List - Only show when month is selected */}
              {selectedMonth !== null && displayDocs.length > 0 && (
                <div className="space-y-12">
                  {/* PDF List View */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-lg"
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Public Notification ({selectedYear}) - {selectedMonth === '0' ? 'General' : MONTH_NAMES[Number(selectedMonth)]}
                    </h3>
                    
                    <div className="space-y-3 mt-6">
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
                            <FileText className="text-[#d4af37] flex-shrink-0" size={20} />
                            <span className="text-[#d4af37] hover:text-amber-600 font-medium transition-colors flex-1">
                              {doc.title}
                            </span>
                            {doc.audit_status && (
                              <span className={`px-3 py-1 ${getAuditStatusBadge(doc.audit_status).bg} ${getAuditStatusBadge(doc.audit_status).text} text-xs font-bold rounded-full`}>
                                {getAuditStatusBadge(doc.audit_status).icon} {doc.audit_status}
                              </span>
                            )}
                            <Download className="text-slate-400 group-hover:text-[#d4af37] transition-colors flex-shrink-0" size={18} />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Detailed Cards View */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Notification Details</h3>
                    
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
                              <div className={`w-16 h-16 bg-gradient-to-br ${getAuditStatusColor(doc.audit_status)} rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-lg`}>
                                {getAuditStatusBadge(doc.audit_status).icon}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <h4 className="text-2xl font-bold text-slate-900">
                                    {doc.title}
                                  </h4>
                                  {doc.audit_status && (
                                    <span className={`px-4 py-2 bg-gradient-to-r ${getAuditStatusColor(doc.audit_status)} text-white text-sm font-bold rounded-lg shadow-md whitespace-nowrap`}>
                                      {doc.audit_status}
                                    </span>
                                  )}
                                </div>
                                
                                {doc.description && (
                                  <p className="text-slate-600 mb-3">{doc.description}</p>
                                )}
                                
                                <div className="flex items-center gap-4 text-slate-500 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="text-[#d4af37]" size={16} />
                                    <span>{doc.month ? `${MONTH_NAMES[doc.month]} ${doc.year}` : doc.year}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="text-[#d4af37]" size={16} />
                                    <span>Added {new Date(doc.created_at).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                            >
                              <Download size={18} />
                              Download PDF
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State when no notifications for selected month */}
              {selectedMonth !== null && displayDocs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-slate-400" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No Notifications
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    No notifications found for {selectedMonth === '0' ? 'General' : MONTH_NAMES[Number(selectedMonth)]} {selectedYear}.
                  </p>
                </motion.div>
              )}

              {/* Empty State when no notifications for entire year */}
              {selectedMonth === null && availableMonths.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-slate-400" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No Notifications
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    No notifications are currently available for {selectedYear}. Check back later for updates.
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
                <Bell className="text-[#d4af37] flex-shrink-0" size={40} />
                <div>
                  <h3 className="text-2xl font-bold mb-4">Stay Informed</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    This page is updated regularly with upcoming audit schedules. Stakeholders, interested parties, and the public are encouraged to monitor this page for the latest information on MSPO certification audits conducted by DIMA Certification.
                  </p>
                  <p className="text-white/60 text-sm">
                    For inquiries regarding specific audits or to participate in the audit process as an interested party, please contact us directly.
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