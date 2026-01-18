import { motion } from "framer-motion";
import { Link2, Palette, Share2 } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Create",
    description: "Claim your unique URL in seconds. No credit card required.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Palette,
    title: "Customize",
    description: "Add your links, choose your theme, and make it uniquely yours.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Share2,
    title: "Share",
    description: "Paste your SmartCard URL in your bio and watch the clicks roll in.",
    color: "from-orange-500 to-amber-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Up and running in <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No design skills needed. Create your SmartCard in minutes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="text-center">
                {/* Icon */}
                <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-4">
                  {index + 1}
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
