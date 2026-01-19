import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductRatingBadgeProps {
  productId: string;
  onClick?: () => void;
}

export function ProductRatingBadge({ productId, onClick }: ProductRatingBadgeProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    fetchRating();
  }, [productId]);

  const fetchRating = async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", productId);

    if (!error && data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
      setReviewCount(data.length);
    }
  };

  if (reviewCount === 0) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Be first to review</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-0.5">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-medium">{averageRating.toFixed(1)}</span>
      </div>
      <span className="text-muted-foreground">({reviewCount})</span>
    </button>
  );
}
