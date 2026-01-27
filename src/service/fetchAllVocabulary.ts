import { api } from "../api/api";

export const fetchAllVocabulary = async (level: number) => {
  const res = await api.get('/vocabulary/all', { params: { level } });
  return res.data;
};
