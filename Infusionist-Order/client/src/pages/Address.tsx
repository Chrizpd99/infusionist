import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Address() {
  const addressLines = [
    "Infusionist Cloud Kitchen",
    "Unit 12, Spice Lane",
    "MG Road, YourCity",
    "State, PIN 123456",
    "Phone: +91 98765 43210"
  ];

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Navigation />

      <main className="flex-grow container mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
          <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-6 h-6 text-amber-400" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Find Us</h1>
          <p className="text-white/70 mb-6">We're a cloud kitchen — here are our contact details and address.</p>

          <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-6 text-left">
            {addressLines.map((line, idx) => (
              <div key={idx} className="text-white/80 mb-1">{line}</div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-white/70 mb-4">Get directions or contact us for bulk orders.</p>
            <Link href="/"><Button variant="outline">Return Home</Button></Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
