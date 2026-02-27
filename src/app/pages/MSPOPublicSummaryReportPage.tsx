import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { FileText, Calendar, Download, Award, Building2, CheckCircle } from 'lucide-react';

interface SummaryReport {
  id: string;
  title: string;
  companyName: string;
  auditType: 'Initial' | 'Re-certification' | 'Surveillance';
  standard: string;
  pdfFileName: string;
  certificationDate?: string;
}

interface MonthData {
  month: string;
  reports: SummaryReport[];
}

export function MSPOPublicSummaryReportPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  // Mock data - in real implementation, this would come from a database
  const reportsByYear: Record<string, MonthData[]> = {
    '2025': [
      {
        month: 'JANUARY',
        reports: [
          {
            id: 'R2025001',
            title: 'AUDIT REPORT SUMMARY – RECERTIFICATION PALMSIDE PLANTATION SDN BHD',
            companyName: 'Palmside Plantation Sdn Bhd',
            auditType: 'Re-certification',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-Palmside Plantation RC',
            certificationDate: '2025-01-15'
          },
          {
            id: 'R2025002',
            title: 'AUDIT REPORT SUMMARY – SINONG PELITA MATU SDN BHD',
            companyName: 'Sinong Pelita Matu Sdn Bhd',
            auditType: 'Initial',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-Sinong Pelita Matu',
            certificationDate: '2025-01-18'
          },
          {
            id: 'R2025003',
            title: 'AUDIT REPORT SUMMARY – UNISTATE SEA FOOD (SABAH) SDN BHD',
            companyName: 'Unistate Sea Food (Sabah) Sdn Bhd',
            auditType: 'Surveillance',
            standard: 'MSPO 2544-5:2022',
            pdfFileName: 'DMC-MSPO-PSR-Unistate Sea Food SV1',
            certificationDate: '2025-01-20'
          },
          {
            id: 'R2025004',
            title: 'AUDIT REPORT SUMMARY – SARAWAK GREEN PLANTATION SDN BHD RECERT',
            companyName: 'Sarawak Green Plantation Sdn Bhd',
            auditType: 'Re-certification',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-Sarawak Green Plantation RC',
            certificationDate: '2025-01-22'
          },
          {
            id: 'R2025005',
            title: 'AUDIT REPORT SUMMARY – RICH RETURNS PLANTATION SDN BHD',
            companyName: 'Rich Returns Plantation Sdn Bhd',
            auditType: 'Initial',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-Rich Returns Plantation',
            certificationDate: '2025-01-25'
          },
          {
            id: 'R2025006',
            title: 'AUDIT REPORT SUMMARY – LL PROSPECT SDN BHD',
            companyName: 'LL Prospect Sdn Bhd',
            auditType: 'Surveillance',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-LL Prospect SV2',
            certificationDate: '2025-01-28'
          },
          {
            id: 'R2025007',
            title: 'AUDIT SUMMARY REPORT SCCS LCH PALM OIL MILL SDN BHD',
            companyName: 'SCCS LCH Palm Oil Mill Sdn Bhd',
            auditType: 'Surveillance',
            standard: 'MSPO 2544-5:2022',
            pdfFileName: 'DMC-MSPO-PSR-SCCS LCH Palm Oil Mill SV1',
            certificationDate: '2025-01-29'
          },
          {
            id: 'R2025008',
            title: 'AUDIT REPORT SUMMARY – LCH Palm Oil Mill Sdn Bhd',
            companyName: 'LCH Palm Oil Mill Sdn Bhd',
            auditType: 'Re-certification',
            standard: 'MSPO 2544-5:2022',
            pdfFileName: 'DMC-MSPO-PSR-LCH Palm Oil Mill RC',
            certificationDate: '2025-01-30'
          },
          {
            id: 'R2025009',
            title: 'AUDIT REPORT SUMMARY KTS AGRICULTURE DEVELOPMENT SDN BHD',
            companyName: 'KTS Agriculture Development Sdn Bhd',
            auditType: 'Initial',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-KTS Agriculture Development',
            certificationDate: '2025-01-31'
          },
          {
            id: 'R2025010',
            title: 'AUDIT REPORT SUMMARY Golden Green Plantation SB RECERTIFICATION',
            companyName: 'Golden Green Plantation SB',
            auditType: 'Re-certification',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-Golden Green Plantation RC',
            certificationDate: '2025-01-31'
          }
        ]
      },
      {
        month: 'FEBRUARY',
        reports: [
          {
            id: 'R2025011',
            title: 'AUDIT REPORT SUMMARY – TROPICAL PALM ESTATES SDN BHD',
            companyName: 'Tropical Palm Estates Sdn Bhd',
            auditType: 'Initial',
            standard: 'MSPO 2544-4:2022',
            pdfFileName: 'DMC-MSPO-PSR-Tropical Palm Estates'
          }
        ]
      },
      {
        month: 'MARCH',
        reports: []
      },
      {
        month: 'APRIL',
        reports: []
      },
      {
        month: 'MAY',
        reports: []
      },
      {
        month: 'JUNE',
        reports: []
      },
      {
        month: 'JULY',
        reports: []
      }
    ],
    '2024': [],
    '2023': [],
    '2022': [],
    '2021': [],
    '2020': [],
    '2026': []
  };

  const currentYearData = reportsByYear[selectedYear] || [];
  const availableMonths = currentYearData.filter(m => m.reports.length > 0);
  const selectedMonthData = currentYearData.find(m => m.month === selectedMonth);

  const handlePDFDownload = (pdfFileName: string, reportTitle: string) => {
    alert(`Downloading: ${pdfFileName}.pdf\n\nReport: ${reportTitle}\n\nIn production, this would download the official MSPO public summary report PDF document.`);
  };

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

  const getAuditTypeBadge = (type: string) => {
    switch (type) {
      case 'Initial':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Initial Certification' };
      case 'Re-certification':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Re-certification' };
      case 'Surveillance':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Surveillance Audit' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700', label: type };
    }
  };

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
              Public Summary Report
            </h3>
          </motion.div>

          {/* Month Selection Buttons */}
          {!selectedMonth && availableMonths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4"
            >
              {currentYearData.map((monthData, index) => {
                if (monthData.reports.length === 0) return null;
                
                return (
                  <motion.button
                    key={monthData.month}
                    onClick={() => setSelectedMonth(monthData.month)}
                    className="w-full max-w-md px-10 py-5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all uppercase"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {monthData.month} {selectedYear}
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Back Button and Report List */}
          {selectedMonth && selectedMonthData && (
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
                  Public Summary Report ({selectedMonth}){selectedYear}
                </h3>
                
                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={20} />
                  <span>Export All</span>
                </motion.button>
              </div>

              {/* PDF Report List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-2 border-slate-200 rounded-3xl p-10 shadow-lg mb-12"
              >
                <div className="space-y-1">
                  {selectedMonthData.reports.map((report, index) => (
                    <motion.button
                      key={report.id}
                      onClick={() => handlePDFDownload(report.pdfFileName, report.title)}
                      className="w-full text-left group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-start gap-3 py-3 border-b border-slate-100 hover:border-[#d4af37] transition-colors">
                        <FileText className="text-[#d4af37] flex-shrink-0 mt-1" size={20} />
                        <span className="text-[#d4af37] hover:text-amber-600 font-medium transition-colors text-lg">
                          {report.title}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Detailed Report Cards */}
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Detailed Report Information</h3>
              <div className="space-y-6">
                {selectedMonthData.reports.map((report, index) => {
                  const badge = getAuditTypeBadge(report.auditType);
                  
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-lg group-hover:shadow-2xl transition-all">
                        <div className="flex items-start justify-between gap-6 mb-6">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-16 h-16 bg-gradient-to-br ${getAuditTypeColor(report.auditType)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                              <Award className="text-white" size={32} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <h4 className="text-xl font-bold text-slate-900 flex-1">
                                  {report.companyName}
                                </h4>
                                <span className={`px-4 py-2 ${badge.bg} ${badge.text} text-sm font-bold rounded-lg whitespace-nowrap`}>
                                  {badge.label}
                                </span>
                              </div>
                              
                              <p className="text-slate-600 mb-4 leading-relaxed">
                                {report.title}
                              </p>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-slate-600">
                                <div className="flex items-center gap-2">
                                  <Building2 className="text-[#d4af37] flex-shrink-0" size={18} />
                                  <span className="font-semibold">Standard:</span>
                                  <span>{report.standard}</span>
                                </div>
                                
                                {report.certificationDate && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="text-[#d4af37] flex-shrink-0" size={18} />
                                    <span className="font-semibold">Date:</span>
                                    <span>{new Date(report.certificationDate).toLocaleDateString('en-MY', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t-2 border-slate-100 pt-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-sm">
                                Report ID: {report.id}
                              </span>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                ✓ Published
                              </span>
                            </div>
                            
                            <button
                              className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                              onClick={() => handlePDFDownload(report.pdfFileName, report.title)}
                            >
                              <FileText className="inline mr-2" size={18} />
                              Download PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Empty State when no reports for entire year */}
          {!selectedMonth && availableMonths.length === 0 && (
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
