import api from './api';

export async function fetchKanji(level: string) {
  const res = await api.get('/kanji', { params: { jlptLevel: level } });
  return res.data;
}
