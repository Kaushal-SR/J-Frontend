import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserCircle,
  Menu,
  X,
  Shield,
  LogOut,
  Home,
  BookOpen,
  Target,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { path: "/hiragana", label: "Hiragana", icon: <span className="font-bold">あ</span> },
    { path: "/katakana", label: "Katakana", icon: <span className="font-bold">ア</span> },
    { path: "/kana-quiz", label: "Kana Quiz", icon: <Target className="w-4 h-4" /> },
    { path: "/flashcards", label: "Flashcards", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-lg border-b border-white/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row h-auto md:h-16 items-stretch md:items-center justify-between w-full">
          <div className="flex flex-row items-center justify-between w-full md:w-auto">
            {/* Logo */}
            {title && <span>{title}</span>}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Nihongo Space
              </span>
            </Link>
            {/* User menu - always top right */}
            <div className="flex items-center gap-2 ml-auto md:ml-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-gray-50"
                  >
                    <UserCircle className="w-7 h-7 text-gray-600" />
                    <ChevronDown
                      className={`w-4 h-4 transition ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                      >
                        Progress
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/register"
                  className="px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-blue-500 hover:shadow-lg whitespace-nowrap border border-white/40 backdrop-blur-lg"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
          {/* Nav - always visible, responsive size and spread horizontally, no overflow */}
          <nav className="flex flex-row items-center justify-between w-full md:w-auto gap-0 md:gap-1 flex-nowrap overflow-hidden max-w-full bg-white/0 mt-1 md:mt-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`basis-0 grow shrink min-w-0 text-[11px] sm:text-xs px-0.5 sm:px-2 py-1 rounded-xl font-medium transition text-center whitespace-nowrap overflow-hidden max-w-full flex items-center justify-center
                  ${isActive(item.path)
                    ? "bg-white/60 backdrop-blur-lg border border-white/40 text-red-600 shadow"
                    : "text-gray-700 hover:bg-white/40 hover:backdrop-blur-lg hover:border hover:border-white/40 hover:text-red-600"
                  }`}
              >
                <span className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 w-full overflow-hidden">
                  {item.icon}
                  <span className="truncate w-full">{item.label}</span>
                </span>
              </Link>
            ))}

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="basis-0 grow shrink min-w-0 text-[11px] sm:text-xs px-0.5 sm:px-2 py-1 rounded-xl font-medium text-red-600 bg-white/60 backdrop-blur-lg border border-white/40 hover:bg-white/80 flex items-center justify-center gap-1 text-center whitespace-nowrap overflow-hidden max-w-full shadow"
              >
                <Shield className="w-4 h-4" />
                <span className="truncate w-full">Admin</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
