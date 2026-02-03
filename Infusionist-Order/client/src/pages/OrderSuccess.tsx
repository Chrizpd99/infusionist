import { useParams, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Clock, ChefHat, Truck, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [showConfetti, setShowConfetti] = useState(true);

  const whatsappNumber = "919876543210";
  const whatsappMessage = encodeURIComponent(`Hi! I'd like to track my order #${id}`);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const orderSteps = [
    { icon: CheckCircle2, label: "Confirmed", status: "completed" },
    { icon: ChefHat, label: "Preparing", status: "current" },
    { icon: Truck, label: "On the Way", status: "pending" },
  ];

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -20,
    rotation: Math.random() * 360,
    color: ["#d4af37", "#22c55e", "#fff", "#fbbf24"][Math.floor(Math.random() * 4)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: `${particle.x}vw`, y: particle.y, opacity: 1, rotate: 0 }}
            animate={{
              y: "120vh",
              rotate: particle.rotation,
              opacity: 0,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeIn",
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: particle.color }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-md w-full text-center bg-zinc-900/30 border border-white/5 p-12 rounded-2xl relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-3xl rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          ))}

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: 0.2,
              }}
              className="mx-auto w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mb-6 border border-green-500/20 relative"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              {/* Expanding rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-green-500"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                  transition={{
                    duration: 2,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-3xl font-bold mb-2"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 mb-6 font-light"
            >
              Order{" "}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
                className="text-primary font-mono font-bold"
              >
                #{id}
              </motion.span>{" "}
              received
            </motion.p>

            {/* Order Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-black/40 p-6 rounded-xl mb-6 border border-white/5"
            >
              <div className="flex items-center justify-between">
                {orderSteps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.8 + index * 0.15,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex flex-col items-center relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        step.status === "completed"
                          ? "bg-green-500 text-white"
                          : step.status === "current"
                            ? "bg-primary text-black"
                            : "bg-white/10 text-white/40"
                      }`}
                    >
                      <motion.div
                        animate={
                          step.status === "current"
                            ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <step.icon className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                    <span
                      className={`text-xs ${
                        step.status === "completed"
                          ? "text-green-400"
                          : step.status === "current"
                            ? "text-primary font-medium"
                            : "text-white/40"
                      }`}
                    >
                      {step.label}
                    </span>
                    {index < orderSteps.length - 1 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step.status === "completed" ? 1 : 0 }}
                        transition={{ delay: 0.9 + index * 0.15, duration: 0.3 }}
                        className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 ${
                          step.status === "completed" ? "bg-green-500" : "bg-white/10"
                        }`}
                        style={{ width: "60px", transformOrigin: "left" }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Estimated Time */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring" }}
              className="bg-gradient-to-r from-primary/20 to-amber-500/20 p-6 rounded-xl mb-6 border border-primary/30 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <div className="flex items-center justify-center gap-3 mb-2 relative z-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Clock className="w-5 h-5 text-primary" />
                </motion.div>
                <p className="text-sm text-white/60 uppercase tracking-widest">Estimated Delivery</p>
              </div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                className="text-3xl font-display font-bold text-primary relative z-10"
              >
                35-45 Mins
              </motion.p>
            </motion.div>

            {/* WhatsApp Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                Track on WhatsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent border-white/10 hover:bg-white/5">
                  Return Home
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}
