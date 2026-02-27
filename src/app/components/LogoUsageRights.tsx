import { Shield, AlertCircle, CheckCircle2, XCircle, FileText } from 'lucide-react';

export function LogoUsageRights() {
  const approvedUsages = [
    "Business cards and letterheads",
    "Company website and digital materials",
    "Marketing brochures and presentations",
    "Product packaging (with approval)",
    "Trade show materials and signage"
  ];

  const prohibitedUsages = [
    "Misrepresenting certification scope",
    "Using logos after certificate expiry",
    "Modifying logo colors or proportions",
    "Implying product certification when only system is certified",
    "Transferring logo rights to third parties"
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
            <Shield className="text-[#d4af37]" size={18} />
            <span className="text-sm font-bold text-[#d4af37]">Usage Guidelines</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Name, Mark or Logo Usage Right
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Guidelines for proper use of DIMA Certification marks and logos by certified organizations
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Rights and Permissions */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Shield className="text-[#d4af37]" size={24} />
                Rights Granted to Certified Organizations
              </h3>
            </div>
            <div className="px-8 py-8">
              <p className="text-slate-700 leading-relaxed mb-6">
                Upon successful certification, DIMA Certification grants certified organizations the 
                <strong> non-exclusive right</strong> to use our certification marks and logos in accordance 
                with the following conditions:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#d4af37]/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="text-[#d4af37]" size={14} />
                  </div>
                  <span className="text-slate-700 text-sm">
                    Usage must be within the <strong>scope of certification</strong> only
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#d4af37]/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="text-[#d4af37]" size={14} />
                  </div>
                  <span className="text-slate-700 text-sm">
                    Logo must be displayed <strong>without modification</strong> to design or colors
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#d4af37]/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="text-[#d4af37]" size={14} />
                  </div>
                  <span className="text-slate-700 text-sm">
                    Certificate must remain <strong>valid and current</strong>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#d4af37]/20 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="text-[#d4af37]" size={14} />
                  </div>
                  <span className="text-slate-700 text-sm">
                    Usage rights are <strong>immediately revoked</strong> upon suspension or withdrawal
                  </span>
                </div>
              </div>

              <div className="bg-[#d4af37]/5 border-l-4 border-[#d4af37] pl-4 py-3">
                <p className="text-slate-900 text-sm font-medium">
                  <AlertCircle className="inline mr-2 text-[#d4af37]" size={16} />
                  All logo usage must comply with DIMA Certification's visual identity guidelines
                </p>
              </div>
            </div>
          </div>

          {/* Conditions and Requirements */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="text-[#d4af37]" size={24} />
                Terms and Conditions
              </h3>
            </div>
            <div className="px-8 py-8">
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  Approved Usage
                </h4>
                <div className="space-y-2">
                  {approvedUsages.map((usage, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#d4af37] rounded-full mt-2"></div>
                      <span className="text-slate-700 text-sm">{usage}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <XCircle className="text-red-600" size={20} />
                  Prohibited Actions
                </h4>
                <div className="space-y-2">
                  {prohibitedUsages.map((usage, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></div>
                      <span className="text-slate-700 text-sm">{usage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Logo Package</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Digital logo files in multiple formats provided upon certification
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Approval Process</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Submit materials for review before publishing if uncertain about usage
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle className="text-amber-600" size={24} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Monitoring</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              DIMA reserves the right to monitor and enforce proper logo usage
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl px-8 lg:px-10 py-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            Questions About Logo Usage?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Contact our certification team for guidance on proper use of DIMA Certification marks and logos
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
            Contact Certification Team
          </button>
        </div>
      </div>
    </section>
  );
}
