import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = '919674171451'; // Replace with actual number
  const whatsappMessage = 'Hi Zettaweb! I would like to discuss a project.';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative">
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-16 bottom-2 glass px-4 py-2 rounded-lg whitespace-nowrap"
                >
                  <p className="text-sm font-medium">Chat with us on WhatsApp!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
              onClick={handleClick}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-lg flex items-center justify-center group transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <MessageCircle className="w-7 h-7 text-white z-10" />
              
              {/* Pulse animation */}
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
            </motion.button>

            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;