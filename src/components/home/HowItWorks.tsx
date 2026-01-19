import { motion, useScroll, useTransform } from "framer-motion";
import { Link2, Palette, Share2 } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: Link2,
    title: "Create",
    description: "Claim your unique URL in seconds. No credit card required.",
    color: "from-violet-500/60 to-purple-600/40",
  },
  {
    icon: Palette,
    title: "Customize",
    description: "Add your links, choose your theme, and make it uniquely yours.",
    color: "from-pink-500/60 to-rose-600/40",
  },
  {
    icon: Share2,
    title: "Share",
    description: "Paste your SmartCard URL in your bio and watch the clicks roll in.",
    color: "from-orange-500/60 to-amber-600/40",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Blurred background */}
      <motion.div 
        className="absolute inset-0 bg-secondary/20"
        style={{ y: backgroundY }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground/95">
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
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border/50 to-transparent" />
              )}
              
              <div className="text-center">
                {/* Icon */}
                <motion.div 
                  className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${step.color} backdrop-blur-xl flex items-center justify-center mb-6 shadow-elevated border border-border/20`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className="w-10 h-10 text-foreground/90" />
                </motion.div>
                
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full glass text-foreground/80 text-sm font-bold mb-4">
                  {index + 1}
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground/90">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
