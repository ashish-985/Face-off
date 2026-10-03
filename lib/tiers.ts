/**
 * Tier Ranks & Animated Card Themes for FACE-OFF
 */

export interface TierInfo {
  id: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legend';
  name: string;
  minElo: number;
  maxElo: number;
  icon: string;
  badgeBg: string;
  badgeTextColor: string;
  badgeBorder: string;
  cardGlow: string;
  cardBorder: string;
  cardHeaderBg: string;
  particleColor: string;
}

export const TIERS: TierInfo[] = [
  {
    id: 'bronze',
    name: 'Bronze Arena',
    minElo: 0,
    maxElo: 1199,
    icon: '🥉',
    badgeBg: 'bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60',
    badgeTextColor: 'text-amber-400',
    badgeBorder: 'border-amber-700/60',
    cardGlow: 'shadow-[0_0_20px_rgba(180,83,9,0.25)]',
    cardBorder: 'border-amber-700/40',
    cardHeaderBg: 'from-amber-950/80 to-amber-900/30',
    particleColor: '#b45309',
  },
  {
    id: 'silver',
    name: 'Silver Contender',
    minElo: 1200,
    maxElo: 1399,
    icon: '🥈',
    badgeBg: 'bg-gradient-to-r from-slate-800/80 via-zinc-700/50 to-slate-800/80',
    badgeTextColor: 'text-slate-200',
    badgeBorder: 'border-slate-400/60',
    cardGlow: 'shadow-[0_0_25px_rgba(203,213,225,0.3)]',
    cardBorder: 'border-slate-400/50',
    cardHeaderBg: 'from-slate-900/80 to-slate-800/40',
    particleColor: '#cbd5e1',
  },
  {
    id: 'gold',
    name: 'Golden Champion',
    minElo: 1400,
    maxElo: 1599,
    icon: '🥇',
    badgeBg: 'bg-gradient-to-r from-amber-600/40 via-yellow-500/50 to-amber-600/40',
    badgeTextColor: 'text-amber-300',
    badgeBorder: 'border-amber-400/80',
    cardGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
    cardBorder: 'border-amber-400/70',
    cardHeaderBg: 'from-amber-950/90 to-yellow-900/40',
    particleColor: '#f59e0b',
  },
  {
    id: 'diamond',
    name: 'Diamond Titan',
    minElo: 1600,
    maxElo: 1799,
    icon: '💎',
    badgeBg: 'bg-gradient-to-r from-cyan-600/40 via-sky-400/50 to-cyan-600/40',
    badgeTextColor: 'text-cyan-300',
    badgeBorder: 'border-cyan-400/80',
    cardGlow: 'shadow-[0_0_35px_rgba(6,182,212,0.45)]',
    cardBorder: 'border-cyan-400/70',
    cardHeaderBg: 'from-cyan-950/90 to-sky-900/40',
    particleColor: '#06b6d4',
  },
  {
    id: 'legend',
    name: 'Legendary Apex',
    minElo: 1800,
    maxElo: 9999,
    icon: '🔥',
    badgeBg: 'bg-gradient-to-r from-red-600/50 via-amber-500/50 to-red-600/50',
    badgeTextColor: 'text-red-400',
    badgeBorder: 'border-red-500/90',
    cardGlow: 'shadow-[0_0_40px_rgba(255,59,92,0.55)]',
    cardBorder: 'border-red-500/80',
    cardHeaderBg: 'from-red-950/90 via-amber-950/50 to-red-950/90',
    particleColor: '#ff3b5c',
  },
];

export function getTierFromElo(elo: number): TierInfo {
  const matched = TIERS.find((t) => elo >= t.minElo && elo <= t.maxElo);
  return matched || TIERS[0];
}

export function getNextTierInfo(elo: number): { nextTier: TierInfo | null; pointsNeeded: number; progressPercent: number } {
  const currentTier = getTierFromElo(elo);
  const currentTierIndex = TIERS.findIndex((t) => t.id === currentTier.id);

  if (currentTierIndex >= TIERS.length - 1) {
    return { nextTier: null, pointsNeeded: 0, progressPercent: 100 };
  }

  const nextTier = TIERS[currentTierIndex + 1];
  const pointsNeeded = nextTier.minElo - elo;
  const tierRange = nextTier.minElo - currentTier.minElo;
  const pointsEarned = elo - currentTier.minElo;
  const progressPercent = Math.min(100, Math.max(0, Math.round((pointsEarned / tierRange) * 100)));

  return { nextTier, pointsNeeded, progressPercent };
}
