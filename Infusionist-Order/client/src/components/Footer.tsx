import { Link } from "wouter";
import { Instagram, MessageCircle, Mail, MapPin, Lock, ArrowUpRight } from "lucide-react";
import { config } from "@/lib/config";

export function Footer() {
  const whatsappNumber = config.whatsappNumber;
  const whatsappMessage = encodeURIComponent("Hi! I'd like to place an order with Infusionist.");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand Section */}
          <div className="md:col-span-5">
            <Link href="/">
              <span className="font-display text-2xl font-bold text-white hover:text-amber-400 transition-colors cursor-pointer">
                INFUSIONIST
              </span>
            </Link>
            <p className="text-amber-500 text-sm mb-4 mt-1 tracking-wider font-medium">Inside-Out Flavour</p>
            <p className="text-white/60 max-w-sm leading-relaxed mb-6">
              We believe some ideas need time. Some flavours need patience.
              Experience the art of slow infusion with our curated cloud kitchen menu.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/infusionist"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent text-white/60 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:border-transparent text-white/60 hover:text-white transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:infusionist.messyapron@gmail.com"
                className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:border-transparent text-white/60 hover:text-black transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5 text-white">Explore</h4>
            <ul className="space-y-3">
              {[
                { href: "/menu", label: "Our Menu" },
                { href: "/about", label: "About Us" },
                { href: "/address", label: "Find Us" },
                { href: "/cart", label: "Your Cart" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-white/60 hover:text-amber-400 cursor-pointer transition-colors duration-200 flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-5 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-white/60">
                  Bangalore, India<br />
                  <span className="text-white/50 text-sm">Cloud Kitchen</span>
                </span>
              </li>
              <li>
                <a
                  href="mailto:infusionist.messyapron@gmail.com"
                  className="flex items-start gap-3 text-white/60 hover:text-amber-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="break-all">infusionist.messyapron@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-white/50">
              © {currentYear} Infusionist by Messy Apron. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-white/40">
                <span className="hover:text-white/60 transition-colors">Sidharth</span>
                <span>•</span>
                <span className="hover:text-white/60 transition-colors">Christy</span>
                <span>•</span>
                <span className="hover:text-white/60 transition-colors">Rohan</span>
              </div>

              <span className="hidden md:block w-px h-4 bg-white/10" />

              <Link href="/login">
                <span className="flex items-center gap-1.5 text-white/50 hover:text-amber-400 transition-colors cursor-pointer">
                  <Lock className="w-3 h-3" />
                  Admin
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
