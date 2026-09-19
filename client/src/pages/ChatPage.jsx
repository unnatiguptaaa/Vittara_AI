import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, AlertCircle, RefreshCw, MessageSquare, Plus, Trash2 } from 'lucide-react';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { apiService } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useJourney } from '../context/JourneyContext';
import { useSearchParams } from 'react-router-dom';

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

export default function ChatPage() {
  const { language, t } = useLanguage();
  const { journeyData } = useJourney();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('vittara_session_id') || generateId();
  });

  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          language === 'Hindi'
            ? 'नमस्ते! मैं विट्टारा एआई (Vittara AI) हूँ, आपका व्यक्तिगत वित्तीय सहायक। आप मुझसे किसी भी वित्तीय शब्द (जैसे Deductible, APR), ईएमआई गणना या बीमा योजनाओं के बारे में पूछ सकते हैं।'
            : language === 'Hinglish'
              ? 'Namaste! Main Vittara AI hoon, aapka personal financial intelligence advisor. Aap mujhse kisi bhi financial term (jaise Deductible, APR), EMI calculation, ya loan/insurance details ke baare mein pooch sakte hain!'
              : 'Hello! I am Vittara AI, your dedicated financial intelligence advisor. Ask me to explain complex terms like Deductibles or APR, calculate loan EMIs, compare bank products, or inspect insurance policies.',
        source: 'vittara-core'
      }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const initialQueryTriggered = useRef(false);

  const [historySessions, setHistorySessions] = useState([]);

  // Fetch all sessions for history sidebar
  const fetchAllSessions = async () => {
    try {
      const res = await apiService.getAllSessions();
      if (res.data?.success) {
        setHistorySessions(res.data.sessions);
      }
    } catch (err) {
      console.error('Failed to load history sessions:', err);
    }
  };

  // Fetch specific session messages
  const loadSessionMessages = async (sid) => {
    try {
      const res = await apiService.getChatHistory(sid);
      if (res.data?.success && res.data.history?.length > 0) {
        // preserve specific format needed by UI by giving random ids if absent
        const loadedMsgs = res.data.history.map((m, i) => ({
          ...m,
          id: m.id || generateId()
        }));
        setMessages(loadedMsgs);
      } else {
        // Fallback welcome message
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am Vittara AI, your dedicated financial intelligence advisor.',
            source: 'vittara-core'
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load messages for session:', err);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  useEffect(() => {
    localStorage.setItem('vittara_session_id', sessionId);
    loadSessionMessages(sessionId);
    fetchAllSessions(); // refresh history list silently
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle query parameter from Home page
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !initialQueryTriggered.current) {
      initialQueryTriggered.current = true;
      setSearchParams({}, { replace: true });
      handleSendMessage(q);
    }
  }, [searchParams]);

  const handleSendMessage = async (text) => {
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsg = { id: generateId(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await apiService.sendChat({
        message: text,
        sessionId,
        language,
        contextData: journeyData.hasActiveJourney ? journeyData : null
      });

      const aiData = response.data?.data;
      const assistantMsg = {
        id: generateId(),
        role: 'assistant',
        content: aiData?.text || 'Response received.',
        source: aiData?.source,
        toolCalls: aiData?.toolCalls || [],
        warning: aiData?.warning
      };

      setMessages((prev) => [...prev, assistantMsg]);
      fetchAllSessions(); // update titles in history sidebar
    } catch (err) {
      console.error('Chat error:', err);
      const errText =
        err.response?.data?.error ||
        'Vittara AI is temporarily unavailable. Please try again.';
      setErrorMessage(errText);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: errText,
          source: 'error-handler'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await apiService.clearChat(sessionId);
    } catch (e) {
      // ignore
    }
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content:
          language === 'Hindi'
            ? 'बातचीत का इतिहास साफ़ कर दिया गया है। आप नया सवाल पूछ सकते हैं!'
            : language === 'Hinglish'
              ? 'Chat history clear kar di gayi hai. Aap fresh sawaal pooch sakte hain!'
              : 'Conversation history has been cleared. What would you like to explore next?',
        source: 'vittara-core'
      }
    ]);
  };

  const handleNewChat = () => {
    const newId = generateId();
    setSessionId(newId);
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: language === 'Hindi'
          ? 'नई बातचीत शुरू हो गई है। मैं आपकी क्या मदद कर सकता हूँ?'
          : language === 'Hinglish'
            ? 'Fresh session shuru ho gaya hai. Aap kya calculate ya explore karna chahte hain?'
            : 'New session started. How can I assist you with your financial questions today?',
        source: 'vittara-core'
      }
    ]);
  };

  const handleSelectSession = (sid) => {
    setSessionId(sid);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex h-[calc(100vh-8rem)] gap-4 w-full">
      {/* History Sidebar */}
      <div className="w-1/4 hidden md:flex flex-col bg-midnight-800/50 border border-slate-700/80 rounded-2xl overflow-hidden shadow-fintech-sm">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ivory flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Chat History
          </h2>
        </div>
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
          {historySessions.length === 0 ? (
            <p className="text-xs text-center text-ivory-subtle mt-4">No recent chats</p>
          ) : (
            historySessions.map(sess => (
              <button
                key={sess.sessionId}
                onClick={() => handleSelectSession(sess.sessionId)}
                className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors block truncate ${sessionId === sess.sessionId ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'text-ivory hover:bg-slate-800'}`}
              >
                {sess.title}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-midnight-800/30 border border-slate-700/80 rounded-2xl p-4 shadow-fintech-sm">
        {/* Header Info */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-ivory flex items-center gap-2">
                Vittara AI Chat Assistant
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                  Multi-Turn
                </span>
              </h1>
              <p className="text-xs text-ivory-subtle">
                Active Language: <strong className="text-emerald-300">{language}</strong> • Real-time Application Tools Enabled
              </p>
            </div>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg, i) => (
            <ChatMessage key={msg.id || i} message={msg} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-midnight-800/80 border border-slate-700 shadow-fintech-md rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                <LoadingState message="Vittara AI is reasoning and executing tools..." />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error alert if any */}
        {errorMessage && (
          <div className="mb-2">
            <ErrorState
              title="Chat Notice"
              message={errorMessage}
              onRetry={() => handleSendMessage("Explain deductible")}
            />
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-slate-700/80 pt-2">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            onNewChat={handleNewChat}
          />
        </div>
      </div>
    </div>
  );
}
