// pages/Home.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Volume2, 
  Award, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Play, 
  Layers,
  Settings,
  BarChart3,
  Sparkles,
  Target,
  Zap,
  Clock,
  Star,
  TrophyIcon,
  GraduationCap
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const learningFeatures = [
    {
      title: "Hiragana Mastery",
      description: "Master all 46 basic hiragana characters with interactive lessons",
      icon: <span className="text-4xl font-bold text-red-600">あ</span>,
      link: "/hiragana",
      color: "bg-red-50 hover:bg-red-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning"
    },
    {
      title: "Katakana Training",
      description: "Learn katakana used for foreign words and technical terms",
      icon: <span className="text-4xl font-bold text-blue-600">ア</span>,
      link: "/katakana",
      color: "bg-blue-50 hover:bg-blue-100",
      stats: "46 Characters",
      status: "available",
      buttonText: "Start Learning"
    },
    {
      title: "Kana Quiz Challenge",
      description: "Test your knowledge like Tofugu's Kana Quiz with customizable options",
      icon: <Target className="w-10 h-10 text-purple-600" />,
      link: "/kana-quiz",
      color: "bg-purple-50 hover:bg-purple-100",
      stats: "3 Quiz Modes",
      status: "available",
      buttonText: "Take Quiz"
    },
    {
      title: "Kanji Learning",
      description: "Start with N5 level kanji and build your way up to advanced characters",
      icon: <span className="text-4xl font-bold text-amber-600">漢</span>,
      link: "/kanji",
      color: "bg-amber-50 hover:bg-amber-100",
      stats: "2,136 Kanji",
      status: "available",
      buttonText: "Start Kanji"
    },
    {
      title: "Vocabulary Builder",
      description: "Expand your vocabulary with themed word lists and quizzes",
      icon: <Brain className="w-10 h-10 text-purple-600" />,
      link: "/vocabulary",
      color: "bg-purple-50 hover:bg-purple-100",
      stats: "5,000+ Words",
      status: "available",
      buttonText: "Build Vocabulary"
    },
    {
      title: "Grammar Lessons",
      description: "Master Japanese sentence structure and common patterns",
      icon: <BookOpen className="w-10 h-10 text-blue-600" />,
      link: "/grammar",
      color: "bg-blue-50 hover:bg-blue-100",
      stats: "50+ Lessons",
      status: "available",
      buttonText: "Learn Grammar"
    },
    // In Home.tsx, add to learningFeatures array
{
  title: "Learning Hub",
  japaneseTitle: "学習センター",
  description: "Access all learning modules: Kanji, Grammar, Vocabulary, Stories and more",
  icon: <GraduationCap className="w-10 h-10 text-indigo-600" />,
  link: "/learn",
  color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
  stats: "6 Modules",
  status: "available",
  buttonText: "Explore All",
  progress: null
}
  ];

  const quizFeatures = [
    {
      title: "Customizable Quiz",
      description: "Choose specific rows, dakuten, combos, and difficulty",
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Multiple Modes",
      description: "Reading, Writing, and Listening quiz modes",
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Instant Feedback",
      description: "Get immediate results with correct answers shown",
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Time Tracking",
      description: "Race against the clock to improve your speed",
      icon: <Clock className="w-6 h-6 text-red-600" />,
      color: "text-red-600 bg-red-50"
    }
  ];

  const comingSoonFeatures = [
    {
      title: "Kanji Journey",
      description: "Start with N5 level kanji and build your way up",
      icon: <span className="text-3xl font-bold text-amber-600">漢</span>,
      stats: "Coming Soon"
    },
    {
      title: "Grammar Lessons",
      description: "Learn sentence structure and common patterns",
      icon: <BookOpen className="w-10 h-10 text-cyan-600" />,
      stats: "Coming Soon"
    },
    {
      title: "Speaking Practice",
      description: "Pronunciation training with voice recognition",
      icon: <Volume2 className="w-10 h-10 text-pink-600" />,
      stats: "Coming Soon"
    }
  ];

  const stats = [
    { 
      label: "Active Learners", 
      value: "1,847", 
      icon: Users,
      color: "text-blue-600 bg-blue-50"
    },
    { 
      label: "Characters Mastered", 
      value: `${getLearnedCount()}/92`, 
      icon: CheckCircle,
      color: "text-green-600 bg-green-50"
    },
    { 
      label: "Average Success Rate", 
      value: "94%", 
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50"
    },
    { 
      label: "Quizzes Completed", 
      value: getQuizCount(), 
      icon: Target,
      color: "text-red-600 bg-red-50"
    }
  ];

  // Add a type for quickActions to include 'badge'
