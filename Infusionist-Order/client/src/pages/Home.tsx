import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, Flame, Clock, ChefHat, Star, Users, User, Heart, Utensils, Hand, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingCartBar } from "@/components/FloatingCartBar";

export default function Home() {
  // Scroll-based parallax - simplified for performance
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Optimized animation variants with GPU-friendly transforms
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax */}
        <motion.div
          className="absolute inset-0 z-0 will-change-transform"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=2070&auto=format&fit=crop"
            alt="Grilled Chicken Feast"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* Subtle floating elements - CSS animations for performance */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container relative z-20 px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            {/* Brand Badge */}
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-xs font-medium tracking-wider uppercase">Now Accepting Orders</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={fadeInUp}
              className="font-display text-6xl md:text-8xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white">INFUSIONIST</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={fadeInUp}
              className="text-amber-400 text-lg md:text-xl tracking-[0.3em] uppercase mb-8"
            >
              Inside-Out Flavour
            </motion.p>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-4 font-light"
            >
              Curated Cloud Kitchen Menu
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-white/60 text-lg mb-10 italic"
            >
              Few Items. Done Properly.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
              <Link href="/menu">
                <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-12 py-7 text-lg rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40 transition-all duration-300 hover:scale-105 active:scale-95">
                  <span className="flex items-center">
                    View Our Menu <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <p className="text-white/50 text-sm">Free delivery on orders above ₹500</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - CSS animation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-amber-500 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Signature Bestseller Section */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* Decorative border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">Signature Bestseller</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Infusionist Feast Combo
            </h2>
            <p className="text-amber-400 text-3xl font-bold font-mono">₹699</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
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
                src="https://images.unsplash.com/photo-1606728035253-49e8a23146de?q=80&w=1200&auto=format&fit=crop"
                alt="Grilled Chicken Platter"
                className="relative rounded-2xl border border-white/10 shadow-2xl"
                loading="lazy"
              />
              {/* Bestseller Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-current" /> BESTSELLER
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-white/70 text-lg leading-relaxed">
                Our signature. Built to be shared. The ultimate Infusionist experience.
              </p>

              <div className="space-y-3">
                <p className="text-white/60 text-sm uppercase tracking-wider mb-4">Includes:</p>
                {[
                  "1 Full Infused Chicken (choice of flavour)",
                  "Mandi Rice (aromatic, lightly spiced)",
                  "Rumali Roti (x4)",
                  "Crispy Fries",
                  "Fresh Garden Salad",
                  "Any 3 Global Dips"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-amber-500">✓</span>
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-white/50 text-sm italic border-t border-white/10 pt-6">
                Infused slowly. Finished fresh. No shortcuts.
              </p>

              <Link href="/menu">
                <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-6 rounded-lg mt-4 transition-all duration-300 hover:scale-105">
                  Order Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Eat Section - The Experience */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Background pattern - static for performance */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(245, 158, 11, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">The Ritual</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              How to Eat Like an Infusionist
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Our food is designed to be experienced, not just consumed. Here's how to get the most out of every bite.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: <Hand className="w-8 h-8" />,
                title: "Use Your Hands",
                desc: "Tear the chicken with your fingers. Feel the texture. This is primal dining.",
                color: "from-amber-500 to-orange-600"
              },
              {
                step: "02",
                icon: <Utensils className="w-8 h-8" />,
                title: "Layer the Flavours",
                desc: "Wrap chicken in rumali roti with your choice of dip. Each bite should tell a story.",
                color: "from-orange-500 to-red-500"
              },
              {
                step: "03",
                icon: <Sparkles className="w-8 h-8" />,
                title: "Mix the Rice",
                desc: "Combine mandi rice with the chicken juices. Let the flavours marry on your plate.",
                color: "from-red-500 to-pink-500"
              },
              {
                step: "04",
                icon: <Heart className="w-8 h-8" />,
                title: "Share the Moment",
                desc: "Pass the platter. Share the dips. Food tastes better when shared.",
                color: "from-pink-500 to-purple-500"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="bg-zinc-900/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 h-full hover:border-amber-500/30 transition-colors duration-300 hover:-translate-y-2">
                  {/* Step number */}
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fun tip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-amber-500/80 italic text-sm">
              "Pro tip: Keep a stack of napkins ready. Messy hands are a sign of good food." — The Infusionist Team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meal Packages Section */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
        {/* Static decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">Choose Your Vibe</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Meals for Every Occasion
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Whether you're dining solo, planning a romantic evening, or feeding the whole family — we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Solo Meal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop"
                    alt="Solo Chicken Meal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <User className="w-3 h-3" /> Solo
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">The Lone Wolf</h3>
                  <p className="text-white/60 text-sm mb-4">Perfect for your me-time. A hearty meal built for one hungry soul.</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> Half Infused Chicken
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> Mandi Rice or Fries
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> 2 Rumali Rotis + 1 Dip
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 text-2xl font-bold">₹349</span>
                    <Link href="/menu">
                      <Button size="sm" className="bg-white/10 hover:bg-amber-500 text-white hover:text-black transition-all duration-300">
                        Order <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Couple Meal - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative group md:-mt-4"
            >
              {/* Featured badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                MOST POPULAR
              </div>

              <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-amber-500/50 rounded-3xl overflow-hidden shadow-xl shadow-amber-500/10 hover:-translate-y-2 transition-transform duration-300">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=800&auto=format&fit=crop"
                    alt="Couple's Feast"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Date Night
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">The Couple's Feast</h3>
                  <p className="text-white/60 text-sm mb-4">Romance over rumali. Share the love (and the chicken).</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> 1 Full Infused Chicken
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> Mandi Rice + Crispy Fries
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> 4 Rumali Rotis + Salad
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> 2 Signature Dips
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 text-2xl font-bold">₹599</span>
                    <Link href="/menu">
                      <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all duration-300">
                        Order <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Family Pack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
                    alt="Family Feast Platter"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" /> Family
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">The Family Feast</h3>
                  <p className="text-white/60 text-sm mb-4">Feed the whole crew. Sunday vibes, any day of the week.</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> 2 Full Infused Chickens
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> Large Mandi Rice + Fries
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> 8 Rumali Rotis + Large Salad
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="text-amber-500">✓</span> All 5 Signature Dips
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 text-2xl font-bold">₹1199</span>
                    <Link href="/menu">
                      <Button size="sm" className="bg-white/10 hover:bg-amber-500 text-white hover:text-black transition-all duration-300">
                        Order <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Special note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-12"
          >
            <p className="text-white/50 text-sm">
              All meals come with our signature 24-hour infused chicken. Customizations available on request.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-20 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4 block">What People Say</span>
            <h2 className="font-display text-3xl font-bold text-white">The Verdict Is In</h2>
          </motion.div>

          <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
            {[
              { text: "Best chicken I've had in years. The flavour goes all the way through!", author: "Priya S.", rating: 5 },
              { text: "The couple's feast was perfect for our anniversary dinner at home.", author: "Rahul M.", rating: 5 },
              { text: "Finally, someone who understands how to marinate chicken properly.", author: "Ananya K.", rating: 5 },
              { text: "Ordered the family pack. Zero leftovers. That says it all.", author: "Vikram P.", rating: 5 },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="min-w-[300px] md:min-w-[350px] snap-center"
              >
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 italic mb-4">"{testimonial.text}"</p>
                  <p className="text-amber-500 font-medium text-sm">— {testimonial.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About CTA Section (links to About page) */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">About Infusionist</h2>
            <p className="text-white/70 mb-6">We craft deep-flavoured meals with patience and intent. Learn more about our story, kitchen, and values.</p>
            <div className="flex justify-center gap-4">
              <Link href="/about"><Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all duration-300 hover:scale-105">About Us</Button></Link>
              <Link href="/address"><Button variant="outline" className="border-white/20 text-white hover:bg-white/10 transition-all duration-300">Find Us</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Method Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">The Method</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Flame className="w-10 h-10 text-amber-500" />,
                title: "Deep Infusion",
                desc: "Flavor driven to the core, not just surface level coating."
              },
              {
                icon: <Clock className="w-10 h-10 text-amber-500" />,
                title: "Patience",
                desc: "Slow-marinated for 24 hours to ensure perfect breakdown."
              },
              {
                icon: <ChefHat className="w-10 h-10 text-amber-500" />,
                title: "Crafted Recipes",
                desc: "Proprietary spice blends tested over hundreds of iterations."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-zinc-900 border border-white/5 p-8 rounded-2xl text-center group hover:border-amber-500/30 hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-20 h-20 mb-6 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center group-hover:bg-amber-500/20 transition-colors duration-300">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold mb-4 font-display text-white">{item.title}</h3>
                <p className="text-white/60 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingCartBar />
    </div>
  );
}
