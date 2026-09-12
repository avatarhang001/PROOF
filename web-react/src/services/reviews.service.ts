/**
 * Reviews Service
 * Handles spaced repetition reviews
 */

import { api } from '../lib/api';
import type { Review } from '../types/api';

export const reviewsService = {
  /**
   * Get all reviews due for the user
   */
  async getDueReviews(): Promise<{ reviews: Review[] }> {
    return api.get<{ reviews: Review[] }>('/api/reviews/due');
  },

  /**
   * Get all reviews (including future ones)
   */
  async getAllReviews(): Promise<{ reviews: Review[] }> {
    return api.get<{ reviews: Review[] }>('/api/review');
  },

  /**
   * Submit a review answer
   */
  async submitReview(
    reviewId: string,
    quality: number
  ): Promise<{ review: Review; nextReviewDate: string }> {
    return api.post(`/api/reviews/${reviewId}/complete`, { quality });
  },

  /**
   * Get review statistics
   */
  async getStats(): Promise<{
    dueToday: number;
    dueThisWeek: number;
    totalReviews: number;
    masteredCount: number;
  }> {
    return api.get('/api/reviews/stats');
  },
};
