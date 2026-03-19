// pages/GrammarLessons.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, Info } from 'lucide-react';
import { fetchGrammarByLevel } from '../service/grammar.service';
import type { GrammarPoint, JLPTLevel, GrammarExampleEntry } from '../service/grammar.service';

const levels: JLPTLevel[] = ['N5', 'N4', 'N3'];

const GrammarLessons: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load grammar points from backend when level changes
  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGrammarByLevel(selectedLevel);
        if (!isActive) return;

        setGrammarPoints(data);
        setSelectedId((prev) => {
          if (prev && data.some((g) => g.id === prev)) return prev;
          return data[0]?.id ?? null;
        });
      } catch (e) {
        if (!isActive) return;
        setError('Failed to load grammar points.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, [selectedLevel]);

  // Filter by search term
  const filteredGrammar = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return grammarPoints;

    return grammarPoints.filter((g) => {
      const haystack = [
        g.grammarPoint,
        g.reading || '',
        g.meaning,
        g.structure || '',
        g.category || '',
        g.formality || '',
        g.similarGrammar || '',
        g.attachesTo || '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [grammarPoints, search]);

  // Currently selected grammar point
  const selectedGrammar: GrammarPoint | null = useMemo(() => {
    if (!filteredGrammar.length) return null;
    if (!selectedId) return filteredGrammar[0];
    const existing = filteredGrammar.find((g) => g.id === selectedId);
    return existing ?? filteredGrammar[0];
  }, [filteredGrammar, selectedId]);

  const selectedIndex = selectedGrammar
    ? filteredGrammar.findIndex((g) => g.id === selectedGrammar.id)
    : -1;

  const goToPrevious = () => {
    if (!selectedGrammar || !filteredGrammar.length) return;
    const idx = filteredGrammar.findIndex((g) => g.id === selectedGrammar.id);
    if (idx <= 0) return;
    setSelectedId(filteredGrammar[idx - 1].id);
  };

  const goToNext = () => {
    if (!selectedGrammar || !filteredGrammar.length) return;
    const idx = filteredGrammar.findIndex((g) => g.id === selectedGrammar.id);
    if (idx === -1 || idx >= filteredGrammar.length - 1) return;
    setSelectedId(filteredGrammar[idx + 1].id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900">
      <div className="w-full px-3 sm:px-4 py-4 flex flex-col gap-4">
        {/* Header box (compact, glassmorphism) */}
        <div className="shrink-0">
          <div className="rounded-3xl bg-gradient-to-r from-cyan-400/60 via-purple-500/60 to-pink-500/60 p-[1px] shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
            <div className="rounded-[1.4rem] bg-slate-950/70 backdrop-blur-xl border border-white/10 px-3 py-3 md:px-5 md:py-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-50 mb-1 flex items-center gap-2 md:gap-3">
                    <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-300">
                      Grammar Lessons
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300/90">
                    Study one grammar point at a time with clear structure, meaning, and examples.
                  </p>
                </div>

                <div className="w-full md:w-96 flex flex-col gap-2.5">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by grammar, meaning, or structure..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm bg-slate-950/60 text-slate-100 placeholder:text-slate-400 border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium border transition-all duration-200 ${
                          selectedLevel === level
                            ? 'bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 border-transparent shadow-[0_0_18px_rgba(56,189,248,0.8)]'
                            : 'bg-slate-950/60 text-slate-100 border-white/15 hover:border-cyan-400/70 hover:bg-slate-950/80'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="text-right text-xs text-slate-300/80">
                    {filteredGrammar.length} pattern{filteredGrammar.length === 1 ? '' : 's'}
                    {loading && ' • loading...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main learning box (full width, no inner scroll, glassmorphism) */}
        <div>
          <div className="rounded-3xl bg-gradient-to-r from-sky-500/60 via-purple-500/60 to-pink-500/60 p-[1px] shadow-[0_22px_80px_rgba(15,23,42,0.9)]">
            <div className="bg-slate-950/80 backdrop-blur-2xl rounded-[1.4rem] border border-white/10 px-3 py-4 md:px-5 md:py-5 w-full flex flex-col">
              {error ? (
                <div className="py-10 text-center text-sm text-rose-300">{error}</div>
              ) : loading && !filteredGrammar.length ? (
                <div className="py-10 flex items-center justify-center text-sm text-slate-200">
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mr-2" />
                  Loading grammar points...
                </div>
              ) : !filteredGrammar.length ? (
                <div className="py-10 text-center text-sm text-slate-200/80">
                  No grammar points found for JLPT {selectedLevel} with the current search.
                </div>
              ) : !selectedGrammar ? (
                <div className="py-10 text-center text-sm text-slate-200/80">
                  Select a grammar point to start learning.
                </div>
              ) : (
                <>
                  {/* Top info row */}
                  <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-slate-50">
                          {selectedGrammar.grammarPoint}
                        </h2>
                        {selectedGrammar.reading && (
                          <span className="text-sm text-slate-300/90">{selectedGrammar.reading}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                            selectedGrammar.jlptLevel === 'N5'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/60'
                              : selectedGrammar.jlptLevel === 'N4'
                              ? 'bg-sky-500/15 text-sky-300 border-sky-400/60'
                              : 'bg-violet-500/15 text-violet-300 border-violet-400/60'
                          }`}
                        >
                          JLPT {selectedGrammar.jlptLevel}
                        </span>
                        {selectedGrammar.formality && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-900/70 text-slate-200 border border-white/10">
                            {selectedGrammar.formality}
                          </span>
                        )}
                        {selectedGrammar.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-900/70 text-slate-200 border border-white/10">
                            {selectedGrammar.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-300/90">
                      Pattern {selectedIndex + 1} of {filteredGrammar.length}
                    </div>
                  </div>

                  {/* Main content arranged in two columns to reduce height */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-4">
                      {selectedGrammar.structure && (
                        <section>
                          <h3 className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-1">
                            <Info className="w-4 h-4 text-cyan-400" />
                            Structure
                          </h3>
                          <p className="text-sm text-slate-100 bg-slate-900/70 border border-white/10 rounded-lg px-3 py-2">
                            {selectedGrammar.structure}
                          </p>
                        </section>
                      )}

                      <section>
                        <h3 className="text-sm font-semibold text-slate-100 mb-1">Meaning</h3>
                        <p className="text-sm text-slate-100/95">{selectedGrammar.meaning}</p>
                        {selectedGrammar.nuance && (
                          <p className="mt-2 text-sm text-slate-300/90">{selectedGrammar.nuance}</p>
                        )}
                      </section>

                      {(selectedGrammar.attachesTo || selectedGrammar.similarGrammar) && (
                        <section className="grid grid-cols-1 gap-3 text-sm">
                          {selectedGrammar.attachesTo && (
                            <div className="bg-slate-900/70 rounded-lg px-3 py-2 border border-white/10">
                              <div className="text-xs font-semibold text-slate-300 mb-1">Attaches To</div>
                              <div className="text-slate-100/95">{selectedGrammar.attachesTo}</div>
                            </div>
                          )}
                          {selectedGrammar.similarGrammar && (
                            <div className="bg-slate-900/70 rounded-lg px-3 py-2 border border-white/10">
                              <div className="text-xs font-semibold text-slate-300 mb-1">Similar Grammar</div>
                              <div className="text-slate-100/95">{selectedGrammar.similarGrammar}</div>
                            </div>
                          )}
                        </section>
                      )}
                    </div>

                    <div className="space-y-4">
                      {selectedGrammar.examples && (
                        <section>
                          <h3 className="text-sm font-semibold text-slate-100 mb-2">Example Sentences</h3>
                          <div className="space-y-3">
                            {Object.entries(selectedGrammar.examples)
                              .filter(([, value]) => value)
                              .map(([key, value]) => {
                                const ex = value as GrammarExampleEntry;
                                if (!ex.jp && !ex.en) return null;
                                return (
                                  <div
                                    key={key}
                                    className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 transition-colors duration-200 hover:border-cyan-400/70 hover:bg-slate-900/90"
                                  >
                                    {ex.jp && (
                                      <p className="text-sm md:text-base font-medium text-slate-50 mb-1">
                                        {ex.jp}
                                      </p>
                                    )}
                                    {ex.hiragana && (
                                      <p className="text-xs md:text-sm text-slate-300 mb-1">
                                        {ex.hiragana}
                                      </p>
                                    )}
                                    {ex.breakdown && (
                                      <p className="text-[11px] md:text-xs text-slate-400 mb-1">
                                        {ex.breakdown}
                                      </p>
                                    )}
                                    {ex.en && (
                                      <p className="text-xs md:text-sm text-slate-100/95">{ex.en}</p>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </section>
                      )}

                      {(selectedGrammar.familiarity || selectedGrammar.status || selectedGrammar.lastReviewed) && (
                        <section className="grid grid-cols-1 gap-3 text-xs text-slate-300/90">
                          {typeof selectedGrammar.familiarity === 'number' && (
                            <div className="bg-slate-900/70 rounded-lg px-3 py-2 border border-white/10">
                              <div className="font-semibold text-slate-300 mb-1">Familiarity</div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <span
                                      key={idx}
                                      className={`inline-block w-2 h-2 rounded-full ${
                                        idx < (selectedGrammar.familiarity || 0)
                                          ? 'bg-emerald-400'
                                          : 'bg-slate-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span>{selectedGrammar.familiarity}/5</span>
                              </div>
                            </div>
                          )}
                          {selectedGrammar.status && (
                            <div className="bg-slate-900/70 rounded-lg px-3 py-2 border border-white/10">
                              <div className="font-semibold text-slate-300 mb-1">Status</div>
                              <div className="text-slate-100/95">{selectedGrammar.status}</div>
                            </div>
                          )}
                          {selectedGrammar.lastReviewed && (
                            <div className="bg-slate-900/70 rounded-lg px-3 py-2 border border-white/10">
                              <div className="font-semibold text-slate-300 mb-1">Last Reviewed</div>
                              <div className="text-slate-100/95">
                                {new Date(selectedGrammar.lastReviewed).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </section>
                      )}

                      {selectedGrammar.personalNotes && (
                        <section>
                          <h3 className="text-sm font-semibold text-slate-100 mb-1">Personal Notes</h3>
                          <p className="text-sm text-slate-100/90 whitespace-pre-line">
                            {selectedGrammar.personalNotes}
                          </p>
                        </section>
                      )}
                    </div>
                  </div>

                  {/* Navigation row at bottom */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-300/90">
                      Navigate through grammar points for JLPT {selectedLevel}.
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={goToPrevious}
                        disabled={selectedIndex <= 0}
                        className="px-4 py-2 rounded-lg border border-white/10 text-xs md:text-sm font-medium bg-slate-950/70 text-slate-100 hover:border-cyan-400/70 hover:bg-slate-950/90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={goToNext}
                        disabled={selectedIndex === filteredGrammar.length - 1}
                        className="px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 border border-transparent hover:from-cyan-300 hover:to-sky-400 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarLessons;
