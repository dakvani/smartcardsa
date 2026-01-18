import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

const categories = ["All", "Fashion", "Music", "Business", "Creative", "Personal"];

const templates = [
  { name: "Midnight", category: "Creative", gradient: "from-indigo-900 via-purple-900 to-pink-900" },
  { name: "Sunset", category: "Personal", gradient: "from-orange-500 via-pink-500 to-purple-600" },
  { name: "Ocean", category: "Business", gradient: "from-cyan-500 via-blue-500 to-indigo-600" },
  { name: "Forest", category: "Personal", gradient: "from-green-600 via-emerald-500 to-teal-500" },
  { name: "Minimal", category: "Business", gradient: "from-gray-100 via-gray-200 to-gray-300" },
  { name: "Neon", category: "Music", gradient: "from-pink-500 via-red-500 to-yellow-500" },
  { name: "Luxury", category: "Fashion", gradient: "from-amber-900 via-yellow-700 to-amber-600" },
  { name: "Candy", category: "Creative", gradient: "from-pink-400 via-purple-400 to-indigo-400" },
  { name: "Smoke", category: "Music", gradient: "from-gray-800 via-gray-700 to-gray-600" },
  { name: "Aurora", category: "Creative", gradient: "from-green-400 via-cyan-500 to-blue-500" },
  { name: "Rose", category: "Fashion", gradient: "from-rose-400 via-pink-400 to-red-400" },
  { name: "Classic", category: "Business", gradient: "from-slate-800 via-slate-700 to-slate-600" },
];

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = activeCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

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
              Beautiful <span className="gradient-text">templates</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Start with a stunning design. Customize it to match your brand.
            </motion.p>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  {/* Phone mockup */}
                  <div className="relative aspect-[9/16] rounded-[32px] bg-foreground p-2 shadow-elevated group-hover:shadow-glow transition-all duration-300 group-hover:-translate-y-2">
                    <div className={`w-full h-full rounded-[24px] bg-gradient-to-b ${template.gradient} overflow-hidden`}>
                      {/* Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-foreground rounded-full" />
                      
                      {/* Content */}
                      <div className="pt-12 px-4 text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur mb-3" />
                        <div className="h-3 w-20 mx-auto bg-white/40 rounded-full mb-2" />
                        <div className="h-2 w-28 mx-auto bg-white/20 rounded-full mb-6" />
                        
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-full h-10 bg-white/20 backdrop-blur rounded-xl mb-2" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/80 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-6 py-3 gradient-primary text-primary-foreground rounded-xl font-semibold text-sm">
                        Use this template
                      </span>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
