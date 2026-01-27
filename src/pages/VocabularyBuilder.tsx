import { fetchBookmarkedVocabDetails } from '../service/fetchBookmarkedVocabDetails';
// pages/VocabularyBuilder.tsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Star, 
  CheckCircle, 
  XCircle, 
  Zap, 
  TrendingUp, 
  RotateCw,
  Filter,
  Search,
  Layers,
  Plus,
  Bookmark,
  Brain,
  Clock,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';



import { fetchNextVocabulary, fetchVocabStats } from '../service/vocabulary.service';
import { fetchLearnedVocabDetails } from '../service/fetchLearnedVocabDetails';

import {
  markVocabLearned,
  markVocabNotLearned,
  setVocabBookmark,
  getVocabProgress
} from '../service/userProgress.service';

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all';
type JLPTLevel = 'N0' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
const JLPT_TO_NUM: Record<JLPTLevel, number> = { N0: 0, N5: 5, N4: 4, N3: 3, N2: 2, N1: 1 };

interface VocabularyWord {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  level: JLPTLevel;
  example: string;
  exampleReading: string;
  exampleEnglish: string;
  isLearned: boolean;
  isBookmarked: boolean;
  reviews: number;
  lastReviewed?: Date;
  nextReview?: Date;
  streak: number;
}

