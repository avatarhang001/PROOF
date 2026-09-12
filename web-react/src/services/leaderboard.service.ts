/**
 * Leaderboard Service
 * Handles leaderboard rankings
 */

import { api } from '../lib/api';
import type { LeaderboardEntry } from '../types/api';

export const leaderboardService = {
  /**
   * Get leaderboard by category
   */
  async getLeaderboard(category = 'proofs'): Promise<{ entries: LeaderboardEntry[]; category: string }> {
    return api.get(`/api/leaderboard?cat=${encodeURIComponent(category)}`);
  },

  /**
   * Get user's rank
   */
};
