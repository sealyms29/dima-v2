import { ArrowRight } from 'lucide-react';
// Figma assets removed - use actual image files
const imgMSPOLogo = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';

export function GetQuotationSection() {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Background Decorations - ALWAYS VISIBLE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(100,116,139,0.05),transparent_50%)]" />
      
      {/* Background Shapes - ALWAYS VISIBLE */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl opacity-30" />

      {/* Main Content Container - ALWAYS VISIBLE */}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section - ALWAYS VISIBLE */}
        <div className="text-center mb-16">
          
          {/* Main Heading - ALWAYS VISIBLE */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Get your quotation now<span className="text-[#d4af37]">!</span>
          </h2>
          
          {/* Description - ALWAYS VISIBLE */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We appreciate your trust and will do our best to continue giving you the kind of service you deserve.
          </p>
        </div>

        {/* Certification Buttons Grid - ALL 4 BUTTONS ALWAYS VISIBLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          
          {/* MSPO Button - ALWAYS VISIBLE */}
          <a
            href="/mspo"
            className="group relative block overflow-hidden"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            
            {/* Button Background */}
            <div className="relative h-full bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 group-hover:border-[#d4af37] rounded-2xl p-6 transition-all duration-300 shadow-lg group-hover:shadow-2xl min-h-[220px] flex flex-col items-center justify-center">
              
              {/* Logo Container */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-slate-200 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={imgMSPOLogo} 
                    alt="MSPO Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Text */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#d4af37] transition-colors duration-300 mb-2">
                  MSPO
                </h4>
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300">
                  <span>Get Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </a>
          
          {/* ISO 9001 Button - ALWAYS VISIBLE */}
          <a
            href="/iso-9001"
            className="group relative block overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative h-full bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 group-hover:border-[#d4af37] rounded-2xl p-6 transition-all duration-300 shadow-lg group-hover:shadow-2xl min-h-[220px] flex flex-col items-center justify-center">
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-slate-200 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={imgISO9001Logo} 
                    alt="ISO 9001 Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#d4af37] transition-colors duration-300 mb-2">
                  ISO 9001
                </h4>
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300">
                  <span>Get Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </a>
          
          {/* ISO 14001 Button - ALWAYS VISIBLE */}
          <a
            href="/iso-14001"
            className="group relative block overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative h-full bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 group-hover:border-[#d4af37] rounded-2xl p-6 transition-all duration-300 shadow-lg group-hover:shadow-2xl min-h-[220px] flex flex-col items-center justify-center">
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-slate-200 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={imgISO14001Logo} 
                    alt="ISO 14001 Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#d4af37] transition-colors duration-300 mb-2">
                  ISO 14001
                </h4>
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300">
                  <span>Get Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </a>
          
          {/* ISO 45001 Button - ALWAYS VISIBLE */}
          <a
            href="/iso-45001"
            className="group relative block overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-amber-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative h-full bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 group-hover:border-[#d4af37] rounded-2xl p-6 transition-all duration-300 shadow-lg group-hover:shadow-2xl min-h-[220px] flex flex-col items-center justify-center">
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-slate-200 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={imgISO45001Logo} 
                    alt="ISO 45001 Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#d4af37] transition-colors duration-300 mb-2">
                  ISO 45001
                </h4>
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 group-hover:text-[#d4af37] transition-colors duration-300">
                  <span>Get Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          </a>
          
        </div>

        {/* Additional CTA - ALWAYS VISIBLE */}
        <div className="text-center">
          <p className="text-slate-600 mb-6">
            Need help choosing the right certification?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            Contact Our Team
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
      </div>
    </section>
  );
}