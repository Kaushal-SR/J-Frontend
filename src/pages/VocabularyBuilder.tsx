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

import VocabsN5 from '../assets/Vocabs_N5.json';
import VocabsN4 from '../assets/Vocabs_N4.json';
import VocabsN3 from '../assets/Vocabs_N3.json';
import VocabsN2 from '../assets/Vocabs_N2.json';
import VocabsN1 from '../assets/Vocabs_N1.json';

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all';
type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

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
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalLearned: 0, 
    totalWords: 0,
    streak: 0,
    accuracy: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [randomOrder, setRandomOrder] = useState(false);
  const [shuffledIndexes, setShuffledIndexes] = useState<number[]>([]);


  // Load N5 vocabulary from JSON

  const vocabularyData: VocabularyWord[] = [
    ...(VocabsN5 as any[]).map((item, idx) => ({
      id: `N5-${idx + 1}`,
      japanese: item.word,
      reading: item.furigana || item.romaji || '',
      english: item.meaning,
      level: 'N5' as JLPTLevel,
      example: '',
      exampleReading: '',
      exampleEnglish: '',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    })),
    ...(VocabsN4 as any[]).map((item, idx) => ({
      id: `N4-${idx + 1}`,
      japanese: item.word,
      reading: item.furigana || item.romaji || '',
      english: item.meaning,
      level: 'N4' as JLPTLevel,
      example: '',
      exampleReading: '',
      exampleEnglish: '',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    })),
    ...(VocabsN3 as any[]).map((item, idx) => ({
      id: `N3-${idx + 1}`,
      japanese: item.word,
      reading: item.furigana || item.romaji || '',
      english: item.meaning,
      level: 'N3' as JLPTLevel,
      example: '',
      exampleReading: '',
      exampleEnglish: '',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    })),
    ...(VocabsN2 as any[]).map((item, idx) => ({
      id: `N2-${idx + 1}`,
      japanese: item.word,
      reading: item.furigana || item.romaji || '',
      english: item.meaning,
      level: 'N2' as JLPTLevel,
      example: '',
      exampleReading: '',
      exampleEnglish: '',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    })),
    ...(VocabsN1 as any[]).map((item, idx) => ({
      id: `N1-${idx + 1}`,
      japanese: item.word,
      reading: item.furigana || item.romaji || '',
      english: item.meaning,
      level: 'N1' as JLPTLevel,
      example: '',
      exampleReading: '',
      exampleEnglish: '',
      isLearned: false,
      isBookmarked: false,
      reviews: 0,
      streak: 0
    })),
  ];


  const jlptLevels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

  useEffect(() => {
    loadVocabulary();
  }, []);

  const fetchKanaCounts = async () => {
  };

  const loadVocabulary = () => {
    setIsLoading(true);
    setTimeout(() => {
      setWords(vocabularyData);
      updateStats();
      setIsLoading(false);
    }, 500);
  };

  const updateStats = () => {
    const learned = vocabularyData.filter(w => w.isLearned).length;
    const total = vocabularyData.length;
    setStats({
      totalLearned: learned,
      totalWords: total,
      streak: Math.floor(Math.random() * 10),
      accuracy: total > 0 ? Math.round((learned / total) * 100) : 0
    });
  };


  const filteredWords = words.filter(word => {
    const matchesLevel = word.level === selectedLevel;
    const matchesSearch = word.japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        word.english.toLowerCase().includes(searchTerm.toLowerCase()); 
    return matchesLevel && matchesSearch; 
  });

  // Shuffle logic
  useEffect(() => {
    if (randomOrder) {
      // Shuffle indexes for filteredWords
      const arr = Array.from({ length: filteredWords.length }, (_, i) => i);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledIndexes(arr);
      setCurrentWordIndex(0);
    } else {
      setShuffledIndexes([]);
      setCurrentWordIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomOrder, selectedLevel, searchTerm, words.length]);

  const getWordByIndex = (idx: number) => {
    if (randomOrder && shuffledIndexes.length === filteredWords.length) {
      return filteredWords[shuffledIndexes[idx]];
    }
    return filteredWords[idx];
  };

  const currentWord = getWordByIndex(currentWordIndex);

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const markAsKnown = () => {
    if (!currentWord) return;
    
    const updatedWords = [...words];
    const wordIndex = words.findIndex(w => w.id === currentWord.id);
    
    updatedWords[wordIndex] = { 
      ...currentWord,
      isLearned: true,
      reviews: currentWord.reviews + 1,
      streak: currentWord.streak + 1,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day later
    };
    
    setWords(updatedWords);
    updateStats();
    
    // Move to next word
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
    setShowAnswer(false);
  };

  const markAsUnknown = () => {
    if (!currentWord) return;
    
    const updatedWords = [...words];
    const wordIndex = words.findIndex(w => w.id === currentWord.id);
    
    updatedWords[wordIndex] = {
      ...currentWord,
      isLearned: false,
      reviews: currentWord.reviews + 1,
      streak: 0,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour later
    };
    
    setWords(updatedWords);
    updateStats();
    
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
    setShowAnswer(false);
  };

  const toggleBookmark = (wordId: string) => {
    const updatedWords = words.map(word => 
      word.id === wordId 
        ? { ...word, isBookmarked: !word.isBookmarked }
        : word
    );
    setWords(updatedWords);
  };

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
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${randomOrder ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                onClick={() => setRandomOrder(r => !r)}
                title="Randomize the order of vocabulary"
              >
                {randomOrder ? 'Random Order: On' : 'Random Order: Off'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 items-center">
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalLearned}</div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalWords}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center justify-center gap-2">
              <div className="text-2xl font-bold text-amber-600">{stats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
              <button
                className={`mt-1 px-2 py-1 rounded text-xs font-medium border transition ${randomOrder ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                onClick={() => setRandomOrder(r => !r)}
                title="Randomize the order of vocabulary"
                style={{ minWidth: 0 }}
              >
                {randomOrder ? 'Random: On' : 'Random: Off'}
              </button>
            </div>
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

            {/* Bookmarked Words */}
            <div className="bg-white rounded-xl shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-600" />
                Bookmarked Words
              </h3>
              <div className="space-y-2">
                {words.filter(w => w.isBookmarked).slice(0, 5).map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <div>
                      <div className="font-medium">{word.japanese}</div>
                      <div className="text-sm text-gray-600">{word.english}</div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(word.id)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
                {words.filter(w => w.isBookmarked).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No bookmarked words yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Learning Interface */}
          <div className="lg:col-span-2">
            {filteredWords.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
                {/* Progress Bar */}
                <div className="px-6 pt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{currentWordIndex + 1} / {filteredWords.length}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all"
                      style={{ width: `${((currentWordIndex + 1) / filteredWords.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Word Display */}
                <div className="p-6 md:p-8">
                  <div className="text-center mb-8">
                    {/* Word */}
                    <div className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                      {currentWord?.japanese}
                    </div>

                    {/* Reading (Romaji) */}
                    {!showAnswer && (
                      <div className="text-2xl text-gray-600 mb-6">
                        {currentWord?.reading}
                      </div>
                    )}

                    {/* English Meaning */}
                    {showAnswer ? (
                      <div className="animate-fade-in">
                        <div className="text-2xl font-bold text-green-600 mb-4">
                          {currentWord?.english}
                        </div>
                        
                        {/* Example Sentence */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                          <div className="text-xl font-medium text-gray-900 mb-2">
                            {currentWord?.example}
                          </div>
                          <div className="text-gray-600 mb-2">
                            {currentWord?.exampleReading}
                          </div>
                          <div className="text-gray-700">
                            {currentWord?.exampleEnglish}
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
                      onClick={() => playAudio(currentWord?.japanese || '')}
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

                    <button
                      onClick={() => toggleBookmark(currentWord?.id || '')}
                      className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
                        currentWord?.isBookmarked
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${currentWord?.isBookmarked ? 'fill-current' : ''}`} />
                      {currentWord?.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>

                  {/* Word Stats */}
                  {currentWord && (
                    <div className="mt-8 pt-6 border-t grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Reviews</div>
                        <div className="text-lg font-bold">{currentWord.reviews}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Streak</div>
                        <div className="text-lg font-bold text-blue-600">{currentWord.streak}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Status</div>
                        <div className={`text-lg font-bold ${
                          currentWord.isLearned ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {currentWord.isLearned ? 'Learned' : 'Learning'}
                        </div>
                      </div>
                      {/* Difficulty removed */}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No words found</h3>
                <p className="text-gray-600 mb-6">Try changing your filters or search term</p>
                <button
                  onClick={() => {
                    setSelectedLevel('N5');
                    setSearchTerm('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}

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
      `}</style>
    </div>
  );
};

export default VocabularyBuilder;