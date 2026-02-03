import { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Plus, Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0].label : undefined
  );

  const handleAdd = () => {
    if (product.sizes && product.sizes.length > 0 && selectedSize) {
      const sizeOption = product.sizes.find(s => s.label === selectedSize);
      if (sizeOption) {
        addItem(product, selectedSize, sizeOption.price);
      }
    } else {
      addItem(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Get display price
  const getDisplayPrice = () => {
    if (product.sizes && product.sizes.length > 0 && selectedSize) {
      const sizeOption = product.sizes.find(s => s.label === selectedSize);
      return sizeOption ? sizeOption.price : Number(product.price);
    }
    return Number(product.price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-zinc-900/80 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
    >
      {/* Image Section */}
      <div className="aspect-square overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Product Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
            {product.badges.map((badge, idx) => {
              // Check if badge is a flag emoji
              const isFlag = /[\u{1F1E0}-\u{1F1FF}]/u.test(badge);
              if (isFlag) {
                return (
                  <span key={idx} className="text-lg bg-black/60 backdrop-blur-sm rounded-lg px-2 py-0.5">
                    {badge}
                  </span>
                );
              }
              // Style based on badge type
              const badgeStyles: Record<string, string> = {
                'Bestseller': 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900',
                'Spicy': 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
                'Mild': 'bg-gradient-to-r from-green-400 to-emerald-500 text-green-900',
                'Popular': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
              };
              const style = badgeStyles[badge] || 'bg-amber-500 text-black';
              return (
                <span key={idx} className={`flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full shadow-lg ${style}`}>
                  {badge === 'Bestseller' && <Star className="w-3 h-3 fill-current" />}
                  {badge}
                </span>
              );
            })}
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className="text-[10px] font-bold text-white/90 tracking-widest uppercase bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title & Price Row */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
            {product.name}
          </h3>
          <span className="font-mono text-lg text-amber-500 font-bold flex-shrink-0">
            ₹{getDisplayPrice()}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Size Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-white/50 uppercase tracking-wider mb-2 font-medium">Select Size</p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => setSelectedSize(size.label)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    selectedSize === size.label
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-white/80 border border-white/10 hover:border-amber-500/50 hover:bg-white/10'
                  }`}
                >
                  <div>{size.label}</div>
                  <div className="text-[10px] font-mono opacity-70 mt-0.5">₹{size.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAdd}
          disabled={!product.available}
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-semibold text-sm ${
            !product.available
              ? "bg-zinc-800 text-white/30 cursor-not-allowed"
              : isAdded
                ? "bg-emerald-500 text-white"
                : "bg-white/5 border border-white/20 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
          }`}
        >
          {!product.available ? (
            <span>Sold Out</span>
          ) : isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
    </motion.div>
  );
}
