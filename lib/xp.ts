/**
 * XP & Progression Engine for FACE-OFF
 */

export const XP_REWARDS = {
  VALID_VOTE: 10,
  COMPLETE_BATTLE: 20,
  WIN_BATTLE: 30,
  LOSE_BATTLE: 10,
  VOTE_STREAK_3: 15,
  DAILY_LOGIN: 10,
  COMPLETE_PROFILE: 25,
  FIRST_BATTLE: 50,
  FIRST_WIN: 50,
} as const;

export interface LevelInfo {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

/**
 * Calculates level from total XP using a smooth curved formula.
 * Each level requires 100 * Level XP.
 */
export function getLevelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let accumulatedXp = 0;
  let costForNextLevel = 100;

  while (totalXp >= accumulatedXp + costForNextLevel) {
    accumulatedXp += costForNextLevel;
    level++;
    costForNextLevel = Math.round(100 * Math.pow(level, 1.2));
  }

  const xpInCurrentLevel = totalXp - accumulatedXp;
  const progressPercent = Math.min(
    100,
    Math.round((xpInCurrentLevel / costForNextLevel) * 100)
  );

  return {
    level,
    currentXp: xpInCurrentLevel,
    nextLevelXp: costForNextLevel,
    progressPercent,
  };
}

export const BADGE_DEFINITIONS = [
  {
    id: 'first_victory',
    title: 'First Victory',
    icon: '🥇',
    description: 'Win your first battle in the Arena.',
    category: 'PLAYER' as const,
  },
  {
    id: 'warrior',
    title: 'Warrior',
    icon: '⚔️',
    description: 'Complete 25 head-to-head battles.',
    category: 'PLAYER' as const,
  },
  {
    id: 'hot_streak',
    title: 'Hot Streak',
    icon: '🔥',
    description: 'Achieve a 5-win streak.',
    category: 'PLAYER' as const,
  },
  {
    id: 'judge_apprentice',
    title: 'Supreme Judge',
    icon: '⚖️',
    description: 'Cast 100 valid votes in the Judge Arena.',
    category: 'JUDGE' as const,
  },
  {
    id: 'sharp_eye',
    title: 'Sharp Eye',
    icon: '🎯',
    description: 'Maintain over 70% consensus agreement rate as judge.',
    category: 'JUDGE' as const,
  },
  {
    id: 'elite_tier',
    title: 'Elite Titan',
    icon: '👑',
    description: 'Reach an Elo Rating of 1300+.',
    category: 'ELITE' as const,
  },
];
