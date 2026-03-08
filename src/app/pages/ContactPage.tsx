import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../components/shared/PageLayout';
import { PageHero } from '../components/shared/PageHero';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle,
  Building2, User, MessageSquare, Scale, ChevronRight, FileText, HelpCircle,
  Sparkles, Heart, Star, MessageCircleHeart, Briefcase,
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

  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    feedback_type: '', name: '', email: '', phone: '', service_type: '', comment: ''
  });
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});
  const [feedbackGeneralError, setFeedbackGeneralError] = useState('');
  const feedbackRef = useRef(null);
  const isFeedbackInView = useInView(feedbackRef, { once: true, amount: 0.2 });

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

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFeedbackLoading(true);
    setFeedbackErrors({});
    setFeedbackGeneralError('');

    try {
      // Use window.location to get correct base path for both local and production
      const basePath = window.location.pathname.includes('/DIMA') ? '/DIMA' : '';
      const response = await fetch(`${basePath}/api/feedback-create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });

      const data = await response.json();

      if (data.success) {
        setIsFeedbackSubmitted(true);
        setFeedbackData({ feedback_type: '', name: '', email: '', phone: '', service_type: '', comment: '' });
        setTimeout(() => {
          setIsFeedbackSubmitted(false);
        }, 3000);
      } else if (data.errors) {
        setFeedbackErrors(data.errors);
      } else {
        setFeedbackGeneralError(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      setFeedbackGeneralError('Network error. Please try again.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };

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

          {/* Map Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="relative bg-slate-100 rounded-3xl overflow-hidden shadow-lg h-[450px] md:h-[500px]">
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
      </section>

      {/* ── Feedback & Support Section ─────────────────────────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden" ref={feedbackRef}>
        {/* Warm Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-[#d4af37]/20 to-amber-300/20 rounded-full blur-xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-[15%] w-32 h-32 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-2xl"
          animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-[20%] w-24 h-24 bg-gradient-to-br from-amber-200/25 to-orange-200/25 rounded-full blur-xl"
          animate={{ y: [0, 15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Icons */}
        <motion.div
          className="absolute top-32 right-[8%] text-amber-300/40"
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star size={32} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-[25%] text-orange-300/40"
          animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Heart size={28} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-[5%] text-yellow-400/30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={40} />
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Illustration & Message */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={isFeedbackInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              {/* Decorative Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-3xl shadow-2xl shadow-amber-500/30 mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={isFeedbackInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <MessageCircleHeart className="text-white" size={48} />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                We'd Love to{' '}
                <span className="bg-gradient-to-r from-[#d4af37] to-amber-500 bg-clip-text text-transparent">
                  Hear From You!
                </span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto lg:mx-0">
                Your thoughts matter to us. Share your feedback, suggestions, or just say hello - we're all ears and excited to connect with you!
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-amber-100"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <CheckCircle2 className="text-green-500" size={18} />
                  <span className="text-sm font-medium text-slate-700">Quick Response</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-amber-100"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Heart className="text-red-400" size={18} fill="currentColor" />
                  <span className="text-sm font-medium text-slate-700">We Care</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-amber-100"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Sparkles className="text-amber-500" size={18} />
                  <span className="text-sm font-medium text-slate-700">No Spam</span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Right Side - Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isFeedbackInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow Effect Behind Card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#d4af37]/20 via-amber-400/20 to-orange-400/20 rounded-[2.5rem] blur-2xl" />
                
                {/* Form Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
                  {isFeedbackSubmitted ? (
                    <motion.div
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Celebration Animation */}
                      <div className="relative">
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 0] }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        >
                          <Sparkles className="text-amber-400" size={80} />
                        </motion.div>
                        <motion.div
                          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        >
                          <CheckCircle2 className="text-white" size={48} />
                        </motion.div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Thank You!</h3>
                        <p className="text-slate-600">Your feedback has been submitted successfully.</p>
                        <p className="text-sm text-slate-500 mt-2">We'll get back to you soon!</p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                      {feedbackGeneralError && (
                        <motion.div
                          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                          <p className="text-red-600 font-medium">{feedbackGeneralError}</p>
                        </motion.div>
                      )}

                      {/* Type of Feedback Dropdown */}
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" aria-hidden="true">
                          <HelpCircle size={20} />
                        </div>
                        <label htmlFor="feedback_type" className="sr-only">Type of Feedback (required)</label>
                        <select
                          id="feedback_type"
                          name="feedback_type"
                          required
                          aria-required="true"
                          aria-invalid={feedbackErrors.feedback_type ? 'true' : 'false'}
                          aria-describedby={feedbackErrors.feedback_type ? 'feedback_type-error' : undefined}
                          value={feedbackData.feedback_type}
                          onChange={handleFeedbackChange}
                          className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50/80 border-2 rounded-2xl focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 transition-all text-slate-700 ${
                            feedbackErrors.feedback_type ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-[#d4af37]'
                          }`}
                        >
                          <option value="">Type of Feedback</option>
                          <option value="General Feedback">General Feedback</option>
                          <option value="Suggestion">Suggestion</option>
                          <option value="Service Inquiry">Service Inquiry</option>
                          <option value="Other">Other</option>
                        </select>
                        {feedbackErrors.feedback_type && <p id="feedback_type-error" className="text-red-500 text-sm mt-1 ml-1" role="alert">{feedbackErrors.feedback_type}</p>}
                      </div>

                      {/* Name & Email Row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" aria-hidden="true">
                            <User size={20} />
                          </div>
                          <label htmlFor="feedback_name" className="sr-only">Your Name (required)</label>
                          <input
                            type="text"
                            id="feedback_name"
                            name="name"
                            required
                            aria-required="true"
                            aria-invalid={feedbackErrors.name ? 'true' : 'false'}
                            aria-describedby={feedbackErrors.name ? 'feedback_name-error' : undefined}
                            value={feedbackData.name}
                            onChange={handleFeedbackChange}
                            placeholder="Your Name *"
                            className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50/80 border-2 rounded-2xl focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                              feedbackErrors.name ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                          />
                          {feedbackErrors.name && <p id="feedback_name-error" className="text-red-500 text-sm mt-1 ml-1" role="alert">{feedbackErrors.name}</p>}
                        </div>

                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" aria-hidden="true">
                            <Mail size={20} />
                          </div>
                          <label htmlFor="feedback_email" className="sr-only">Your Email (required)</label>
                          <input
                            type="email"
                            id="feedback_email"
                            name="email"
                            required
                            aria-required="true"
                            aria-invalid={feedbackErrors.email ? 'true' : 'false'}
                            aria-describedby={feedbackErrors.email ? 'feedback_email-error' : undefined}
                            value={feedbackData.email}
                            onChange={handleFeedbackChange}
                            placeholder="Your Email *"
                            className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50/80 border-2 rounded-2xl focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                              feedbackErrors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                          />
                          {feedbackErrors.email && <p id="feedback_email-error" className="text-red-500 text-sm mt-1 ml-1" role="alert">{feedbackErrors.email}</p>}
                        </div>
                      </div>

                      {/* Phone & Service Type Row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" aria-hidden="true">
                            <Phone size={20} />
                          </div>
                          <label htmlFor="feedback_phone" className="sr-only">Your Phone Number (required)</label>
                          <input
                            type="tel"
                            id="feedback_phone"
                            name="phone"
                            required
                            aria-required="true"
                            aria-invalid={feedbackErrors.phone ? 'true' : 'false'}
                            aria-describedby={feedbackErrors.phone ? 'feedback_phone-error' : undefined}
                            value={feedbackData.phone}
                            onChange={handleFeedbackChange}
                            placeholder="Your Phone No. *"
                            className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50/80 border-2 rounded-2xl focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                              feedbackErrors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                          />
                          {feedbackErrors.phone && <p id="feedback_phone-error" className="text-red-500 text-sm mt-1 ml-1" role="alert">{feedbackErrors.phone}</p>}
                        </div>

                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" aria-hidden="true">
                            <Briefcase size={20} />
                          </div>
                          <label htmlFor="feedback_service_type" className="sr-only">Service Type (required)</label>
                          <input
                            type="text"
                            id="feedback_service_type"
                            name="service_type"
                            required
                            aria-required="true"
                            aria-invalid={feedbackErrors.service_type ? 'true' : 'false'}
                            aria-describedby={feedbackErrors.service_type ? 'feedback_service_type-error' : undefined}
                            value={feedbackData.service_type}
                            onChange={handleFeedbackChange}
                            placeholder="Service Type *"
                            className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50/80 border-2 rounded-2xl focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 transition-all text-slate-900 placeholder:text-slate-400 ${
                              feedbackErrors.service_type ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-[#d4af37]'
                            }`}
                          />
                          {feedbackErrors.service_type && <p id="feedback_service_type-error" className="text-red-500 text-sm mt-1 ml-1" role="alert">{feedbackErrors.service_type}</p>}
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#d4af37] transition-colors" aria-hidden="true">
                          <MessageSquare size={20} />
                        </div>
                        <label htmlFor="feedback_comment" className="sr-only">Your Feedback (required)</label>
                        <textarea
                          id="feedback_comment"
                          name="comment"
                          rows={4}
                          required
                          aria-required="true"
                          aria-invalid={feedbackErrors.comment ? 'true' : 'false'}
                          aria-describedby={feedbackErrors.comment ? 'feedback_comment-error' : undefined}
                          value={feedbackData.comment}
                          onChange={handleFeedbackChange}
                          placeholder="Share your thoughts with us... *"
                          className={`w-full pl-12 pr-5 py-4 text-base bg-slate-50/80 border-2 rounded-2xl focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 transition-all resize-none text-slate-900 placeholder:text-slate-400 ${
                            feedbackErrors.comment ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-[#d4af37]'
                          }`}
                        />
                        {feedbackErrors.comment && <p id="feedback_comment-error" className="text-red-500 text-sm mt-1 ml-1" role="alert">{feedbackErrors.comment}</p>}
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isFeedbackLoading}
                        className="group relative w-full px-8 py-5 bg-gradient-to-r from-[#d4af37] via-amber-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-3 text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isFeedbackLoading ? { scale: 1.02, boxShadow: '0 25px 50px -12px rgba(212,175,55,0.4)' } : {}}
                        whileTap={!isFeedbackLoading ? { scale: 0.98 } : {}}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500"
                          initial={{ x: '-100%' }}
                          whileHover={!isFeedbackLoading ? { x: 0 } : {}}
                          transition={{ duration: 0.4 }}
                        />
                        {isFeedbackLoading ? (
                          <>
                            <motion.div
                              className="relative z-10 w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="relative z-10">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={22} className="relative z-10" />
                            <span className="relative z-10">Send Feedback</span>
                            <motion.div
                              className="relative z-10"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Sparkles size={18} />
                            </motion.div>
                          </>
                        )}
                      </motion.button>
                    </form>
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