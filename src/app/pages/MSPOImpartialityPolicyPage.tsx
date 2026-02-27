import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../components/shared/PageLayout";
import { PageHero } from "../components/shared/PageHero";
import { Scale, Shield, Users, Ban } from "lucide-react";

const policyParagraphs = [
  {
    icon: Scale,
    gradient: "from-[#d4af37] to-amber-500",
    border: "border-amber-200",
    bg: "from-amber-50 to-white",
    heading: "Commitment to Impartiality",
    text: "DIMA top management is committed to impartiality in management system certification activities.",
  },
  {
    icon: Shield,
    gradient: "from-blue-600 to-blue-700",
    border: "border-blue-200",
    bg: "from-blue-50 to-white",
    heading: "Importance of Impartiality",
    text: "DIMA understands the importance of impartiality in carrying out its management system certification activities, manages conflict of interest and ensures the objectivity of its management system certification activities. It is essential that the virtue of independent certification is maintained, to empower clients to confide in certification frameworks as a method for 'checking' providers.",
  },
  {
    icon: Shield,
    gradient: "from-emerald-600 to-green-700",
    border: "border-emerald-200",
    bg: "from-emerald-50 to-white",
    heading: "Organisational Safeguards",
    text: "DIMA organisation and its operation are established to safeguard the objectivity and impartiality of its activities.",
  },
  {
    icon: Users,
    gradient: "from-purple-600 to-indigo-700",
    border: "border-purple-200",
    bg: "from-purple-50 to-white",
    heading: "Conflict of Interest Management",
    text: "DIMA with participation of the interested parties (ICB) will identify, analyse and document the relationships with related interested parties to determine the potential for conflict of interest, whether they arise from within DIMA organisation or from the activities of the related ICB.",
  },
  {
    icon: Ban,
    gradient: "from-rose-600 to-red-700",
    border: "border-rose-200",
    bg: "from-rose-50 to-white",
    heading: "No Consultancy Activities",
    text: "DIMA core activities are from the certification services, therefore there shall be no engagement with any consultancy activities.",
  },
];

export function MSPOImpartialityPolicyPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const navigate = useNavigate();

  return (
    <PageLayout>
      <PageHero
        badge="Corporate Policy"
        title="Policy on Impartiality"
        subtitle="Our commitment to unbiased and independent management system certification activities"
      />

      <section
        className="relative py-20 md:py-28 bg-white"
        ref={ref}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Decorative top rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-1 rounded-full bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] mb-16 origin-left"
          />

          {/* Policy paragraphs */}
          <div className="space-y-8">
            {policyParagraphs.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.12,
                  }}
                  className={`flex gap-6 bg-gradient-to-br ${item.bg} border-2 ${item.border} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow`}
                >
                  {/* Icon badge */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="text-white" size={26} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">
                      {item.heading}
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Decorative bottom rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.7,
              ease: "easeOut",
            }}
            className="h-1 rounded-full bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#d4af37] mt-16 mb-16 origin-right"
          />

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center text-white shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scale className="text-white" size={30} />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Questions About Our Impartiality?
              </h3>
              <p
                className="mb-8 max-w-2xl mx-auto"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                We welcome any questions or concerns about our
                impartiality policies and practices. Your trust
                is essential to the integrity of our
                certification services.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="inline-block px-8 py-4 bg-gradient-to-r from-[#d4af37] to-amber-500 text-black font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}