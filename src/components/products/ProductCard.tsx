import { motion } from "framer-motion";
import { NFCProduct } from "./types";
import { CreditCard, Sticker, Watch, Key, Star } from "lucide-react";

const iconMap = {
  card: CreditCard,
  sticker: Sticker,
  band: Watch,
  keychain: Key,
  review: Star,
};

interface ProductCardProps {
  product: NFCProduct;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const Icon = iconMap[product.category];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isSelected
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      }`}
    >
      {/* Product Image/Gradient */}
      <div className={`aspect-square bg-gradient-to-br ${product.image} p-6 flex items-center justify-center`}>
        <div className="w-20 h-20 bg-background/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <Icon className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-card">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${product.basePrice.toFixed(2)}
          </span>
          {isSelected && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
              Selected
            </span>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}
