import { api } from '../lib/api';

export type SearchResult = {
  type: 'skill' | 'path' | 'proof';
  title: string;
  detail: string;
  to: string;
};

export const searchService = {
  search(query: string): Promise<{ results: SearchResult[] }> {
    return api.get(`/api/search?q=${encodeURIComponent(query.trim())}`);
  },
};
