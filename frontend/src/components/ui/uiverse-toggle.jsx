import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * UIverse Glassmorphic Switch Toggle Component
 * Smooth spring-animated toggle with neon glowing indicator and glass backdrop.
 */
export const UIverseToggle = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  activeColor = 'bg-gradient-to-r from-cyan-500 to-indigo-600',
  glowColor = 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
  className,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      {...props}
    >
      {label && <span className="text-sm font-medium text-slate-300">{label}</span>}

      <div
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={cn(
          'relative flex h-8 w-16 items-center rounded-full p-1 transition-colors duration-300 border border-white/10 backdrop-blur-lg',
          checked ? activeColor : 'bg-slate-800/80 hover:bg-slate-700/80'
        )}
      >
        {/* Slot Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-slate-400">
          {LeftIcon && <LeftIcon className="h-3.5 w-3.5" />}
          {RightIcon && <RightIcon className="h-3.5 w-3.5" />}
        </div>

        {/* Sliding Knob with Spring Animation */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          animate={{ x: checked ? 32 : 0 }}
          className={cn(
            'relative z-10 h-6 w-6 rounded-full bg-white shadow-md transition-shadow duration-300 flex items-center justify-center',
            checked ? glowColor : ''
          )}
        >
          {/* Subtle center dot */}
          <span
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-200',
              checked ? 'bg-cyan-500' : 'bg-slate-400'
            )}
          />
        </motion.div>
      </div>
    </label>
  );
};

export default UIverseToggle;