type QuickAction = {
  title: string;
  description: string;
  action: () => void | Promise<void>;
  color: string;
  icon: React.ElementType;
  badge?: string;
};

  const quickActions: QuickAction[] = [
    {
      title: "Kana Quiz",
      description: "Test your knowledge with customizable quiz",
      action: () => navigate("/kana-quiz"),
      color: "from-purple-500 to-pink-500",
      icon: Target
      // badge: "NEW", // Example: add badge if needed
    },
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      action: () => {
        const lastPage = localStorage.getItem("lastVisitedPage") || "/hiragana";
        navigate(lastPage);
      },
      color: "from-red-500 to-orange-500",
      icon: Play
    },
    {
      title: "Daily Review",
      description: "Review due flashcards",
      action: () => navigate("/flashcards?mode=review"),
      color: "from-blue-500 to-cyan-500",
      icon: Brain
    }
  ];

  // Check user progress from localStorage
  function getLearnedCount() {
    let count = 0;
    // Check hiragana
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('hiragana_') && localStorage.getItem(key) === 'true') {
        count++;
      }
    }
    // Check katakana
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('katakana_') && localStorage.getItem(key) === 'true') {
        count++;
      }
    }
    return count;
  }

  function getQuizCount() {
    const results = JSON.parse(localStorage.getItem('kanaQuizResults') || '[]');
    return results.length;
  }

  const learnedCount = getLearnedCount();
  const totalCount = 92; // 46 hiragana + 46 katakana
  const progressPercent = Math.round((learnedCount / totalCount) * 100);

  // Get recent quiz results
  function getRecentQuizResult() {
    const results = JSON.parse(localStorage.getItem('kanaQuizResults') || '[]');
    if (results.length > 0) {
      const latest = results[results.length - 1];
      return {
        score: latest.score,
        total: latest.total,
        accuracy: latest.accuracy,
        date: new Date(latest.date).toLocaleDateString()
      };
    }
    return null;
  }

  const recentQuiz = getRecentQuizResult();

  // Unsplash API dynamic image logic
  const [unsplashUrl, setUnsplashUrl] = useState<string>("");
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=japan&orientation=landscape&client_id=${accessKey}`
        );
        const data = await response.json();
        if (data && data.urls && data.urls.full) {
          const url = data.urls.full + "&w=1920&q=80&auto=format";
          setUnsplashUrl(url);
          localStorage.setItem('heroImageUrl', url);
          localStorage.setItem('heroImageTimestamp', Date.now().toString());
        } else {
          setUnsplashUrl("");
        }
      } catch (e) {
        setUnsplashUrl("");
      }
    };

    const now = Date.now();
    const lastTimestamp = parseInt(localStorage.getItem('heroImageTimestamp') || '0', 10);
    const lastUrl = localStorage.getItem('heroImageUrl') || '';
    // 15 minutes = 900000 ms
    if (lastUrl && lastTimestamp && now - lastTimestamp < 900000) {
      setUnsplashUrl(lastUrl);
    } else {
      fetchImage();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden text-white">
        {/* Unsplash Japan image as background (rotates every 15 min) */}
        <img
          src={unsplashUrl || "/su-san-lee-E_eWwM29wfU-unsplash.jpg"}
          alt="Japan background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          onError={e => {
            const target = e.currentTarget;
            if (target.src !== '/su-san-lee-E_eWwM29wfU-unsplash.jpg') {
              target.src = '/su-san-lee-E_eWwM29wfU-unsplash.jpg';
            }
          }}
        />
        {/* Semi-transparent dark overlay for text readability */}
        <div className="absolute inset-0 bg-white/30 z-10 pointer-events-none border border-white/40" />
        <div className="relative max-w-3xl mx-auto px-6 pt-24 pb-20" style={{ position: 'relative', zIndex: 20 }}>
          <div className="text-center">
            <div className="flex flex-col items-center mb-6 gap-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Kanji and Vocabulary are added !</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-4 h-4" />
                <span className="text-sm">Use Login To Save Progress!</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-white drop-shadow-lg">
              Nihongo Space
              <br />
              <span className="text-yellow-300">Your Japanese Learning Hub</span>
            </h1>
            <p className="text-lg mb-12 opacity-90 max-w-xl mx-auto text-white/90">
              Learn Hiragana, Katakana, and more through interactive lessons, 
              smart flashcards, and the ultimate Kana Quiz experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate("/kana-quiz")}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:-translate-y-1 shadow-lg"
              >
                <Target className="w-5 h-5" />
                Try Kana Quiz
              </button>
              <button
                onClick={() => navigate("/flashcards")}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Start Learning
              </button>
            </div>

            {/* Progress Bar for Returning Users */}
            {learnedCount > 0 && (
              <div className="mt-12 max-w-md mx-auto bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-xl">
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    Your Progress
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm mt-2">
                  {learnedCount} of {totalCount} characters learned
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`bg-white/60 backdrop-blur-2xl border border-white/60 text-gray-900 rounded-3xl p-8 text-left shadow-xl hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-300 transform hover:-translate-y-2 relative`}
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  {action.badge}
                </span>
              )}
              <div className="flex items-center justify-between mb-4">
                {/* FIX: instantiate icon as a component */}
                {React.createElement(action.icon, { className: "w-8 h-8" })}
                <ArrowRight className="w-5 h-5 opacity-75" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 drop-shadow-sm">{action.title}</h3>
              <p className="text-gray-800 text-sm drop-shadow-sm">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Quiz Result */}
      {recentQuiz && (
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-green-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  Your Last Quiz Result
                </h3>
                <p className="text-gray-600">Completed on {recentQuiz.date}</p>
              </div>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {recentQuiz.score}/{recentQuiz.total}
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {recentQuiz.accuracy}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
              <button
                onClick={() => navigate("/kana-quiz")}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
          {stats.map((stat, index) => (
            <div key={index} className="relative flex flex-col items-center justify-center w-44 h-44 bg-white/40 backdrop-blur-2xl rounded-full shadow-2xl border-4 border-transparent group transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-blue-300/60 before:via-pink-200/40 before:to-purple-200/60 before:animate-spin-slow before:z-0 hover:before:blur-[2px] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.22)]">
              <div className="absolute inset-2 rounded-full bg-white/30 backdrop-blur-2xl border-2 border-white/60 z-10" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-400/70 via-pink-300/60 to-purple-400/70 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl border-2 border-white/80 z-20 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-2xl transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white drop-shadow" />
              </div>
              <div className="flex flex-col items-center justify-center h-full pt-10 z-20">
                <div className="text-4xl font-extrabold mb-1 text-gray-900 drop-shadow-sm">{stat.value}</div>
                <div className="text-base font-semibold text-gray-700 text-center opacity-90 px-2 tracking-wide">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Learning Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to master Japanese characters, built with modern learning science.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {learningFeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.link)}
              className="flex flex-row items-center bg-gradient-to-r from-white/60 via-blue-100/40 to-pink-100/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 md:p-8 cursor-pointer group transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200/60 mb-2"
            >
              <div className="flex-shrink-0 w-20 h-20 bg-white/70 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-lg border-2 border-white/80 mr-6 group-hover:scale-105 transition-transform duration-300">
                {feature.icon}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1 drop-shadow-sm">{feature.title}</h3>
                <p className="text-gray-700 text-base mb-3 opacity-90">{feature.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-semibold text-blue-700 bg-white/80 rounded-full px-4 py-1 shadow-sm border border-blue-200/40">
                    {feature.stats}
                  </span>
                  <button className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 hover:gap-2 transition-all">
                    {feature.buttonText} <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Kana Quiz Highlight - Glassmorphic Enhanced */}
      <div className="relative py-20 mx-2">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full animate-gradient-move bg-gradient-to-br from-purple-200/40 via-pink-200/30 to-blue-200/40 blur-2xl opacity-80 rounded-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Info Card */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Floating Glass Badge */}
                <div className="absolute -top-8 left-0 flex items-center gap-2 bg-white/80 backdrop-blur-xl px-5 py-2 rounded-full shadow-lg border border-white/70">
                  <Target className="w-5 h-5 text-purple-600 animate-pulse" />
                  <span className="text-sm font-semibold text-purple-700 tracking-wide">NEW FEATURE</span>
                </div>
                <div className="bg-white/60 backdrop-blur-2xl border border-white/70 rounded-3xl shadow-2xl p-10 pt-16">
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">
                    Ultimate Kana Quiz Challenge
                  </h2>
                  <p className="text-gray-700 mb-8 text-lg font-medium">
                    Inspired by Tofugu's Kana Quiz, our advanced quiz system lets you test your 
                    knowledge with customizable settings, multiple modes, and detailed analytics.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {quizFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${feature.color} bg-white/70 backdrop-blur-md shadow border border-white/40`}> 
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate("/kana-quiz")}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      <Target className="w-5 h-5" />
                      Start Quiz Challenge
                    </button>
                    <button
                      onClick={() => navigate("/flashcards")}
                      className="inline-flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition"
                    >
                      <Brain className="w-5 h-5" />
                      Practice First
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Quiz Preview Card */}
            <div className="lg:w-1/2">
              <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl p-10 border border-white/60 relative overflow-hidden">
                {/* Subtle floating gradient blob */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-300/40 via-pink-300/30 to-blue-300/40 rounded-full blur-2xl opacity-60 animate-float" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Quiz Preview</h3>
                    <p className="text-gray-600">Try a sample question</p>
                  </div>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-6xl font-bold text-gray-900 mb-4">あ</div>
                    <p className="text-lg font-medium text-gray-700">What is the romaji for this character?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">a</span>
                    </button>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">i</span>
                    </button>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">u</span>
                    </button>
                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition">
                      <span className="font-mono text-lg">e</span>
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                      Real quiz includes dakuten, combos, and timing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Coming Soon Features - Minimal Glass Card Stack */}
      <div className="py-20 bg-gradient-to-b from-white/80 to-blue-50/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-700 max-w-2xl mx-auto font-medium">
              Exciting new features to help you become fluent in Japanese.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {comingSoonFeatures.map((feature, index) => (
              <div key={index} className="flex-1 min-w-[260px] max-w-sm mx-auto bg-white/60 backdrop-blur-xl border border-white/70 rounded-2xl shadow-xl flex flex-col items-center p-8 relative overflow-hidden group transition-all hover:scale-105">
                {/* Accent Bar */}
                <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400 opacity-60 rounded-l-2xl group-hover:opacity-80 transition-all" />
                {/* Floating Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-gradient-to-br from-purple-200/70 to-pink-200/70 shadow-lg border border-white/60 z-10">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 z-10">{feature.title}</h3>
                <p className="text-gray-700 mb-4 text-center z-10">{feature.description}</p>
                <div className="mt-auto z-10">
                  <span className="text-xs font-medium text-purple-700 px-3 py-1 bg-white/80 border border-purple-100 rounded-full shadow-sm">
                    {feature.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Learn Smart, Not Hard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-10 bg-white/60 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <div className="w-24 h-24 bg-gradient-to-br from-white/70 to-blue-100/60 backdrop-blur-2xl border border-white/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <BookOpen className="w-10 h-10 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Learn with Flashcards</h3>
            <p className="text-gray-600">
              Master characters with spaced repetition and smart review scheduling
            </p>
          </div>
          <div className="text-center p-8 bg-white/40 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl">
            <div className="w-20 h-20 bg-white/60 backdrop-blur-lg border border-white/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Test with Quizzes</h3>
            <p className="text-gray-600">
              Challenge yourself with customizable quizzes and track your progress
            </p>
          </div>
          <div className="text-center p-8 bg-white/40 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl">
            <div className="w-20 h-20 bg-white/60 backdrop-blur-lg border border-white/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-gray-900" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">See Your Growth</h3>
            <p className="text-gray-600">
              Watch your skills improve with detailed analytics and progress tracking
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl py-20 mx-2 mt-16 transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Master Japanese?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are mastering Japanese with our complete platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/kana-quiz")}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105"
            >
              <Target className="w-5 h-5" />
              Start with Quiz
            </button>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl"
            >
              <Sparkles className="w-5 h-5" />
              Create Free Account
            </button>
          </div>
          <p className="text-sm opacity-75 mt-6">No credit card required • Start learning in seconds</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/60 backdrop-blur-2xl border-white/60 rounded-3xl shadow-2xl py-16 mt-16 mx-2 transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                日本語 Master
              </div>
              <p className="text-gray-500 text-sm">Learn Japanese the Smart Way</p>
            </div>
            <div className="flex gap-6">
              <button onClick={() => navigate("/about")} className="text-gray-600 hover:text-gray-900">
                About
              </button>
              <button onClick={() => navigate("/contact")} className="text-gray-600 hover:text-gray-900">
                Contact
              </button>
              <button onClick={() => navigate("/privacy")} className="text-gray-600 hover:text-gray-900">
                Privacy
              </button>
              <button onClick={() => navigate("/terms")} className="text-gray-600 hover:text-gray-900">
                Terms
              </button>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Nihongo Space • 一緒に学びましょう！ (Let's learn together!)</p>
            <p className="mt-2">🇯🇵 Made with ❤️ for Japanese learners worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;