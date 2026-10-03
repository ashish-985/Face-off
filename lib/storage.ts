import { UserProfile, Match, Vote, Report, Block, ReportReason } from './types';
import { calculateElo } from './elo';
import { XP_REWARDS } from './xp';

const STORAGE_KEYS = {
  CURRENT_USER: 'faceoff_current_user_v1',
  USERS: 'faceoff_users_v1',
  MATCHES: 'faceoff_matches_v1',
  VOTES: 'faceoff_votes_v1',
  REPORTS: 'faceoff_reports_v1',
  BLOCKS: 'faceoff_blocks_v1',
  AGE_VERIFIED: 'faceoff_age_verified_v1',
};

// Seed Avatars from Unsplash
const SEED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
];

export const CURRENT_USER_ID = 'user_ashish_001';

const INITIAL_USERS: UserProfile[] = [
  {
    id: CURRENT_USER_ID,
    username: 'ASHISH',
    avatarUrl: SEED_AVATARS[1],
    bio: 'Ready for the arena ⚔️ Voting daily.',
    rating: 1247,
    provisionalMatches: 12,
    wins: 29,
    losses: 18,
    streak: 4,
    maxStreak: 6,
    battleCredits: 1,
    pendingVotesCount: 1,
    totalVotesCast: 183,
    judgeAgreements: 130,
    playerXp: 1450,
    judgeXp: 1830,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior', 'judge_apprentice', 'sharp_eye'],
  },
  {
    id: 'user_alex_002',
    username: 'Alex Titan',
    avatarUrl: SEED_AVATARS[0],
    bio: 'Top 3 contender. Bring your best photo.',
    rating: 1842,
    provisionalMatches: 50,
    wins: 82,
    losses: 24,
    streak: 8,
    maxStreak: 12,
    battleCredits: 4,
    pendingVotesCount: 0,
    totalVotesCast: 420,
    judgeAgreements: 320,
    playerXp: 4800,
    judgeXp: 4200,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior', 'hot_streak', 'elite_tier'],
  },
  {
    id: 'user_rahul_003',
    username: 'Rahul_V',
    avatarUrl: SEED_AVATARS[3],
    bio: 'Challenging the global leaderboard daily.',
    rating: 1819,
    provisionalMatches: 45,
    wins: 76,
    losses: 30,
    streak: 3,
    maxStreak: 9,
    battleCredits: 2,
    pendingVotesCount: 2,
    totalVotesCast: 310,
    judgeAgreements: 235,
    playerXp: 4200,
    judgeXp: 3100,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 80 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior', 'elite_tier'],
  },
  {
    id: 'user_sam_004',
    username: 'Sam_K',
    avatarUrl: SEED_AVATARS[2],
    bio: 'Elo hunter.',
    rating: 1798,
    provisionalMatches: 38,
    wins: 65,
    losses: 28,
    streak: 1,
    maxStreak: 7,
    battleCredits: 3,
    pendingVotesCount: 0,
    totalVotesCast: 280,
    judgeAgreements: 210,
    playerXp: 3900,
    judgeXp: 2800,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 75 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior', 'elite_tier'],
  },
  {
    id: 'user_sarah_005',
    username: 'Sarah_G',
    avatarUrl: SEED_AVATARS[4],
    bio: 'Number 1 Judge on FACE-OFF ⚖️',
    rating: 1750,
    provisionalMatches: 40,
    wins: 60,
    losses: 30,
    streak: 5,
    maxStreak: 8,
    battleCredits: 10,
    pendingVotesCount: 1,
    totalVotesCast: 842,
    judgeAgreements: 690,
    playerXp: 3500,
    judgeXp: 8420,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 100 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior', 'judge_apprentice', 'sharp_eye'],
  },
  {
    id: 'user_mike_006',
    username: 'Mike_R',
    avatarUrl: SEED_AVATARS[5],
    bio: 'Battle ready.',
    rating: 1690,
    provisionalMatches: 29,
    wins: 48,
    losses: 25,
    streak: 2,
    maxStreak: 5,
    battleCredits: 2,
    pendingVotesCount: 0,
    totalVotesCast: 810,
    judgeAgreements: 620,
    playerXp: 2900,
    judgeXp: 8102,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior', 'judge_apprentice'],
  },
  {
    id: 'user_elena_007',
    username: 'Elena_M',
    avatarUrl: SEED_AVATARS[6],
    bio: 'Arena enthusiast.',
    rating: 1540,
    provisionalMatches: 20,
    wins: 34,
    losses: 20,
    streak: 0,
    maxStreak: 6,
    battleCredits: 1,
    pendingVotesCount: 0,
    totalVotesCast: 210,
    judgeAgreements: 160,
    playerXp: 2100,
    judgeXp: 2100,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    badges: ['first_victory', 'warrior'],
  },
  {
    id: 'user_lucas_008',
    username: 'Lucas_B',
    avatarUrl: SEED_AVATARS[7],
    bio: 'May the best profile win.',
    rating: 1480,
    provisionalMatches: 15,
    wins: 22,
    losses: 15,
    streak: 2,
    maxStreak: 4,
    battleCredits: 2,
    pendingVotesCount: 1,
    totalVotesCast: 140,
    judgeAgreements: 98,
    playerXp: 1600,
    judgeXp: 1400,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    badges: ['first_victory'],
  },
  {
    id: 'user_sophia_009',
    username: 'Sophia_X',
    avatarUrl: SEED_AVATARS[8],
    bio: 'Casual competitor.',
    rating: 1390,
    provisionalMatches: 10,
    wins: 14,
    losses: 12,
    streak: 1,
    maxStreak: 3,
    battleCredits: 1,
    pendingVotesCount: 0,
    totalVotesCast: 95,
    judgeAgreements: 65,
    playerXp: 1100,
    judgeXp: 950,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    badges: ['first_victory'],
  },
  {
    id: 'user_david_010',
    username: 'David_H',
    avatarUrl: SEED_AVATARS[9],
    bio: 'Climbing up!',
    rating: 1280,
    provisionalMatches: 8,
    wins: 10,
    losses: 8,
    streak: 0,
    maxStreak: 3,
    battleCredits: 0,
    pendingVotesCount: 2,
    totalVotesCast: 60,
    judgeAgreements: 40,
    playerXp: 800,
    judgeXp: 600,
    visibility: 'PUBLIC',
    isAgeVerified: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    badges: ['first_victory'],
  },
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_001',
    playerAId: 'user_alex_002',
    playerBId: 'user_rahul_003',
    status: 'WAITING_FOR_VOTES',
    votesA: 2,
    votesB: 1,
    totalVotes: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'match_002',
    playerAId: 'user_sarah_005',
    playerBId: 'user_mike_006',
    status: 'WAITING_FOR_VOTES',
    votesA: 1,
    votesB: 1,
    totalVotes: 2,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'match_003',
    playerAId: 'user_elena_007',
    playerBId: 'user_lucas_008',
    status: 'WAITING_FOR_VOTES',
    votesA: 3,
    votesB: 1,
    totalVotes: 4,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'match_004',
    playerAId: 'user_sophia_009',
    playerBId: 'user_david_010',
    status: 'WAITING_FOR_VOTES',
    votesA: 1,
    votesB: 0,
    totalVotes: 1,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'match_005',
    playerAId: 'user_sam_004',
    playerBId: 'user_elena_007',
    status: 'WAITING_FOR_VOTES',
    votesA: 0,
    votesB: 1,
    totalVotes: 1,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
];

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredUsers(): UserProfile[] {
  if (!isClient()) return INITIAL_USERS;
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserProfile[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getStoredCurrentUser(): UserProfile {
  const users = getStoredUsers();
  const current = users.find((u) => u.id === CURRENT_USER_ID);
  return current || users[0];
}

export function saveCurrentUser(updatedUser: UserProfile): void {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
  } else {
    users.push(updatedUser);
  }
  saveUsers(users);
}

export function getStoredMatches(): Match[] {
  if (!isClient()) return INITIAL_MATCHES;
  const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(INITIAL_MATCHES));
    return INITIAL_MATCHES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_MATCHES;
  }
}

