import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { ChevronDown, FileText } from 'lucide-react';
// Figma asset removed - use actual image file
const imgAnnexes = '/assets/d2f7e4afea8e979e18a33eefbc2d66fecb6de6f4.png';

// Collapsible Section Component
function CollapsibleSection({ 
  id, 
  title, 
  children, 
  isOpen, 
  onToggle,
  icon: Icon = FileText
}: { 
  id: string;
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean;
  onToggle: () => void;
  icon?: any;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 md:p-8 lg:p-10 text-left hover:bg-slate-50/50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="text-white" size={24} />
          </div>
          <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-slate-900 leading-tight group-hover:text-[#d4af37] transition-colors">
            {title}
          </h2>
        </div>
        <ChevronDown 
          className={`w-6 h-6 text-slate-600 transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 md:px-8 lg:px-10 pb-6 md:pb-8 lg:pb-10 pt-2">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CertificationMarkPage() {
  // State for collapsible sections - all open by default on desktop
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    intro: true,
    annexes: true,
    standardsMalaysia: true,
    mspo: true,
    statements: true,
    misuse: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <PageLayout>
      <PageHero
        badge="Certification Guidelines"
        title="Name, Mark or Logo Usage Right"
        subtitle="Official policy document governing the use of DIMA certification marks"
      />

      <section className="relative py-12 md:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10">
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Table of Contents - Sticky on Desktop */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
                    On This Page
                  </h3>
                  <nav className="space-y-2">
                    <button
                      onClick={() => scrollToSection('intro')}
                      className="block w-full text-left text-sm text-slate-700 hover:text-[#d4af37] hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      Rules on Use of Mark
                    </button>
                    <button
                      onClick={() => scrollToSection('annexes')}
                      className="block w-full text-left text-sm text-slate-700 hover:text-[#d4af37] hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      Annexes & Examples
                    </button>
                    <button
                      onClick={() => scrollToSection('standardsMalaysia')}
                      className="block w-full text-left text-sm text-slate-700 hover:text-[#d4af37] hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      Standards Malaysia Mark
                    </button>
                    <button
                      onClick={() => scrollToSection('mspo')}
                      className="block w-full text-left text-sm text-slate-700 hover:text-[#d4af37] hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      MSPO Logo
                    </button>
                    <button
                      onClick={() => scrollToSection('statements')}
                      className="block w-full text-left text-sm text-slate-700 hover:text-[#d4af37] hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      Use of Statements
                    </button>
                    <button
                      onClick={() => scrollToSection('misuse')}
                      className="block w-full text-left text-sm text-slate-700 hover:text-[#d4af37] hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      Misuse of Marks
                    </button>
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 space-y-6 md:space-y-8">
              
              {/* Page Title */}
              <div className="mb-8 md:mb-10">
                <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-slate-900 mb-2 leading-tight">
                  RULES ON THE USE OF DIMA CERTIFICATION MARK
                </h1>
                <div className="h-1 w-24 bg-[#d4af37] rounded-full mt-4"></div>
              </div>

              {/* Section 1: Introduction */}
              <CollapsibleSection
                id="intro"
                title="General Usage Guidelines"
                isOpen={openSections.intro}
                onToggle={() => toggleSection('intro')}
              >
                <div className="space-y-6">
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    These rules specify how DIMA certification mark shall be depicted and the conditions relating to their use. A client whose has been certified by DIMA is entitled to use the certification mark of DIMA CERTIFICATION.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    For multi-site organizations, only sites whose activities are included in the scope of the certification may use the applicable certification mark. The right to use the certification mark does not extend to the parent company or to the subsidiaries) of the certified client unless these entities are also included in the certification. DIMA certification mark may be used on its own or in combination with the accreditation mark which appears on the certificate issued to the client. The mark used shall clearly reflect the management system for which the client has been certified. The applicable mark when used on its own shall be as shown in Annex 1.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    For a client whose has been certified to more than one standard e.g., a single mark may be used but the applicable standards and certification numbers shall be specified below the mark. The certification marks may be used in literature, stationery and advertising. However, they shall not be used on products or packaging (both primary and secondary), and laboratory test, calibration or inspection reports or certificates, as such reports or certificates are deemed to be products in this context.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The official artwork of certification marks in Annex 1 may be obtained from DIMA via email to <a href="mailto:adimacertification@gmail.com" className="text-[#d4af37] font-semibold hover:underline transition-colors">adimacertification@gmail.com</a> in the case of preprinted material e.g. letterhead, stationery, newspaper and magazine articles, the certification marks may be reproduced in the predominant colour of these items. The marks and associated text shall always follow the relative proportions as illustrated in Annex 1 although they may be uniformly enlarged or reduced The lower limit of the size of the marks shall be such that the associated text is clearly legible. The marks shall always be used with the associated text.
                  </p>
                  
                  <div className="bg-slate-900 rounded-xl p-6 md:p-7 mt-6">
                    <p className="text-white text-[1.0625rem] leading-[1.85]">
                      The use of DIMA name, corporate logo, trademarks or any intellectual property under any circumstances without prior written approval of the top management is strictly forbidden.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 2: Annexes */}
              <CollapsibleSection
                id="annexes"
                title="Annexes - Certification Mark Examples"
                isOpen={openSections.annexes}
                onToggle={() => toggleSection('annexes')}
              >
                <div className="space-y-6">
                  <p className="text-slate-600 text-[1rem] leading-[1.75]">
                    Official artwork showing all annexes referenced in this document
                  </p>
                  
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <img 
                      src={imgAnnexes} 
                      alt="DIMA Certification Mark Annexes" 
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Section 3: Standards Malaysia */}
              <CollapsibleSection
                id="standardsMalaysia"
                title="Certification Mark with Standards Malaysia Accreditation Mark"
                isOpen={openSections.standardsMalaysia}
                onToggle={() => toggleSection('standardsMalaysia')}
              >
                <div className="space-y-6">
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The DIMA certification mark may be used in combination with the Standards Malaysia accreditation mark by a client who has been issued with a Standards Malaysia accredited certificate as per the Accreditation Policy 1 (AP 1). In all instances where the accreditation mark is used by the client, it shall be together with the certification mark with associated text as shown in Annex 2.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The marks, when used in combination, shall be used as depicted in Annex 2. The client, however, may use the Standards Malaysia mark in black and white and may be obtained the official artwork from DIMA via email to <a href="mailto:adimacertification@gmail.com" className="text-[#d4af37] font-semibold hover:underline transition-colors">adimacertification@gmail.com</a>.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The combined marks, as depicted in Annex 2, may be uniformly enlarged or reduced, but all the accompanying text shall always remain legible. The combined marks may be used in literature, stationery and advertising. The marks shall not be used on products or packaging (both primary and secondary), and laboratory test, calibration or inspection reports or certificates, as such reports or certificates are deemed to be products in this context.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 4: MSPO Logo */}
              <CollapsibleSection
                id="mspo"
                title="Certification Mark with MSPO Logo"
                isOpen={openSections.mspo}
                onToggle={() => toggleSection('mspo')}
              >
                <div className="space-y-6">
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The MSPO logo is the certification mark related to the MSPO certification scheme. It can be a symbol of the connection with MSPO, in terms of promoting, supporting, collaborating, and acting as an indicator where the organisation is certified with MSPO certification.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The MSPO logo shall be used in combination with the DIMA certification mark and may only be used by the certified client according to the following rules:
                  </p>
                  
                  <ul className="space-y-3 pl-7">
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      Always in conjunction with DIMA certification mark with associated text as shown in Annex 3
                    </li>
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      clearly linked to the name of the certified organization
                    </li>
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      within the validity period of the DIMA certificate
                    </li>
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      within the certified scope/ area
                    </li>
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      without any changes
                    </li>
                  </ul>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The marks and associated text shall always follow the relative proportions as illustrated in Annex 1 although they may be uniformly enlarged or reduced. The lower limit of the size of the marks shall be such that the associated text is clearly legible. The marks shall always be used with the associated text.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The certification mark together with the MSPO logo may be used in documents, signs, windows, website and advertising media. When the certificate coverage/scope does not cover all activities of the certified client and/or when its use may induce an error on the certified scope, a clear description of the certificate coverage/scope shall be made together with the MSPO logo.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The certification mark shall not be used on products nor on primary packaging or any secondary packaging which could reach the end user (eg. a tray containing cartons of milk, a box containing multiple packs of 500 sheets of photocopy paper, etc.). Shall also not be used related to any kind of management system certification when forbidden by legal requirements unless the client is certified for product certification.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 5: Use of Statements */}
              <CollapsibleSection
                id="statements"
                title="Use of Statements Referring to the Certification (Applicable to all the marks referred in Annexes)"
                isOpen={openSections.statements}
                onToggle={() => toggleSection('statements')}
              >
                <div className="space-y-6">
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    The use of any of the management certification marks on products is strictly prohibited. This prohibition includes all primary and secondary packaging. (unless the client is certified to product certification)
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    However, a client whose management system has been certified by DIMA is entitled to use a statement on product packaging or in accompanying information that it has a certified management system. Product packaging is considered as that which can be removed without the product disintegrating or being damaged. Accompanying information is considered as separately available or easily detachable. Type labels or identification plates are considered as part of the product. The statement shall in no way imply that the product, process or service is certified.
                  </p>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    Where such a statement is used, it shall include reference to:
                  </p>
                  
                  <ul className="space-y-3 pl-7">
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      identification (eg brand or name) of the certified client
                    </li>
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      the type of management system and the applicable standard
                    </li>
                    <li className="text-[1.0625rem] text-slate-800 leading-[1.85] relative before:content-['•'] before:absolute before:-left-7 before:text-[#d4af37] before:font-bold before:text-xl">
                      the name of the certification body i.e. DIMA Certification Sdn Bhd
                    </li>
                  </ul>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    An example of a statement that may be used is as follows;
                  </p>
                  
                  <div className="bg-slate-100 border-l-4 border-[#d4af37] rounded-r-xl p-6 md:p-7">
                    <p className="text-slate-900 text-[1.0625rem] font-semibold italic leading-[1.85]">
                      "Manufactured by ABC Sdn. Bhd. whose management system is certified to MS 2530 by DIMA Certification."
                    </p>
                  </div>
                  
                  <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                    Equivalent statements, carrying the same meaning, may be acceptable.
                  </p>
                </div>
              </CollapsibleSection>

              {/* Section 6: Misuse */}
              <CollapsibleSection
                id="misuse"
                title="Misuse of the Certification Marks"
                isOpen={openSections.misuse}
                onToggle={() => toggleSection('misuse')}
              >
                <div className="space-y-5">
                  <div className="border-l-4 border-red-500 pl-6 md:pl-7 py-4 bg-red-50/40 rounded-r-lg">
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      Any recreating/ reproducing of the certification mark without prior written approval by DIMA is strictly forbidden.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6 md:pl-7 py-4 bg-red-50/40 rounded-r-lg">
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      Any act such as addition and/or omission by certified client with or without intention that has breach the term and guidelines provided herein shall be considered as an act of misuse of the certification mark.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6 md:pl-7 py-4 bg-red-50/40 rounded-r-lg">
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      DIMA shall have the right to make an investigation related to the relevant standard system without giving notice to the certified client once DIMA received such a complaint
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6 md:pl-7 py-4 bg-red-50/40 rounded-r-lg">
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      DIMA shall have the right to terminate the certified client and the agreement with the certified client if it is shown there are evidence of misuse of the certification mark.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6 md:pl-7 py-4 bg-red-50/40 rounded-r-lg">
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      DIMA shall have the right to claim from the certified client for any loss and cost incurred that DIMA has to suffer as a result of the misuse including legal proceedings and public notification costs.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-6 md:pl-7 py-4 bg-red-50/40 rounded-r-lg">
                    <p className="text-[1.0625rem] text-slate-800 leading-[1.85]">
                      DIMA shall have the right to make a claim through court jurisdiction if the remedy provided by arbitration is not sufficient to cover the loss and cost suffered by DIMA due to the misuse.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

            </main>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}