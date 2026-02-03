import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PromoCodeInputProps {
  onApply?: (code: string, discount: number) => void;
  onRemove?: () => void;
  applied?: boolean;
  appliedCode?: string;
  discountAmount?: number;
}

// Mock promo codes for demo (replace with API call)
const VALID_PROMOS: Record<string, number> = {
  SAVE50: 50,
  SAVE100: 100,
  WELCOME: 75,
  FIRST20: 0.2, // 20% off (will be calculated)
};

export function PromoCodeInput({
  onApply,
  onRemove,
  applied = false,
  appliedCode = "",
  discountAmount = 0,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const discount = VALID_PROMOS[code.toUpperCase()];

      if (discount) {
        onApply?.(code.toUpperCase(), discount);
        setCode("");
      } else {
        setError("Invalid promo code");
      }
    } catch (err) {
      setError("Failed to apply code");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
      >
        <Check className="w-5 h-5 text-green-400" />
        <div className="flex-1">
          <p className="text-sm font-bold text-green-400">{appliedCode} Applied</p>
          <p className="text-xs text-green-400/70">−₹{discountAmount} discount</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          onKeyPress={(e) => e.key === "Enter" && handleApply()}
          disabled={loading}
          className="flex-1 bg-zinc-900/50 border-white/10"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6"
          >
            {loading ? "..." : "Apply"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Suggested codes hint */}
      <div className="text-xs text-white/40">
        Try: <span className="text-amber-500/70 font-mono">SAVE50</span>, 
        <span className="text-amber-500/70 font-mono ml-1">WELCOME</span>
      </div>
    </div>
  );
}
