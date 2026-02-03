import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ProductListSkeleton } from "@/components/SkeletonLoader";
import { Product } from "@shared/schema";
import { motion } from "framer-motion";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { useState, useEffect } from "react";
import { ChefHat, Flame, Clock } from "lucide-react";

export default function Menu() {
  const { data: products, isLoading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { name: "Signature Combos", icon: "🍗" },
    { name: "Infused Chickens", icon: "🔥" },
    { name: "Sides & Breads", icon: "🍟" },
    { name: "Global Sauces", icon: "🌍" },
    { name: "Beverages", icon: "🥤" }
  ];

  // Track active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => {
        const id = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const el = document.getElementById(id);
        return { name: cat.name, el, top: el?.offsetTop || 0 };
      });

      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPos >= sections[i].top) {
          setActiveCategory(sections[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (categoryName: string) => {
    const id = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 150;
      const top = el.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1606728035253-49e8a23146de?q=80&w=2070&auto=format&fit=crop"
            alt="Menu Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-600/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6"
            >
              <ChefHat className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400 text-sm font-medium">Curated Selection</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-white">
              Our Menu
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Each item is prepared with our signature 24-hour slow infusion process.
              Few items. Done properly.
            </p>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="text-white/70 text-sm">Deep Infused</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-white/70 text-sm">24hr Marinated</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Category Navigation */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => scrollToCategory(cat.name)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-6 py-12">
        {isLoading && <ProductListSkeleton />}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-red-900/50 bg-red-900/10 rounded-2xl"
          >
            <p className="text-red-400 text-lg">Failed to load menu. Please try again later.</p>
          </motion.div>
        )}

        {products && categories.map((category, catIdx) => {
          const categoryProducts = products.filter(
            (p: Product) => p.category.toLowerCase() === category.name.toLowerCase()
          );

          if (categoryProducts.length === 0) return null;

          const id = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

          return (
            <motion.section
              key={category.name}
              id={id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-20"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                    {category.name}
                  </h2>
                </div>
                <div className="h-px bg-gradient-to-r from-amber-500/50 to-transparent flex-grow" />
                <span className="text-white/40 text-sm font-medium">
                  {categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {categoryProducts.map((product: Product, idx: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      <Footer />
      <FloatingCartBar />
    </div>
  );
}
