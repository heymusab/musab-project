'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Clock, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/admin/messages');
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await fetch('/api/admin/messages', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            alert('Failed to delete message');
        }
    };

    const handleToggleRead = async (id: string, currentRead: boolean) => {
        if (currentRead) return;
        try {
            await fetch('/api/admin/messages', {
                method: 'PATCH',
                body: JSON.stringify({ id }),
            });
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (error) {
            alert('Failed to update message');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Contact Messages</h1>
                    <p className="text-gray-400 mt-2">Manage inquiries and feedback from patients and clinics.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-md">
                    <span className="text-cyan-400 font-bold text-lg">{messages.length}</span>
                    <span className="text-gray-400 ml-2 text-sm uppercase tracking-widest font-bold">Total</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
            ) : messages.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-20 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="text-gray-500 w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No messages yet</h3>
                    <p className="text-gray-500 mt-2">When someone contacts you, their message will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group relative bg-black/40 backdrop-blur-xl border ${msg.read ? 'border-white/5' : 'border-cyan-500/30'} rounded-[2rem] p-6 lg:p-8 transition-all hover:border-white/20 hover:bg-white/5`}
                            >
                                {!msg.read && (
                                    <div className="absolute top-6 right-6 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                )}

                                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/10">
                                                <User className="w-4 h-4 text-cyan-400" />
                                                {msg.name}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 border border-white/10">
                                                <Mail className="w-4 h-4 text-blue-400" />
                                                {msg.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Clock className="w-4 h-4" />
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 bg-black/20 rounded-2xl p-6 border border-white/5">
                                            <MessageSquare className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                                            <p className="text-gray-300 leading-relaxed text-lg italic whitespace-pre-wrap">
                                                "{msg.message}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col gap-3">
                                        {!msg.read && (
                                            <button
                                                onClick={() => handleToggleRead(msg.id, false)}
                                                className="flex-1 lg:w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded-xl border border-cyan-500/30 transition-all font-bold group"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Mark Read</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all group"
                                            title="Delete Message"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
