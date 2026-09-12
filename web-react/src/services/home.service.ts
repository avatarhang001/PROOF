/**
 * Home Service
 * Handles homepage data aggregation
 */

import { api } from '../lib/api';
import type { HomeResponse } from '../types/api';

export const homeService = {
  /**
   * Get all homepage data (dashboard)
   */
  async getHome(): Promise<HomeResponse> {
    const response = await api.get<HomeResponse>('/api/home');
    
    // Enrich mySkills with skill names from catalog or generate from slug
    // Backend returns minimal skill data, we need to enhance it for UI
    if (response.mySkills) {
      response.mySkills = response.mySkills.map(skill => ({
        ...skill,
        // Generate a display name from slug if name not provided
        name: skill.name || skill.skillSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        tier: skill.tier || (skill.verified ? 'Verified' : 'Learning'),
      }));
    }
    
    return response;
  },
};
