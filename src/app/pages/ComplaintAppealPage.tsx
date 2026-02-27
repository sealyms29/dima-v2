import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  Scale,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  CheckCircle2,
  Globe,
  ChevronRight,
  Shield,
  Leaf,
  HardHat,
  TreePine,
  ChevronDown,
} from 'lucide-react';

type Programme = '' | 'iso' | 'mspo';
type ISOStandard = '' | '9001' | '14001' | '45001';

const isoStandards = [
  {
    value: '9001' as ISOStandard,
    label: 'ISO 9001',
    subtitle: 'Quality Management System',
    icon: Shield,
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-300',
    activeBg: 'bg-blue-50',
    activeRing: 'ring-blue-500',
  },
  {
    value: '14001' as ISOStandard,
    label: 'ISO 14001',
    subtitle: 'Environmental Management System',
    icon: Leaf,
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-300',
    activeBg: 'bg-emerald-50',
    activeRing: 'ring-emerald-500',
  },
  {
    value: '45001' as ISOStandard,
    label: 'ISO 45001',
    subtitle: 'OH&S Management System',
    icon: HardHat,
    gradient: 'from-orange-500 to-orange-600',
    border: 'border-orange-300',
    activeBg: 'bg-orange-50',
    activeRing: 'ring-orange-500',
  },
];

const inputCls =
  'w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-[#d4af37] focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm';

function FieldWrap({
  label,
  icon: Icon,
  required = false,
  children,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-slate-900 font-semibold mb-2 text-sm">
        <Icon size={16} className="text-[#d4af37]" />
        {label}
        {required && <span className="text-[#d4af37]">*</span>}
      </label>
      {children}
    </div>
  );
}

