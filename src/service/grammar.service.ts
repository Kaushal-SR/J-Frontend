import { api } from "../api/api";

export type JLPTLevel = "N5" | "N4" | "N3";

export interface GrammarExampleEntry {
  jp?: string | null;
  en?: string | null;
  breakdown?: string | null;
  hiragana?: string | null;
}

export interface GrammarExamples {
  ex1?: GrammarExampleEntry;
  ex2?: GrammarExampleEntry;
  ex3?: GrammarExampleEntry;
  [key: string]: GrammarExampleEntry | undefined;
}

export interface GrammarPoint {
  id: string;
  grammarPoint: string;
  reading?: string | null;
  jlptLevel: JLPTLevel;
  structure?: string | null;
  meaning: string;
  nuance?: string | null;
  formality?: string | null;
  category?: string | null;
  similarGrammar?: string | null;
  attachesTo?: string | null;
  examples?: GrammarExamples | null;
  familiarity?: number | null;
  status?: string | null;
  lastReviewed?: string | null;
  personalNotes?: string | null;
}

export const fetchGrammarByLevel = async (level: JLPTLevel) => {
  const res = await api.get<GrammarPoint[]>("/grammar", { params: { level } });
  return res.data;
};
