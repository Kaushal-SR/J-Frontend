import React, { useState, useEffect, useCallback } from 'react';
// import KanjiN5Data from '../assets/Kanji_N5.json';
// import KanjiN4Data from '../assets/Kanji_N4.json';
// import KanjiN3Data from '../assets/Kanji_N3.json';
// import KanjiN2Data from '../assets/Kanji_N2.json';
import { fetchKanji } from '../api/kanjiApi';
import { getLearnedProgress, markKanjiLearned, markKanjiNotLearned, setKanjiBookmark } from '../service/userProgress.service';
import KanjiTable from '../component/kanji/KanjiTable';
import KanjiGrid from '../component/kanji/KanjiGrid';
import {
  BookOpen,
  PenTool,
  Target,
  CheckCircle,
  XCircle,
  RotateCw,
  Star,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  Bookmark,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  Layers,
  Zap
} from 'lucide-react';

// ...existing code...

function KanjiLearning() {

  // --- All state hooks must come first ---
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'all'>('N5');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [kanjiList, setKanjiList] = useState<KanjiCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  // ...existing state...

  // Load kanji data when selectedLevel changes
  useEffect(() => {
    setLoading(true);
    fetchKanji(selectedLevel)
      .then((data) => {
        setKanjiList(Array.isArray(data) ? data : []);
      })
      .catch(() => setKanjiList([]))
      .finally(() => setLoading(false));
  }, [selectedLevel]);


  // When JLPT level changes during flashcard mode, reset flashcard state and fetch a new card for the new level
  useEffect(() => {
    if (flashcardMode) {
      setShownIds([]);
      setIsEnd(false);
      setCurrentFlashcard(null);
      setShowFlashcardAnswer(false);
    }
  }, [selectedLevel]);

  // When kanjiList changes and flashcardMode is active, fetch a new flashcard
  useEffect(() => {
    if (flashcardMode && kanjiList.length > 0) {
      fetchNextFlashcard([]);
    }
  }, [kanjiList, flashcardMode]);

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type KanjiStatus = 'new' | 'learning' | 'review' | 'mastered';

interface KanjiCharacter {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  jlptLevel: JLPTLevel;
  examples: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  radicals: string[];
  status: KanjiStatus;
  reviewCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
  isBookmarked: boolean;
}

  const [shownIds, setShownIds] = useState<string[]>([]);
  const [currentFlashcard, setCurrentFlashcard] = useState<KanjiCharacter | null>(null);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  // Existing practice mode state
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [randomOrder, setRandomOrder] = useState(false);
  const [shuffledIndexes, setShuffledIndexes] = useState<number[]>([]);
    // Helper to get a random kanji not in shownIds, filtered by selected JLPT level
    const getRandomKanji = (excludeIds: string[]): KanjiCharacter | null => {
      const available = filteredKanji.filter(k =>
        !excludeIds.includes(k.id) &&
        (selectedLevel === 'all' ? true : k.jlptLevel === selectedLevel)
      );
      if (available.length === 0) return null;
      const idx = Math.floor(Math.random() * available.length);
      return available[idx];
    };

    // Fetch next kanji for flashcard mode
    const fetchNextFlashcard = (exclude: string[] = []) => {
      setIsCardLoading(true);
      setTimeout(() => {
        const next = getRandomKanji(exclude);
        if (next) {
          setCurrentFlashcard(next);
          setShowFlashcardAnswer(false);
          setIsEnd(false);
        } else {
          setCurrentFlashcard(null);
          setIsEnd(true);
        }
        setIsCardLoading(false);
      }, 300); // Simulate async
    };

    // Start flashcard mode (make it the only active view)
    const startFlashcardMode = () => {
      setPracticeMode(false);
      setFlashcardMode(true);
      setShownIds([]);
      setIsEnd(false);
      fetchNextFlashcard([]);
    };

    // End flashcard mode
    const endFlashcardMode = () => {
      setFlashcardMode(false);
      setShownIds([]);
      setCurrentFlashcard(null);
      setIsEnd(false);
      setShowFlashcardAnswer(false);
    };

    // Mark as known/unknown in flashcard mode
    const markFlashcardKnown = async () => {
      if (!currentFlashcard) return;
      const nextShown = [...shownIds, currentFlashcard.id];
      setShownIds(nextShown);

      try {
        await markKanjiLearned(currentFlashcard.id);
        setLearnedKanjiIds(prev =>
          prev.includes(currentFlashcard.id) ? prev : [...prev, currentFlashcard.id],
        );
      } catch (e) {
        console.error('Failed to mark flashcard kanji learned', e);
      }

      fetchNextFlashcard(nextShown);
    };
    const markFlashcardUnknown = async () => {
      if (!currentFlashcard) return;
      const nextShown = [...shownIds, currentFlashcard.id];
      setShownIds(nextShown);

      try {
        await markKanjiNotLearned(currentFlashcard.id);
        setLearnedKanjiIds(prev => prev.filter(id => id !== currentFlashcard.id));
      } catch (e) {
        console.error('Failed to mark flashcard kanji not learned', e);
      }

      fetchNextFlashcard(nextShown);
    };

    // Toggle bookmark for flashcard kanji
    const toggleFlashcardBookmark = async () => {
      if (!currentFlashcard) return;
      setKanjiList(prev => prev.map(k =>
        k.id === currentFlashcard.id ? { ...k, isBookmarked: !k.isBookmarked } : k
      ));
      setCurrentFlashcard(cur => cur ? { ...cur, isBookmarked: !cur.isBookmarked } : cur);

      try {
        await setKanjiBookmark(currentFlashcard.id, !currentFlashcard.isBookmarked);
      } catch (e) {
        console.error('Failed to update flashcard kanji bookmark', e);
      }
    };
  const [selectedStatus, setSelectedStatus] = useState<KanjiStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false); // simple on/off for Quiz box
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalKanji: 0,
    learned: 0,
    inProgress: 0,
    accuracy: 0,
    streak: 0,
  });
  const [kanjiListStyle, setKanjiListStyle] = useState<'list' | 'grid'>('list');
  const [learnedKanjiIds, setLearnedKanjiIds] = useState<string[]>([]);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);

  const filteredKanji = kanjiList.filter(kanji => {
    const matchesLevel = selectedLevel === 'all' || kanji.jlptLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || kanji.status === selectedStatus;
    const matchesSearch = kanji.character.includes(searchTerm) || 
                         kanji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kanji.onyomi.some(o => o.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         kanji.kunyomi.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesStatus && matchesSearch;
  });

  // Load learned kanji progress from backend when the kanji list is available
  useEffect(() => {
    if (!kanjiList.length) return;

    const loadProgress = async () => {
      try {
        const res: any = await getLearnedProgress();
        const learnedFromApi: string[] = (res.data || [])
          .filter((p: any) => p.itemType === 'KANJI' && p.learned)
          .map((p: any) => p.itemId);

        setLearnedKanjiIds(learnedFromApi);

        // Reflect learned status in local kanji list
        setKanjiList(prev =>
          prev.map(k =>
            learnedFromApi.includes(k.id)
              ? { ...k, status: 'mastered' as KanjiStatus }
              : k,
          ),
        );
      } catch (e) {
        console.error('Failed to load kanji progress', e);
      }
    };

    loadProgress();
  }, [kanjiList.length]);

  // Recompute top stats when filters or learned IDs change
  useEffect(() => {
    const filtered = kanjiList.filter(kanji => {
      const matchesLevel = selectedLevel === 'all' || kanji.jlptLevel === selectedLevel;
      const matchesStatus = selectedStatus === 'all' || kanji.status === selectedStatus;
      const matchesSearch = kanji.character.includes(searchTerm) ||
        kanji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kanji.onyomi.some(o => o.toLowerCase().includes(searchTerm.toLowerCase())) ||
        kanji.kunyomi.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesLevel && matchesStatus && matchesSearch;
    });

    const learnedCount = filtered.filter(k => learnedKanjiIds.includes(k.id)).length;

    setStats(prev => ({
      ...prev,
      totalKanji: filtered.length,
      learned: learnedCount,
      inProgress: Math.max(filtered.length - learnedCount, 0),
    }));
  }, [kanjiList, selectedLevel, selectedStatus, searchTerm, learnedKanjiIds]);

  // Shuffle logic
  useEffect(() => {
    if (randomOrder) {
      const arr = Array.from({ length: filteredKanji.length }, (_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledIndexes(arr);
      setCurrentKanjiIndex(0);
    } else {
      setShuffledIndexes([]);
      setCurrentKanjiIndex(0);
    }
  }, [randomOrder, selectedLevel, selectedStatus, searchTerm, kanjiList.length]);

  const getKanjiByIndex = (idx: number) => {
    if (randomOrder && shuffledIndexes.length === filteredKanji.length) {
      return filteredKanji[shuffledIndexes[idx]];
    }
    return filteredKanji[idx];
  };

  const currentKanji = getKanjiByIndex(currentKanjiIndex);

  const jlptLevels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const statusOptions: (KanjiStatus | 'all')[] = ['all', 'new', 'learning', 'review', 'mastered'];

  const getStatusColor = (status: KanjiStatus) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-700';
      case 'learning': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-yellow-100 text-yellow-700';
      case 'mastered': return 'bg-green-100 text-green-700';
    }
  };

  const getLevelColor = (level: JLPTLevel) => {
    switch (level) {
      case 'N5': return 'bg-green-100 text-green-700';
      case 'N4': return 'bg-blue-100 text-blue-700';
      case 'N3': return 'bg-purple-100 text-purple-700';
      case 'N2': return 'bg-orange-100 text-orange-700';
      case 'N1': return 'bg-red-100 text-red-700';
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  // Quiz answer logic removed for now (practice mode under redesign)

  // Reset answer state when moving to a new kanji or toggling Quiz
  useEffect(() => {
    setShowAnswer(false);
    setIsCorrect(null);
    setUserAnswer('');
  }, [currentKanjiIndex, practiceMode]);

  // Toggle bookmark status for a kanji by id
  const toggleBookmark = async (id: string) => {
    setKanjiList(prev =>
      prev.map(k =>
        k.id === id ? { ...k, isBookmarked: !k.isBookmarked } : k
      ),
    );

    const target = kanjiList.find(k => k.id === id);
    const newValue = target ? !target.isBookmarked : true;
    try {
      await setKanjiBookmark(id, newValue);
    } catch (e) {
      console.error('Failed to update kanji bookmark', e);
    }
  };


  const prevKanji = () => {
    setCurrentKanjiIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextKanji = () => {
    setCurrentKanjiIndex((prev) =>
      prev < filteredKanji.length - 1 ? prev + 1 : prev
    );
  };

  // Toggle random order for practice mode
  const shufflePracticeKanji = () => {
    setRandomOrder((prev) => !prev);
  };

  const renderWritingGuide = () => {
    // TODO: Implement writing guide rendering
    return null;
  };

  // Keyboard navigation for previous/next kanji in Quiz mode
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!practiceMode) return;
    if (e.key === 'ArrowLeft') {
      prevKanji();
    } else if (e.key === 'ArrowRight') {
      nextKanji();
    }
  }, [practiceMode, prevKanji, nextKanji]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amber-50">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
          <span className="ml-4 text-xl font-bold text-amber-700">Loading Kanji...</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header container (currently no title/subtitle as per design) */}
        <div className="mb-8">
          {/* Top controls: search + JLPT level selector + mode buttons */}
          <div className="bg-white rounded-2xl shadow-sm border mb-4 px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-4">
              {/* Search bar - full width */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search kanji by character, meaning, or reading..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 border rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50/60"
                />
              </div>

              {/* Levels + mode buttons row */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* JLPT level selector */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap">JLPT Level</span>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {jlptLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition border ${
                          selectedLevel === level
                            ? getLevelColor(level) + ' border-transparent shadow-sm'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View mode + flashcard + Quiz controls */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <button
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    !flashcardMode && !practiceMode && kanjiListStyle === 'list'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setPracticeMode(false);
                      endFlashcardMode();
                      setKanjiListStyle('list');
                    }}
                  >
                    List View
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    !flashcardMode && !practiceMode && kanjiListStyle === 'grid'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setPracticeMode(false);
                      endFlashcardMode();
                      setKanjiListStyle('grid');
                    }}
                  >
                    Grid View
                  </button>

                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition border flex items-center gap-2 ${
                      flashcardMode
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (flashcardMode) {
                        endFlashcardMode();
                        setPracticeMode(false);
                      } else {
                        setPracticeMode(false);
                        startFlashcardMode();
                      }
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Flashcard
                  </button>

                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition border flex items-center gap-2 ${
                      practiceMode && !flashcardMode
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (practiceMode) {
                        setPracticeMode(false);
                      } else {
                        setPracticeMode(true);
                        endFlashcardMode();
                      }
                    }}
                  >
                    <Target className="w-4 h-4" />
                    Quiz
                  </button>

                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition border flex items-center gap-2 ${
                      showBookmarksModal
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setShowBookmarksModal(true)}
                  >
                    <Bookmark className="w-4 h-4" />
                    Bookmarks
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Individual stat cards in header area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-amber-600">
                {stats.learned}/{filteredKanji.length}
              </div>
              <div className="text-sm text-gray-600">Kanji Learned</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">
                {kanjiList.filter(k => k.status === 'mastered').length}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Learning Area */}
          <div className="lg:col-span-3 lg:col-start-1">
            <div>
              {flashcardMode ? (
                <div className="mb-8">
                  {/* Flashcard Mode UI */}
                  {isCardLoading ? (
                    <div className="flex items-center justify-center h-60">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                  ) : isEnd ? (
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <div className="text-2xl font-bold text-gray-900 mb-2">No more kanji in this level</div>
                      <button
                        onClick={startFlashcardMode}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all mt-2"
                      >
                        Restart Flashcard Mode
                      </button>
                      <button
                        onClick={endFlashcardMode}
                        className="ml-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all mt-2"
                      >
                        Exit
                      </button>
                    </div>
                  ) : currentFlashcard ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border flex flex-col items-center relative">
                      {/* Show Details Button - top right */}
                      <button
                        className="absolute top-4 right-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition z-10"
                        onClick={() => setShowDetails((prev) => !prev)}
                      >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                      </button>
                      <div className="flex flex-col items-center gap-2 mb-6">
                        <span className="text-7xl md:text-8xl font-bold text-gray-900">{currentFlashcard.character}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getLevelColor(currentFlashcard.jlptLevel)}`}>{currentFlashcard.jlptLevel}</span>
                          <button
                            onClick={toggleFlashcardBookmark}
                            className={
                              currentFlashcard.isBookmarked
                                ? 'text-yellow-400 hover:text-yellow-500 transition'
                                : 'text-gray-300 hover:text-yellow-400 transition'
                            }
                            title={currentFlashcard.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                            style={{ outline: 'none', border: 'none', background: 'none', padding: 0 }}
                          >
                            <Star className="w-8 h-8" fill={currentFlashcard.isBookmarked ? '#facc15' : 'none'} />
                          </button>
                        </div>
                      </div>
                      {/* Details Section */}
                      {showDetails && (
                        <div className="w-full mt-2 p-4 border rounded-xl bg-gray-50 animate-fade-in">
                          <div className="mb-2"><b>Meaning:</b> {currentFlashcard.meaning}</div>
                          <div className="mb-2"><b>Onyomi:</b> {currentFlashcard.onyomi.join(', ')}</div>
                          <div className="mb-2"><b>Kunyomi:</b> {currentFlashcard.kunyomi.join(', ')}</div>
                          <div className="mb-2"><b>Strokes:</b> {currentFlashcard.strokes}</div>
                          <div className="mb-2"><b>Radicals:</b> {currentFlashcard.radicals.join(', ')}</div>
                          {/* Add more details as needed */}
                        </div>
                      )}
                      {showFlashcardAnswer ? (
                        <div className="w-full animate-fade-in">
                          <div className="text-2xl font-bold text-green-700 mb-2">{currentFlashcard.meaning}</div>
                          <div className="text-xl text-blue-700 mb-2">On'yomi: {currentFlashcard.onyomi.join(', ')}</div>
                          <div className="text-xl text-purple-700 mb-2">Kun'yomi: {currentFlashcard.kunyomi.join(', ')}</div>
                          <div className="text-sm text-gray-500">Strokes: {currentFlashcard.strokes}</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowFlashcardAnswer(true)}
                          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto mt-4 text-lg"
                        >
                          <Sparkles className="w-6 h-6" />
                          Show Answer
                        </button>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full">
                        <button
                          onClick={() => playAudio(currentFlashcard.character)}
                          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 w-full text-lg"
                        >
                          <Volume2 className="w-6 h-6" />
                          Listen
                        </button>
                        <div className="flex gap-4 w-full">
                          <button
                            onClick={markFlashcardUnknown}
                            className="px-8 py-4 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all flex items-center gap-2 w-full text-lg"
                          >
                            <XCircle className="w-6 h-6" />
                            Don't Know
                          </button>
                          <button
                            onClick={markFlashcardKnown}
                            className="px-8 py-4 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all flex items-center gap-2 w-full text-lg"
                          >
                            <CheckCircle className="w-6 h-6" />
                            I Know It
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={endFlashcardMode}
                        className="mt-8 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all text-lg"
                      >
                        Exit Flashcard Mode
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : selectedLevel === 'N1' && !practiceMode ? (
                <div className="flex items-center justify-center h-96">
                  <span className="text-3xl text-gray-400 font-bold">Coming Soon</span>
                </div>
              ) : practiceMode ? (
                currentKanji ? (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border">
                    {/* Quiz box - layout preserved, content to be redesigned later */}
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={prevKanji}
                          disabled={currentKanjiIndex === 0}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Kanji</div>
                          <div className="text-lg font-bold">
                            {currentKanjiIndex + 1} / {filteredKanji.length}
                          </div>
                        </div>
                        <button
                          onClick={nextKanji}
                          disabled={currentKanjiIndex === filteredKanji.length - 1}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${randomOrder ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                          onClick={shufflePracticeKanji}
                          title="Randomize the order of kanji"
                        >
                          {randomOrder ? 'Random Order: On' : 'Random Order: Off'}
                        </button>
                        <button
                          onClick={() => toggleBookmark(currentKanji.id)}
                          className={`p-2 rounded-lg transition ${
                            currentKanji.isBookmarked
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${currentKanji.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        >
                          {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>
                    </div>
                    {/* Kanji Display */}
                    <div className="mb-8">
                      <div className="text-8xl md:text-9xl font-bold text-gray-900 mb-6">
                        {currentKanji.character}
                      </div>
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <div className={`px-3 py-1 rounded-full text-sm ${getLevelColor(currentKanji.jlptLevel)}`}>
                          {currentKanji.jlptLevel}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentKanji.status)}`}>
                          {currentKanji.status}
                        </div>
                        <div className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                          {currentKanji.strokes} strokes
                        </div>
                      </div>
                    </div>
                    {/* Quiz content intentionally left blank for now */}
                    <div className="mb-8">
                      {/* TODO: Quiz interactions will be implemented here */}
                    </div>
                    {/* Kanji Details */}
                    {showDetails && (
                      <div className="mt-8 pt-8 border-t animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Kanji Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Readings */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Volume2 className="w-4 h-4 text-blue-600" />
                              Readings
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-gray-600 mb-1">On'yomi (Chinese reading)</div>
                                <div className="text-lg font-mono">
                                  {currentKanji.onyomi.join(', ')}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 mb-1">Kun'yomi (Japanese reading)</div>
                                <div className="text-lg font-mono">
                                  {currentKanji.kunyomi.join(', ')}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Examples */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Example Words</h4>
                            <div className="space-y-3">
                              {currentKanji.examples.map((example, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium">{example.word}</div>
                                    <button
                                      onClick={() => playAudio(example.word)}
                                      className="text-gray-500 hover:text-blue-600"
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="text-sm text-gray-600">{example.reading}</div>
                                  <div className="text-sm text-gray-700">{example.meaning}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/* Radicals */}
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Radicals</h4>
                          <div className="flex gap-2">
                            {currentKanji.radicals.map((radical, index) => (
                              <div key={index} className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-xl font-bold">{radical}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Study Stats */}
                    <div className="mt-8 pt-6 border-t">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Reviews</div>
                          <div className="text-lg font-bold">{currentKanji.reviewCount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Status</div>
                          <div className={`text-lg font-bold ${
                            currentKanji.status === 'mastered' ? 'text-green-600' :
                            currentKanji.status === 'review' ? 'text-yellow-600' :
                            currentKanji.status === 'learning' ? 'text-blue-600' : 'text-gray-600'
                          }`}>
                            {currentKanji.status}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Strokes</div>
                          <div className="text-lg font-bold">{currentKanji.strokes}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Level</div>
                          <div className={`text-lg font-bold ${getLevelColor(currentKanji.jlptLevel).split(' ')[1]}`}>
                            {currentKanji.jlptLevel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No kanji found</h3>
                    <p className="text-gray-600 mb-6">Try changing your filters or search term</p>
                    <button
                      onClick={() => {
                        setSelectedLevel('N5');
                        setSelectedStatus('all');
                        setSearchTerm('');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      Reset Filters
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Kanji List</h2>
                  </div>
                  {kanjiListStyle === 'list' ? (
                    <KanjiTable kanjiList={filteredKanji} />
                  ) : (
                    <KanjiGrid kanjiList={filteredKanji} />
                  )}
                </div>
              )}
            </div>

            {/* Learning Tips */}
            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Kanji Learning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold">Learn Radicals First</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Understanding radicals makes learning complex kanji much easier.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold">Practice Regularly</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consistent daily practice is more effective than occasional long sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                Bookmarked Kanji
              </h3>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {kanjiList.filter(k => k.isBookmarked).length > 0 ? (
                <div className="space-y-2">
                  {kanjiList.filter(k => k.isBookmarked).map((kanji) => (
                    <div
                      key={kanji.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-amber-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold">{kanji.character}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{kanji.meaning}</div>
                          <div className="text-xs text-gray-600">
                            {[kanji.onyomi[0], kanji.kunyomi[0]].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBookmark(kanji.id)}
                        className={`p-2 rounded-full transition ${
                          kanji.isBookmarked
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={kanji.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                      >
                        <Bookmark className={`w-5 h-5 ${kanji.isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">You don't have any bookmarked kanji yet.</p>
              )}
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default KanjiLearning;