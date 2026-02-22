import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          <span className="text-[10rem] font-black leading-none bg-gradient-to-br from-primary via-primary/60 to-primary/20 bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page <code className="px-2 py-0.5 rounded bg-muted text-sm font-mono">{location.pathname}</code> doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Looking for a profile? Try{" "}
          <Link to="/dakvan" className="text-primary underline hover:text-primary/80">
            smartcard.com/username
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
