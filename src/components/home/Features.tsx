import { motion } from "framer-motion";
import { BarChart3, CreditCard, Layers, Palette, Smartphone, Zap } from "lucide-react";

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
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
