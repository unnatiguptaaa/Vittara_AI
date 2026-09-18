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
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { apiService } from '../../api/client';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
                <span className="font-extrabold text-white text-lg">
                  V
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    {t.brandName}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Controls: Language Selector & API Key Settings */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Language Selector */}
              <div className="flex items-center bg-slate-100/90 border border-slate-200 rounded-xl p-0.5">
                <Globe className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
                {['English', 'Hindi', 'Hinglish'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                      language === lang
                        ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'Hindi' ? 'हिंदी' : lang}
                  </button>
                ))}
              </div>

              {/* Settings / API Key Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 hover:border-slate-300 shadow-xs transition-colors"
                title="AI Settings & API Key"
              >
                <Key className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 animate-fadeIn shadow-lg">
            {/* Language Switcher Mobile */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Language:</span>
              <div className="flex items-center gap-1">
                {['English', 'Hindi', 'Hinglish'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      language === lang
                        ? 'bg-emerald-600 text-white font-semibold'
                        : 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {lang === 'Hindi' ? 'हिंदी' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Vittara AI — System & Key Settings"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Backend Connection Status</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">API Server: </span>
                <span className={backendHealth?.status === 'healthy' ? 'text-emerald-600 font-semibold' : 'text-rose-600'}>
                  {backendHealth?.status || 'Connecting...'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Database: </span>
                <span className="text-emerald-600 font-semibold">
                  {backendHealth?.database?.mode || 'Active'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">AI Model: </span>
                <span className="text-slate-800">Gemini 3.8 Flash</span>
              </div>
              <div>
                <span className="text-slate-500">Key Source: </span>
                <span className="text-slate-800">
                  {apiKeyInput ? 'Custom Session Key' : backendHealth?.ai?.serverKeyConfigured ? 'Server .env' : 'Deterministic Mode'}
                </span>
              </div>
            </div>
          </div>

          {/* MongoDB Connection */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-semibold uppercase text-slate-500">MongoDB Database Configuration</h4>
            <Input
              label="MongoDB Connection URI"
              type="text"
              value={mongoUriInput}
              onChange={(e) => setMongoUriInput(e.target.value)}
              placeholder="mongodb+srv://user:pass@cluster.mongodb.net/vittara_ai"
              helperText="Connect to your local MongoDB (mongodb://localhost:27017/vittara_ai) or MongoDB Atlas cloud cluster."
            />

            {mongoStatusMsg && (
              <p className="text-xs text-emerald-400 font-medium">{mongoStatusMsg}</p>
            )}

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={handleConnectMongo}
                isLoading={isConnectingMongo}
              >
                Connect & Reseed MongoDB
              </Button>
            </div>
          </div>

          <div>
            <Input
              label="Google Gemini API Key (Optional)"
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              helperText="Add your Gemini API Key for live multimodal reasoning. If left empty, the server automatically runs deterministic financial intelligence."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setApiKeyInput('');
                localStorage.removeItem('vittara_gemini_key');
              }}
            >
              Clear Saved Key
            </Button>
            <Button
              size="sm"
              onClick={handleSaveKey}
              icon={isSaved ? CheckCircle2 : Key}
            >
              {isSaved ? 'Key Saved!' : t.actions.saveKey}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
