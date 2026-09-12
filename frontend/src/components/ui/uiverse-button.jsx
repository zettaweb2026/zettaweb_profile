import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * UIverse Interactive Shimmer / Cyber Button Component
 * Features futuristic neon borders, shimmer animations, and Framer Motion micro-interactions.
 */
export const UIverseButton = ({
  children,
  className,
  variant = 'neon', // 'neon' | 'cyber' | 'glass' | 'gradient'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5 rounded-lg',
    md: 'px-6 py-3 text-sm gap-2 rounded-xl',
    lg: 'px-8 py-4 text-base gap-3 rounded-2xl font-semibold',
  };

  const variantStyles = {
    neon: 'relative group overflow-hidden bg-slate-950 border border-cyan-500/50 text-cyan-300 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:border-cyan-400',
    cyber: 'relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02]',
    glass: 'relative group overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 shadow-xl',
    gradient: 'relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-lg hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {/* Background Animated Shimmer Beam */}
      <span className="absolute inset-0 block h-full w-full bg-[linear-gradient(110deg,transparent,45%,rgba(255,255,255,0.25),55%,transparent)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Glow pulse layer */}
      {variant === 'neon' && (
        <span className="absolute -inset-0.5 rounded-xl bg-cyan-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          )}
          <span className="relative z-10">{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </>
      )}
    </motion.button>
  );
};

export default UIverseButton;
