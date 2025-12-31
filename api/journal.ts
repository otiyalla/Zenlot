import { api, getTokens } from '.';

export interface JournalEntry {
  id?: number;
  userId: number;
  symbol: string;
  title?: string;
  tradeId?: number;
  plainText?: string;
  editorState?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  author?: any;
  trade?: any;
}

export interface SearchJournalParams {
  userId?: number;
  query?: string;
  symbol?: string;
  tags?: string[];
  start?: string;
  end?: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

export const journalApi = {
  async getJournals() {
    const { userId } = await getTokens();
    
    const url = `journal/user/${userId}`;
    return await api.read(url);
  },

  async getJournal(id: string | number) {
    const url = `journal/${id}`;
    return await api.read(url);
  },

  async createJournal(data: JournalEntry) {
    const { userId } = await getTokens();
    return await api.create('journal', { ...data, userId });
  },

  async updateJournal(id: string, data: Partial<JournalEntry>) {
    return await api.update(`journal/${id}`, data);
  },

  async deleteJournal(id: string) {
    return await api.delete(`journal/${id}`);
  },

  async searchJournals(params: SearchJournalParams) {
    const { userId } = await getTokens();
    if (!userId) {
      throw new Error('User ID is required to search journals');
    }
    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    
    if (params.query) queryParams.append('query', params.query);
    if (params.symbol) queryParams.append('symbol', params.symbol);
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag));
    }
    if (params.start) queryParams.append('start', params.start);
    if (params.end) queryParams.append('end', params.end);
    if (params.isPinned !== undefined) queryParams.append('isPinned', params.isPinned.toString());
    if (params.isArchived !== undefined) queryParams.append('isArchived', params.isArchived.toString());
    
    const url = `journal/search?${queryParams.toString()}`;
    return await api.read(url);
  },
};

