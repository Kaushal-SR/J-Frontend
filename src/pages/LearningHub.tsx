// pages/LearningHub.tsx
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Languages, 
  MessageSquare, 
  BookText, 
  Users,
  Brain,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Star,
  Target
} from "lucide-react";

const LearningHub = () => {
  const navigate = useNavigate();

  const learningModules = [
    {
      title: "Smart Flashcards",
      japanese: "スマートフラッシュカード",
      description: "Master kana and vocabulary with spaced repetition flashcards.",
      icon: <Sparkles className="w-10 h-10 text-yellow-500" />, 
      path: "/flashcards",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
      level: "All Levels",
      status: "available",
      stats: "Kana & Vocab"
    },
    {
      title: "Progress Tracking",
      japanese: "進捗トラッキング",
      description: "Track your learning progress, streaks, and achievements.",
      icon: <Star className="w-10 h-10 text-blue-500" />, 
      path: "/progress",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      level: "All Levels",
      status: "available",
      stats: "Stats & Streaks"
    },
    {
      title: "Audio Pronunciation",
      japanese: "発音練習",
      description: "Practice and compare your Japanese pronunciation with audio feedback.",
      icon: <BookOpen className="w-10 h-10 text-green-600" />, 
      path: "/pronunciation",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      level: "All Levels",
      status: "available",
      stats: "Voice Practice"
    },
    {
      title: "Grammar Lessons",
      japanese: "文法レッスン",
      description: "Master Japanese sentence structure and common patterns",
      icon: <BookOpen className="w-10 h-10 text-blue-600" />, 
      path: "/grammar",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      level: "All Levels",
      status: "available",
      stats: "50+ Lessons"
    },
    {
      title: "Daily Conversation",
      japanese: "日常会話",
      description: "Practice real-life conversations with audio and transcripts",
      icon: <MessageSquare className="w-10 h-10 text-green-600" />, 
      path: "/daily-conversation",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      level: "Beginner → Intermediate",
      status: "available",
      stats: "100+ Dialogues"
    },
    {
      title: "Short Stories",
      japanese: "ショートストーリー",
      description: "Read and listen to Japanese stories with vocabulary support",
      icon: <BookText className="w-10 h-10 text-pink-600" />, 
      path: "/stories",
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
      level: "Intermediate → Advanced",
      status: "available",
      stats: "25+ Stories"
    },
    {
      title: "Community",
      japanese: "コミュニティ",
      description: "Connect with other learners, share progress, and compete",
      icon: <Users className="w-10 h-10 text-cyan-600" />, 
      path: "/community",
      color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
      level: "All Learners",
      status: "available",
      stats: "Live Leaderboard"
    }
  ];

  const quickAccess = [
    {
      title: "Kana Flashcards",
      description: "Review hiragana and katakana",
      path: "/flashcards",
      icon: <Brain className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Kana Quiz",
      description: "Test your character knowledge",
      path: "/kana-quiz",
      icon: <Target className="w-5 h-5" />,
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Progress Tracker",
      description: "View your learning stats",
      path: "/progress",
      icon: <Star className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
      {/* Hero Section */}
      <div className="relative flex justify-center items-center py-20 bg-white/40 backdrop-blur-2xl border-b border-white/60 shadow-xl z-10 overflow-hidden">
        {/* Animated glassmorphic background shapes */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-300/40 via-purple-200/30 to-pink-200/40 rounded-full blur-3xl opacity-60 animate-pulse-slow z-0" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-gradient-to-br from-pink-200/40 via-blue-200/30 to-purple-200/40 rounded-full blur-3xl opacity-50 animate-pulse-slow z-0" style={{top:'60%'}} />
        <div className="w-full max-w-4xl mx-auto flex flex-row items-center gap-8 px-4 relative z-10">
          {/* Floating icon */}
          <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-blue-400/80 via-pink-300/70 to-purple-400/80 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-xl border-4 border-white/90">
            <GraduationCap className="w-12 h-12 text-white drop-shadow" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative w-full">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg mb-2">学習センター</h1>
              <span className="absolute left-0 bottom-0 w-32 h-2 bg-gradient-to-r from-blue-400/60 to-purple-400/60 rounded-full blur-sm opacity-60" />
            </div>
            <span className="inline-block mt-2 mb-4 px-6 py-2 rounded-full bg-white/60 backdrop-blur border border-blue-200/40 text-blue-700 font-bold text-lg shadow">Learning Center</span>
            <p className="text-xl opacity-90 max-w-2xl text-gray-700 font-medium">
              Your complete Japanese learning toolkit. Choose a module to start your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickAccess.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`bg-white/60 bg-gradient-to-br from-white/60 via-blue-100/40 to-pink-100/40 backdrop-blur-2xl border border-white/60 text-gray-900 rounded-3xl p-8 text-left shadow-xl hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-300 transform hover:-translate-y-2 relative`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400/70 via-pink-300/60 to-purple-400/70 shadow-lg border-2 border-white/80">{item.icon}</span>
                  <span className="text-sm opacity-90">クイックアクセス</span>
                </div>
                <ArrowRight className="w-5 h-5 opacity-75" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Learning Modules */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Modules</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive collection of Japanese learning resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {learningModules.map((module, index) => (
            <div
              key={index}
              onClick={() => navigate(module.path)}
              className="relative flex flex-col items-center justify-center bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border-2 border-transparent shadow-2xl p-14 cursor-pointer group transition-all duration-500 hover:scale-110 hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.25)] hover:border-blue-300/70 hover:z-30 overflow-hidden"
            >
              {/* Animated glow */}
              <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-0 animate-pulse-slow" style={{boxShadow:'0 0 80px 10px rgba(80,180,255,0.10), 0 0 120px 30px rgba(255,120,220,0.08)'}} />
              {/* Glass reflection overlay */}
              <div className="absolute left-0 top-0 w-full h-1/3 rounded-t-[2.5rem] bg-white/30 opacity-40 blur-lg z-10" />
              {/* Floating icon with glass ring */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-blue-400/80 via-pink-300/70 to-purple-400/80 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-2xl border-4 border-white/90 z-20 group-hover:scale-125 group-hover:-translate-y-2 group-hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.22)] transition-transform duration-300">
                {module.icon}
              </div>
              <div className="flex flex-col items-center justify-center pt-12 relative z-20">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1 drop-shadow-sm text-center">{module.title}</h3>
                <p className="text-sm text-blue-700 mb-2 text-center">{module.japanese}</p>
                <p className="text-gray-700 text-base mb-4 text-center opacity-90 px-2">{module.description}</p>
                <div className="flex items-center justify-between w-full mt-6">
                  <span className="text-xs font-semibold text-blue-700 bg-white/80 rounded-full px-4 py-1 shadow-sm border border-blue-200/40">
                    {module.stats}
                  </span>
                  <span className="text-xs font-semibold text-purple-700 bg-white/80 rounded-full px-4 py-1 shadow-sm border border-purple-200/40">
                    {module.level}
                  </span>
                  <button className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 hover:gap-2 transition-all">
                    開始する <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              {/* Vibrant floating badge */}
              <span className="absolute top-6 right-6 z-30 px-4 py-2 rounded-full bg-gradient-to-r from-blue-400/80 to-purple-400/80 text-xs font-bold text-white shadow-lg border-2 border-white/70 group-hover:scale-110 group-hover:shadow-xl transition-all">{module.status === 'available' ? 'Available' : 'Coming Soon'}</span>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">More exciting features are on the way</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Listening Comprehension", level: "Intermediate+" },
              { title: "Writing Practice", level: "All Levels" },
              { title: "JLPT Test Prep", level: "N5 → N1" }
            ].map((item, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/60 shadow-lg flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.level}</p>
                  </div>
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400/70 via-pink-300/60 to-purple-400/70 shadow-lg border-2 border-white/80"><Sparkles className="w-5 h-5 text-white" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;