import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle,
  Building2, User, MessageSquare, Scale, ChevronRight, FileText,
} from 'lucide-react';

interface ContactSettings {
  office_name?: string;
  office_address?: string;
  phone_1?: string;
  phone_2?: string;
  email_1?: string;
  email_2?: string;
  business_hours?: string;
  map_lat?: string;
  map_lng?: string;
}

export function ContactPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [settings, setSettings] = useState<ContactSettings>({});

  useEffect(() => {
    const apiBase = import.meta.env.BASE_URL;
    fetch(`${apiBase}api/public-contact-settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const apiBase = import.meta.env.BASE_URL;
      const response = await fetch(`${apiBase}api/contact-create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setGeneralError(data.message || 'Failed to submit form');
      }
    } catch (error) {
      setGeneralError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const officeDetails = settings.office_name
    ? [settings.office_name, ...(settings.office_address?.split('\n') || [])]
    : ['DIMA Certification Sdn Bhd', 'Kuching, Sarawak', 'Malaysia'];

  const phoneDetails = settings.phone_1
    ? [settings.phone_1, ...(settings.phone_2 ? [settings.phone_2] : [])]
    : ['+60 12-345 6789', '+60 82-123 456'];

  const emailDetails = settings.email_1
    ? [settings.email_1, ...(settings.email_2 ? [settings.email_2] : [])]
    : ['info@dima.com.my', 'certification@dima.com.my'];

  const hoursDetails = settings.business_hours
    ? settings.business_hours.split('\n')
    : ['Monday - Friday', '9:00 AM - 5:00 PM', 'Closed on Public Holidays'];

  const mapLat = settings.map_lat || '1.4654755562789052';
  const mapLng = settings.map_lng || '110.32736266883343';

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: officeDetails,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: phoneDetails,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Mail,
      title: 'Email',
      details: emailDetails,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: hoursDetails,
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <PageLayout>
      <PageHero
        badge="Get in Touch"
        title="Contact Us"
        subtitle="Ready to start your certification journey? Our team is here to help"
      />

      {/* ── Complaint / Appeal CTA band — TOP ──────────────────────── */}
      <section className="relative bg-white pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
              {/* Gold top stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(to right, #d4af37, #f59e0b, #d4af37)' }}
              />

              <div className="flex flex-col lg:flex-row items-center gap-6 px-8 py-8 lg:px-10">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Scale className="text-white" size={26} />
                </div>

                {/* Text */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="font-bold text-white text-lg mb-1">
                    Complaint / Appeal Submission
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Have a complaint or wish to appeal a certification decision? Submit your formal request through our dedicated form. All submissions are confidential.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                  <motion.button
                    onClick={() => navigate('/complaint-appeal')}
                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-xl shadow-lg overflow-hidden whitespace-nowrap"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <FileText size={16} className="relative z-10" />
                    <span className="relative z-10">Submit a Request</span>
                    <ChevronRight size={15} className="relative z-10" />
                  </motion.button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/mspo-complaint-procedure')}
                      className="inline-flex items-center gap-1.5 px-4 py-3 bg-white/10 text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all whitespace-nowrap"
                    >
                      <AlertCircle size={14} />
                      MSPO Complaint/Appeal
                    </button>
                    <button
                      onClick={() => navigate('/iso-complaints-appeals')}
                      className="inline-flex items-center gap-1.5 px-4 py-3 bg-white/10 text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all whitespace-nowrap"
                    >
                      <Scale size={14} />
                      ISO Complaint/Appeal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact info + general enquiry ─────────────────────────── */}
      <section className="relative py-20 md:py-28 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Info cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
                <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-lg group-hover:shadow-2xl transition-shadow h-full">
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mb-4`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <info.icon className="text-white" size={24} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-slate-600 text-sm">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid lg:grid-cols-2 gap-12">

            {/* General Enquiry Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 via-amber-500/10 to-transparent rounded-[2rem] blur-2xl" />
                <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                  {isSubmitted ? (
                    <motion.div
                      className="text-center py-16"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                      >
                        <CheckCircle2 className="text-white" size={40} />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">Thank You!</h3>
                      <p className="text-lg text-slate-600">We'll get back to you shortly</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {generalError && (
                        <motion.div
                          className="flex items-gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                          <p className="text-red-700 font-medium">{generalError}</p>
                        </motion.div>
                      )}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                            <User size={18} className="text-[#d4af37]" /> Full Name *
                          </label>
                          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 ${
                              errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                            placeholder="John Doe" />
                          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="email" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                            <Mail size={18} className="text-[#d4af37]" /> Email Address *
                          </label>
                          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 ${
                              errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                            placeholder="john@company.com" />
                          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                            <Phone size={18} className="text-[#d4af37]" /> Phone Number *
                          </label>
                          <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 ${
                              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                            placeholder="+60 12-345 6789" />
                          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                          <label htmlFor="company" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                            <Building2 size={18} className="text-[#d4af37]" /> Company Name *
                          </label>
                          <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 ${
                              errors.company ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                            placeholder="Your Company Sdn Bhd" />
                          {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="message" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                          <MessageSquare size={18} className="text-[#d4af37]" /> Message
                        </label>
                        <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange}
                          className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400 ${
                            errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#d4af37]'
                          }`}
                          placeholder="Tell us about your certification requirements..." />
                        {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                      </div>
                      <motion.button type="submit" disabled={isLoading}
                        className="group relative w-full px-8 py-5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-2xl shadow-[#d4af37]/20 flex items-center justify-center gap-3 text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isLoading ? { scale: 1.02 } : {}} whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                          initial={{ x: '-100%' }} whileHover={!isLoading ? { x: 0 } : {}} transition={{ duration: 0.3 }} />
                        {isLoading ? (
                          <>
                            <motion.div
                              className="relative z-10 w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                            <span className="relative z-10">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={22} className="relative z-10" />
                            <span className="relative z-10">Submit Request</span>
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-slate-100 rounded-3xl overflow-hidden h-full shadow-lg min-h-[400px]">
                <iframe
                  src={`https://maps.google.com/maps?q=${mapLat},${mapLng}&z=18&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="DIMA Certification Location - Kuching, Sarawak, Malaysia"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}