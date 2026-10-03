'use client';

import React from 'react';
import { BADGE_DEFINITIONS } from '@/lib/xp';
import { Lock } from 'lucide-react';

interface BadgeGridProps {
  unlockedBadgeIds: string[];
}

export default function BadgeGrid({ unlockedBadgeIds }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {BADGE_DEFINITIONS.map((badge) => {
        const isUnlocked = unlockedBadgeIds.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`relative p-3 rounded-2xl border transition-all ${
              isUnlocked
                ? 'bg-arena-card border-arena-gold/40 shadow-lg shadow-amber-500/10'
                : 'bg-arena-bg/40 border-arena-border/40 opacity-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-zinc-800'
                }`}
              >
                {isUnlocked ? badge.icon : <Lock className="w-4 h-4 text-zinc-600" />}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {badge.title}
                </span>
                <span className="text-[10px] text-zinc-400 leading-tight line-clamp-2 block">
                  {badge.description}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
