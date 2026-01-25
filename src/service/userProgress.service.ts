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
