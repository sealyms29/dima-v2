import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Leaf, Shield, HardHat } from 'lucide-react';

export function QuotationCTA() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const certifications = [
    {
      id: 'mspo',
      label: 'MSPO',
      icon: Leaf,
      route: '/mspo',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'iso9001',
      label: 'ISO 9001',
      icon: Award,
      route: '/iso-9001',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'iso14001',
      label: 'ISO 14001',
      icon: Shield,
      route: '/iso-14001',
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'iso45001',
      label: 'ISO 45001',
      icon: HardHat,
      route: '/iso-45001',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-amber-500/5 to-transparent rounded-[3rem] blur-3xl" />
          
          {/* Main Container */}
          
        </motion.div>
      </div>
    </section>
  );
}
