import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import { ChevronDown, ChevronUp, FileText, Download, ArrowLeft, ExternalLink } from 'lucide-react';
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

interface SectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionSection({ number, title, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors text-left min-h-[56px]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
            {number}
          </span>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="text-slate-500 flex-shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-slate-500 flex-shrink-0" size={20} />
        )}
      </button>
      
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <div className="p-5 pt-0 bg-white">
          <div className="pt-4 border-t border-slate-100 text-slate-700 leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function CertificationAgreementPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null);

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

  const handlePrint = () => {
    window.print();
  };

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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PageLayout>
      <PageHero
        badge="Certification Agreement"
        title="Terms & Conditions"
        subtitle={agreementData?.title || "DMC/ISO/QCA Quotation Certification Agreement"}
      />

      <section className="relative py-16 md:py-24 bg-white" ref={ref}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Navigation & Actions */}
          <motion.div
            className="flex flex-wrap items-center justify-between gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#d4af37] transition-colors min-h-[44px]"
            >
              <ArrowLeft size={18} />
              <span>Back to About Us</span>
            </Link>
            
            <div className="flex gap-3">
              {agreementData?.has_pdf && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-600 hover:to-[#d4af37] text-white rounded-lg transition-all shadow-lg hover:shadow-xl min-h-[44px]"
                >
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
              )}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors min-h-[44px]"
              >
                <ExternalLink size={18} />
                <span>Print Page</span>
              </button>
            </div>
          </motion.div>

          {/* PDF Download Card (if available) */}
          {agreementData?.has_pdf && (
            <motion.div
              className="mb-10 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="text-white" size={28} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {agreementData.file_name || 'Certification Agreement PDF'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {agreementData.version && <span>{agreementData.version}</span>}
                    {agreementData.issue_date && <span> • {new Date(agreementData.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                    {agreementData.file_size && <span> • {formatFileSize(agreementData.file_size)}</span>}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-600 hover:to-[#d4af37] text-white rounded-xl transition-all shadow-lg hover:shadow-xl min-h-[48px]"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Document Header */}
          <motion.div
            className="text-center mb-12 p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FileText className="text-[#d4af37] mx-auto mb-4" size={48} />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              DMC/ISO/QCA Quotation Certification Agreement
            </h2>
            <p className="text-slate-600">Issue 1, 17 October 2024</p>
          </motion.div>

          {/* Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AccordionSection number="1" title="General Conditions" defaultOpen={true}>
              <p><strong>1.1</strong> Certification Audit of Client's management system shall be performed based on the requirements of applicable standards.</p>
              <p><strong>1.2</strong> The audit program shall include a two-stage initial audit which shall be conducted onsite and exceptionally cases the stage 1 audit shall be carried offsite, surveillance audits in the first and second years, and a recertification audit in the third year prior to expiration of certificate.</p>
              <p><strong>1.3</strong> An audit plan is established for each audit in contract with the Client.</p>
              <p><strong>1.4</strong> A documented report is provided after each audit.</p>
              <p><strong>1.5</strong> Client shall make all necessary arrangements for the conduct of the audits, including provision for examining documentation and access to all processes and areas, records and personnel for the purpose of initial certification, surveillance, recertification and resolution of complaints.</p>
              <p><strong>1.6</strong> Client shall make provisions, where applicable, to accommodate the presence of observers (e.g., accreditation auditors or trainee auditors).</p>
              <p><strong>1.7</strong> Client shall comply with certification requirements.</p>
              <p><strong>1.8</strong> This agreement shall become a contract upon its acceptance and signing by both the parties, these agreements shall bind both of the parties and no other statements, representations or arguments, verbal or written, which contradicts to the terms and condition of this agreement is void made by either representative of the parties.</p>
              <p><strong>1.9</strong> The Certification process shall be initiated after the acceptance of this agreement.</p>
              <p><strong>1.10</strong> DIMA CERTIFICATION shall provide detailed description of the initial and continuing certification activity, including the application, initial audits, surveillance audits, and the process for granting, maintaining, reducing, extending, suspending, withdrawing certification and recertification and the normative requirements for certification; publicly.</p>
              <p><strong>1.11</strong> Clients are agreed to release audit report information to regulators.</p>
            </AccordionSection>

            <AccordionSection number="2" title="Terms of Payment">
              <p>DIMA CERTIFICATION shall inform about the fees for application, initial certification, and continuing certification in its Quotation.</p>
              <p><strong>2.1</strong> Invoices / Performa Invoices shall be provided to the client organization and client organization is liable to pay the stipulated amount as raised and duly accepted by the client organization for certification services as scheduled in the invoice at the different stages. Charges and fees shall be based on the application review.</p>
              <p><strong>2.2</strong> Postponement of confirmed on-site audit dates may result in charges up to 50 percent of scheduled on-site assessment plus all pre-paid expenses.</p>
              <p><strong>2.3</strong> In the event an account is not paid or otherwise resolved within 30 days after the date of invoice, Thereafter, interest will be chargeable on the outstanding amount @ 18% per annum. DIMA CERTIFICATION may at its option:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Refuse any further consideration of the agreement,</li>
                <li>Not issue a certification document or</li>
                <li>Terminate this agreement with reasons in writing</li>
              </ul>
              <p><strong>2.4</strong> Fees and expenses incurred by DIMA CERTIFICATION in connection with collecting past due accounts shall be the responsibility of the Organization.</p>
              <p><strong>2.5</strong> Certificate of Registration will only be issued upon successful assessment and when the outstanding invoices have been settled.</p>
              <p><strong>2.6</strong> Fees for special Surveillance visits, as and when, required to be made to the Organizations premises, will be specifically quoted, and charged, separately.</p>
              <p><strong>2.7</strong> Travel expenses of Assessment staff will be charged at actual from our nearest office. Boarding and lodging expenses shall be charged at actual where the assessment staff is required to travel overnight.</p>
            </AccordionSection>

            <AccordionSection number="3" title="Rights and Duties of Client Organization (Pre-Certification)">
              <p><strong>3.1</strong> Client Organization shall provide to the DIMA CERTIFICATION all documents, information and facilities at sites as required, to enable DIMA CERTIFICATION to provide its services under this Agreement and sites will be audited as per the sample plan prepared by DIMA CERTIFICATION.</p>
              <p><strong>3.2</strong> The Organization agrees to comply with relevant provisions of the provision of the standard and certification requirement for which the certificate is applied, with the requirements for certification-granting, maintaining, reducing, extending, suspending, withdrawing certification and recertification. If the organization has multiple sites the agreement shall cover all the sites covered by the scope of the certification.</p>
              <p><strong>3.3</strong> The DIMA CERTIFICATION can select any accredited client for witness audit. The client shall permit for the witness audit and allow the accreditation body assessors to assess the competency of the DIMA CERTIFICATION auditor. There shall be no additional charges for witness audit and all the expenses shall be borne by DIMA CERTIFICATION.</p>
              <p><strong>3.4</strong> Due to any circumstances whatsoever, DIMA CERTIFICATION can visit the client any time and if this visit is not for the purpose of Surveillance or follow-up audit, then fees shall be charged.</p>
              <p><strong>3.5</strong> When requested, Organization shall make available all documents including complaint and related matters to DIMA CERTIFICATION.</p>
              <p><strong>3.6</strong> DIMA CERTIFICATION shall not be liable for any loss or damage due to any failure or delay in performance of this agreement resulting from any cause beyond our reasonable control, compliance with applicable regulations or directive of national, state, or local governments is the responsibility of the client.</p>
              <p><strong>3.7</strong> Client will agree to ensure that the auditors/assessors are properly briefed about health, safety, and other necessary safety hazards that they may encounter during the audits. Client will be responsible for providing them with the personnel protective / safety equipment during the audits.</p>
              <p><strong>3.8</strong> For the scopes not available with the DIMA CERTIFICATION, the validity of certificate is contingent upon the organization agreeing and meeting the requirements specified in Certification Rules as given in our website and this agreement. The conformity with the requirements for certification is the responsibility of the organization. DIMA CERTIFICATION shall issue a non-accredited certificate. As per the terms mutually agreed a fresh accredited certificate may be issued as and when the activity is accredited by Accreditation Body. In the event the client is issued a non-accredited certificate, DIMA CERTIFICATION can provide an accredited certificate only after doing a fresh audit as per the terms mutually agreed. In case any change of rules or methodology is advised by the accreditation body, the same shall be applicable for certification body and the client for maintaining the validity of Certificate.</p>
              <p><strong>3.9</strong> After the signing of agreement, if the applicant wishes to cancel it, the advance or any other charges paid shall not be refundable. Liability of DIMA CERTIFICATION is limited to a maximum of amount equivalent to the fees paid by the client. The offer given in agreement is valid for 30 days from the date of issuance.</p>
              <p><strong>3.10</strong> The client shall agree allow and give access to Auditors and /or Certification personnel or observer to carry out any auditing activity, Inspection, or investigation against any complaint.</p>
              <p><strong>3.11</strong> The Organization hereby warrants the completeness and accuracy of all documents and accuracy of all information supplied to DIMA CERTIFICATION for the purposes of this Agreement.</p>
            </AccordionSection>

            <AccordionSection number="4" title="Post Certification Terms and Conditions">
              <p><strong>4.1</strong> Certificates: Certificates of conformity issued by DIMA CERTIFICATION shall be the property of DIMA CERTIFICATION and that these shall be returned to DIMA CERTIFICATION when the certificate is withdrawn.</p>
              
              <p><strong>4.2</strong> Use of Logos and Marks: Right to use Logo is granted and the use of the logo is subject to restrictions:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>4.2.1</strong> Logo/Marks shall not be used during the period of suspension / withdrawal of certificate and shall be discontinue from all its advertisement material that is contains a reference to certification.</li>
                <li><strong>4.2.2</strong> Certified organization shall not apply marks to laboratory test, calibration or inspection reports, such reports are deemed to be products in this context. Mark shall not be used on a product or product packaging seen by the consumer or in any other way that may be interpreted as denoting product conformity.</li>
                <li><strong>4.2.3</strong> Use of DIMA CERTIFICATION and accreditation logo on any test report or certificate is not allowed stating/indicating that the tests are approved.</li>
                <li><strong>4.2.4</strong> Not to use logo of DIMA CERTIFICATION or Accreditation Body in such manner as to bring DIMA CERTIFICATION or to Accreditation Body into disrepute and not to make any misleading or unauthorized statement or incorrect references (such as claiming certification of locations/activities/sites not covered in the scope) with respect to their certification.</li>
                <li><strong>4.2.5</strong> Not to use certification/accreditation logos to indicate that the product or service is certified by DIMA CERTIFICATION.</li>
                <li><strong>4.2.6</strong> Does not use or permit the use of a certification document or any part thereof in a misleading manner.</li>
                <li><strong>4.2.7</strong> The Client Organization shall ensure compliance to these requirements while referring to its registration or use of certification logo/mark in communication media such as Documents, brochures, or advertising. The customer shall follow the logo rules which be supplied along with the certificate, if issued.</li>
              </ul>
              
              <p><strong>4.3</strong> Voluntary withdrawal: Client may request for suspension / withdrawal of certificate on temporary basis if they feel that their existing system does not comply / conform to the requirements of the standard.</p>
              
              <p><strong>4.4</strong> Suspension and withdrawal and Restoration: DIMA CERTIFICATION will impose the suspension based on the conditions defined and which are publicly available on the website.</p>
              <ul className="list-disc ml-6 space-y-1">
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
            </AccordionSection>

            <AccordionSection number="5" title="Responsibilities of DIMA Certification">
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
            </AccordionSection>

            <AccordionSection number="6" title="Confidentiality">
              <p><strong>6.1</strong> DIMA CERTIFICATION shall, through legally enforceable agreements, follow policy to safeguard the confidentiality of the information obtained or created during the performance of certification activities at all levels of its structure, including committees and external bodies or individuals acting on our behalf.</p>
              <p><strong>6.2</strong> Except as may be required by Law or the ISO/IEC 17021 or due to contractual obligation like with DIMA CERTIFICATION, Information between DIMA CERTIFICATION and the Organization will treat as strictly confidential and will not disclose to any third party without prior written consent of the other, any information which comes into their possession, the possession of their employees, agents or others by virtue of this Agreement.</p>
              <p><strong>6.3</strong> In case any law or regulation required to disclose the information of the client organization or individual to a third party which is treated as confidential shall be given but the client organization or individual concerned shall be notified in advanced.</p>
              <p><strong>6.4</strong> DIMA CERTIFICATION shall inform the Organization of any information other than brief particulars of the organization about that DIMA CERTIFICATION shall place them, as per then existing practice covering name, relevant nominative document, scope and geographical locations in public domain. All other information, except for information that is made publicly accessible by the Organization, shall be considered confidential.</p>
              <p><strong>6.5</strong> Information about the Organization from sources other than Organization i.e. complaints and regulators shall be treated as confidential, consistent with the DIMA CERTIFICATION's policy.</p>
              <p><strong>6.6</strong> Personnel, including any committee members, contractors, personnel of external bodies or individuals acting on the DIMA CERTIFICATION's behalf, shall keep confidential all information obtained or created during the performance of the DIMA CERTIFICATION's activities.</p>
              <p><strong>6.7</strong> DIMA CERTIFICATION shall ensure and having a process for the secure handling of all confidential information including documents and records held by it.</p>
              <p><strong>6.8</strong> When any confidential information is to be made available to any external bodies' i.e., accreditation body, agreement group of per assessment scheme, DIMA CERTIFICATION shall keep the client organization informed.</p>
            </AccordionSection>

            <AccordionSection number="7" title="Short Notice Audit">
              <p><strong>7.1</strong> DIMA CERTIFICATION conduct audits of certified clients at short notice or unannounced audit to investigate complaints after ensuring that it belongs to DIMA CERTIFICATION, or in response to changes (Legal status, Organisation and management, address and sites, scope, major changes to management system and processes, fatal accidents, or a legal action by any regulatory authority) OR as follow up on suspended clients.</p>
              <p><strong>7.2</strong> In either of such cases DIMA CERTIFICATION will describe and make known in advance to the certified clients on the following aspects:</p>
              <ul className="list-disc ml-6 space-y-1">
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
            </AccordionSection>

            <AccordionSection number="8" title="Certification Recommendation">
              <p><strong>8.1</strong> In the event of major non conformities being, a recommendation for certification is made subject to a Corrective action plan being submitted within 30 days and corrective actions being verified onsite and closed out through a special visit within 60 days of the stage 2 date, before certification is granted.</p>
              <p><strong>8.2</strong> Where the audit has revealed only minor non conformities which need to be addressed through corrective actions, the certification may be recommended subject to the Corrective Action Plan being submitted by the company within 30 days together with objective evidences of the corrective actions taken. The corrective actions plan is required to be closed out upon physical verification of the satisfactory implementation at the first subsequent surveillance audit.</p>
              <p><strong>8.3</strong> In the case of where "opportunities for improvement having been recorded during the certification audit, the actions, as applicable, are observed for effectiveness at the subsequent audit visit.</p>
              <p><strong>8.4</strong> DIMA CERTIFICATION may perform additional full audit, an additional limited audit, or documented evidence (to be confirmed during future surveillance audits) to verify effective correction and corrective actions.</p>
            </AccordionSection>

            <AccordionSection number="9" title="Liability">
              <p><strong>9.1</strong> Except, in the case of deliberate neglect on the part of DIMA CERTIFICATION, its employees, servants or agents, DIMA CERTIFICATION shall not be liable for any loss or damage sustained by any person due to any act of omission or error whatsoever or howsoever caused during the performance of its assessment, certification or other services.</p>
              <p><strong>9.2</strong> In the case of neglect, as aforesaid, the limit of any loss, damage or otherwise DIMA CERTIFICATION liability will be limited to an amount not exceeding the maximum fee (if any) charged by DIMA CERTIFICATION for the service in respect of which the neglect arose. While the restrictions on liability herein contained are considered by the parties to be reasonable in all the circumstances, if such restrictions taken together or any one of them shall be judged to be unlawful or unenforceable then the said restriction shall apply with such words deleted or amended or added.</p>
              <p><strong>9.3</strong> The provision of this clause shall not apply to any death or personal injury but the Organization shall maintain at all time adequate insurance sufficient to cover all liability that may arise as a result of any matter arising in pursuant to this Agreement.</p>
            </AccordionSection>

            <AccordionSection number="10" title="Force Majeure">
              <p><strong>10.1</strong> DIMA CERTIFICATION shall not be liable in any respect, should it be prevented from discharging such obligations as a result of any matter beyond its control which could not be reasonably foreseen.</p>
            </AccordionSection>

            <AccordionSection number="11" title="Disputes">
              <p><strong>11.1</strong> In case of the dispute arise between the parties then it shall be settled by appointment of the sole arbitrator as The Malaysian Arbitration Act.</p>
              <p><strong>11.2</strong> Aggrieved party can challenge the award of arbitrator with 30 days of the award but the Jurisdiction area shall be Malaysia and the case can be filed in the competent court of Malaysia only.</p>
            </AccordionSection>
          </motion.div>

          {/* Signature Section */}
          <motion.div
            className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Agreement Signatures</h3>
            
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
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl transition-colors min-h-[48px]"
            >
              <ArrowLeft size={18} />
              <span>Back to About Us</span>
            </Link>
            {agreementData?.has_pdf && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-amber-600 hover:from-amber-600 hover:to-[#d4af37] text-white rounded-xl transition-all shadow-lg hover:shadow-xl min-h-[48px]"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl transition-colors min-h-[48px]"
            >
              <ExternalLink size={18} />
              <span>Print Page</span>
            </button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
