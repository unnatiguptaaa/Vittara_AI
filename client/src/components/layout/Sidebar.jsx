import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Sparkles,
  Home,
  Bot,
  BadgePercent,
  Scale,
  ShieldCheck,
  BookOpen,
  FileText,
  Key,
  Globe,
  ReceiptText,
  Menu,
  X,
  Sun,
  Moon,
  Database,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { apiService } from '../../api/client';

export default function Sidebar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [mongoUriInput, setMongoUriInput] = useState('');
  const [isConnectingMongo, setIsConnectingMongo] = useState(false);
  const [mongoStatusMsg, setMongoStatusMsg] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('vittara_gemini_key') || '';
    const savedMongo = localStorage.getItem('vittara_mongo_uri') || 'mongodb://127.0.0.1:27017/vittara_ai';
    setApiKeyInput(savedKey);
    setMongoUriInput(savedMongo);

    refreshHealth();
  }, []);

  const refreshHealth = () => {
    apiService.getHealth()
      .then(res => setBackendHealth(res.data))
      .catch(() => setBackendHealth({ status: 'offline' }));
  };

  const handleConnectMongo = async () => {
    if (!mongoUriInput.trim()) return;
    setIsConnectingMongo(true);
    setMongoStatusMsg(null);
    try {
      const res = await apiService.updateDatabaseConfig(mongoUriInput.trim());
      localStorage.setItem('vittara_mongo_uri', mongoUriInput.trim());
      setMongoStatusMsg(res.data?.message || 'Connected to MongoDB!');
      refreshHealth();
    } catch (err) {
      setMongoStatusMsg(err.response?.data?.error || 'Failed to connect to MongoDB.');
    } finally {
      setIsConnectingMongo(false);
    }
  };

  const handleSaveKey = () => {
    localStorage.setItem('vittara_gemini_key', apiKeyInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const navLinks = [
    { to: '/', label: t.nav.home || 'Home', icon: Home },
    { to: '/chat', label: t.nav.chat, icon: Bot },
    { to: '/loans', label: t.nav.loans, icon: BadgePercent },
    { to: '/calculator', label: t.nav.calculator, icon: Sparkles },
    { to: '/compare', label: t.nav.compare, icon: Scale },
    { to: '/insurance', label: t.nav.insurance, icon: ShieldCheck },
    { to: '/terms', label: t.nav.terms, icon: BookOpen },
    { to: '/documents', label: t.nav.documents, icon: FileText },
    { to: '/summary', label: t.nav.summary, icon: ReceiptText },
  ];

  const isBright = theme === 'bright';

  return (
    <>
      {/* Mobile backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-all duration-300 theme-transition ${
          isBright
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-black border-zinc-850'
        } backdrop-blur-xl ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-hidden`}
      >
        {/* Right Edge Laser Glow Beam (Animated Cyberpunk/Fintech Accent) */}
        <div className="absolute top-0 right-0 w-[1.5px] h-40 pointer-events-none overflow-hidden z-20">
          <div className={`w-full h-full animate-vertical-beam ${
            isBright 
              ? 'bg-gradient-to-b from-transparent via-[#00BAF2] to-transparent shadow-[0_0_8px_#00BAF2]' 
              : 'bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(0,174,239,0.9)]'
          }`} />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className={`relative px-5 pt-6 pb-4 border-b overflow-hidden ${isBright ? 'border-slate-200' : 'border-zinc-850'}`}>
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)} 
            className="relative flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded-xl p-1 transition-transform duration-300"
          >
            {/* Holographic Glowing App Icon */}
            <div className="relative group/icon">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-40 blur-sm group-hover/icon:opacity-80 transition duration-500 group-hover/icon:scale-110 group-hover:animate-pulse" />
              <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${isBright ? 'from-[#00BAF2] to-[#006699]' : 'from-cyan-400 via-cyan-500 to-blue-600'} p-0.5 shadow-sm group-hover:scale-105 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(0,174,239,0.6)] transition-all duration-300 flex items-center justify-center border ${isBright ? 'border-[#00BAF2]/40' : 'border-cyan-300/40'}`}>
                <span className="font-black text-white text-base tracking-tight drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                  V
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-base font-extrabold tracking-tight transition-all duration-300 ${isBright ? 'text-[#002970] group-hover:text-[#00BAF2]' : 'text-white group-hover:text-cyan-300'}`}>
                  {t.brandName}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold transition-all duration-300 ${isBright ? 'bg-sky-100 text-[#0088CC] border border-sky-300/60' : 'bg-zinc-900 text-cyan-300 border border-cyan-500/40 group-hover:shadow-[0_0_10px_rgba(0,174,239,0.4)]'}`}>
                  AI
                </span>
              </div>
              <p className={`text-[10px] transition-colors duration-300 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                {t.tagline}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 bg-transparent">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-250 ease-out overflow-hidden ${
                  isActive
                    ? isBright
                      ? 'bg-[#EBF7FF] text-[#0088CC] border-l-4 border-l-[#0088CC] border-y border-r border-[#BCE4FB] shadow-xs font-semibold translate-x-1'
                      : 'bg-zinc-900/90 text-cyan-300 border-l-4 border-l-cyan-400 border-y border-r border-cyan-500/30 shadow-[0_0_20px_rgba(0,174,239,0.2)] font-semibold translate-x-1'
                    : isBright
                      ? 'text-slate-700 hover:text-[#002970] hover:bg-slate-100/80 hover:translate-x-1'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/70 hover:translate-x-1 hover:border-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Subtle Light Sweep Reflection On Hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Icon Tile with Micro-Spring Animation */}
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-115 group-hover:rotate-6 ${
                    isActive
                      ? isBright
                        ? 'bg-[#0088CC] text-white shadow-xs'
                        : 'bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-[0_0_12px_rgba(0,174,239,0.6)]'
                      : isBright
                        ? 'bg-slate-100 text-slate-500 group-hover:bg-[#EBF7FF] group-hover:text-[#0088CC] group-hover:shadow-xs'
                        : 'bg-zinc-900/80 text-zinc-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:shadow-[0_0_10px_rgba(0,174,239,0.3)]'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  
                  {/* Label */}
                  <span className="flex-1 truncate transition-transform duration-200 group-hover:translate-x-0.5">
                    {label}
                  </span>

                  {/* Active Indicator Pulse Dot */}
                  {isActive && (
                    <span className="relative flex h-2 w-2 shrink-0 mr-0.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBright ? 'bg-sky-400' : 'bg-cyan-400'}`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isBright ? 'bg-sky-600' : 'bg-cyan-400 shadow-[0_0_8px_rgba(0,174,239,0.8)]'}`} />
                    </span>
                  )}

                  {/* Sliding Hover Chevron */}
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out shrink-0 ${
                    isBright ? 'text-[#0088CC]' : 'text-cyan-400'
                  }`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Controls */}
        <div className={`px-4 py-4 border-t space-y-3 bg-black ${isBright ? 'bg-white border-slate-200' : 'border-zinc-850'}`}>
          {/* Theme Toggle Button with Physics Spring Animation */}
          <div
            onClick={toggleTheme}
            className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer border transition-all duration-300 select-none active:scale-98 ${
              isBright
                ? 'bg-[#F4F8FC] border-slate-200 hover:border-sky-300 hover:shadow-sm'
                : 'bg-black border-zinc-800 hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(0,174,239,0.2)]'
            }`}
            title="Toggle between Paytm Bright theme and Whatin Dark theme"
          >
            <span className={`text-xs font-semibold flex items-center gap-2 transition-colors ${isBright ? 'text-slate-700' : 'text-zinc-300 group-hover:text-cyan-300'}`}>
              {isBright ? (
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20 group-hover:rotate-90 group-hover:scale-115 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400 fill-cyan-400/20 group-hover:-rotate-12 group-hover:scale-115 group-hover:text-cyan-300 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(0,174,239,0.5)]" />
              )}
              <span>{isBright ? 'Bright (Paytm)' : 'Dark (Whatin)'}</span>
            </span>
            <div
              className={`w-11 h-6 rounded-full p-0.5 relative border transition-colors duration-300 ${
                isBright ? 'bg-sky-100 border-sky-300' : 'bg-zinc-900 border-zinc-700 group-hover:border-cyan-500/50'
              }`}
            >
              <span
                style={{ transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                className={`absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                  isBright
                    ? 'left-[22px] bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                    : 'left-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(0,174,239,0.7)]'
                }`}
              >
                {isBright ? (
                  <Sun className="w-3 h-3 text-white animate-spin-slow" />
                ) : (
                  <Moon className="w-3 h-3 text-white" />
                )}
              </span>
            </div>
          </div>

          {/* Language Selector with Spinning Globe */}
          <div className={`group flex items-center border rounded-xl p-0.5 text-xs transition-all duration-200 ${isBright ? 'bg-[#F4F8FC] border-slate-200' : 'bg-black border-zinc-800 hover:border-zinc-700'}`}>
            <Globe className={`w-3.5 h-3.5 ml-2 mr-1 shrink-0 transition-transform duration-700 ease-in-out group-hover:rotate-180 ${isBright ? 'text-slate-500' : 'text-cyan-400'}`} />
            {['English', 'Hindi', 'Hinglish'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 flex-1 active:scale-95 ${
                  language === lang
                    ? isBright
                      ? 'bg-white text-[#0088CC] shadow-xs font-bold border border-slate-200/80 scale-102'
                      : 'bg-zinc-800 text-cyan-300 shadow-sm font-semibold border border-cyan-500/30 scale-102'
                    : isBright
                      ? 'text-slate-600 hover:text-[#002970]'
                      : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lang === 'Hindi' ? 'हिंदी' : lang}
              </button>
            ))}
          </div>

          {/* Settings / API Key Button with Rotating Key */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`group w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 active:scale-98 ${
              isBright
                ? 'border-slate-200 bg-[#F4F8FC] text-slate-700 hover:text-[#0088CC] hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-xs'
                : 'border-zinc-800 bg-black text-zinc-400 hover:text-white hover:border-cyan-500/40 hover:shadow-[0_0_18px_rgba(0,174,239,0.2)]'
            }`}
            title="AI Settings & Connection"
          >
            <Key className="w-4 h-4 transition-transform duration-300 ease-out group-hover:rotate-45 group-hover:scale-120 group-hover:text-cyan-400" />
            <span className="text-xs font-medium">AI Settings & Connection</span>
          </button>
        </div>
      </aside>

      {/* Mobile hamburger with smooth animated icon */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-4 left-4 z-[60] lg:hidden p-2.5 rounded-xl border transition-all duration-300 shadow-md theme-transition active:scale-90 ${
          isBright
            ? 'border-slate-200 bg-white/95 text-[#002970] shadow-sm'
            : 'border-slate-800 bg-midnight-900/90 text-slate-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
        } backdrop-blur-xl ${
          isMenuOpen ? 'opacity-0 pointer-events-none' : ''
        }`}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 transition-transform duration-300" />
      </button>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="AI Engine & Database Connection"
      >
        <div className="space-y-5">
          {/* Connection status indicator */}
          <div className="p-3.5 rounded-xl bg-midnight-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">System Connection:</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {backendHealth?.status === 'ok' ? 'Backend Online' : 'Active / Ready'}
            </span>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300 block">
              Google Gemini API Key
            </label>
            <Input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste your Gemini API key here..."
              helperText="Enables live Google Gemini 3.8 Flash responses for all financial queries."
            />
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveKey}
              className="w-full"
            >
              {isSaved ? 'API Key Saved!' : 'Save Key'}
            </Button>
          </div>

          {/* MongoDB Connection */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-300 block">
              MongoDB URI
            </label>
            <Input
              type="text"
              value={mongoUriInput}
              onChange={(e) => setMongoUriInput(e.target.value)}
              placeholder="mongodb://127.0.0.1:27017/vittara_ai"
              helperText="Connects to bank products, insurance policies, and user journey databases."
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleConnectMongo}
              isLoading={isConnectingMongo}
              icon={Database}
              className="w-full"
            >
              Update Database URI
            </Button>

            {mongoStatusMsg && (
              <p className="text-xs text-emerald-400 mt-1">
                {mongoStatusMsg}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}