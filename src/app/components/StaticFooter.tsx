import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

export function StaticFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg">DIMA Certification</div>
                <div className="text-xs text-slate-400">Sdn Bhd</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Malaysia's trusted certification body providing expert audit and certification services for 
              ISO standards and MSPO schemes.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-[#d4af37] transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#mspo" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  MSPO Certification
                </a>
              </li>
              <li>
                <a href="#iso9001" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  ISO 9001 (QMS)
                </a>
              </li>
              <li>
                <a href="#iso14001" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  ISO 14001 (EMS)
                </a>
              </li>
              <li>
                <a href="#iso45001" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  ISO 45001 (OHSMS)
                </a>
              </li>
              <li>
                <a href="#consulting" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                  Consulting Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#d4af37] flex-shrink-0 mt-1" size={18} />
                <span className="text-slate-400 text-sm">
                  Kuala Lumpur, Malaysia
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-[#d4af37] flex-shrink-0 mt-1" size={18} />
                <span className="text-slate-400 text-sm">
                  +60 3-XXXX XXXX
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-[#d4af37] flex-shrink-0 mt-1" size={18} />
                <span className="text-slate-400 text-sm">
                  info@dimacertification.com.my
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} DIMA Certification Sdn Bhd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#privacy" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#terms" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#quality" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                Quality Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}