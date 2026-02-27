import { Target, CheckCircle2, BarChart3, Clock, Users2, Shield } from 'lucide-react';

export function QualityObjectives() {
  const objectives = [
    {
      icon: CheckCircle2,
      title: "Certification Accuracy",
      objective: "Achieve 100% compliance in all certification audits",
      measure: "Zero non-conformances in external surveillance audits",
      target: "100%"
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      objective: "Complete certification processes within agreed timelines",
      measure: "Percentage of certifications delivered on schedule",
      target: "≥95%"
    },
    {
      icon: Users2,
      title: "Client Satisfaction",
      objective: "Maintain high levels of client satisfaction and trust",
      measure: "Client satisfaction survey scores",
      target: "≥4.5/5.0"
    },
    {
      icon: BarChart3,
      title: "Auditor Competence",
      objective: "Ensure all auditors maintain required competencies",
      measure: "Auditors with current qualifications and training",
      target: "100%"
    },
    {
      icon: Shield,
      title: "Impartiality",
      objective: "Maintain complete independence in certification decisions",
      measure: "Zero conflicts of interest reported",
      target: "0 incidents"
    },
    {
      icon: Target,
      title: "Continuous Improvement",
      objective: "Implement process improvements based on feedback",
      measure: "Improvement actions implemented annually",
      target: "≥10 actions"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-4">
            <Target className="text-[#d4af37]" size={18} />
            <span className="text-sm font-bold text-[#d4af37]">Performance Standards</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">
            Quality Objectives
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our measurable quality objectives ensure we consistently deliver exceptional certification 
            services and maintain the highest professional standards.
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {objectives.map((obj, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Header with Icon */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <obj.icon className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-white text-lg">{obj.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wide mb-2">
                    Objective
                  </div>
                  <p className="text-slate-900 font-semibold leading-snug">
                    {obj.objective}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                    Measurement
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {obj.measure}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Target
                    </span>
                    <span className="text-2xl font-bold text-[#d4af37]">
                      {obj.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Statement */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200 shadow-lg p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#d4af37] to-amber-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Monitoring & Review
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                These quality objectives are monitored regularly through key performance indicators (KPIs) 
                and reviewed quarterly by management to ensure continuous improvement and alignment with 
                our quality policy.
              </p>
              <p className="text-slate-700 leading-relaxed">
                All personnel are made aware of these objectives and contribute to their achievement through 
                their daily activities and commitment to excellence in certification services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
