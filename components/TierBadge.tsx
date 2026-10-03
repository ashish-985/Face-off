'use client';

import React from 'react';
import { getTierFromElo, getNextTierInfo, TierInfo } from '@/lib/tiers';
import { Sparkles, Shield, ChevronUp } from 'lucide-react';

interface TierBadgeProps {
  elo: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ elo, showProgress = false, size = 'md' }: TierBadgeProps) {
  const tier = getTierFromElo(elo);
  const { nextTier, pointsNeeded, progressPercent } = getNextTierInfo(elo);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] space-x-1',
    md: 'px-3 py-1 text-xs space-x-1.5',
    lg: 'px-4 py-1.5 text-sm space-x-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="inline-flex flex-col items-center">
      {/* Badge Pill */}
      <div
        className={`inline-flex items-center rounded-full font-black uppercase tracking-wider border shadow-md backdrop-blur-md transition-all duration-300 transform hover:scale-105 ${tier.badgeBg} ${tier.badgeTextColor} ${tier.badgeBorder} ${sizeClasses[size]}`}
      >
        <span className="animate-pulse">{tier.icon}</span>
        <span>{tier.name}</span>
        {tier.id === 'legend' && (
          <Sparkles className={`${iconSizes[size]} text-amber-400 animate-spin`} />
        )}
      </div>

      {/* Optional Progress Bar to Next Tier */}
      {showProgress && nextTier && (
        <div className="w-full max-w-xs mt-2 text-center">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 mb-1">
            <span className="flex items-center space-x-0.5">
              <span>{tier.icon}</span>
              <span>{tier.minElo}</span>
            </span>
            <span className="text-zinc-300 font-mono">
              {pointsNeeded} Elo to {nextTier.icon} {nextTier.name}
            </span>
            <span className="flex items-center space-x-0.5">
              <span>{nextTier.icon}</span>
              <span>{nextTier.minElo}</span>
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 border border-zinc-700/60 overflow-hidden p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                tier.id === 'legend'
                  ? 'from-red-500 to-amber-400'
                  : tier.id === 'diamond'
                  ? 'from-cyan-500 to-sky-300'
                  : tier.id === 'gold'
                  ? 'from-amber-500 to-yellow-300'
                  : tier.id === 'silver'
                  ? 'from-slate-400 to-zinc-200'
                  : 'from-amber-700 to-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
