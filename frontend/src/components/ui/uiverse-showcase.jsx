import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Zap, ShieldAlert, CheckCircle, Sun, Moon } from 'lucide-react';
import { UIverseCard } from './uiverse-card';
import { UIverseButton } from './uiverse-button';
import { UIverseLoader } from './uiverse-loader';
import { UIverseToggle } from './uiverse-toggle';
import { UIverseBadge } from './uiverse-badge';

/**
 * UIverse Interactive Component Showcase Gallery
 */
export const UIverseShowcase = () => {
  const [toggleState, setToggleState] = useState(true);
  const [loadingState, setLoadingState] = useState(false);

  const triggerLoader = () => {
    setLoadingState(true);
    setTimeout(() => setLoadingState(false), 2500);
  };

  return (
    <div className="w-full rounded-3xl bg-slate-950 p-8 border border-slate-800 text-white shadow-2xl space-y-10 my-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            UIverse Component Library
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          High-performance, futuristic open-source interactive UI elements built for ZettaWeb.
        </p>
      </div>

      {/* Section 1: Glowing Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <Zap className="h-4 w-4" /> 1. Animated Glow Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UIverseCard
            title="Cyber Security Architecture"
            subtitle="Next-gen zero-trust edge protection with instant threat mitigation."
            icon={ShieldAlert}
            badgeText="LIVE DEMO"
            glowColor="from-cyan-500 via-blue-500 to-indigo-600"
          />
          <UIverseCard
            title="AI Cloud Acceleration"
            subtitle="Accelerate your workflow with real-time neural inference edge engines."
            icon={Rocket}
            badgeText="NEW"
            glowColor="from-purple-500 via-pink-500 to-rose-500"
          />
          <UIverseCard
            title="Global Edge CDN"
            subtitle="Sub-millisecond static and dynamic content routing across 300+ PoPs."
            icon={Sparkles}
            badgeText="ENTERPRISE"
            glowColor="from-emerald-400 via-teal-500 to-cyan-600"
          />
        </div>
      </div>

      {/* Section 2: Interactive Neon Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
          <Rocket className="h-4 w-4" /> 2. 3D Neon Action Buttons
        </h3>
        <div className="flex flex-wrap items-center gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <UIverseButton variant="neon" icon={Rocket} onClick={triggerLoader} isLoading={loadingState}>
            Launch System
          </UIverseButton>
          <UIverseButton variant="cyber" icon={Sparkles}>
            Cyberpunk Glow
          </UIverseButton>
          <UIverseButton variant="gradient" icon={Zap}>
            Gradient Beam
          </UIverseButton>
          <UIverseButton variant="glass" icon={CheckCircle}>
            Glassmorphic
          </UIverseButton>
        </div>
      </div>

      {/* Section 3: Cyber Loaders & Status Badges & Glass Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loaders */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col items-center justify-center">
          <h4 className="text-sm font-semibold text-slate-300 self-start">Cyber Loaders</h4>
          <div className="flex items-center justify-center gap-6">
            <UIverseLoader size="sm" text="" color="cyan" />
            <UIverseLoader size="md" text="Processing..." color="purple" />
          </div>
        </div>

        {/* Toggles */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col items-center justify-center">
          <h4 className="text-sm font-semibold text-slate-300 self-start">Glass Toggles</h4>
          <div className="flex flex-col gap-4">
            <UIverseToggle
              checked={toggleState}
              onChange={setToggleState}
              label="Realtime Edge Mode"
              leftIcon={Sun}
              rightIcon={Moon}
            />
            <UIverseToggle
              checked={!toggleState}
              onChange={(val) => setToggleState(!val)}
              label="Stealth Mode"
            />
          </div>
        </div>

        {/* Badges */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-slate-300">Animated Badges</h4>
          <div className="flex flex-wrap gap-2">
            <UIverseBadge variant="cyan" icon={Zap}>System Operational</UIverseBadge>
            <UIverseBadge variant="emerald" icon={CheckCircle}>Deployed v2.4</UIverseBadge>
            <UIverseBadge variant="purple" icon={Sparkles}>AI Active</UIverseBadge>
            <UIverseBadge variant="amber" icon={ShieldAlert}>High Priority</UIverseBadge>
            <UIverseBadge variant="rose" pulse={false}>Offline</UIverseBadge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIverseShowcase;
