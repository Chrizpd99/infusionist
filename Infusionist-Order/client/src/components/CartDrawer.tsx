import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total: getTotalFunction } = useCart();
  const totalAmount = typeof getTotalFunction === 'function' ? getTotalFunction() : getTotalFunction;

  const getCartItemId = (productId: number, selectedSize?: string) => {
    return selectedSize ? `${productId}-${selectedSize}` : `${productId}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-black border-l border-white/10 flex flex-col shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-white/60">No items in cart</p>
                  <Button
                    onClick={onClose}
                    variant="link"
                    className="mt-4 text-amber-500 hover:text-amber-400"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const cartItemId = getCartItemId(item.id, item.selectedSize);
                    const displayPrice = item.selectedPrice ?? Number(item.price);
                    return (
                      <motion.div
                        key={cartItemId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 bg-zinc-900/50 p-3 rounded-lg border border-white/5 group hover:border-amber-500/20 transition-colors"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="font-bold text-sm line-clamp-1">
                              {item.name}
                            </h3>
                            {item.selectedSize && (
                              <p className="text-xs text-amber-500/80">
                                {item.selectedSize}
                              </p>
                            )}
                            <p className="text-amber-400 font-mono text-sm">
                              ₹{displayPrice}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(cartItemId, item.quantity - 1)
                              }
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="w-6 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(cartItemId, item.quantity + 1)
                              }
                              className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(cartItemId)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Subtotal</span>
                    <span className="font-mono">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Delivery</span>
                    <span className="font-mono text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-amber-400">₹{totalAmount}</span>
                  </div>
                </div>

                <Link href="/cart">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
                    >
                      Checkout <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
