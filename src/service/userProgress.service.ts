import api from "../api/api";

export const markHiraganaLearned = (itemId: string) => {
  return api.post("/user-progress/learned", {
    itemId,
    itemType: "HIRAGANA",
  });
};

export const markKatakanaLearned = (itemId: string) => {
  return api.post("/user-progress/learned", {
    itemId,
    itemType: "KATAKANA",
  });
};

export const getLearnedProgress = () => {
  return api.get("/user-progress/learned");
};

// --- Vocabulary Progress API ---
export const markVocabLearned = (itemId: string) => {
  return api.post("/user-progress/learned", {
    itemId,
    itemType: "VOCAB",
  });
};

export const markVocabNotLearned = (itemId: string) => {
  return api.post("/user-progress/not-learned", {
    itemId,
    itemType: "VOCAB",
  });
};

export const setVocabBookmark = (itemId: string, value: boolean) => {
  return api.post("/user-progress/bookmark", {
    itemId,
    itemType: "VOCAB",
    value,
  });
};

export const getVocabProgress = () => {
  return api.get("/user-progress/learned"); // Optionally filter for VOCAB in frontend
};
