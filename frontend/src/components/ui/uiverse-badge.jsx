import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * UIverse Animated Status Badge Component
 * Features a glowing pulse beacon, glass backdrop, subtle neon border, and light sweep effect.
 */
export const UIverseBadge = ({
  children,
  className,
  variant = 'cyan', // 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose'
  pulse = true,
  icon: Icon,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
  };

  const dotColors = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide border backdrop-blur-md transition-all duration-300 select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              dotColors[variant]
            )}
          />
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotColors[variant])} />
        </span>
      )}

      {Icon && <Icon className="h-3.5 w-3.5" />}

      <span>{children}</span>
    </motion.span>
  );
};

export default UIverseBadge;
