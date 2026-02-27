import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { Calendar, Bell, Search, Download, Building2, MapPin, Clock, FileText } from 'lucide-react';

interface Notification {
  id: string;
  companyName: string;
  location: string;
  auditType: 'Initial' | 'Re-certification' | 'Surveillance';
  auditDate: string;
  scope: string;
  standard: string;
  pdfFileName?: string;
}

interface MonthlyNotifications {
  month: string;
  notifications: Notification[];
}

export function MSPOPublicNotificationPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  // Mock data - in real implementation, this would come from a database
  const notificationsByYear: Record<string, Notification[]> = {
    '2026': [
      {
        id: 'N2026001',
        companyName: 'Nice Plantation',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-10',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022',
        pdfFileName: 'DMC-MSPO-PN-Nice Plantation SV1'
      },
      {
        id: 'N2026002',
        companyName: 'Borneo Wave',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-15',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022',
        pdfFileName: 'DMC-MSPO-PN-Borneo Wave SV1'
      },
      {
        id: 'N2026003',
        companyName: 'Sekitong',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-18',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022',
        pdfFileName: 'DMC-MSPO-PN-Sekitong SV1'
      },
      {
        id: 'N2026004',
        companyName: 'Golden Biogreens',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-22',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022',
        pdfFileName: 'DMC-MSPO-PN-Golden Biogreens SV1'
      },
      {
        id: 'N2026005',
        companyName: 'Green Jaya Resources',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-25',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022',
        pdfFileName: 'DMC-MSPO-PN Green Jaya Resources (SV1)'
      },
      {
        id: 'N2026006',
        companyName: 'Karisma Plantation',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-28',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022',
        pdfFileName: 'DMC-MSPO-PN-Karisma Plantation SV2'
      },
      {
        id: 'N2026007',
        companyName: 'DD Palm Oil Mill',
        location: 'Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-02-28',
        scope: 'MSPO Part 5',
        standard: 'MSPO 2544-5:2022',
        pdfFileName: 'DMC-MSPO-PN DD Palm Oil Mill (SV1)'
      },
      {
        id: 'N2026008',
        companyName: 'Sarawak Palm Oil Estate Sdn Bhd',
        location: 'Mukah, Sarawak',
        auditType: 'Initial',
        auditDate: '2026-03-15',
        scope: 'MSPO Part 1 & Part 4',
        standard: 'MSPO 2544-1:2022 & MSPO 2544-4:2022'
      },
      {
        id: 'N2026009',
        companyName: 'Green Valley Plantations',
        location: 'Bintulu, Sarawak',
        auditType: 'Surveillance',
        auditDate: '2026-03-22',
        scope: 'MSPO Part 4',
        standard: 'MSPO 2544-4:2022'
      },
      {
        id: 'N2026010',
        companyName: 'Tropical Oil Industries',
        location: 'Sibu, Sarawak',
        auditType: 'Re-certification',
        auditDate: '2026-04-10',
        scope: 'MSPO Part 5',
        standard: 'MSPO 2544-5:2022'
      }
    ],
    '2025': [
      {
        id: 'N2025001',
        companyName: 'Malaysia Palm Industries',
        location: 'Kuching, Sarawak',
        auditType: 'Initial',
        auditDate: '2025-12-20',
        scope: 'MSPO Part 1 & Part 4',
        standard: 'MSPO 2544-1:2022 & MSPO 2544-4:2022'
      }
    ],
    '2024': [],
    '2023': [],
    '2022': [],
    '2021': [],
    '2020': []
  };

  const currentNotifications = notificationsByYear[selectedYear] || [];
  
  const filteredNotifications = currentNotifications.filter(notification =>
    notification.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAuditTypeColor = (type: string) => {
    switch (type) {
      case 'Initial':
        return 'from-blue-500 to-blue-600';
      case 'Re-certification':
        return 'from-green-500 to-emerald-600';
      case 'Surveillance':
        return 'from-orange-500 to-amber-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getAuditTypeIcon = (type: string) => {
    switch (type) {
      case 'Initial':
        return '🆕';
      case 'Re-certification':
        return '🔄';
      case 'Surveillance':
        return '👁️';
      default:
        return '📋';
    }
  };

  // Group notifications by month
  const groupNotificationsByMonth = (notifications: Notification[]): MonthlyNotifications[] => {
    const grouped: Record<string, Notification[]> = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.auditDate);
      const monthYear = date.toLocaleDateString('en-MY', { year: 'numeric', month: 'long' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(notification);
    });
    
    return Object.entries(grouped).map(([month, notifications]) => ({
      month,
      notifications: notifications.sort((a, b) => 
        new Date(a.auditDate).getTime() - new Date(b.auditDate).getTime()
      )
    }));
  };

  const monthlyGroups = groupNotificationsByMonth(filteredNotifications);
  
  // Get available months for the selected year
  const getAvailableMonths = (): string[] => {
    const months = new Set<string>();
    currentNotifications.forEach(notification => {
      const date = new Date(notification.auditDate);
      const monthName = date.toLocaleDateString('en-MY', { month: 'long' });
      months.add(monthName);
    });
    return Array.from(months).sort((a, b) => {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
  };

  const availableMonths = getAvailableMonths();
  
  // Filter notifications by selected month
  const monthFilteredNotifications = selectedMonth
    ? filteredNotifications.filter(n => {
        const date = new Date(n.auditDate);
        const monthName = date.toLocaleDateString('en-MY', { month: 'long' });
        return monthName === selectedMonth;
      })
    : [];
  
  const displayNotifications = selectedMonth ? monthFilteredNotifications : [];

  const handlePDFDownload = (pdfFileName: string) => {
    // In production, this would download the actual PDF file
    alert(`Downloading: ${pdfFileName}.pdf\n\nIn production, this would download the official public notification PDF document.`);
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
                {years.map((year, index) => (
                  <motion.button
                    key={year}
                    onClick={() => setSelectedYear(year)}
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
                placeholder="Search by company name, location, or scope..."
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
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className="w-full max-w-xs px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {month}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Back Button and Month Display */}
          {selectedMonth && (
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
                  {selectedMonth} {selectedYear} Audit Schedule
                  <span className="ml-3 text-lg font-normal text-slate-600">
                    ({displayNotifications.length} {displayNotifications.length === 1 ? 'audit' : 'audits'} scheduled)
                  </span>
                </h3>
                
                {displayNotifications.length > 0 && (
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={20} />
                    <span>Export {selectedMonth}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* Notifications List - Only show when month is selected */}
          {selectedMonth && displayNotifications.length > 0 && (
            <div className="space-y-12">
              {/* PDF List View */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Public Notification ({selectedYear}) - {selectedMonth}
                </h3>
                <h4 className="text-lg font-semibold text-slate-600 mb-6">Upcoming Audit</h4>
                
                <div className="space-y-3">
                  {displayNotifications.filter(n => n.pdfFileName).map((notification, index) => (
                    <motion.button
                      key={notification.id}
                      onClick={() => handlePDFDownload(notification.pdfFileName!)}
                      className="w-full text-left group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3 py-2 border-b border-slate-100 hover:border-[#d4af37] transition-colors">
                        <FileText className="text-[#d4af37] flex-shrink-0" size={20} />
                        <span className="text-[#d4af37] hover:text-amber-600 font-medium transition-colors">
                          {notification.pdfFileName}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              {/* Detailed Cards View */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Detailed Audit Information</h3>
                
                {displayNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all">
                      <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-16 h-16 bg-gradient-to-br ${getAuditTypeColor(notification.auditType)} rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-lg`}>
                            {getAuditTypeIcon(notification.auditType)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h4 className="text-2xl font-bold text-slate-900">
                                {notification.companyName}
                              </h4>
                              <span className={`px-4 py-2 bg-gradient-to-r ${getAuditTypeColor(notification.auditType)} text-white text-sm font-bold rounded-lg shadow-md whitespace-nowrap`}>
                                {notification.auditType}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-slate-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="text-[#d4af37] flex-shrink-0" size={20} />
                                <span>{notification.location}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Calendar className="text-[#d4af37] flex-shrink-0" size={20} />
                                <span>{new Date(notification.auditDate).toLocaleDateString('en-MY', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t-2 border-slate-100 pt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="text-[#d4af37]" size={18} />
                              <span className="font-semibold text-slate-900">Certification Scope:</span>
                            </div>
                            <p className="text-slate-700 ml-7">{notification.scope}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="text-[#d4af37]" size={18} />
                              <span className="font-semibold text-slate-900">Standard:</span>
                            </div>
                            <p className="text-slate-700 ml-7">{notification.standard}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center gap-3">
                          {notification.pdfFileName && (
                            <button
                              className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                              onClick={() => handlePDFDownload(notification.pdfFileName!)}
                            >
                              <FileText className="inline mr-2" size={16} />
                              Download PDF
                            </button>
                          )}
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-sm">
                            ID: {notification.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State when no audits for selected month */}
          {selectedMonth && displayNotifications.length === 0 && (
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
                No Audits Scheduled
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                No audits are currently scheduled for {selectedMonth} {selectedYear}.
              </p>
            </motion.div>
          )}

          {/* Empty State when no audits for entire year */}
          {!selectedMonth && availableMonths.length === 0 && (
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
                No Audits Scheduled
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                No audits are currently scheduled for {selectedYear}. Check back later for updates.
              </p>
            </motion.div>
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