export function ComplaintAppealPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const navigate = useNavigate();

  const [programme, setProgramme] = useState<Programme>('');
  const [isoStandard, setIsoStandard] = useState<ISOStandard>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    option: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleProgrammeChange = (val: Programme) => {
    setProgramme(val);
    setIsoStandard('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Complaint/Appeal submitted:', { programme, isoStandard, ...formData });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setProgramme('');
      setIsoStandard('');
      setFormData({ name: '', email: '', phone: '', option: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <PageLayout>
      <PageHero
        badge="Formal Submission"
        title="Complaint / Appeal Submission"
        subtitle="Submit your complaint or appeal securely. All submissions are treated with strict confidentiality."
      />

      <section
        ref={ref}
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #f8f7f4 0%, #fdfcf9 60%, #f3f0e8 100%)',
        }}
      >
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 5% 50%, rgba(212,175,55,0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 95% 80%, rgba(99,102,241,0.04) 0%, transparent 65%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* ── Intro text + procedure links ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center"
          >
            <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-5">
              Please refer to our Complaint / Appeal procedures on every audit programmes that related to proceed with this matter below.
            </p>

            {/* Procedure quick-links */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/mspo-complaint-procedure')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 font-medium shadow-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
              >
                <TreePine size={14} />
                MSPO Complaint Procedure
                <ChevronRight size={13} />
              </button>
              <button
                onClick={() => navigate('/mspo-appeal-procedure')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 font-medium shadow-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
              >
                <TreePine size={14} />
                MSPO Appeal Procedure
                <ChevronRight size={13} />
              </button>
              <button
                onClick={() => navigate('/iso-complaints-appeals')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 font-medium shadow-sm hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
              >
                <Shield size={14} />
                ISO Complaints &amp; Appeals
                <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>

          {/* ── Two-column layout ──────────────────────────────────── */}
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 items-start">

            {/* LEFT — info panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="flex flex-col gap-5"
            >
              {/* Dark card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl">
                {/* Gold top stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background:
                      'linear-gradient(to right, #d4af37, #f59e0b, #d4af37)',
                  }}
                />

                <div className="flex flex-col items-center text-center gap-5">
                  {/* Icon */}
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-[#d4af37]/20 rounded-full blur-xl" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Scale className="text-white" size={44} />
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-white text-lg mb-1">Formal Submission</p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                    >
                      Submit your complaint or appeal through this form. All submissions are treated with strict confidentiality.
                    </p>
                  </div>

                  {/* Info rows */}
                  <div className="w-full space-y-2.5 pt-1">
                    {[
                      { icon: FileText, label: 'Written record kept for all submissions' },
                      { icon: Globe,    label: 'dima.my/complaint-appeal' },
                      { icon: Mail,     label: 'dimacertification@gmail.com' },
                    ].map(({ icon: Ic, label }, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                      >
                        <Ic size={15} style={{ color: '#d4af37' }} className="flex-shrink-0" />
                        <span className="text-xs text-left" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confidentiality notice */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                <AlertCircle size={17} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900 text-sm leading-relaxed">
                  All complaint and appeal processes are subject to confidentiality requirements.
                </p>
              </div>

              {/* Back to Contact */}
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-[#d4af37] text-sm font-medium transition-colors cursor-pointer"
              >
                <ChevronRight size={14} className="rotate-180" />
                Back to Contact Us
              </button>
            </motion.div>

            {/* RIGHT — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/15 to-transparent rounded-[1.75rem] blur-2xl" />

                <div className="relative bg-white border border-slate-200 rounded-[1.75rem] p-7 md:p-9 shadow-xl">

                  {submitted ? (
                    <motion.div
                      className="text-center py-16"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
                      >
                        <CheckCircle2 className="text-white" size={40} />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Submission Received</h3>
                      <p className="text-slate-600">
                        Your request has been recorded. We will respond in due course.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Form heading */}
                      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-lg flex items-center justify-center shadow">
                          <FileText className="text-white" size={17} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg leading-none">
                            Complaint / Appeal Form
                          </h3>
                          <p className="text-slate-400 text-xs mt-0.5">
                            Fields marked <span className="text-[#d4af37] font-bold">*</span> are required
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ─── Certification Programme ─── */}
                        <div>
                          <p className="flex items-center gap-2 text-slate-900 font-semibold mb-3 text-sm">
                            <FileText size={16} className="text-[#d4af37]" />
                            Certification Programme{' '}
                            <span className="text-[#d4af37]">*</span>
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {/* ISO */}
                            <button
                              type="button"
                              onClick={() => handleProgrammeChange('iso')}
                              className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                programme === 'iso'
                                  ? 'border-[#d4af37] bg-amber-50 ring-2 ring-[#d4af37]/20'
                                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                  programme === 'iso'
                                    ? 'bg-gradient-to-br from-[#d4af37] to-amber-500'
                                    : 'bg-slate-200'
                                }`}
                              >
                                <Shield
                                  size={18}
                                  className={programme === 'iso' ? 'text-white' : 'text-slate-500'}
                                />
                              </div>
                              <div>
                                <span
                                  className={`font-semibold text-sm block ${
                                    programme === 'iso' ? 'text-[#b8962e]' : 'text-slate-700'
                                  }`}
                                >
                                  ISO Certification
                                </span>
                                <span className="text-xs text-slate-400">
                                  ISO 9001, ISO 14001, ISO 45001
                                </span>
                              </div>
                              {programme === 'iso' && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center"
                                >
                                  <CheckCircle size={12} className="text-white" />
                                </motion.div>
                              )}
                            </button>

                            {/* MSPO */}
                            <button
                              type="button"
                              onClick={() => handleProgrammeChange('mspo')}
                              className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                                programme === 'mspo'
                                  ? 'border-green-500 bg-green-50 ring-2 ring-green-500/20'
                                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                  programme === 'mspo'
                                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                                    : 'bg-slate-200'
                                }`}
                              >
                                <TreePine
                                  size={18}
                                  className={programme === 'mspo' ? 'text-white' : 'text-slate-500'}
                                />
                              </div>
                              <div>
                                <span
                                  className={`font-semibold text-sm block ${
                                    programme === 'mspo' ? 'text-green-700' : 'text-slate-700'
                                  }`}
                                >
                                  MSPO Certification
                                </span>
                                <span className="text-xs text-slate-400">
                                  Malaysian Sustainable Palm Oil
                                </span>
                              </div>
                              {programme === 'mspo' && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2.5 right-2.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                                >
                                  <CheckCircle size={12} className="text-white" />
                                </motion.div>
                              )}
                            </button>
                          </div>

                          {/* ISO Sub-options */}
                          <AnimatePresence>
                            {programme === 'iso' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200">
                                  <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                                    <ChevronDown size={14} className="text-[#d4af37]" />
                                    Select ISO Standard
                                  </p>
                                  <div className="grid grid-cols-3 gap-2.5">
                                    {isoStandards.map((std) => {
                                      const Icon = std.icon;
                                      const isSelected = isoStandard === std.value;
                                      return (
                                        <button
                                          key={std.value}
                                          type="button"
                                          onClick={() => setIsoStandard(std.value)}
                                          className={`relative p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                                            isSelected
                                              ? `${std.border} ${std.activeBg} ring-2 ${std.activeRing} shadow-md`
                                              : 'border-slate-200 bg-white hover:border-slate-300'
                                          }`}
                                        >
                                          <div className="flex flex-col items-center gap-1.5">
                                            <div
                                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                                isSelected
                                                  ? `bg-gradient-to-br ${std.gradient}`
                                                  : 'bg-slate-100'
                                              }`}
                                            >
                                              <Icon
                                                size={16}
                                                className={isSelected ? 'text-white' : 'text-slate-400'}
                                              />
                                            </div>
                                            <div>
                                              <p className="font-bold text-slate-900 text-xs leading-tight">
                                                {std.label}
                                              </p>
                                              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                                                {std.subtitle}
                                              </p>
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className={`absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-br ${std.gradient} rounded-full flex items-center justify-center`}
                                            >
                                              <CheckCircle size={10} className="text-white" />
                                            </motion.div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Name */}
                        <FieldWrap label="Name" icon={User} required>
                          <input
                            type="text" name="name" required
                            value={formData.name} onChange={handleChange}
                            placeholder="Your full name"
                            className={inputCls}
                          />
                        </FieldWrap>

                        {/* Email + Phone */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FieldWrap label="Email" icon={Mail} required>
                            <input
                              type="email" name="email" required
                              value={formData.email} onChange={handleChange}
                              placeholder="you@email.com"
                              className={inputCls}
                            />
                          </FieldWrap>
                          <FieldWrap label="Contact Number" icon={Phone} required>
                            <input
                              type="tel" name="phone" required
                              value={formData.phone} onChange={handleChange}
                              placeholder="+60 12-345 6789"
                              className={inputCls}
                            />
                          </FieldWrap>
                        </div>

                        {/* Choose Option */}
                        <div>
                          <p className="flex items-center gap-2 text-slate-900 font-semibold mb-3 text-sm">
                            <Scale size={16} className="text-[#d4af37]" />
                            Choose Your Option{' '}
                            <span className="text-[#d4af37]">*</span>
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              { val: 'Complaint', sub: 'Dissatisfaction with service', icon: AlertCircle },
                              { val: 'Appeal',    sub: 'Reconsider a decision',        icon: Scale },
                            ].map(({ val, sub, icon: Ic }) => {
                              const selected = formData.option === val;
                              return (
                                <label
                                  key={val}
                                  className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    selected
                                      ? 'border-[#d4af37] bg-amber-50'
                                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                                  }`}
                                >
                                  <input
                                    type="radio" name="option" value={val} required
                                    checked={selected}
                                    onChange={handleChange}
                                    className="sr-only"
                                  />
                                  <span
                                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                      selected ? 'border-[#d4af37] bg-[#d4af37]' : 'border-slate-300'
                                    }`}
                                  >
                                    {selected && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                                    )}
                                  </span>
                                  <div>
                                    <span
                                      className={`font-semibold text-sm block ${
                                        selected ? 'text-[#b8962e]' : 'text-slate-700'
                                      }`}
                                    >
                                      {val}
                                    </span>
                                    <span className="text-xs text-slate-400">{sub}</span>
                                  </div>
                                  {selected && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                                      <Ic size={16} style={{ color: '#d4af37' }} />
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Subject */}
                        <FieldWrap label="Subject" icon={FileText} required>
                          <input
                            type="text" name="subject" required
                            value={formData.subject} onChange={handleChange}
                            placeholder="Brief description of your complaint or appeal"
                            className={inputCls}
                          />
                        </FieldWrap>

                        {/* Message */}
                        <FieldWrap label="Message" icon={MessageSquare} required>
                          <textarea
                            name="message" required rows={5}
                            value={formData.message} onChange={handleChange}
                            placeholder="Provide full details including relevant dates and evidence..."
                            className={`${inputCls} resize-none`}
                          />
                        </FieldWrap>

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          <Send size={18} className="relative z-10" />
                          <span className="relative z-10">Submit Request</span>
                        </motion.button>

                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
}