import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Calculator,
  Store,
  CloudSun,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Bot,
  User,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function AIChatbot() {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Load welcome message & suggestions on mount or language change
  useEffect(() => {
    loadSuggestions();
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: lang === 'te'
            ? `నమస్కారం! నేను మీ **అగ్రిప్రైస్ AI చాట్‌బాట్**. 🌾\n\nఆంధ్రప్రదేశ్‌లోని మిర్చి మరియు పసుపు రైతులకు లైవ్ మార్కెట్ ధరలు, 15-90 రోజుల AI ధరల అంచనాలు, వాతావరణ సమాచారం మరియు అమ్మాలా/ఆగాలా సూచనలు అందిస్తాను.\n\nక్రింద ఉన్న ప్రశ్నలలో ఒకదాన్ని ఎంచుకోండి లేదా మీ ప్రశ్న టైప్ / వాయిస్‌ ద్వారా అడగండి!`
            : `Hello! I am your **AgriPrice AI Assistant**. 🌾\n\nI provide real-time spot prices, 15-90 day AI forecasts, weather impact advisories, and sell/wait recommendations for Chilli & Turmeric farmers across Andhra Pradesh.\n\nSelect a quick prompt below or ask any question by typing or voice!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [lang]);

  const loadSuggestions = async () => {
    try {
      const data = await api.getChatSuggestions(lang);
      if (data && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.warn('Failed to load chat suggestions', e);
    }
  };

  // Text-To-Speech
  const handleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for speech
    const cleanText = text.replace(/[*#_`~]/g, '').replace(/\[ACTION:[A-Z]+\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.lang = lang === 'te' ? 'te-IN' : 'en-IN';

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(lang === 'te' ? 'మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వడం లేదు.' : 'Web Speech API is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setIsListening(false);
        if (spokenText) {
          handleSendMessage(spokenText);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (id, text) => {
    const cleanText = text.replace(/\[ACTION:[A-Z]+\]/g, '');
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send Message
  const handleSendMessage = async (textToSend = inputMsg) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

    const userMsgId = `usr_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const botMsgId = `bot_${Date.now()}`;
    const initialBotMsg = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    setInputMsg('');
    setIsStreaming(true);

    // Build chat history for context
    const historyPayload = messages.slice(-4).map((m) => ({
      role: m.role,
      content: m.content
    }));

    await api.chatStream(
      {
        message: trimmed,
        language: lang,
        crop: trimmed.toLowerCase().includes('turmeric') || trimmed.toLowerCase().includes('పసుపు') ? 'turmeric' : 'chilli',
        market: trimmed.toLowerCase().includes('duggirala') ? 'Duggirala' : 'Guntur',
        history: historyPayload
      },
      (chunk) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === botMsgId ? { ...msg, content: msg.content + chunk } : msg))
        );
      },
      (err) => {
        console.error('Chat stream error', err);
        setIsStreaming(false);
      },
      () => {
        setIsStreaming(false);
      }
    );
  };

  const handleClearChat = () => {
    setMessages([]);
    window.speechSynthesis.cancel();
    setSpeakingMsgId(null);
  };

  // Render formatted markdown text & clickable action cards
  const renderMessageContent = (content) => {
    let text = content;
    const actionMatches = [...text.matchAll(/\[ACTION:([A-Z]+)\]/g)];
    const actions = actionMatches.map((m) => m[1]);
    text = text.replace(/\[ACTION:[A-Z]+\]/g, '').trim();

    // Format simple markdown headers, bold text & lists
    const formattedLines = text.split('\n').map((line, idx) => {
      let formattedLine = line;

      // Bold formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-amber-300">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 pl-2">
            <span className="text-emerald-400 font-bold">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={line === '' ? 'h-2' : 'my-0.5'}>
          {renderedParts}
        </p>
      );
    });

    return (
      <div className="space-y-1">
        <div>{formattedLines}</div>

        {/* Action Button Cards */}
        {actions.length > 0 && (
          <div className="mt-3 pt-2 border-t border-emerald-800/40 flex flex-wrap gap-2">
            {actions.includes('FORECAST') && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/forecast');
                }}
                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('chatActionForecast')}</span>
              </button>
            )}
            {actions.includes('CALCULATOR') && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/calculator');
                }}
                className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer border border-emerald-600/40"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('chatActionCalculator')}</span>
              </button>
            )}
            {actions.includes('MARKETS') && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/markets');
                }}
                className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer border border-emerald-600/40"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('chatActionMarkets')}</span>
              </button>
            )}
            {actions.includes('WEATHER') && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/weather');
                }}
                className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer border border-emerald-600/40"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('chatActionWeather')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-800 hover:from-emerald-500 hover:to-green-600 text-white p-3.5 md:p-4 rounded-full shadow-2xl border-2 border-amber-400/60 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open AgriPrice AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="font-bold text-xs leading-none text-white flex items-center gap-1">
              AgriPrice AI <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-emerald-200 font-medium">
              {lang === 'te' ? 'రైతు AI చాట్‌బాట్' : 'Real-time Assistant'}
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Container */}
      {isOpen && (
        <div
          className={`bg-slate-950/95 text-slate-100 rounded-2xl shadow-2xl border border-emerald-500/40 flex flex-col backdrop-blur-xl transition-all duration-300 ${
            isExpanded
              ? 'fixed inset-4 md:inset-10 z-50 w-auto h-auto'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 px-4 py-3 rounded-t-2xl border-b border-emerald-800/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white tracking-wide">
                    {t('chatTitle')}
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE AI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80 font-medium">
                  {t('chatSubtitle')}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5">
              {/* Language Switch */}
              <button
                onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
                className="bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 text-xs px-2.5 py-1 rounded-lg border border-emerald-700/50 font-bold transition-all cursor-pointer"
                title="Toggle Language"
              >
                {lang === 'te' ? 'EN' : 'తెలుగు'}
              </button>

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition-colors hidden sm:block cursor-pointer"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Clear Chat */}
              <button
                onClick={handleClearChat}
                className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-emerald-900/40 transition-colors cursor-pointer"
                title={t('chatClear')}
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Close Drawer */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm custom-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-800/60 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-amber-300">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg relative group ${
                      isUser
                        ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-br-none border border-emerald-500/30'
                        : 'bg-emerald-950/80 text-emerald-100 rounded-bl-none border border-emerald-800/60'
                    }`}
                  >
                    {/* Message Body */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      renderMessageContent(msg.content)
                    )}

                    {/* Cursor streaming indicator */}
                    {!isUser && isStreaming && msg.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-1 align-middle"></span>
                    )}

                    {/* Timestamp & Action Bar for AI message */}
                    <div
                      className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                        isUser ? 'border-emerald-500/40 text-emerald-200' : 'border-emerald-900/60 text-emerald-400/70'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && msg.content && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className={`transition-colors cursor-pointer ${
                              speakingMsgId === msg.id ? 'text-amber-400 animate-bounce' : 'hover:text-white'
                            }`}
                            title="Voice Read Aloud"
                          >
                            {speakingMsgId === msg.id ? (
                              <VolumeX className="w-3 h-3 text-red-400" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5 text-white">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions.length > 0 && !isStreaming && (
            <div className="px-3 py-2 bg-slate-900/80 border-t border-emerald-900/40 shrink-0">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1.5">
                {t('chatSuggestions')}
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSendMessage(s.text)}
                    className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs px-2.5 py-1 rounded-full border border-emerald-700/60 whitespace-nowrap transition-all hover:scale-102 cursor-pointer shrink-0"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Bar */}
          <div className="p-3 bg-slate-900 rounded-b-2xl border-t border-emerald-800/50 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Speech Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                    : 'bg-emerald-900/70 hover:bg-emerald-800 text-amber-300 border border-emerald-700/50'
                }`}
                title="Voice Input (Speech-to-Text)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Field */}
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={isListening ? t('chatVoiceListening') : t('chatPlaceholder')}
                disabled={isStreaming}
                className="flex-1 bg-slate-950 text-slate-100 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-emerald-800/70 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-500"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMsg.trim() || isStreaming}
                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
