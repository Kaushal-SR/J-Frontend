import api from "../api/api";

export const fetchLearnedVocabDetails = async (levelNum: number) => {
  // Get all learned progress for this user
  const progressRes = await api.get("/user-progress/learned");
  const learned = progressRes.data.filter((p: any) => p.itemType === "VOCAB");
  if (!learned.length) return [];
  // Get all vocab details for these IDs
  const ids = learned.map((p: any) => p.itemId);
  const vocabRes = await api.get("/vocabulary/all", { params: { level: levelNum } });
  // Only return those in learned list
  return vocabRes.data.filter((v: any) => ids.includes(v.id));
};
