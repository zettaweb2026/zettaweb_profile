import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * UIverse Glow Card Component
 * High-aesthetic glassmorphic card with an animated glowing gradient border,
 * dynamic backdrop blur, and interactive hover light flare effect.
 */
export const UIverseCard = ({
  children,
  className,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  variant = 'glow', // 'glow' | 'cyber' | 'glass' | 'neon'
  glowColor = 'from-cyan-500 via-indigo-500 to-purple-600',
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'group relative rounded-2xl p-[1.5px] transition-all duration-500 cursor-pointer overflow-hidden',
        onClick ? 'hover:shadow-2xl hover:shadow-cyan-500/20' : '',
        className
      )}
      {...props}
    >
      {/* Animated RGB Gradient Border Background */}
      <div
        className={cn(
          'absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-40 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg animate-tilt',
          glowColor
        )}
      />

      {/* Card Inner Container */}
      <div className="relative h-full w-full rounded-2xl bg-slate-950/85 p-6 backdrop-blur-xl border border-white/10 text-white shadow-xl transition-colors duration-300 group-hover:bg-slate-900/90 group-hover:border-white/20">
        
        {/* Flare highlight sweep on hover */}
        <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:animate-shine group-hover:opacity-100" />

        {/* Top Header Row */}
        {(Icon || badgeText) && (
          <div className="flex items-center justify-between gap-3 mb-4">
            {Icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-inner group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300">
                <Icon className="h-6 w-6" />
              </div>
            )}

            {badgeText && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                {badgeText}
              </span>
            )}
          </div>
        )}

        {/* Card Content */}
        {title && (
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors duration-200">
            {title}
          </h3>
        )}

        {subtitle && (
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
};

export default UIverseCard;
