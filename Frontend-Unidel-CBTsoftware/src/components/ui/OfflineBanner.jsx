import React from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsOffline } from "../../hooks/useNetworkStatus";

/**
 * OfflineBanner - Non-blocking offline indicator
 *
 * Shows a banner at the top of the screen when the app detects
 * the user is offline. Automatically hides when back online.
 *
 * Usage:
 * Place in App.jsx after QueryClientProvider and Router
 * <OfflineBanner />
 */
const OfflineBanner = () => {
  const isOffline = useIsOffline();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {/* Left side - Icon and message */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm">You're offline</p>
                <p className="text-xs text-white/80">
                  Some features may not work. Check your connection.
                </p>
              </div>
            </div>

            {/* Right side - Retry button */}
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