const VocabularyBuilder = () => {
  // Bookmarked modal state and handler (must be inside component)
  const [showBookmarkedModal, setShowBookmarkedModal] = useState(false);
  const [bookmarkedList, setBookmarkedList] = useState<any[]>([]);
  const [isBookmarkedLoading, setIsBookmarkedLoading] = useState(false);
  // Fetch bookmarked list for the current level
  const fetchBookmarkedList = async () => {
    setIsBookmarkedLoading(true);
    const list = await fetchBookmarkedVocabDetails(JLPT_TO_NUM[selectedLevel]);
    setBookmarkedList(list);
    setIsBookmarkedLoading(false);
  };
  // Show modal and fetch latest list
  const handleShowBookmarked = async () => {
    setShowBookmarkedModal(true);
    fetchBookmarkedList();
  };
  const [showLearnedModal, setShowLearnedModal] = useState(false);
  const [learnedList, setLearnedList] = useState<any[]>([]);
  const [isLearnedLoading, setIsLearnedLoading] = useState(false);
  const handleShowLearned = async () => {
    setIsLearnedLoading(true);
    setShowLearnedModal(true);
    const list = await fetchLearnedVocabDetails(JLPT_TO_NUM[selectedLevel]);
    setLearnedList(list);
    setIsLearnedLoading(false);
  };
  const [currentVocab, setCurrentVocab] = useState<VocabularyWord | null>(null);
  const [shownIds, setShownIds] = useState<string[]>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [searchTerm, setSearchTerm] = useState('');
  // Remove old stats state (now replaced by new stats bar)
  const [isLoading, setIsLoading] = useState(true);
  const [isCardLoading, setIsCardLoading] = useState(false); // For vocab card area only
  // Only random mode now
  const [stats, setStats] = useState({ total: 0, learned: 0 });



  // Fetch vocabulary from backend for selected level


  useEffect(() => {
    // Reset state on level change
    setShownIds([]);
    setIsEnd(false);
    setCurrentVocab(null);
    setIsLoading(true);
    fetchAndSetNextVocab([]);
    // Fetch stats for this level
    fetchVocabStats(JLPT_TO_NUM[selectedLevel]).then(setStats);
    // Fetch bookmarks for this level
    fetchBookmarkedList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevel]);

  const fetchAndSetNextVocab = async (exclude: string[], cardOnly = false) => {
    if (cardOnly) {
      setIsCardLoading(true);
    } else {
      setIsLoading(true);
    }
    try {
      const vocab = await fetchNextVocabulary(JLPT_TO_NUM[selectedLevel], 'random', exclude);
      if (vocab) {
        setCurrentVocab({
          id: vocab.id, // Use backend UUID
          japanese: vocab.word,
          reading: vocab.furigana || vocab.romaji || '',
          english: vocab.meaning,
          level: selectedLevel,
          example: vocab.example || '',
          exampleReading: vocab.exampleReading || '',
          exampleEnglish: vocab.exampleEnglish || '',
          isLearned: false,
          isBookmarked: vocab.isBookmarked ?? false,
          reviews: 0,
          streak: 0
        });
      } else {
        setCurrentVocab(null);
        setIsEnd(true);
      }
    } catch (e) {
      setCurrentVocab(null);
      setIsEnd(true);
    }
    if (cardOnly) {
      setIsCardLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  const handleBookmark = async () => {
    if (!currentWord) return;
    const newValue = !currentWord.isBookmarked;
    try {
      await setVocabBookmark(currentWord.id, newValue);
      setCurrentVocab({ ...currentWord, isBookmarked: newValue });
      // Refresh bookmarks after change
      fetchBookmarkedList();
    } catch (e) {}
  };


  const jlptLevels: JLPTLevel[] = ['N0', 'N5', 'N4', 'N3', 'N2', 'N1'];


  useEffect(() => {
    fetchAndMergeUserProgress();
  }, []);

  // Fetch user progress from backend and merge with local vocab data
  const fetchAndMergeUserProgress = async () => {
    setIsLoading(true);
    // This function is now obsolete since vocabularyData is removed and words are fetched per level
    // Keeping for compatibility, but it just sets loading false
    setIsLoading(false);
  };

  const fetchKanaCounts = async () => {
  };


  // Remove loadVocabulary, handled by fetchAndMergeUserProgress



  // updateStats removed (not needed in one-at-a-time mode)



  // No longer filter words, just search in currentVocab


  // Shuffle logic removed (handled by backend random mode)


  const currentWord = currentVocab;

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };



  const markAsKnown = async () => {
    if (!currentWord) return;
    try {
      await markVocabLearned(currentWord.id);
    } catch (e) {}
    setShowAnswer(false);
    setCurrentVocab(null);
    fetchVocabStats(JLPT_TO_NUM[selectedLevel]).then(setStats);
    // Always use backend random mode
    const nextShown = [...shownIds, currentWord.id];
    setShownIds(nextShown);
    fetchAndSetNextVocab(nextShown, true);
  };



  const markAsUnknown = async () => {
    if (!currentWord) return;
    try {
      await markVocabNotLearned(currentWord.id);
    } catch (e) {}
    setShowAnswer(false);
    setCurrentVocab(null);
    fetchVocabStats(JLPT_TO_NUM[selectedLevel]).then(setStats);
    // Always use backend random mode
    const nextShown = [...shownIds, currentWord.id];
    setShownIds(nextShown);
    fetchAndSetNextVocab(nextShown, true);
  };



  // Bookmark logic removed (not available in one-at-a-time mode)


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  if (isEnd) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No more words in this level</h3>
          <button
            onClick={() => {
              setShownIds([]);
              setIsEnd(false);
              setCurrentVocab(null);
              setIsLoading(true);
              fetchAndSetNextVocab([]);
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Restart Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-red-600" />
                Vocabulary Builder
              </h1>
              <p className="text-gray-600">Learn essential Japanese words with context and examples</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center">
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Custom Word
              </button>
              <button
                className="px-4 py-2 rounded-xl border text-sm font-medium transition bg-blue-100 text-blue-700 border-blue-200"
                onClick={() => fetchAndSetNextVocab([])}
                title="Randomize the order of vocabulary"
              >
                Randomize
              </button>
            </div>
          </div>



          {/* Stats Bar Restored */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8 items-center w-full">
            <div
              className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition w-full"
              onClick={handleShowLearned}
              title="Show all learned words"
            >
              <div className="text-2xl font-bold text-green-600">{stats.learned}</div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
            <div
              className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50 transition w-full"
              onClick={handleShowBookmarked}
              title="Show all bookmarked words"
            >
              <div className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                <Star className="w-6 h-6" fill="#facc15" />
                {bookmarkedList.length}
              </div>
              <div className="text-sm text-gray-600">Bookmarked</div>
            </div>
                        {/* Bookmarked Words Modal */}
                        {showBookmarkedModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
                              <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                                onClick={() => setShowBookmarkedModal(false)}
                                title="Close"
                              >
                                &times;
                              </button>
                              <h2 className="text-xl font-bold mb-4 text-center">Bookmarked Words (Level {selectedLevel})</h2>
                              {isBookmarkedLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
                                </div>
                              ) : bookmarkedList.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">No words bookmarked yet for this level.</div>
                              ) : (
                                <div className="max-h-96 overflow-y-auto divide-y">
                                  {bookmarkedList.map((vocab) => (
                                    <div key={vocab.id} className="py-3 px-2 flex flex-col md:flex-row md:items-center gap-2">
                                      <div className="flex-1">
                                        <div className="text-lg font-bold text-gray-900">{vocab.word}</div>
                                        <div className="text-gray-600 text-base">{vocab.furigana || vocab.romaji || ''}</div>
                                        <div className="text-gray-700 text-base">{vocab.meaning}</div>
                                        {vocab.example && (
                                          <div className="text-sm text-gray-500 mt-1">Ex: {vocab.example}</div>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-400">ID: {vocab.id}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                  {/* Learned Words Modal */}
                  {showLearnedModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                          onClick={() => setShowLearnedModal(false)}
                          title="Close"
                        >
                          &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-center">Learned Words (Level {selectedLevel})</h2>
                        {isLearnedLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                          </div>
                        ) : learnedList.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">No words learned yet for this level.</div>
                        ) : (
                          <div className="max-h-96 overflow-y-auto divide-y">
                            {learnedList.map((vocab) => (
                              <div key={vocab.id} className="py-3 px-2 flex flex-col md:flex-row md:items-center gap-2">
                                <div className="flex-1">
                                  <div className="text-lg font-bold text-gray-900">{vocab.word}</div>
                                  <div className="text-gray-600 text-base">{vocab.furigana || vocab.romaji || ''}</div>
                                  <div className="text-gray-700 text-base">{vocab.meaning}</div>
                                  {vocab.example && (
                                    <div className="text-sm text-gray-500 mt-1">Ex: {vocab.example}</div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">ID: {vocab.id}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center w-full">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center w-full">
              <div className="text-2xl font-bold text-purple-600">{stats.total > 0 ? Math.floor((stats.learned / stats.total) * 100) : 0}%</div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
            {/* Randomize button removed from stats bar */}
          </div>
        </div>

        {/* Kana health check */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Hiragana</div>
                <div className="text-2xl font-bold">—</div>
                <div className="text-sm text-gray-400">Sample: —</div>
            </div>
            <button onClick={fetchKanaCounts} className="px-3 py-2 bg-blue-50 text-blue-600 rounded">Refresh</button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Katakana</div>
                <div className="text-2xl font-bold">—</div>
                <div className="text-sm text-gray-400">Sample: —</div>
            </div>
            <button onClick={fetchKanaCounts} className="px-3 py-2 bg-blue-50 text-blue-600 rounded">Refresh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* JLPT Level Selector */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                JLPT Level
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {jlptLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-2 rounded-lg transition ${
                      selectedLevel === level
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vocabulary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Categories and Difficulty selectors removed */}


            {/* Bookmarked Words removed in one-at-a-time mode */}
          </div>

          {/* Right Column - Learning Interface */}
          <div className="lg:col-span-2">

            {/* Only one vocab at a time */}
            <div style={{ minHeight: 350 }}>
              {isCardLoading ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : (
                currentWord && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                    <div className="p-6 md:p-8">
                      <div className="text-center mb-8">
                        {/* Word + Bookmark */}
                        <div className="flex flex-col items-center mb-6">
                          <div className="text-5xl md:text-6xl font-bold text-gray-900 flex items-center gap-2">
                            {currentWord.japanese}
                            <button
                              onClick={handleBookmark}
                              className={
                                currentWord.isBookmarked
                                  ? 'text-yellow-400 hover:text-yellow-500 transition'
                                  : 'text-gray-300 hover:text-yellow-400 transition'
                              }
                              title={currentWord.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                              style={{ outline: 'none', border: 'none', background: 'none', padding: 0 }}
                            >
                              <Star className="w-7 h-7" fill={currentWord.isBookmarked ? '#facc15' : 'none'} />
                            </button>
                          </div>
                        </div>
                        {/* Reading (Romaji) */}
                        {!showAnswer && (
                          <div className="text-2xl text-gray-600 mb-6">
                            {currentWord.reading}
                          </div>
                        )}
                        {/* English Meaning */}
                        {showAnswer ? (
                          <div className="animate-fade-in">
                            <div className="text-2xl font-bold text-green-600 mb-4">
                              {currentWord.english}
                            </div>
                            {/* Example Sentence */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                              <div className="text-xl font-medium text-gray-900 mb-2">
                                {currentWord.example}
                              </div>
                              <div className="text-gray-600 mb-2">
                                {currentWord.exampleReading}
                              </div>
                              <div className="text-gray-700">
                                {currentWord.exampleEnglish}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAnswer(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                          >
                            <Sparkles className="w-5 h-5" />
                            Show Answer
                          </button>
                        )}
                      </div>
                      {/* Controls */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button
                          onClick={() => playAudio(currentWord.japanese || '')}
                          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <Volume2 className="w-5 h-5" />
                          Listen
                        </button>
                        <div className="flex gap-4">
                          <button
                            onClick={markAsUnknown}
                            className="px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all flex items-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Don't Know
                          </button>
                          <button
                            onClick={markAsKnown}
                            className="px-6 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            I Know It
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Learning Tips */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Learning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold">Practice Pronunciation</h4>
                  </div>
                  <p className="text-sm text-gray-600">Always listen to the audio and repeat the words out loud.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold">Review Regularly</h4>
                  </div>
                  <p className="text-sm text-gray-600">Use spaced repetition for better long-term retention.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Progress removed */}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fff7ed;
        }
      `}</style>
    </div>
  );
};

export default VocabularyBuilder;