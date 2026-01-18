import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { BarChart3, CreditCard, Layers, Lock, Palette, Smartphone, Zap, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "Link Management",
    description: "Add unlimited links with drag-and-drop reordering. Show, hide, or schedule links to go live at specific times.",
    image: "from-violet-500 to-purple-600",
  },
  {
    icon: Palette,
    title: "Customization",
    description: "Choose from beautiful themes or create your own. Custom fonts, backgrounds, button styles, and more.",
    image: "from-pink-500 to-rose-600",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track views, clicks, and engagement. See which links perform best and optimize your content strategy.",
    image: "from-cyan-500 to-blue-600",
  },
  {
    icon: CreditCard,
    title: "Monetization",
    description: "Collect tips, sell products, and accept payments directly from your SmartCard. Multiple payment options supported.",
    image: "from-green-500 to-emerald-600",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Designed for where your audience is. Looks stunning on every device with lightning-fast load times.",
    image: "from-orange-500 to-amber-600",
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    description: "Your data is protected with enterprise-grade security. Control what's public and what's private.",
    image: "from-red-500 to-rose-600",
  },
];

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Everything you need to <span className="gradient-text">grow</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Powerful features to help you connect with your audience and monetize your content.
            </motion.p>
          </div>
        </section>

        {/* Features */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="space-y-24">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.image} mb-6`}>
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                    <Link to="/auth?signup=true">
                      <Button variant="gradient">
                        Get started
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Visual */}
                  <div className="flex-1">
                    <div className={`aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br ${feature.image} p-8 shadow-elevated`}>
                      <div className="w-full h-full rounded-2xl bg-background/10 backdrop-blur flex items-center justify-center">
                        <feature.icon className="w-24 h-24 text-primary-foreground/50" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 gradient-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
              Join millions of creators using SmartCard to connect with their audience.
            </p>
            <Link to="/auth?signup=true">
              <Button variant="hero" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
                Create your SmartCard
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
