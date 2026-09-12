import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * UIverse Cyber Glowing Loader Component
 * A visually captivating loader with counter-rotating neon rings, central pulse,
 * and glowing status typography.
 */
export const UIverseLoader = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  text = 'Loading System...',
  className,
  color = 'cyan', // 'cyan' | 'purple' | 'pink' | 'emerald'
}) => {
  const sizeMap = {
    sm: { container: 'h-10 w-10', inner: 'h-6 w-6', font: 'text-xs' },
    md: { container: 'h-16 w-16', inner: 'h-10 w-10', font: 'text-sm' },
    lg: { container: 'h-24 w-24', inner: 'h-14 w-14', font: 'text-base' },
  };

  const colorVariants = {
    cyan: {
      ring1: 'border-cyan-500/80 border-t-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      ring2: 'border-indigo-500/80 border-b-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]',
      core: 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]',
      text: 'text-cyan-400',
    },
    purple: {
      ring1: 'border-purple-500/80 border-t-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      ring2: 'border-pink-500/80 border-b-transparent shadow-[0_0_15px_rgba(236,72,153,0.5)]',
      core: 'bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]',
      text: 'text-purple-400',
    },
    emerald: {
      ring1: 'border-emerald-500/80 border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      ring2: 'border-teal-500/80 border-b-transparent shadow-[0_0_15px_rgba(20,184,166,0.5)]',
      core: 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]',
      text: 'text-emerald-400',
    },
  };

  const selectedColor = colorVariants[color] || colorVariants.cyan;
  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-4', className)}>
      <div className={cn('relative flex items-center justify-center', dimensions.container)}>
        {/* Outer clockwise rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className={cn(
            'absolute inset-0 rounded-full border-2',
            selectedColor.ring1
          )}
        />

        {/* Inner counter-clockwise rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className={cn(
            'absolute rounded-full border-2',
            dimensions.inner,
            selectedColor.ring2
          )}
        />

        {/* Central pulsing core */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className={cn('h-3 w-3 rounded-full', selectedColor.core)}
        />
      </div>

      {text && (
        <p className={cn('font-mono font-medium tracking-widest animate-pulse', dimensions.font, selectedColor.text)}>
          {text}
        </p>
      )}
    </div>
  );
};

export default UIverseLoader;
