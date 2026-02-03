import { useCart } from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Truck, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  deliveryCharges?: number;
  promoApplied?: string;
  promoDiscount?: number;
}

export function OrderSummaryModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  deliveryCharges = 0,
  promoApplied,
  promoDiscount = 0,
}: OrderSummaryModalProps) {
  const { items, total: getTotalFunction } = useCart();
  const subtotal = typeof getTotalFunction === 'function' ? getTotalFunction() : getTotalFunction;
  const finalTotal = subtotal + deliveryCharges - promoDiscount;

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
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-black border border-white/10 rounded-2xl max-w-md w-full shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Items */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">
                    Items ({items.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedSize || ""}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p className="text-white">
                            {item.name}
                            {item.selectedSize && (
                              <span className="text-amber-500/80 ml-1">
                                ({item.selectedSize})
                              </span>
                            )}
                          </p>
                          <p className="text-white/40 text-xs">x{item.quantity}</p>
                        </div>
                        <p className="font-mono text-amber-400">
                          ₹{(Number(item.selectedPrice || item.price) * item.quantity).toFixed(0)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-3 border-t border-white/10 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Subtotal</span>
                        <span className="font-mono">₹{subtotal}</span>
                      </div>

                      {deliveryCharges > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-white/60 flex items-center gap-2">
                            <Truck className="w-4 h-4 text-blue-400" />
                            Delivery
                          </span>
                          <span className="font-mono">₹{deliveryCharges}</span>
                        </motion.div>
                      )}

                      {promoDiscount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-white/60 flex items-center gap-2">
                            <Gift className="w-4 h-4 text-green-400" />
                            {promoApplied || "Promo Discount"}
                          </span>
                          <span className="font-mono text-green-400">
                            −₹{promoDiscount}
                          </span>
                        </motion.div>
                      )}

                      {deliveryCharges === 0 && !promoDiscount && (
                        <div className="flex justify-between text-sm text-green-400/80">
                          <span>Free Delivery</span>
                          <span className="font-bold">on orders 500+</span>
                        </div>
                      )}
                </div>

                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/30 rounded-lg p-4"
                >
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <div className="text-right">
                      {finalTotal !== subtotal && (
                        <p className="text-sm text-white/50 line-through">
                          ₹{subtotal}
                        </p>
                      )}
                      <p className="text-3xl font-bold text-amber-400">
                        ₹{finalTotal.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-xs text-blue-300">
                    💡 You'll receive a WhatsApp confirmation with real-time order tracking
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/10 p-6 flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
                  >
                    {isLoading ? "Processing..." : "Confirm Order"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
