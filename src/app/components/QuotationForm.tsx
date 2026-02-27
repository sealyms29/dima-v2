import { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Send, Building2, User, Mail, Phone, MessageSquare, CheckCircle2, Sparkles } from 'lucide-react';

export function QuotationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="quotation" className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-slate-50 to-white" ref={ref}>
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold text-[#d4af37] bg-amber-50 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Sparkles size={16} />
            Get in Touch
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-slate-600">
            Let's discuss your certification needs
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 via-amber-500/10 to-transparent rounded-[2rem] blur-2xl" />
          
          {/* Form Card */}
          <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            {isSubmitted ? (
              <motion.div 
                className="text-center py-16 relative z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                  }}
                >
                  <CheckCircle2 className="text-white" size={48} />
                </motion.div>
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Thank You!
                </motion.h3>
                <motion.p 
                  className="text-xl text-slate-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  We'll get back to you shortly
                </motion.p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label htmlFor="name" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                      <User size={18} className="text-[#d4af37]" />
                      Full Name *
                    </label>
                    <motion.input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#d4af37] focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="John Doe"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <label htmlFor="email" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                      <Mail size={18} className="text-[#d4af37]" />
                      Email Address *
                    </label>
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#d4af37] focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="john@company.com"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                </div>

                {/* Phone & Company Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <label htmlFor="phone" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                      <Phone size={18} className="text-[#d4af37]" />
                      Phone Number *
                    </label>
                    <motion.input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#d4af37] focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="+60 12-345 6789"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <label htmlFor="company" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                      <Building2 size={18} className="text-[#d4af37]" />
                      Company Name *
                    </label>
                    <motion.input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#d4af37] focus:bg-white focus:outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Your Company Sdn Bhd"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                </div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <label htmlFor="message" className="flex items-center gap-2 text-slate-900 font-semibold mb-3">
                    <MessageSquare size={18} className="text-[#d4af37]" />
                    Message *
                  </label>
                  <motion.textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#d4af37] focus:bg-white focus:outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400"
                    placeholder="Tell us how we can help you..."
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="group relative w-full px-8 py-5 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-2xl shadow-[#d4af37]/20 flex items-center justify-center gap-3 text-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Send size={22} className="relative z-10" />
                  <span className="relative z-10">Submit Request</span>
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}