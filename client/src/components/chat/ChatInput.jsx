import React, { useState } from 'react';
import { Send, Sparkles, Trash2, PlusCircle } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function ChatInput({ onSendMessage, isLoading, onClearChat, onNewChat }) {
  const { language, t } = useLanguage();
  const [text, setText] = useState('');

  const suggestions = {
    English: [
      "What is a deductible?",
      "Calculate EMI for ₹2,00,000 for 36 months",
      "Explain APR and processing fee",
      "Compare SBI and HDFC loans"
    ],
    Hindi: [
      "Deductible kya hota hai?",
      "₹2,00,000 के लिए 36 महीने की EMI बताओ",
      "APR का मतलब समझाइए",
      "हेल्थ इंश्योरेंस प्लान दिखाइए"
    ],
    Hinglish: [
      "Deductible simple language mein samjhao.",
      "₹2,00,000 ka 36 months ke liye EMI calculate karo",
      "APR aur processing fee mein kya farak hai?",
      "SBI vs HDFC loan compare karo"
    ]
  };

  const currentSuggestions = suggestions[language] || suggestions.English;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 flex items-center gap-1 shrink-0 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Suggestions:</span>
        </span>
        {currentSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(item)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-400 shadow-xs transition-colors text-left"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              language === 'Hindi'
                ? 'विट्टारा एआई से कोई भी वित्तीय सवाल पूछें...'
                : language === 'Hinglish'
                ? 'Vittara AI se koi bhi financial sawaal poochiye...'
                : 'Ask Vittara AI anything about loans, EMI, terms, or insurance...'
            }
            disabled={isLoading}
            className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 pr-12 transition-all outline-none shadow-xs"
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons: New Chat and Clear */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNewChat}
            disabled={isLoading}
            title={t.actions.newChat}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-slate-300 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClearChat}
            disabled={isLoading}
            title={t.actions.clearChat}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-slate-300 shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
