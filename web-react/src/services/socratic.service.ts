import { api } from '../lib/api';
import type { SocraticSession } from '../types/api';

export const socraticService = {
  getSessions: () => api.get<{ sessions: SocraticSession[] }>('/api/socratic/sessions?limit=20'),
};
