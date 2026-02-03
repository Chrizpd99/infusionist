import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface SpecialInstructionsProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

export function SpecialInstructions({
  value = "",
  onChange,
  maxLength = 200,
}: SpecialInstructionsProps) {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = value.length;
  const percentage = (charCount / maxLength) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-semibold text-white/80">
        Special Instructions (Optional)
      </label>

      <div className="relative">
        <motion.div
          animate={{ borderColor: isFocused ? "rgba(212, 165, 55, 0.5)" : "rgba(255, 255, 255, 0.1)" }}
          transition={{ duration: 0.2 }}
          className="border rounded-lg overflow-hidden"
        >
          <Textarea
            placeholder="E.g., Extra spicy • No onions • Allergies..."
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                onChange?.(e.target.value);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="min-h-20 bg-zinc-900/50 border-0 text-white placeholder:text-white/30 resize-none focus:outline-none"
            maxLength={maxLength}
          />
        </motion.div>

        {/* Character counter */}
        <motion.div
          className="absolute bottom-2 right-2 text-xs font-mono"
          animate={{ color: percentage > 80 ? "rgb(239, 68, 68)" : "rgba(255, 255, 255, 0.4)" }}
        >
          {charCount}/{maxLength}
        </motion.div>

        {/* Progress bar */}
        <motion.div className="h-1 bg-white/5 mt-1 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${percentage > 80 ? "bg-red-500" : "bg-gradient-to-r from-amber-500 to-amber-400"}`}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </motion.div>
      </div>

      {/* Hints */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-blue-300/70 space-y-1"
          >
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Let us know about allergies, preferences, or dietary restrictions. We'll take extra care.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
