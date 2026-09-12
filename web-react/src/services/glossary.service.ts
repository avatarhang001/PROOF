import { api } from '../lib/api';
import type { GlossaryTerm } from '../types/api';

export const glossaryService = {
  getTerms: (level?: GlossaryTerm['level']) =>
    api.get<{ terms: GlossaryTerm[] }>(`/api/glossary?limit=100${level ? `&level=${level}` : ''}`),
  createTerm: (term: Omit<GlossaryTerm, 'id'>) =>
    api.post<{ term: GlossaryTerm }>('/api/glossary', term),
  deleteTerm: (id: string) => api.delete<{ ok: boolean }>(`/api/glossary/${id}`),
};
