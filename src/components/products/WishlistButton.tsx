import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

export function WishlistButton({ productId, productName, className = "" }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const checkWishlistStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
    
    if (user) {
      const { data } = await supabase
        .from("product_wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();
      
      setIsWishlisted(!!data);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Please log in to save to wishlist");
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        const { error } = await supabase
          .from("product_wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);

        if (error) throw error;
        setIsWishlisted(false);
        toast.success(`${productName} removed from wishlist`);
      } else {
        const { error } = await supabase.from("product_wishlist").insert({
          user_id: userId,
          product_id: productId,
        });

        if (error) throw error;
        setIsWishlisted(true);
        toast.success(`${productName} added to wishlist`);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist");
    }
    setLoading(false);
  };

  return (
    <motion.button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2.5 rounded-xl bg-background/90 backdrop-blur-sm border border-border/50 shadow-lg disabled:opacity-50 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-5 h-5 transition-colors ${
          isWishlisted
            ? "text-red-500 fill-red-500"
            : "text-muted-foreground hover:text-red-500"
        }`}
      />
    </motion.button>
  );
}
