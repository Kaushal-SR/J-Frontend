import api from "../api/api";

export const fetchBookmarkedVocabDetails = async (levelNum: number) => {
  // Get all bookmarked progress for this user
  const progressRes = await api.get("/user-progress/learned");
  const bookmarked = progressRes.data.filter((p: any) => p.itemType === "VOCAB" && p.bookmarked);
  if (!bookmarked.length) return [];
  // Get all vocab details for these IDs
  const ids = bookmarked.map((p: any) => p.itemId);
  const vocabRes = await api.get("/vocabulary/all", { params: { level: levelNum } });
  // Only return those in bookmarked list
  return vocabRes.data.filter((v: any) => ids.includes(v.id));
};
