import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { FileText, Download, ArrowLeft, List } from 'lucide-react';
import { Link } from 'react-router';

interface AgreementData {
  title: string;
  description: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  version: string;
  issue_date: string;
  has_pdf: boolean;
}

// Table of Contents sections
const tocSections = [
  { id: "general-conditions", number: "1", title: "General Conditions" },
  { id: "terms-of-payment", number: "2", title: "Terms of Payment" },
  { id: "rights-duties-pre-cert", number: "3", title: "Rights and Duties of Organization (Pre-Certification)" },
  { id: "post-cert-terms", number: "4", title: "Terms of Certification (Post Certification)" },
  { id: "responsibilities", number: "5", title: "Responsibilities of DIMA Certification" },
  { id: "confidentiality", number: "6", title: "Confidentiality" },
  { id: "short-notice-audit", number: "7", title: "Short Notice Audit" },
  { id: "certification-recommendation", number: "8", title: "Certification Recommendation" },
  { id: "liability", number: "9", title: "Liability" },
  { id: "force-majeure", number: "10", title: "Force Majeure" },
  { id: "disputes", number: "11", title: "Disputes" },
  { id: "signatures", number: "", title: "Agreement Signatures" },
];

export function CertificationAgreementPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);
  const [activeSection, setActiveSection] = useState<string>("general-conditions");

  useEffect(() => {
    fetch('/api/public-certification-agreement.php')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAgreementData(data.data);
        }
      })
      .catch(err => console.error('Error fetching agreement:', err));
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocSections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocSections[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownload = () => {
    if (agreementData?.file_path) {
      const link = document.createElement('a');
      link.href = agreementData.file_path;
      link.download = agreementData.file_name || 'certification_agreement.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      <PageHero
        badge="Legal Document"
        title="Certification Terms & Conditions"
        subtitle={agreementData?.title || "DMC/ISO/QCA Quotation Certification Agreement"}
      />

      <section className="relative py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Bar with Download */}
          <motion.div
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-6 bg-white rounded-xl border border-slate-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-white" size={22} />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  {agreementData?.title || 'Certification Agreement'}
                </h2>
                {agreementData?.version && (
                  <p className="text-sm text-slate-500">
                    {agreementData.version}
                    {agreementData.issue_date && ` • ${new Date(agreementData.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                  </p>
                )}
              </div>
            </div>
            {agreementData?.has_pdf && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-600 hover:to-[#d4af37] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </button>
            )}
          </motion.div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar - Table of Contents */}
            <motion.aside
              className="lg:w-72 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="lg:sticky lg:top-24 bg-white rounded-xl border border-slate-200 shadow-sm p-5 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <List size={18} className="text-[#d4af37]" />
                  <h3 className="font-bold text-slate-900">Table of Contents</h3>
                </div>
                <nav className="space-y-1">
                  {tocSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-[#d4af37]/10 text-[#d4af37] font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {section.number && <span className="font-semibold mr-1">{section.number}.</span>}
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
              className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 md:p-8 lg:p-10">
                  {/* Document Introduction */}
                  <div className="mb-10 pb-8 border-b border-slate-200">
                    <p className="text-slate-600 leading-relaxed">
                      {agreementData?.description || 'This document outlines the general conditions, payment terms, rights and duties of client organizations, confidentiality requirements, and the responsibilities of DIMA Certification throughout the certification process.'}
                    </p>
                  </div>

                  {/* Section 1 */}
                  <section id="general-conditions" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">1</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">General Conditions</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>1.1</strong> DIMA CERTIFICATION will conduct Audit, Assessment, Verification and Certification based on selected international certification standards. The client organization will be assessed for the Scheme/Multi-Scheme Management System (s) Standard (s) applicable to the organization's agreed scope of certification by an audit team based on size and competency requirements.</p>
                      <p><strong>1.2</strong> During the Certification, (including any subsequent surveillance, re-certifications, continuing updating, transfer audits and/or visits) the client shall provide all relevant documentation, records and otherwise as determined by DIMA CERTIFICATION and allow access to all the relevant levels of personnel. All information provided to DIMA CERTIFICATION is subject to internal audit and/or regulatory investigation as well as assessment by assessors from the respective.</p>
                      <p><strong>1.3</strong> Accreditation body(s). Client shall ensure that the regulatory requirements specific to product or safety are complied legally by making declarations, providing the details of the applicable regulatory requirements. Client Organization shall also provide information related to complaints received from customers or third party.</p>
                      <p><strong>1.4</strong> If a client is dissatisfied with a member of the audit team, DIMA CERTIFICATION will consider for changing that team member but will allow the audit to proceed unless there is a conflict of interest. An auditor with a conflict of interest should not visit the client's premises.</p>
                      <p><strong>1.5</strong> Approval: Certification Process or Decision of Re-certification shall be made within 60 days after completion of the Final Audit stage.</p>
                      <p><strong>1.6</strong> The term "certificate" shall include any mark of conformity or copy thereof issued by DIMA CERTIFICATION.</p>
                      <p><strong>1.7</strong> Cancellation of certification is the obligation of the client not of the DIMA CERTIFICATION. When the client wishes to cancel the certification with DIMA CERTIFICATION then they shall inform DIMA CERTIFICATION in writing at least 30 days prior to the certification cancellation date otherwise due fees will be charged to the client.</p>
                      <p><strong>1.8</strong> Tax, charges, fees or other out of pocket expenses etc. payable as per Government rules, shall be borne by Client. The service tax will be charged as applicable.</p>
                    </div>
                  </section>

                  {/* Section 2 */}
                  <section id="terms-of-payment" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">2</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Terms of Payment</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>2.1</strong> Initial Stage Audit: Client & DIMA CERTIFICATION mutually agree the plan of Initial stage audit. The plan is prepared to assess the operational areas and activities based on selected international certification standards for the agreed scope of certification.</p>
                      <p><strong>2.2</strong> Client shall arrange all valid invoices to be paid in advance before the relevant audit will be undertaken. Once undertaken, audits shall be deemed completed. For Initial Stage/Initial Management System Certification Audit the entire payment has to be made in advance before the audit. For Surveillance Audits due annually, the client shall arrange payment of invoice at least 30 days in advance of the Surveillance Audit Date.</p>
                      <p><strong>2.3</strong> Failure to pay Invoices may result in certificate suspension.</p>
                      <p><strong>2.4</strong> All expenses like travel, conveyance, boarding / lodging and any other out of pocket expenses will be borne by the Client Organization. In the event of organization's decision to cancel any audits 7 working days without prior notice to DIMA CERTIFICATION, a 50% service charge will be applied to the total quoted cost for that specific audit. This charge is designed to cover the costs associated with the audit team's time and resources, including preparation and travel arrangements that have already been undertaken.</p>
                      <p><strong>2.5</strong> The Client is required to obtain all applicable governmental permits and approvals, if any required, before implementing business and the same must be informed to DIMA CERTIFICATION.</p>
                    </div>
                  </section>

                  {/* Section 3 */}
                  <section id="rights-duties-pre-cert" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">3</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Rights and Duties of Organization (Pre-Certification)</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>3.1</strong> The client shall cooperate with the audit team all the times and make available the management system documents and records and make all necessary arrangements for the conduct of audits, including provisions for examining documentation and the access to all areas, records and personnel as applicable for the purposes of certification, Re-certification, Special, Surveillance, Transfer, Expansion and Reduction of Scope and Extension of Audit.</p>
                      <p><strong>3.2</strong> Client shall provide records and documentary evidence to demonstrate compliance to statutory and regulatory requirements.</p>
                      <p><strong>3.3</strong> Client shall provide documentation identifying all locations and premises from where activities relating to and within scope of audit is conducted.</p>
                      <p><strong>3.4</strong> Complaints and appeals: Client Organisations have the right to appeal against any decision taken by DIMA CERTIFICATION. Client Organization has the right to complain against assessment/findings/decisions taken by DIMA CERTIFICATION auditor/independent auditor and the decision shall be disclosed to third party. The actions taken by you on these complaints shall be notified and communicated to DIMA CERTIFICATION. If not satisfied, the matter may be referred to the accreditation body.</p>
                      <p><strong>3.5</strong> Client Organization shall not imply that the certification applies to activities that are outside the sector and scope of certification.</p>
                      <p><strong>3.6</strong> Client Organization shall not use its certification in such a manner that would bring the certification body and/or certification system into disrepute or and lose public trust.</p>
                      <p><strong>3.7</strong> Organization shall indemnify the certification body for any expense arising from any legal action against the certification body as a result of the Organization misusing its Certificate of Registration.</p>
                      <p><strong>3.8</strong> Client Organization shall follow the terms of Contract.</p>
                    </div>
                  </section>

                  {/* Section 4 */}
                  <section id="post-cert-terms" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">4</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Terms of Certification (Post Certification)</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>4.1</strong> Surveillance audit: The client organization shall agree to co-operate and facilitate DIMA CERTIFICATION Audit Team in conducting surveillance audits in accordance with the time frame prescribed by DIMA CERTIFICATION.</p>
                      <p><strong>4.2</strong> Re-Certification audit: The purpose of the re-certification audit is to confirm the continued conformity and effectiveness of the management system as a whole, and its continued relevance and applicability for the scope of certification. Re-certification is usually conducted 2-3 months prior to the date of expiry of the certificate.</p>
                      <p><strong>4.3</strong> Voluntary withdrawal: Client may request for suspension / withdrawal of certificate on temporary basis if they feel that their existing system does not comply / conform to the requirements of the standard.</p>
                      <p><strong>4.4</strong> Suspension and withdrawal and Restoration: DIMA CERTIFICATION will impose the suspension based on the conditions defined and which are publicly available on the website.</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li><strong>4.4.1</strong> DIMA CERTIFICATION will Suspend and / or withdraw the certificate if the client fails to meet the requirements of the Standard or Criteria, fees and / or expenses incurred by DIMA CERTIFICATION are not paid / cleared and in the opinion of the auditor that the terms of business of DIMA CERTIFICATION you are complying with, is not established.</li>
                        <li><strong>4.4.2</strong> The reasons which caused suspension shall be complied within 30 days.</li>
                        <li><strong>4.4.3</strong> In case the client organization has not complied with then suspended certificate will be withdrawn.</li>
                        <li><strong>4.4.4</strong> Under the withdrawal of certification, the organization shall return the original certification and other related documents.</li>
                        <li><strong>4.4.5</strong> Upon suspension and withdrawal of certification, the Organization shall discontinue its use of all advertising matter that contains reference to certification as directed by DIMA CERTIFICATION.</li>
                        <li><strong>4.4.6</strong> The Client organization can restore the certification with 6 months of the suspension after complying all the condition by which the certificate was suspended.</li>
                      </ul>
                      <p><strong>4.5</strong> The client shall agree to inform DIMA CERTIFICATION any changes with respect to Management System, Organizational change including Legal, Commercial, Organizational status, ownership, Changes in personnel like managerial, decision making and Technical staff, change of location or address or site, changes in the certified scope and any major changes in management system and processes including additional or deletion of processes / activities, fatal incidents, serious injuries, occupational disease or legal action by a regulatory authority and DIMA CERTIFICATION will take the appropriate action.</p>
                      <p><strong>4.5.1</strong> Any such issues related OHS finding by any third party shall be brought into notice of DIMA CERTIFICATION during Surveillance or Re-Certification Audit.</p>
                      <p><strong>4.5.2</strong> Certification is granted and maintained based on the limited sampling audit and DIMA CERTIFICATION shall not be responsible for the client's failure to maintain the implemented documented system.</p>
                      <p><strong>4.6</strong> Complaints and appeals: Client Organization has the right to complain against assessment / findings on decisions taken by DIMA CERTIFICATION auditor / independent auditor. The complaint shall be in writing and an independent investigation shall be carried out DIMA CERTIFICATION and the findings of the complaint will be intimated to client organization. Client organization have the right to appeal against any decision taken. Any complaints received from third party will be forwarded to you regarding and the decision shall be disclosed to third party. The actions taken by you on these complaints shall be notified and communicated to DIMA CERTIFICATION.</p>
                      <p><strong>4.7</strong> The client Organization hereby warrants and covenants with DIMA CERTIFICATION that it will, at all times, during the subsistence of the Agreement comply with all DIMA CERTIFICATION requirements necessary for the issuance of the Certificate of Registration including (but without prejudice to the generality thereof) all statutes, rules, regulations issued by any statutory or other competent authority, all recommendations, codes and similar matters issued by any authority, pursuant to which in compliance of which or for the purpose of which the Certificate of Registration is issued or such other reasonable requirements of DIMA CERTIFICATION as are Necessary to enable the Certificate of Registration to be issued and maintained in force in conformity with DIMA CERTIFICATION's Accredited Quality System Certification Scheme Regulations.</p>
                      <p><strong>4.8</strong> The organization shall ensure that the information provided to DIMA CERTIFICATION by the organization, relevant to its management system is kept updated and it shall promptly notify DIMA CERTIFICATION of any intended change in its Management system which would significantly affect the effective implementation of its management system. Changes such as contact address and sites, legal status, scope of Certification, organizational structural changes need to be communicated to the DIMA CERTIFICATION.</p>
                      <p><strong>4.9</strong> Client Organization shall not use or present the use of certification document in a misleading manner or make such statements.</p>
                      <p><strong>4.10</strong> Client Organization shall amend all advertising matter when the sector and scope of certification has been reduced.</p>
                      <p><strong>4.11</strong> Client Organization shall not allow reference to its management system certification to be used in such a way, as to imply that DIMA CERTIFICATION has certified a product or services or process.</p>
                      <p><strong>4.12</strong> Client Organization shall not imply that the certification applies to activities that are outside the sector and scope of certification.</p>
                      <p><strong>4.13</strong> Client Organization shall not use its certification in such a manner that would bring the certification body and/or certification system into disrepute or loose public trust.</p>
                      <p><strong>4.14</strong> Certified Client Organization informs to DIMA CERTIFICATION without delay, of matters that may affect the capability of the management system to continue to fulfill the requirements of the standard used for certification. These include, for example, changes relating to the legal, commercial, organizational status or ownership, organization, and management (e.g. key managerial, decision-making, or technical staff), contact address and sites, scope of operations under the certified management system, and major changes to the management system and processes. DIMA CERTIFICATION shall review the changes and may conduct the audit to verify the changes.</p>
                      <p><strong>4.15</strong> Allow the Accreditation Board Assessors with or without DIMA CERTIFICATION Audit Team to verify the relevant documents and records maintained for Management System Certification, the information about the audit will be provided well in advance.</p>
                      <p><strong>4.16</strong> DIMA CERTIFICATION may at any time, refuse to issue a certificate or suspend or cancel such certificate in circumstances where, in DIMA CERTIFICATION's opinion, compliance with the specified standard/ specification (including not meeting the regulatory requirements) is not maintained on continuous basis or conditions of this contract are not met. In case of cancellation, the customer's name shall be removed from the register of certified companies and such information may be available to public.</p>
                      <p><strong>4.17</strong> The Client organization shall declare in advance that any of its employee does not have any conflict of Interest with the DIMA CERTIFICATION.</p>
                    </div>
                  </section>

                  {/* Section 5 */}
                  <section id="responsibilities" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">5</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Responsibilities of DIMA Certification</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>5.1</strong> DIMA CERTIFICATION shall inform the client, in advance, that the name, Geographical Location, scope of certification, Date of Issue, Date of Expiry, Date of Surveillance audit and status and standard of the certification are the information which intends to place in the public Domain and the any other information which is not meant to public domain asked by public cannot be provided until and unless permission is taken from the client.</p>
                      <p><strong>5.2</strong> Any information about the client (e.g., complaint, Notice or feedback) received by DIMA CERTIFICATION from the any person other than client like complainant/Regulators/Statutory bodies or any other person shall be treated confidential and can't not be disclosed to client.</p>
                      <p><strong>5.3</strong> All other information, except for information that is made publicly accessible by the client, will be considered confidential by DIMA CERTIFICATION.</p>
                      <p><strong>5.4</strong> Except as required in this International Standard, is information about a particular client or individual disclosed to a third party without the written consent of the client or individual concerned will not be disclosed by DIMA CERTIFICATION.</p>
                      <p><strong>5.5</strong> DIMA CERTIFICATION have a policy governing any mark that it authorizes certified clients to use. It shall be provided with the certificate.</p>
                      <p><strong>5.6</strong> When there is any change in the requirement of the certification then DIMA CERTIFICATION will send a notice to client company intimating the new requirement or change. The client must Comply to notice of any changes to its requirements for certification and verification of compliance with the new requirements.</p>
                      <p><strong>5.7</strong> DIMA CERTIFICATION shall exercise proper control of ownership and shall take action to deal with incorrect references to certification status or misleading use of certification document marks and audit reports. DIMA CERTIFICATION actions include request for correction and corrective action, suspension, withdrawal of certification, publication of the transgression and it necessary, legal action.</p>
                      <p><strong>5.8</strong> DIMA CERTIFICATION shall provide information of client's, address standard and scope in public domain.</p>
                      <p><strong>5.9</strong> Information provided by the DIMA CERTIFICATION to any client or to the marketplace, including advertising, shall be accurate and not misleading.</p>
                      <p><strong>5.10</strong> On request from any party, DIMA CERTIFICATION shall provide the means to confirm the validity of a client certification.</p>
                    </div>
                  </section>

                  {/* Section 6 */}
                  <section id="confidentiality" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">6</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Confidentiality</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>6.1</strong> DIMA CERTIFICATION shall, through legally enforceable agreements, follow policy to safeguard the confidentiality of the information obtained or created during the performance of certification activities at all levels of its structure, including committees and external bodies or individuals acting on our behalf.</p>
                      <p><strong>6.2</strong> Except as may be required by Law or the ISO/IEC 17021 or due to contractual obligation like with DIMA CERTIFICATION, Information between DIMA CERTIFICATION and the Organization will treat as strictly confidential and will not disclose to any third party without prior written consent of the other, any information which comes into their possession, the possession of their employees, agents or others by virtue of this Agreement.</p>
                      <p><strong>6.3</strong> In case any law or regulation required to disclose the information of the client organization or individual to a third party which is treated as confidential shall be given but the client organization or individual concerned shall be notified in advanced.</p>
                      <p><strong>6.4</strong> DIMA CERTIFICATION shall inform the Organization of any information other than brief particulars of the organization about that DIMA CERTIFICATION shall place them, as per then existing practice covering name, relevant nominative document, scope and geographical locations in public domain. All other information, except for information that is made publicly accessible by the Organization, shall be considered confidential.</p>
                      <p><strong>6.5</strong> Information about the Organization from sources other than Organization i.e. complaints and regulators shall be treated as confidential, consistent with the DIMA CERTIFICATION's policy.</p>
                      <p><strong>6.6</strong> Personnel, including any committee members, contractors, personnel of external bodies or individuals acting on the DIMA CERTIFICATION's behalf, shall keep confidential all information obtained or created during the performance of the DIMA CERTIFICATION's activities.</p>
                      <p><strong>6.7</strong> DIMA CERTIFICATION shall ensure and having a process for the secure handling of all confidential information including documents and records held by it.</p>
                      <p><strong>6.8</strong> When any confidential information is to be made available to any external bodies' i.e., accreditation body, agreement group of per assessment scheme, DIMA CERTIFICATION shall keep the client organization informed.</p>
                    </div>
                  </section>

                  {/* Section 7 */}
                  <section id="short-notice-audit" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">7</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Short Notice Audit</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>7.1</strong> DIMA CERTIFICATION conduct audits of certified clients at short notice or unannounced audit to investigate complaints after ensuring that it belongs to DIMA CERTIFICATION, or in response to changes (Legal status, Organisation and management, address and sites, scope, major changes to management system and processes, fatal accidents, or a legal action by any regulatory authority) OR as follow up on suspended clients.</p>
                      <p><strong>7.2</strong> In either of such cases DIMA CERTIFICATION will describe and make known in advance to the certified clients on the following aspects:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li>Certification process</li>
                        <li>Normative requirements of certification</li>
                        <li>Information about the applicable fees</li>
                        <li>Any changes in the accreditation rules affecting their certification</li>
                        <li>Any change in the standards</li>
                        <li>To make all necessary arrangements as per the requirements of DIMA CERTIFICATION certification procedure</li>
                        <li>Accommodate Observers as needed by DIMA CERTIFICATION</li>
                        <li>Identifying and recording nonconformities and the need for corrective action by organizations on a timely basis for such</li>
                        <li>Items as incorrect references to the certification or misleading use of certification information.</li>
                        <li>DIMA CERTIFICATION appeals and complaints procedure</li>
                      </ul>
                      <p><strong>7.3</strong> The client Company cannot refuse or reject or make any objection for the Auditor or the Audit Team in case of short notice Audit.</p>
                      <p><strong>7.4</strong> This the client responsibility to accept and facilitate Accreditation Body like from which seeking accreditation for its Management System without any or with limited time notice.</p>
                    </div>
                  </section>

                  {/* Section 8 */}
                  <section id="certification-recommendation" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">8</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Certification Recommendation</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>8.1</strong> In the event of major non conformities being, a recommendation for certification is made subject to a Corrective action plan being submitted within 30 days and corrective actions being verified onsite and closed out through a special visit within 60 days of the stage 2 date, before certification is granted.</p>
                      <p><strong>8.2</strong> Where the audit has revealed only minor non conformities which need to be addressed through corrective actions, the certification may be recommended subject to the Corrective Action Plan being submitted by the company within 30 days together with objective evidences of the corrective actions taken. The corrective actions plan is required to be closed out upon physical verification of the satisfactory implementation at the first subsequent surveillance audit.</p>
                      <p><strong>8.3</strong> In the case of where "opportunities for improvement having been recorded during the certification audit, the actions, as applicable, are observed for effectiveness at the subsequent audit visit.</p>
                      <p><strong>8.4</strong> DIMA CERTIFICATION may perform additional full audit, an additional limited audit, or documented evidence (to be confirmed during future surveillance audits) to verify effective correction and corrective actions.</p>
                    </div>
                  </section>

                  {/* Section 9 */}
                  <section id="liability" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">9</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Liability</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>9.1</strong> Except, in the case of deliberate neglect on the part of DIMA CERTIFICATION, its employees, servants or agents, DIMA CERTIFICATION shall not be liable for any loss or damage sustained by any person due to any act of omission or error whatsoever or howsoever caused during the performance of its assessment, certification or other services.</p>
                      <p><strong>9.2</strong> In the case of neglect, as aforesaid, the limit of any loss, damage or otherwise DIMA CERTIFICATION liability will be limited to an amount not exceeding the maximum fee (if any) charged by DIMA CERTIFICATION for the service in respect of which the neglect arose. While the restrictions on liability herein contained are considered by the parties to be reasonable in all the circumstances, if such restrictions taken together or any one of them shall be judged to be unlawful or unenforceable then the said restriction shall apply with such words deleted or amended or added.</p>
                      <p><strong>9.3</strong> The provision of this clause shall not apply to any death or personal injury but the Organization shall maintain at all time adequate insurance sufficient to cover all liability that may arise as a result of any matter arising in pursuant to this Agreement.</p>
                    </div>
                  </section>

                  {/* Section 10 */}
                  <section id="force-majeure" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">10</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Force Majeure</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>10.1</strong> DIMA CERTIFICATION shall not be liable in any respect, should it be prevented from discharging such obligations as a result of any matter beyond its control which could not be reasonably foreseen.</p>
                    </div>
                  </section>

                  {/* Section 11 */}
                  <section id="disputes" className="mb-12 scroll-mt-28">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">11</span>
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900 pt-1">Disputes</h2>
                    </div>
                    <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed pl-14">
                      <p><strong>11.1</strong> In case of the dispute arise between the parties then it shall be settled by appointment of the sole arbitrator as The Malaysian Arbitration Act.</p>
                      <p><strong>11.2</strong> Aggrieved party can challenge the award of arbitrator with 30 days of the award but the Jurisdiction area shall be Malaysia and the case can be filed in the competent court of Malaysia only.</p>
                    </div>
                  </section>

                  {/* Signature Section */}
                  <section id="signatures" className="scroll-mt-28 pt-8 border-t border-slate-200">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8">Agreement Signatures</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <p className="font-semibold text-slate-700 mb-2">FOR & ON BEHALF OF CERTIFICATION BODY</p>
                          <p className="text-slate-600">DIMA CERTIFICATION Sdn. Bhd.</p>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                          <p>(Signature With Seal)</p>
                          <p>Name of Signatory:</p>
                          <p>Designation: Director 1</p>
                          <p>Date:</p>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-200">
                          <p className="font-semibold text-slate-700 mb-2">WITNESS BY CERTIFICATION BODY</p>
                          <p className="text-slate-600">DIMA CERTIFICATION Sdn. Bhd.</p>
                          <div className="space-y-2 text-sm text-slate-600 mt-2">
                            <p>(Signature With Seal)</p>
                            <p>Name of Signatory:</p>
                            <p>Designation: Director 2</p>
                            <p>Date:</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-semibold text-slate-700 mb-2">FOR & ON BEHALF OF CLIENT</p>
                        <div className="space-y-2 text-sm text-slate-600 mt-4">
                          <p>(Signature With Seal)</p>
                          <p>Name of Signatory:</p>
                          <p>Designation:</p>
                          <p>Date:</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 hover:border-[#d4af37] text-slate-700 hover:text-[#d4af37] rounded-xl transition-colors min-h-[52px] font-medium"
                >
                  <ArrowLeft size={18} />
                  <span>Back to About Us</span>
                </Link>
                {agreementData?.has_pdf && (
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-600 hover:to-[#d4af37] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl min-h-[52px]"
                  >
                    <Download size={18} />
                    <span>Download PDF</span>
                  </button>
                )}
              </div>
            </motion.main>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
