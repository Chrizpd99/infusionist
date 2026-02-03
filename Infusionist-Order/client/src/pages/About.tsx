import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Flame,
  Heart,
  Leaf,
  ChefHat,
  Clock,
  Star,
  ArrowRight,
  Quote,
  Sparkles
} from "lucide-react";

export default function About() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Optimized animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const values = [
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Deep Flavour",
      description: "We believe flavour should penetrate to the core, not just coat the surface. Every dish is infused for hours."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Patience",
      description: "Good food takes time. We slow-marinate for 24+ hours because shortcuts compromise quality."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainability",
      description: "Locally sourced ingredients, eco-friendly packaging, and mindful practices in everything we do."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Crafted with Care",
      description: "Every order is prepared fresh. We treat each dish like it's going to our own family."
    }
  ];

  const team = [
    {
      name: "Sidharth",
      role: "Founder & Head Chef",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=500&auto=format&fit=crop",
      quote: "Food is love made visible."
    },
    {
      name: "Christy",
      role: "Operations & Experience",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop",
      quote: "Every detail matters."
    },
    {
      name: "Rohan",
      role: "Tech & Innovation",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
      quote: "Building the future of food."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
            alt="Restaurant Kitchen"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* Static floating accent for better performance */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="container relative z-20 px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-sm tracking-[0.3em] uppercase">Our Story</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-display text-5xl md:text-7xl font-bold mb-6"
            >
              About <span className="text-amber-500">Infusionist</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed"
            >
              Born from a passion for deep, slow-cooked flavours and a commitment to
              delivering restaurant-grade meals to your doorstep.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator - CSS animation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-amber-500 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-zinc-950 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&auto=format&fit=crop"
                alt="Marinating Chicken"
                className="relative rounded-2xl border border-white/10 shadow-2xl"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-500 text-black p-6 rounded-xl">
                <p className="font-bold text-3xl">24+</p>
                <p className="text-sm">Hours Infusion</p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="font-display text-4xl font-bold text-white">
                The <span className="text-amber-500">Infusionist</span> Way
              </h2>

              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  It started in a small home kitchen with one simple belief: flavour shouldn't
                  be an afterthought. We wanted to create dishes where every bite tells a story
                  of patience, quality ingredients, and genuine craftsmanship.
                </p>
                <p>
                  Today, we operate as a modern cloud kitchen — efficient, consistent, and
                  quality-driven. Our recipes are developed and tested in-house, with each
                  spice blend perfected over hundreds of iterations.
                </p>
                <p>
                  We don't do everything. We do a few things, and we do them properly.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {team.map((member, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-full border-2 border-black overflow-hidden"
                    >
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-sm">
                  Built with love by our founding team
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">What We Believe</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center group hover:border-amber-500/30 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        {/* Static background decoration for performance */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">The Humans Behind It</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="font-display text-2xl font-bold text-white">{member.name}</h3>
                    <p className="text-amber-400 text-sm">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2">
                  <Quote className="w-5 h-5 text-amber-500/50 flex-shrink-0 mt-1" />
                  <p className="text-white/60 italic">{member.quote}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-black relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Quote className="w-12 h-12 text-amber-500/30 mx-auto mb-6" />
            <p className="font-display text-3xl md:text-4xl text-white/90 leading-relaxed mb-6">
              "We don't just make food. We craft experiences that you can taste."
            </p>
            <p className="text-amber-500">— The Infusionist Team</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-zinc-950 to-black relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <ChefHat className="w-12 h-12 text-amber-500 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-white/60 mb-8">
              Explore our carefully curated menu and taste the infusion for yourself.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/menu">
                <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
                  View Menu <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/address">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
                  Find Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
