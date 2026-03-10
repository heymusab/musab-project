'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, CheckCheck, User, Stethoscope } from 'lucide-react';

const doctors = [
  { id: '1', name: 'Dr. Faisal Hayat', specialization: 'Cardiology', status: 'online', avatar: 'FH' },
  { id: '2', name: 'Dr. Ayesha Khan', specialization: 'Neurology', status: 'offline', avatar: 'AK' },
  { id: '3', name: 'Dr. Sarah Ahmed', specialization: 'General Physician', status: 'online', avatar: 'SA' },
];

export default function MessagesPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [messages, setMessages] = useState<{id: string, role: string, content: string, timestamp: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ 
      id: Date.now().toString(), 
      role: 'assistant', 
      content: `Hi! I am ${selectedDoctor.name}. How can I help you today?`, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
  }, [selectedDoctor]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate doctor reply
    setIsTyping(true);
    setTimeout(() => {
      const doctorReply = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Got it. I'll review this. Please wait a moment while I check the records for ${selectedDoctor.specialization}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, doctorReply]);
      setIsTyping(false);
    }, 3000);
  };

  return (
    <div className="h-[calc(100vh-12rem)] mt-4">
      {/* Main Chat Window */}
      <div className="glass-card rounded-[3rem] flex flex-col border border-border shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-8 py-6 border-b border-border bg-card/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
              {selectedDoctor.avatar}
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg tracking-tighter">{selectedDoctor.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedDoctor.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`}></span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">
                  {selectedDoctor.status === 'online' ? 'Active Now' : 'Last seen 2h ago'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-105 active:scale-95"><Phone size={18} /></button>
            <button className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-all hover:scale-105 active:scale-95"><Video size={18} /></button>
            <button className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-none">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-6 py-4 rounded-[1.8rem] text-sm shadow-xl font-medium leading-relaxed ${
                  msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none shadow-primary/20'
                  : 'bg-muted/80 text-foreground rounded-tl-none border border-border shadow-black/5'
                }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-2 px-1">
                  <span className="text-[8px] text-muted-foreground font-black tracking-widest uppercase">{msg.timestamp}</span>
                  {msg.role === 'user' && <CheckCheck size={12} className="text-primary" />}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted/80 px-6 py-4 rounded-[1.8rem] rounded-tl-none border border-border flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]"></span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Action Bar */}
        <div className="shrink-0 p-8 bg-card/40 backdrop-blur-md border-t border-border mt-auto">
          <div className="flex items-center gap-4 bg-muted/30 rounded-[2rem] border border-border p-3 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center cursor-pointer">
                <Paperclip size={18} />
              </button>
              <button className="w-10 h-10 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center cursor-pointer">
                <ImageIcon size={18} />
              </button>
            </div>
            
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Write advice or upload report..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground flex-1 placeholder-muted-foreground/50 px-2"
            />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
