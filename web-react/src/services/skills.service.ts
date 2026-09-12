/**
 * Skills Service
 * Handles skills catalog and user skill progress
 */

import { api } from '../lib/api';
import type { SkillCatalog, Skill } from '../types/api';

export const skillsService = {
  /**
   * Get the full skills catalog
   */
  async getCatalog(): Promise<{ catalog: SkillCatalog[] }> {
    const response = await api.get<{ skills: SkillCatalog[] }>('/api/skills');
    return { catalog: response.skills };
  },

  /**
   * Get current user's skills
   */
  async getUserSkills(): Promise<{ skills: Skill[] }> {
    return api.get<{ skills: Skill[] }>('/api/me').then(({ skills }) => ({ skills }));
  },

  /**
   * Get details of a specific skill
   */
  async getSkill(slug: string): Promise<{ skill: SkillCatalog }> {
    return api.get<{ skill: SkillCatalog }>(`/api/skills/${slug}`);
  },

  /**
   * Get recommended skills for user
   */
};
