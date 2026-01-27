import { api } from "../api/api";

export const fetchVocabStats = async (level: number) => {
  const res = await api.get('/vocabulary/stats', { params: { level } });
  return res.data;
};

export const fetchNextVocabulary = async (level: number, mode: 'normal' | 'random', excludeIds: string[] = []) => {
  const params: any = { level, mode };
  if (excludeIds.length > 0) {
    params.exclude = excludeIds.join(',');
  }
  const res = await api.get('/vocabulary/next', { params });
  return res.data;
};
