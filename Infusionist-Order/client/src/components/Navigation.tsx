import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navigation() {
  const [location, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isLoading, logout } = useAuth();
  const cartItems = useCart((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About" },
    { href: "/address", label: "Contact" },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    handleMobileLinkClick();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
            : "py-5 bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50">
            <motion.span
              className="font-display text-2xl font-bold tracking-wider text-white hover:text-amber-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              INFUSIONIST
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location === link.href ||
                (link.href !== "/" && location.startsWith(link.href));

              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide uppercase cursor-pointer transition-colors duration-200 ${
                      isActive
                        ? "text-amber-400"
                        : "text-white/70 hover:text-white"
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    {link.label}
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 relative z-50">
            {/* Cart Icon */}
            <Link href="/cart">
              <motion.div
                className="relative group cursor-pointer p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:text-amber-400 transition-colors" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-amber-500/30"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* User Menu */}
            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-white/10 border border-white/10">
                    <UserIcon className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-900/95 backdrop-blur-xl border-white/10" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-white/50">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin")}
                        className="cursor-pointer text-white/80 hover:text-white focus:bg-white/10"
                      >
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-white/80 hover:text-white focus:bg-white/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden text-white hover:text-amber-400 transition-colors p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
          >
            <motion.nav
              className="flex flex-col items-center gap-6"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
            >
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 }
                    }}
                  >
                    <Link href={link.href}>
                      <span
                        onClick={handleMobileLinkClick}
                        className={`font-display text-3xl cursor-pointer transition-colors ${
                          isActive ? "text-amber-400" : "text-white hover:text-amber-400"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 20, opacity: 0 }
                }}
              >
                <Link href="/cart">
                  <span
                    onClick={handleMobileLinkClick}
                    className="font-display text-3xl text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="bg-amber-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </span>
                </Link>
              </motion.div>

              {!isLoading && user && (
                <>
                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 }
                    }}
                    className="w-16 h-px bg-white/20 my-2"
                  />

                  {user.role === "admin" && (
                    <motion.div
                      variants={{
                        open: { y: 0, opacity: 1 },
                        closed: { y: 20, opacity: 0 }
                      }}
                    >
                      <Link href="/admin">
                        <span
                          onClick={handleMobileLinkClick}
                          className="font-display text-2xl text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          Admin Dashboard
                        </span>
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    variants={{
                      open: { y: 0, opacity: 1 },
                      closed: { y: 20, opacity: 0 }
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className="font-display text-xl text-white/60 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </button>
                  </motion.div>
                </>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
