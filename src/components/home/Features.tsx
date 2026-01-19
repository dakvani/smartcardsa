import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, CreditCard, Layers, Palette, Smartphone, Zap } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Layers,
    title: "Unlimited Links",
    description: "Add as many links as you need. Drag and drop to reorder.",
  },
  {
    icon: Palette,
    title: "Custom Themes",
    description: "Choose from beautiful presets or create your own brand colors.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track views and clicks. Know what your audience loves.",
  },
  {
    icon: CreditCard,
    title: "Monetization",
    description: "Collect tips and sell products directly from your page.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Looks perfect on every device. Optimized for where your fans are.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Blazing fast load times. Your fans won't wait around.",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Subtle blurred background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      
      <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground/95">
            Everything you need to <span className="gradient-text">stand out</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you grow your audience and monetize your content.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-6 rounded-2xl glass hover:bg-card/60 border border-border/30 hover:border-primary/20 hover:shadow-glow transition-all duration-500"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-accent/50 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
              >
                <feature.icon className="w-6 h-6 text-accent-foreground" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-foreground/90">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
