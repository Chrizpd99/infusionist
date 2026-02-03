import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, CheckCircle, UtensilsCrossed, Truck } from "lucide-react";

interface OrderStatus {
  id: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  estimatedTime?: number; // in minutes
  currentStep?: string; // For POS integration
  posSystemId?: string; // For linking to external POS
  updatedAt: string;
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: UtensilsCrossed },
  { key: "ready", label: "Ready", icon: CheckCircle },
  { key: "out_for_delivery", label: "On the way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

interface OrderTrackingProps {
  orderId: number;
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const { data: orderStatus, isLoading } = useQuery<OrderStatus>({
    queryKey: ["order-tracking", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}/tracking`);
      if (!res.ok) throw new Error("Failed to fetch order status");
      return res.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-zinc-800 rounded w-1/3 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3 bg-zinc-800 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!orderStatus) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key === orderStatus.status
  );

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full" />

        {/* Progress bar fill */}
        {currentStepIndex >= 0 && (
          <motion.div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / STATUS_STEPS.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {STATUS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <motion.div
                key={step.key}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    isCurrent
                      ? "bg-amber-500/30 border-2 border-amber-500 shadow-lg shadow-amber-500/20"
                      : isCompleted
                        ? "bg-green-500/30 border-2 border-green-500"
                        : "bg-white/5 border-2 border-white/10"
                  }`}
                  animate={
                    isCurrent
                      ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] }
                      : undefined
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCompleted
                        ? "text-amber-400"
                        : "text-white/40"
                    }`}
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`text-xs text-center font-medium ${
                    isCurrent
                      ? "text-amber-400"
                      : isCompleted
                        ? "text-green-400"
                        : "text-white/40"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Estimated time & POS info */}
      <div className="space-y-3">
        {orderStatus.estimatedTime && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
          >
            <p className="text-xs text-white/70">Estimated time</p>
            <p className="text-lg font-bold text-amber-400">
              {orderStatus.estimatedTime} min
            </p>
          </motion.div>
        )}

        {/* Current step display */}
        {orderStatus.currentStep && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-white/5 rounded-lg p-3"
          >
            <p className="text-xs text-white/50">Current Activity</p>
            <p className="text-sm font-medium text-white/80">
              {orderStatus.currentStep}
            </p>
          </motion.div>
        )}

        {/* POS integration ready notice */}
        {orderStatus.posSystemId && (
          <div className="text-xs text-white/40 text-center italic">
            Synced with kitchen (ID: {orderStatus.posSystemId})
          </div>
        )}
      </div>

      {/* Last updated */}
      <p className="text-xs text-white/30 text-center">
        Last updated: {new Date(orderStatus.updatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}
