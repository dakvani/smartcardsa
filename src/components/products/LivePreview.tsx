import { motion } from "framer-motion";
import { DesignCustomization, NFCProduct } from "./types";
import { Wifi, CreditCard, Sticker, Watch, Key, Star } from "lucide-react";

const iconMap = {
  card: CreditCard,
  sticker: Sticker,
  band: Watch,
  keychain: Key,
  review: Star,
};

interface LivePreviewProps {
  product: NFCProduct;
  customization: DesignCustomization;
}

export function LivePreview({ product, customization }: LivePreviewProps) {
  const Icon = iconMap[product.category];

  const renderBusinessCard = () => (
    <div
      className="relative w-[340px] h-[200px] rounded-2xl shadow-2xl overflow-hidden"
      style={{ backgroundColor: customization.backgroundColor }}
    >
      {/* Custom artwork background */}
      {customization.customArtworkUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${customization.customArtworkUrl})` }}
        />
      )}
      
      {/* NFC icon */}
      <div className="absolute top-4 right-4">
        <Wifi className="w-6 h-6" style={{ color: customization.accentColor }} />
      </div>
      
      {/* Logo */}
      {customization.logoUrl && (
        <div className="absolute top-4 left-4">
          <img
            src={customization.logoUrl}
            alt="Logo"
            className="w-12 h-12 rounded-lg object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="absolute bottom-6 left-6 right-6">
        <h3
          className="text-xl font-bold"
          style={{ color: customization.textColor }}
        >
          {customization.name || "Your Name"}
        </h3>
        <p
          className="text-sm mt-1"
          style={{ color: `${customization.textColor}99` }}
        >
          {customization.title || "Your Title"}
        </p>
        {customization.linkedProfileUsername && (
          <p
            className="text-xs mt-2 font-medium"
            style={{ color: customization.accentColor }}
          >
            @{customization.linkedProfileUsername}
          </p>
        )}
      </div>
      
      {/* Accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: customization.accentColor }}
      />
    </div>
  );

  const renderSticker = () => (
    <div
      className="relative w-[200px] h-[200px] rounded-full shadow-2xl flex items-center justify-center"
      style={{ backgroundColor: customization.backgroundColor }}
    >
      {customization.logoUrl ? (
        <img
          src={customization.logoUrl}
          alt="Logo"
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <div className="text-center">
          <Wifi className="w-12 h-12 mx-auto" style={{ color: customization.accentColor }} />
          <p
            className="text-sm font-bold mt-2"
            style={{ color: customization.textColor }}
          >
            {customization.name || "TAP ME"}
          </p>
        </div>
      )}
      <div
        className="absolute inset-0 rounded-full border-4"
        style={{ borderColor: customization.accentColor }}
      />
    </div>
  );

  const renderBand = () => (
    <div
      className="relative w-[300px] h-[60px] rounded-full shadow-2xl flex items-center justify-center px-6"
      style={{ backgroundColor: customization.backgroundColor }}
    >
      <Wifi className="w-5 h-5 mr-3" style={{ color: customization.accentColor }} />
      <span
        className="font-bold text-lg"
        style={{ color: customization.textColor }}
      >
        {customization.name || "YOUR NAME"}
      </span>
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: customization.accentColor }}
      />
    </div>
  );

  const renderKeychain = () => (
    <div className="flex flex-col items-center">
      {/* Ring */}
      <div
        className="w-8 h-8 rounded-full border-4"
        style={{ borderColor: customization.accentColor }}
      />
      {/* Chain */}
      <div
        className="w-1 h-4"
        style={{ backgroundColor: customization.accentColor }}
      />
      {/* Tag */}
      <div
        className="relative w-[120px] h-[160px] rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: customization.backgroundColor }}
      >
        <Wifi className="w-8 h-8 mb-2" style={{ color: customization.accentColor }} />
        {customization.logoUrl ? (
          <img
            src={customization.logoUrl}
            alt="Logo"
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <>
            <p
              className="text-sm font-bold text-center"
              style={{ color: customization.textColor }}
            >
              {customization.name || "NAME"}
            </p>
            <p
              className="text-xs text-center mt-1"
              style={{ color: `${customization.textColor}99` }}
            >
              {customization.title || "Title"}
            </p>
          </>
        )}
      </div>
    </div>
  );

  const renderReviewCard = () => (
    <div
      className="relative w-[340px] h-[200px] rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: customization.backgroundColor }}
    >
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-8 h-8 fill-current"
            style={{ color: customization.accentColor }}
          />
        ))}
      </div>
      <h3
        className="text-xl font-bold"
        style={{ color: customization.textColor }}
      >
        {customization.name || "Leave a Review"}
      </h3>
      <p
        className="text-sm mt-2"
        style={{ color: `${customization.textColor}99` }}
      >
        Tap to rate us!
      </p>
      <Wifi
        className="absolute bottom-4 right-4 w-6 h-6"
        style={{ color: customization.accentColor }}
      />
    </div>
  );

  const renderPreview = () => {
    switch (product.category) {
      case 'card':
        return renderBusinessCard();
      case 'sticker':
        return renderSticker();
      case 'band':
        return renderBand();
      case 'keychain':
        return renderKeychain();
      case 'review':
        return renderReviewCard();
      default:
        return renderBusinessCard();
    }
  };

  return (
    <div className="bg-gradient-to-br from-muted/50 to-muted rounded-2xl p-8">
      <h3 className="text-lg font-semibold mb-6 text-center">Live Preview</h3>
      <motion.div
        key={JSON.stringify(customization)}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center min-h-[250px]"
      >
        {renderPreview()}
      </motion.div>
      {customization.canvaDesignUrl && (
        <p className="text-xs text-center text-muted-foreground mt-4">
          📎 Canva design will be applied to final product
        </p>
      )}
    </div>
  );
}
