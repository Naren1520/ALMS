'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Radio, 
  ChevronDown,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'artisan';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  '🌾 How to register as an artisan?',
  '🏷️ What is GI craft certification?',
  '📦 How to place a bulk B2B order?',
  '📸 How does the AI Studio enhancement work?',
];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assistant' | 'live'>('assistant');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste! 🙏 Welcome to **ALMS**. I am your intelligent heritage craft & platform assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // WebSocket Connection for Live Artisan Chat Tab
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001/ws';

    try {
      const socket = io(wsUrl, {
        autoConnect: false,
        reconnectionAttempts: 3,
        timeout: 5000,
        auth: { userId: 'guest-buyer-' + Math.floor(Math.random() * 10000) },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setSocketConnected(true);
      });

      socket.on('disconnect', () => {
        setSocketConnected(false);
      });

      socket.on('message:new', (msg: any) => {
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id || String(Date.now()),
            sender: 'artisan',
            text: msg.content || msg.text || 'Message from artisan desk',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      });

      if (activeTab === 'live') {
        socket.connect();
      }

      return () => {
        socket.disconnect();
      };
    } catch (e) {
      console.warn('WebSocket init warning:', e);
    }
  }, [activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    if (activeTab === 'live' && socketConnected && socketRef.current) {
      // Send via WebSocket to artisan gateway
      socketRef.current.emit('message:send', {
        conversationId: 'general-support',
        content: text,
      });
      setIsTyping(false);
      return;
    }

    // Default: AI Assistant mode via /api/chat
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('API response failed');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: 'Namaste! You can browse authentic verified crafts in our **Explore** catalog, register with zero commission in **Artisan Center**, or request custom quotes in **B2B RFQ**.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Chat history cleared. How else may I assist you with ALMS artisan services today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <aside aria-label="Live Chat and Support" className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#E05A00] via-[#FA7A21] to-amber-400 text-white shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
          aria-label="Open Live Chat & Support"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1E1B18] animate-pulse" />
          <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-6" />
          
          {/* Tooltip Pill */}
          <span className="absolute right-16 px-3 py-1.5 rounded-full bg-[#1E1B18]/90 backdrop-blur-md text-amber-100 text-xs font-medium whitespace-nowrap shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            💬 Chat with ALMS Support
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="flex flex-col w-[380px] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl bg-[#181512]/95 backdrop-blur-2xl border border-amber-500/20 shadow-2xl shadow-black/80 overflow-hidden text-neutral-100 animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="relative px-5 py-4 bg-gradient-to-b from-amber-500/15 to-transparent border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-[#FA7A21]/20 border border-[#FA7A21]/40 flex items-center justify-center text-[#FA7A21]">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#181512]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                  ALMS Support Desk
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FA7A21]/20 text-amber-300 border border-[#FA7A21]/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-[#FA7A21]" /> Multilingual AI & Artisan Desk
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400">
              <button
                onClick={clearChat}
                title="Clear Conversation"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1.5 mx-4 mt-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'assistant'
                  ? 'bg-[#FA7A21] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-[#FA7A21] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${socketConnected ? 'text-emerald-300 animate-pulse' : 'text-neutral-400'}`} />
              Artisan Live Desk
            </button>
          </div>

          {/* Status Subtitle for Live Desk */}
          {activeTab === 'live' && (
            <div className="mx-4 mt-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {socketConnected ? 'Connected to Artisan Desk' : 'Waiting for desk agent...'}
              </span>
              <span className="text-[10px] text-neutral-400">WebSocket /ws</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] ${
                    isUser ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-[#E05A00] to-[#FA7A21] text-white rounded-br-xs'
                        : 'bg-white/10 text-neutral-200 border border-white/10 rounded-bl-xs'
                    }`}
                  >
                    {/* Render simple markdown bolding */}
                    <div
                      className="whitespace-pre-wrap break-words space-y-1.5"
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/10 text-neutral-400 w-fit text-xs border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 3 && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-white/5 bg-black/20">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#FA7A21]/20 hover:border-[#FA7A21]/40 border border-white/10 text-amber-200/90 transition-all duration-200 text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                activeTab === 'assistant'
                  ? 'Ask anything about ALMS, crafts, or GI...'
                  : 'Message the artisan support desk...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FA7A21] focus:ring-1 focus:ring-[#FA7A21] transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-[#FA7A21] text-white hover:bg-[#e05a00] disabled:opacity-40 disabled:hover:bg-[#FA7A21] transition-all shadow-md active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
