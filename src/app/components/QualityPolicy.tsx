import { FileText, Target, Users, TrendingUp } from 'lucide-react';

export function QualityPolicy() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
            <FileText className="text-[#d4af37]" size={18} />
            <span className="text-sm font-bold text-[#d4af37]">Our Commitment</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Quality Policy Statement
          </h2>
        </div>

        {/* Main Policy Card */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 lg:px-10 py-6">
            <h3 className="text-xl lg:text-2xl font-bold text-white">
              DIMA Certification Sdn Bhd Quality Policy
            </h3>
          </div>

          <div className="px-8 lg:px-10 py-10">
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-800 leading-relaxed mb-6">
                DIMA Certification Sdn Bhd is committed to providing <strong>professional, impartial, and 
                competent certification services</strong> that meet the needs of our clients and comply with 
                all applicable statutory, regulatory, and accreditation requirements.
              </p>

              <p className="text-slate-800 leading-relaxed mb-6">
                We are dedicated to maintaining the <strong>highest standards of integrity</strong> in all our 
                certification activities, ensuring that our services are delivered with transparency, 
                consistency, and technical excellence.
              </p>

              <div className="bg-[#d4af37]/5 border-l-4 border-[#d4af37] pl-6 py-4 my-8">
                <p className="text-slate-900 font-medium italic text-lg">
                  "Our commitment is to deliver certification services that build trust, enhance credibility, 
                  and create value for organizations across Malaysia and beyond."
                </p>
              </div>

              <p className="text-slate-800 leading-relaxed">
                Through continuous improvement of our Quality Management System, we ensure that our audit 
                processes remain robust, our auditors stay competent, and our clients receive exceptional 
                service that supports their journey towards international standards compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center mb-4">
              <Target className="text-white" size={28} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2 text-lg">Impartiality</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              We maintain independence and objectivity in all certification decisions
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center mb-4">
              <Users className="text-white" size={28} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2 text-lg">Competence</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our auditors possess the expertise and qualifications required for excellence
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center mb-4">
              <FileText className="text-white" size={28} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2 text-lg">Compliance</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Full adherence to accreditation bodies and regulatory requirements
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="text-white" size={28} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2 text-lg">Improvement</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Continuous enhancement of our processes and service delivery
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
