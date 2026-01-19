import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { name: "Templates", href: "/templates" },
  { name: "Products", href: "/products" },
  { name: "NFC Products", href: "/nfc-products" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Pricing", href: "/pricing" },
  { name: "Learn", href: "/learn" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0.6, 0.95]);

  // Handle scroll direction for show/hide
  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    // Always show at top
    if (currentScrollY < 50) {
      setIsVisible(true);
      setHasScrolled(false);
    } else {
      setHasScrolled(true);
      // Show when scrolling up (with threshold for sensitivity)
      const scrollDiff = currentScrollY - lastScrollY.current;
      
      if (scrollDiff < -5) {
        // Scrolling up
        setIsVisible(true);
      } else if (scrollDiff > 10 && currentScrollY > 100) {
        // Scrolling down significantly
        setIsVisible(false);
      }
    }
    
    lastScrollY.current = currentScrollY;
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled 
          ? "border-b border-border/30" 
          : "border-b border-transparent"
      }`}
      role="banner"
    >
      <motion.div 
        className="absolute inset-0 glass-heavy"
        style={{ opacity: headerOpacity }}
        aria-hidden="true"
      />
      <nav 
        className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
          aria-label="SmartCard - Go to homepage"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow"
            aria-hidden="true"
          >
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </motion.div>
          <span className="font-bold text-xl text-foreground/90 group-hover:text-foreground transition-colors">SmartCard</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1" role="menubar">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              role="none"
            >
              <Link
                to={link.href}
                role="menuitem"
                aria-current={location.pathname === link.href ? "page" : undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.href
                    ? "bg-accent/80 text-accent-foreground backdrop-blur-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                }`}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/auth" aria-label="Log in to your account">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link to="/auth?signup=true" aria-label="Sign up for a free account">
            <Button variant="gradient" size="sm" className="shadow-glow">
              Sign up free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-heavy border-b border-border/30"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                role="none"
              >
                <Link
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  role="menuitem"
                  aria-current={location.pathname === link.href ? "page" : undefined}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.href
                      ? "bg-accent/80 text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <div className="pt-4 flex flex-col gap-2" role="group" aria-label="Authentication options">
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full border-border/50" aria-label="Log in to your account">
                  Log in
                </Button>
              </Link>
              <Link to="/auth?signup=true" onClick={() => setMobileOpen(false)}>
                <Button variant="gradient" className="w-full shadow-glow" aria-label="Sign up for a free account">
                  Sign up free
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
