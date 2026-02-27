// Figma assets removed - use actual image files
const imgMSPOLogo = '/assets/660c856aa747ee61d8736225fb4e8a2223cba616.png';
const imgISO9001Logo = '/assets/f6b29378242e360ef76c08104138a1ba5b1221cf.png';
const imgISO14001Logo = '/assets/2d9026f9e22edaafe364adfbbe2c34557e69572a.png';
const imgISO45001Logo = '/assets/87b8275a2bdc8c27df956c8d594d5a341e9c6866.png';
import { Award } from 'lucide-react';

export function CertificationStandards() {
  const certifications = [
    {
      name: "MSPO",
      fullName: "Malaysian Sustainable Palm Oil",
      description: "Sustainable palm oil certification standard ensuring environmental responsibility and ethical production practices for Malaysian plantations.",
      logo: imgMSPOLogo,
      benefits: [
        "Internationally recognized sustainability",
        "Market access advantages",
        "Environmental compliance",
        "Enhanced brand reputation"
      ]
    },
    {
      name: "ISO 9001",
      fullName: "Quality Management Systems (QMS)",
      description: "International standard for quality management excellence, helping organizations consistently deliver products and services that meet customer requirements.",
      logo: imgISO9001Logo,
      benefits: [
        "Improved customer satisfaction",
        "Process efficiency gains",
        "Competitive market advantage",
        "Continuous improvement culture"
      ]
    },
    {
      name: "ISO 14001",
      fullName: "Environmental Management Systems (EMS)",
      description: "Global standard for environmental management, enabling organizations to improve environmental performance and reduce ecological impact.",
      logo: imgISO14001Logo,
      benefits: [
        "Reduced environmental impact",
        "Regulatory compliance",
        "Cost savings through efficiency",
        "Stakeholder confidence"
      ]
    },
    {
      name: "ISO 45001",
      fullName: "Occupational Health & Safety Management (OHSMS)",
      description: "International standard for workplace health and safety, protecting employees and creating safer working environments across industries.",
      logo: imgISO45001Logo,
      benefits: [
        "Reduced workplace incidents",
        "Legal compliance assurance",
        "Improved employee morale",
        "Lower insurance costs"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
            <Award className="text-[#d4af37]" size={18} />
            <span className="text-sm font-bold text-[#d4af37]">Certification Standards</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Our Certification Programmes
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            DIMA Certification provides expert audit and certification services across four internationally 
            recognized standards, helping your organization achieve excellence.
          </p>
        </div>

        {/* Certification Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Logo Section */}
              <div className="bg-white p-8 border-b border-slate-200 flex items-center justify-center min-h-[220px]">
                <img
                  src={cert.logo}
                  alt={`${cert.name} Logo`}
                  className="w-full max-w-[280px] h-auto object-contain"
                />
              </div>

              {/* Content Section */}
              <div className="p-8">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-lg flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">
                      {cert.fullName}
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed mb-6">
                  {cert.description}
                </p>

                <div className="space-y-2.5">
                  <div className="text-sm font-bold text-slate-900 mb-3">Key Benefits:</div>
                  {cert.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 bg-[#d4af37]/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                  Learn More About {cert.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-10 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Get Certified?
          </h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Our expert auditors are ready to guide you through the certification process. 
            Contact us today to discuss your requirements.
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
            Contact Our Team
          </button>
        </div>
      </div>
    </section>
  );
}