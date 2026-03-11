'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleOpenChat = () => setOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };

      const assistantContent = res.ok && data.reply
        ? data.reply
        : data.reply || data.error || 'Sorry, I couldn’t process that. Please try again.';

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };    return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-6 z-[100] flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50 focus:outline-none ring-offset-2 ring-offset-slate-950 focus:ring-2 focus:ring-blue-500"
      >
        {open ? (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </div>
        )}
      </motion.button>

      {/* Chat modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed bottom-24 right-6 z-[120] w-[calc(100%-3rem)] max-w-sm pointer-events-none">
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex h-[min(70vh,550px)] w-full flex-col overflow-hidden rounded-[2.5rem] border border-border glass-card shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] pointer-events-auto"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/40 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-white shadow-lg shadow-primary/20 shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="font-black text-foreground tracking-tighter leading-tight">MediAI Assistant</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Live Now</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-3xl mb-6 border border-primary/20 animate-bounce">🤖</div>
                    <p className="text-foreground font-black text-xl tracking-tight mb-2">Hello! How can I help?</p>
                    <p className="text-sm text-muted-foreground font-medium">I can help find specialists, check symptoms or guide you through appointments.</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[1.5rem] px-5 py-4 text-sm shadow-xl ${msg.role === 'user'
                          ? 'bg-primary text-white rounded-tr-none shadow-primary/20'
                          : 'bg-muted/80 text-foreground rounded-tl-none border border-border shadow-black/5'
                        }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-relaxed font-medium">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-[1.5rem] rounded-tl-none border border-border bg-muted/80 px-5 py-4 text-sm text-primary flex items-center gap-3">
                      <span className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s]"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]"></span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]"></span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 p-6 bg-card/40 backdrop-blur-md">
                <div className="flex gap-3 items-center">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    rows={1}
                    disabled={loading}
                    className="min-h-[56px] py-[18px] w-full resize-none rounded-[1.5rem] border border-border bg-muted/50 px-6 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-60 transition-all scrollbar-none self-center"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="shrink-0 h-14 w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center border border-white/10"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