export function saveMatches(matches: Match[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
}

/**
 * Ensures the Judge Arena never runs out of matches!
 * Auto-generates fresh matches if active queue dips below 5 or forceNew is true.
 */
export function ensureActiveMatchesInQueue(forceNew: boolean = false): Match[] {
  const users = getStoredUsers();
  const matches = getStoredMatches();

  const activeWaiting = matches.filter((m) => m.status === 'WAITING_FOR_VOTES');

  if (activeWaiting.length < 5 || forceNew) {
    for (let i = 0; i < 5; i++) {
      const available = users.filter((u) => u.id !== CURRENT_USER_ID);
      const pA = available[Math.floor(Math.random() * available.length)];
      let pB = available[Math.floor(Math.random() * available.length)];
      while (pB.id === pA.id && available.length > 1) {
        pB = available[Math.floor(Math.random() * available.length)];
      }

      if (pA && pB && pA.id !== pB.id) {
        const newMatch: Match = {
          id: `match_auto_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          playerAId: pA.id,
          playerBId: pB.id,
          status: 'WAITING_FOR_VOTES',
          votesA: Math.floor(Math.random() * 2),
          votesB: Math.floor(Math.random() * 2),
          totalVotes: 0,
          createdAt: new Date().toISOString(),
        };
        newMatch.totalVotes = newMatch.votesA + newMatch.votesB;
        matches.unshift(newMatch);
      }
    }
    saveMatches(matches);
  }

  return matches;
}

export function getStoredVotes(): Vote[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.VOTES);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveVotes(votes: Vote[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
}

export function getStoredReports(): Report[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveReport(report: Report): void {
  const reports = getStoredReports();
  reports.push(report);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }
}

export function getStoredBlocks(): Block[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(STORAGE_KEYS.BLOCKS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveBlock(block: Block): void {
  const blocks = getStoredBlocks();
  blocks.push(block);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  }
}

export function isUserBlocked(blockerId: string, targetId: string): boolean {
  const blocks = getStoredBlocks();
  return blocks.some(
    (b) =>
      (b.blockerId === blockerId && b.blockedUserId === targetId) ||
      (b.blockerId === targetId && b.blockedUserId === blockerId)
  );
}

export function getAgeVerified(): boolean {
  if (!isClient()) return false;
  return localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED) === 'true';
}

export function setAgeVerified(verified: boolean): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, String(verified));
}

export interface CastVoteResult {
  matchResolved: boolean;
  unlockedCredit: boolean;
  updatedUser: UserProfile;
  updatedMatch: Match;
}

export function castJudgeVote(
  judgeId: string,
  matchId: string,
  votedForId: string
): CastVoteResult {
  const users = getStoredUsers();
  const matches = getStoredMatches();
  const votes = getStoredVotes();

  const judge = users.find((u) => u.id === judgeId);
  const match = matches.find((m) => m.id === matchId);

  if (!judge || !match) {
    throw new Error('Judge or Match not found');
  }

  if (match.playerAId === judgeId || match.playerBId === judgeId) {
    throw new Error('You cannot vote on your own match.');
  }

  const existingVote = votes.find(
    (v) => v.judgeId === judgeId && v.matchId === matchId
  );
  if (existingVote) {
    throw new Error('You have already voted on this match.');
  }

  const newVote: Vote = {
    id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    matchId,
    judgeId,
    votedForId,
    createdAt: new Date().toISOString(),
  };
  votes.push(newVote);
  saveVotes(votes);

  if (votedForId === match.playerAId) {
    match.votesA += 1;
  } else if (votedForId === match.playerBId) {
    match.votesB += 1;
  }
  match.totalVotes += 1;

  judge.pendingVotesCount += 1;
  judge.totalVotesCast += 1;
  judge.judgeXp += XP_REWARDS.VALID_VOTE;

  let unlockedCredit = false;
  if (judge.pendingVotesCount >= 3) {
    judge.pendingVotesCount = 0;
    judge.battleCredits += 1;
    judge.judgeXp += XP_REWARDS.VOTE_STREAK_3;
    unlockedCredit = true;
  }

  if (judge.totalVotesCast >= 100 && !judge.badges.includes('judge_apprentice')) {
    judge.badges.push('judge_apprentice');
  }

  let matchResolved = false;
  if (match.totalVotes >= 5 && match.status === 'WAITING_FOR_VOTES') {
    resolveMatch(match, users);
    matchResolved = true;
  }

  saveMatches(matches);
  saveUsers(users);

  return {
    matchResolved,
    unlockedCredit,
    updatedUser: judge,
    updatedMatch: match,
  };
}

function resolveMatch(match: Match, users: UserProfile[]): void {
  match.status = 'COMPLETED';
  match.resolvedAt = new Date().toISOString();

  const playerA = users.find((u) => u.id === match.playerAId);
  const playerB = users.find((u) => u.id === match.playerBId);

  if (!playerA || !playerB) return;

  const winnerKey = match.votesA >= match.votesB ? 'A' : 'B';
  const winnerId = winnerKey === 'A' ? playerA.id : playerB.id;
  const loserId = winnerKey === 'A' ? playerB.id : playerA.id;

  match.winnerId = winnerId;

  const eloResult = calculateElo(
    playerA.rating,
    playerB.rating,
    playerA.provisionalMatches,
    playerB.provisionalMatches,
    winnerKey
  );

  playerA.rating = eloResult.newRatingA;
  playerB.rating = eloResult.newRatingB;
  match.ratingDeltaA = eloResult.deltaA;
  match.ratingDeltaB = eloResult.deltaB;

  playerA.provisionalMatches += 1;
  playerB.provisionalMatches += 1;

  const winner = users.find((u) => u.id === winnerId)!;
  const loser = users.find((u) => u.id === loserId)!;

  winner.wins += 1;
  winner.streak += 1;
  if (winner.streak > winner.maxStreak) {
    winner.maxStreak = winner.streak;
  }
  winner.playerXp += XP_REWARDS.COMPLETE_BATTLE + XP_REWARDS.WIN_BATTLE;

  if (winner.wins === 1 && !winner.badges.includes('first_victory')) {
    winner.badges.push('first_victory');
    winner.playerXp += XP_REWARDS.FIRST_WIN;
  }
  if (winner.streak >= 5 && !winner.badges.includes('hot_streak')) {
    winner.badges.push('hot_streak');
  }
  if (winner.rating >= 1300 && !winner.badges.includes('elite_tier')) {
    winner.badges.push('elite_tier');
  }

  loser.losses += 1;
  loser.streak = 0;
  loser.playerXp += XP_REWARDS.COMPLETE_BATTLE + XP_REWARDS.LOSE_BATTLE;
}

export function enterArenaMatchmaking(userId: string): {
  match: Match;
  opponent: UserProfile;
} {
  const users = getStoredUsers();
  const matches = getStoredMatches();
  const currentUser = users.find((u) => u.id === userId);

  if (!currentUser) throw new Error('User not found');
  if (currentUser.battleCredits < 1) {
    throw new Error('You need 1 Battle Credit! Vote 3 times to unlock.');
  }

  currentUser.battleCredits -= 1;

  const blocks = getStoredBlocks();
  const blockedIds = blocks
    .filter((b) => b.blockerId === userId || b.blockedUserId === userId)
    .map((b) => (b.blockerId === userId ? b.blockedUserId : b.blockerId));

  const eligibleOpponents = users.filter(
    (u) =>
      u.id !== userId &&
      u.visibility !== 'HIDDEN' &&
      !blockedIds.includes(u.id)
  );

  eligibleOpponents.sort(
    (a, b) =>
      Math.abs(a.rating - currentUser.rating) -
      Math.abs(b.rating - currentUser.rating)
  );

  const opponent = eligibleOpponents[0] || users.find((u) => u.id !== userId)!;

  const newMatch: Match = {
    id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    playerAId: userId,
    playerBId: opponent.id,
    status: 'WAITING_FOR_VOTES',
    votesA: 0,
    votesB: 0,
    totalVotes: 0,
    createdAt: new Date().toISOString(),
  };

  matches.unshift(newMatch);

  saveMatches(matches);
  saveUsers(users);

  return { match: newMatch, opponent };
}
