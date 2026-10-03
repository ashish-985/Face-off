/**
 * Elo Rating Calculation Engine for FACE-OFF
 */

export interface EloCalculationResult {
  newRatingA: number;
  newRatingB: number;
  deltaA: number;
  deltaB: number;
  expectedA: number;
  expectedB: number;
}

export function calculateElo(
  ratingA: number,
  ratingB: number,
  matchesA: number,
  matchesB: number,
  winner: 'A' | 'B'
): EloCalculationResult {
  // Determine K-factor (provisional bonus for first 10 matches)
  const kA = matchesA < 10 ? 40 : 32;
  const kB = matchesB < 10 ? 40 : 32;

  // Expected score
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 / (1 + Math.pow(10, (ratingA - ratingB) / 400));

  // Actual scores
  const scoreA = winner === 'A' ? 1 : 0;
  const scoreB = winner === 'B' ? 1 : 0;

  // Rating changes
  const deltaA = Math.round(kA * (scoreA - expectedA));
  const deltaB = Math.round(kB * (scoreB - expectedB));

  return {
    newRatingA: Math.max(100, ratingA + deltaA),
    newRatingB: Math.max(100, ratingB + deltaB),
    deltaA,
    deltaB,
    expectedA,
    expectedB,
  };
}

export function isProvisional(matchesCount: number): boolean {
  return matchesCount < 10;
}
