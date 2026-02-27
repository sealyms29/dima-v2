import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center px-6">
      <motion.div 
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Number */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-600 leading-none">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page may have been moved or doesn't exist.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/">
            <motion.button
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} />
              Back to Home
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Go Back
          </motion.button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          className="mt-16 pt-8 border-t border-slate-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-slate-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/about">
              <span className="text-sm text-[#d4af37] hover:underline">About Us</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/services">
              <span className="text-sm text-[#d4af37] hover:underline">Services</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/team">
              <span className="text-sm text-[#d4af37] hover:underline">Our Team</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link to="/contact">
              <span className="text-sm text-[#d4af37] hover:underline">Contact Us</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
