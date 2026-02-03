import { motion } from "framer-motion";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900/50 border border-white/5">
      {/* Image skeleton */}
      <div className="relative w-full aspect-square bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["−100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ width: "100%" }}
        />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <div className="h-5 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["−100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Description */}
        <div className="h-4 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded w-5/6">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["−100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-16 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["−100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="h-8 w-8 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 rounded-lg">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["−100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
