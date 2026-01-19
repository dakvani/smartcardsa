import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { ScrollToTop } from "./ScrollToTop";
import { ScrollProgress } from "./ScrollProgress";
import { FloatingActionButton } from "./FloatingActionButton";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import Templates from "@/pages/Templates";
import Products from "@/pages/Products";
import NFCProducts from "@/pages/NFCProducts";
import OrderHistory from "@/pages/OrderHistory";
import AdminOrders from "@/pages/AdminOrders";
import Marketplace from "@/pages/Marketplace";
import Learn from "@/pages/Learn";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import PublicProfile from "@/pages/PublicProfile";
import NotFound from "@/pages/NotFound";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <FloatingActionButton />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/templates" element={<PageTransition><Templates /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/nfc-products" element={<PageTransition><NFCProducts /></PageTransition>} />
          <Route path="/order-history" element={<PageTransition><OrderHistory /></PageTransition>} />
          <Route path="/admin/orders" element={<PageTransition><AdminOrders /></PageTransition>} />
          <Route path="/marketplace" element={<PageTransition><Marketplace /></PageTransition>} />
          <Route path="/learn" element={<PageTransition><Learn /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
          <Route path="/:username" element={<PageTransition><PublicProfile /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
