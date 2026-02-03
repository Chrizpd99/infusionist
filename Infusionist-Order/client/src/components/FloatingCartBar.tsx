import { Link } from "wouter";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export function FloatingCartBar() {
  const { items, total } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-gradient-to-t from-black/95 via-black/90 to-transparent backdrop-blur-lg border-t border-amber-500/20 px-4 py-4 safe-area-bottom shadow-2xl shadow-black/50">
            <Link href="/cart">
              <Button variant="premium" className="w-full py-4 flex items-center justify-between hover:shadow-lg hover:shadow-amber-500/20 transition-shadow">
                <div className="flex items-center gap-3">
                  <motion.div className="relative" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <ShoppingBag className="w-5 h-5" />
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {cartCount}
                    </motion.span>
                  </motion.div>
                  <span className="font-medium">View Cart</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">₹{total().toFixed(0)}</span>
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
