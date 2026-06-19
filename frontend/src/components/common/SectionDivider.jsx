import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * SectionDivider — A decorative gradient line with a centered glowing dot.
 * Place between major sections in App.jsx to avoid abrupt raw stacking.
 */
const SectionDivider = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="relative flex items-center justify-center py-2 pointer-events-none select-none z-10">
      {/* Gradient line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(63,167,230,0.25) 35%, rgba(243,191,74,0.2) 50%, rgba(63,167,230,0.25) 65%, transparent 100%)',
          transformOrigin: 'center',
        }}
      />
      {/* Center glow dot */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative w-2 h-2 rounded-full bg-primary"
        style={{
          boxShadow: '0 0 10px rgba(63,167,230,0.8), 0 0 20px rgba(63,167,230,0.4)',
        }}
      />
    </div>
  );
};

export default SectionDivider;
