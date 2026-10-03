export type ProfileVisibility = 'PUBLIC' | 'MATCH_ONLY' | 'HIDDEN';

export type ReportReason =
  | 'UNDERAGE'
  | 'NUDITY'
  | 'HARASSMENT'
  | 'STOLEN_PHOTO'
  | 'IMPERSONATION'
  | 'HATE_ABUSE'
  | 'SPAM'
  | 'OTHER';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  rating: number; // Elo
  provisionalMatches: number; // <= 10 matches is provisional
  wins: number;
  losses: number;
  streak: number;
  maxStreak: number;
  battleCredits: number; // Earned by judging (3 votes = 1 credit)
  pendingVotesCount: number; // 0, 1, 2
  totalVotesCast: number;
  judgeAgreements: number; // votes matching crowd consensus
  playerXp: number;
  judgeXp: number;
  visibility: ProfileVisibility;
  isAgeVerified: boolean;
  createdAt: string;
  badges: string[];
}

export interface Match {
  id: string;
  playerAId: string;
  playerBId: string;
  status: 'WAITING_FOR_VOTES' | 'COMPLETED' | 'CANCELLED';
  votesA: number;
  votesB: number;
  totalVotes: number; // minimum target: 5
  winnerId?: string;
  ratingDeltaA?: number;
  ratingDeltaB?: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface Vote {
  id: string;
  matchId: string;
  judgeId: string;
  votedForId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetUserId: string;
  reason: ReportReason;
  details?: string;
  createdAt: string;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedUserId: string;
  createdAt: string;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'PLAYER' | 'JUDGE' | 'ELITE';
}
