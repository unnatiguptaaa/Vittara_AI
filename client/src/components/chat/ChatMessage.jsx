import React from 'react';
import { Bot, User, Sparkles, CheckCircle2, Wrench } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  // Helper to render markdown-like content safely
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-emerald-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-emerald-200 mt-3 mb-1.5">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-extrabold text-ivory mt-3 mb-2">{line.replace('# ', '')}</h2>;
      }

      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-sm my-0.5">
            {formatInlineText(text)}
          </li>
        );
      }

      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-sm text-ivory-muted leading-relaxed my-1">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (text) => {
    const parts = [];
    // Bold matching **bold**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-emerald-300">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
          isUser
            ? 'bg-emerald-600 text-white rounded-tr-none shadow-fintech-md'
            : 'bg-midnight-800/80 border border-slate-700 text-ivory rounded-tl-none shadow-fintech-sm'
        }`}
      >
        {/* Tool badges if executed */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5 pb-2 border-b border-slate-700/80">
            {message.toolCalls.map((tool, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-500/40"
              >
                <Wrench className="w-3 h-3" />
                <span>Tool: {tool}()</span>
              </span>
            ))}
          </div>
        )}

        <div className="space-y-1">
          {renderFormattedContent(message.content)}
        </div>

        {/* Source metadata tag */}
        {!isUser && message.source && (
          <div className="mt-2.5 pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-ivory-dark">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{message.source === 'gemini-3.8-flash' ? 'Google Gemini 3.8 Flash' : 'Vittara AI Engine'}</span>
            </span>
            {message.warning && <span className="text-amber-400 font-medium">{message.warning}</span>}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-white shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
