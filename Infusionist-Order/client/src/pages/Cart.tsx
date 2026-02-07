import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Trash2, Plus, Minus, ArrowRight, Loader2, CreditCard, CheckCircle, Shield, Truck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { PromoCodeInput } from "@/components/PromoCodeInput";
import { SpecialInstructions } from "@/components/SpecialInstructions";
import { OrderSummaryModal } from "@/components/OrderSummaryModal";
import { config } from "@/lib/config";


const formSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  customerAddress: z.string().min(5, "Address is required"),
  specialInstructions: z.string().optional(),
  promoCode: z.string().optional(),
});

// Helper to generate cart item ID (matches use-cart.ts)
const getCartItemId = (productId: number, selectedSize?: string) => {
  return selectedSize ? `${productId}-${selectedSize}` : `${productId}`;
};

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment">("details");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerAddress: "",
      specialInstructions: "",
      promoCode: "",
    },
  });

  // Calculate delivery charges
  useEffect(() => {
    const cartTotal = total();
    setDeliveryCharges(cartTotal >= config.freeDeliveryThreshold ? 0 : config.deliveryCharge);
  }, [total()]);

  const handlePromoApply = (code: string, discount: number) => {
    setPromoCode(code);
    setPromoApplied(true);
    setPromoDiscount(discount);
    toast({ title: `${code} applied!`, description: `You saved ₹${discount}` });
  };

  const handlePromoRemove = () => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoDiscount(0);
    toast({ title: "Promo removed" });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (items.length === 0) return;

    setShowOrderSummary(true);
  }

  const handleConfirmOrder = () => {
    const values = form.getValues();

    // Retrieve cookie consent from localStorage
    const consentData = localStorage.getItem("infusionist_cookie_consent");
    const cookieConsent = consentData ? JSON.parse(consentData) : null;

    createOrder(
      {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail || undefined,
        customerAddress: values.customerAddress,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        cookieConsent: cookieConsent || undefined, // Include consent with order
      } as any,
      {
        onSuccess: (order) => {
          toast({ title: "Order created!" });
          clearCart();
          setLocation(`/order-success/${order.id}`);
        },
        onError: (error) => {
          toast({
            title: "Failed to place order",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (items.length === 0 && checkoutStep === "details") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/10 relative"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trash2 className="w-8 h-8 text-white/20" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-bold mb-4"
          >
            Your cart is empty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 mb-8 max-w-md"
          >
            Looks like you haven't added any infused delights yet. Our kitchen is waiting.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/menu">
              <Button variant="premium" size="lg">
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="font-display text-4xl font-bold">
            Complete Your Order
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Cart Items */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6 tracking-widest uppercase text-white/70">Cart Items</h2>
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const cartItemId = getCartItemId(item.id, item.selectedSize);
                const displayPrice = item.selectedPrice ?? Number(item.price);
                return (
                <motion.div
                  layout
                  key={cartItemId}
                  initial={{ opacity: 0, x: -50, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: 50, rotateY: 15, transition: { duration: 0.3 } }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-primary/20 transition-all duration-300 preserve-3d"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </motion.div>

                  <div className="ml-6 flex-grow">
                    <h3 className="font-display text-lg font-bold">
                      {item.name}
                      {item.selectedSize && (
                        <span className="text-sm font-normal text-primary ml-2">({item.selectedSize})</span>
                      )}
                    </h3>
                    <p className="text-primary font-mono">₹{displayPrice}</p>
                  </div>

                  {/* Quantity Controls - always visible */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-black rounded-lg border border-white/10 relative overflow-hidden">
                      <motion.button
                        onClick={() => updateQuantity(cartItemId, item.quantity - 1)}
                        whileTap={{ scale: 0.85, rotate: -10 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 165, 55, 0.1)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="p-2 hover:text-primary transition-colors relative z-10"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-8 text-center font-mono text-sm"
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        onClick={() => updateQuantity(cartItemId, item.quantity + 1)}
                        whileTap={{ scale: 0.85, rotate: 10 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 165, 55, 0.1)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="p-2 hover:text-primary transition-colors relative z-10"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <motion.button
                      onClick={() => removeItem(cartItemId)}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9, rotate: -10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="p-2 text-white/30 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>

            <motion.div
              layout
              className="pt-6 border-t border-white/10 flex justify-between items-center text-xl font-bold"
            >
              <span>Total</span>
              <motion.span
                key={total()}
                initial={{ scale: 1.2, color: "#d4af37" }}
                animate={{ scale: 1, color: "#d4af37" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="font-mono text-primary"
              >
                ₹{total().toFixed(2)}
              </motion.span>
            </motion.div>
          </div>

          {/* Checkout Form / Payment */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 25 }}
            className="bg-zinc-900/20 border border-white/5 p-8 rounded-2xl h-fit"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold mb-6 tracking-widths uppercase text-white/70"
            >
              Delivery Details
            </motion.h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60">
                            Email <span className="text-white/30">(optional - for order updates)</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/60">Delivery Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Flat No, Building, Street..." {...field} className="h-24" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Delivery Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                    >
                      <Truck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-blue-400">
                          {deliveryCharges === 0 ? "✓ Free Delivery" : `₹${deliveryCharges} Delivery`}
                        </p>
                        <p className="text-xs text-blue-300/70">
                          {deliveryCharges === 0
                            ? "Free on orders ₹500+"
                            : "Free delivery on orders ₹500+"}
                        </p>
                      </div>
                    </motion.div>

                    {/* Promo Code */}
                    <PromoCodeInput
                      onApply={handlePromoApply}
                      onRemove={handlePromoRemove}
                      applied={promoApplied}
                      appliedCode={promoCode}
                      discountAmount={promoDiscount}
                    />

                    {/* Special Instructions */}
                    <SpecialInstructions
                      value={form.watch("specialInstructions")}
                      onChange={(value) =>
                        form.setValue("specialInstructions", value)
                      }
                    />

                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button type="submit" variant="premium" size="lg" className="w-full mt-8 relative overflow-hidden" disabled={isPending}>
                        {!isPending && (
                          <motion.div
                            className="absolute inset-0 w-full h-full"
                            style={{
                              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                              backgroundSize: "200% 100%",
                            }}
                            animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <span className="relative z-10">
                          {isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              Review Order <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </span>
                      </Button>
                    </motion.div>
                  </form>
                </Form>
            </motion.div>
          </div>
      </div>

      {/* Order Summary Modal */}
      <OrderSummaryModal
        isOpen={showOrderSummary}
        onClose={() => setShowOrderSummary(false)}
        onConfirm={handleConfirmOrder}
        isLoading={isPending}
        deliveryCharges={deliveryCharges}
        promoApplied={promoCode}
        promoDiscount={promoDiscount}
      />

      <Footer />
    </div>
  );
}
