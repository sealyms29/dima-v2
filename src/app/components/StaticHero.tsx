import { Shield, Award, CheckCircle } from 'lucide-react';

export function StaticHero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full mb-6">
              <Shield className="text-[#d4af37]" size={18} />
              <span className="text-sm font-medium text-[#d4af37]">Accredited Certification Body</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Professional Audit &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-400">
                Certification Services
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed">
              DIMA Certification Sdn Bhd is Malaysia's trusted partner for ISO certifications and MSPO schemes. 
              We help corporate clients, SMEs, and plantation companies achieve international standards with integrity and excellence.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <CheckCircle className="text-[#d4af37]" size={20} />
                <span className="font-medium">Expert Auditors</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <CheckCircle className="text-[#d4af37]" size={20} />
                <span className="font-medium">Trusted Process</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <CheckCircle className="text-[#d4af37]" size={20} />
                <span className="font-medium">Fast Turnaround</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                View Our Services
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 font-bold rounded-xl hover:bg-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <Award className="text-[#d4af37] mb-4" size={40} />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-slate-300">Certified Companies</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <Shield className="text-[#d4af37] mb-4" size={40} />
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-slate-300">Years Experience</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 col-span-2">
              <CheckCircle className="text-[#d4af37] mb-4" size={40} />
              <div className="text-4xl font-bold mb-2">4 Standards</div>
              <div className="text-slate-300">MSPO, ISO 9001, ISO 14001, ISO 45001</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 fill-white" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0,24 C360,48 720,0 1440,24 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}
