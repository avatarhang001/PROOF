import { api } from '../lib/api';
import type { Badge } from '../types/api';

export const badgesService = {
  getBadges: () => api.get<{ badges: Badge[]; next?: Badge[] }>('/api/badges'),
  getAchievements: () => api.get<{ achievements: Badge[] }>('/api/achievements'),
};
