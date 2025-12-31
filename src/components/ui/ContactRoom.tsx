'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Image as ImageIcon, Smile, Heart, MessageCircle, Share2, MoreHorizontal, UserCheck, ShieldCheck, Star, Plus } from 'lucide-react';
import { useState } from 'react';
import { Influencer } from '@/hooks/useMoments';
import { twMerge } from 'tailwind-merge';

interface ContactRoomProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Influencer | null;
}

export default function ContactRoom({ isOpen, onClose, contact }: ContactRoomProps) {
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');

    if (!contact) return null;

    const MOCK_MESSAGES = [
        { id: 1, sender: 'them', text: '¡Hola! ¿Viste el drop de hoy?', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Sí, ¡está increíble! Ya tengo mis tickets.', time: '10:31 AM' },
        { id: 3, sender: 'them', text: 'Genial, nos vemos ahí entonces 🚀', time: '10:32 AM' },
    ];

    const MOCK_POSTS = [
        { id: 1, image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500', likes: 124, comments: 12 },
        { id: 2, image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=500', likes: 89, comments: 5 },
        { id: 3, image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=500', likes: 231, comments: 24 },
        { id: 4, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500', likes: 45, comments: 2 },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md pointer-events-auto"
                    />

                    {/* Main Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-6xl h-full max-h-[850px] bg-[#f8f8fa] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col pointer-events-auto border border-white/20"
                    >
                        {/* Header */}
                        <div className="px-6 lg:px-10 py-6 lg:py-8 bg-white border-b border-black/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4 lg:gap-6">
                                <div className={twMerge(
                                    "w-12 h-12 lg:w-16 lg:h-16 rounded-[1.2rem] lg:rounded-[1.5rem] p-0.5 border-2 relative",
                                    contact.tier === 'verified' ? "border-cyan-500" : contact.tier === 'influencer' ? "border-yellow-400" : "border-green-500"
                                )}>
                                    <img src={contact.avatar} className="w-full h-full object-cover rounded-[1rem] lg:rounded-[1.3rem]" alt={contact.name} />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                                </div>
                                <div>
                                    <h3 className="text-lg lg:text-xl font-black text-black uppercase tracking-tighter flex items-center gap-2 leading-none mb-1 lg:mb-2">
                                        {contact.name}
                                        {contact.tier === 'verified' && <ShieldCheck size={16} className="text-cyan-500" />}
                                    </h3>
                                    <div className="flex items-center gap-2 lg:gap-3">
                                        <span className="text-[9px] lg:text-[10px] font-black text-black/30 uppercase tracking-widest">{contact.handle}</span>
                                        <span className="w-1 h-1 rounded-full bg-black/10" />
                                        <span className="text-[9px] lg:text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 lg:gap-4">
                                <button className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gray-50 text-black/40 hover:text-black hover:bg-gray-100 transition-all">
                                    <MoreHorizontal size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-black text-white hover:bg-cyan-600 transition-all shadow-xl shadow-black/10"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Tab Switcher */}
                        <div className="lg:hidden flex bg-white border-b border-black/5 p-2 gap-2">
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={twMerge(
                                    "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'feed' ? "bg-black text-white" : "text-black/30 bg-black/5"
                                )}
                            >
                                Private Feed
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={twMerge(
                                    "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'chat' ? "bg-black text-white" : "text-black/30 bg-black/5"
                                )}
                            >
                                Secure Chat
                            </button>
                        </div>

                        {/* Split Body */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* LEFT PANEL: User Feed */}
                            <div className={twMerge(
                                "lg:w-[45%] w-full border-r border-black/5 flex flex-col bg-white/40 backdrop-blur-xl transition-all duration-300",
                                activeTab === 'chat' ? "hidden lg:flex" : "flex"
                            )}>
                                <div className="p-6 lg:p-8 border-b border-black/5 flex items-center justify-between hidden lg:flex">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Private Feed</h4>
                                    <span className="px-3 py-1 bg-black/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-black/40">Exclusive</span>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 lg:p-8 no-scrollbar space-y-6 lg:space-y-8">
                                    {MOCK_POSTS.map(post => (
                                        <div key={post.id} className="bg-white/60 backdrop-blur-md rounded-[2rem] lg:rounded-[2.5rem] border border-white/40 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                                            <div className="aspect-square relative flex items-center justify-center bg-gray-50 overflow-hidden">
                                                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Post" />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="p-4 lg:p-6 flex items-center justify-between">
                                                <div className="flex items-center gap-4 lg:gap-6">
                                                    <div className="flex items-center gap-2 text-black/30 group-hover:text-pink-500 transition-colors">
                                                        <Heart size={14} fill={post.id === 1 ? 'currentColor' : 'none'} className={post.id === 1 ? 'text-pink-500' : ''} />
                                                        <span className="text-[9px] font-black">{post.likes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-black/30 group-hover:text-cyan-600 transition-colors">
                                                        <MessageCircle size={14} />
                                                        <span className="text-[9px] font-black">{post.comments}</span>
                                                    </div>
                                                </div>
                                                <Share2 size={14} className="text-black/10 group-hover:text-black transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT PANEL: Chat */}
                            <div className={twMerge(
                                "flex-1 flex flex-col bg-white/20 backdrop-blur-3xl transition-all duration-300",
                                activeTab === 'feed' ? "hidden lg:flex" : "flex"
                            )}>
                                <div className="p-6 lg:p-8 border-b border-black/5 flex items-center justify-between hidden lg:flex">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60">Secure Transmission</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">Encrypted</span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar space-y-3 flex flex-col">
                                    <div className="text-center mb-4 lg:mb-6">
                                        <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[0.3em] text-black/20">Yesterday</span>
                                    </div>
                                    {MOCK_MESSAGES.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={twMerge(
                                                "max-w-[75%] px-5 py-3 rounded-[1.4rem] relative shadow-sm",
                                                msg.sender === 'me'
                                                    ? "self-end bg-[#5E5CE6] text-white rounded-tr-[0.3rem] shadow-[#5E5CE6]/20"
                                                    : "self-start bg-white/80 backdrop-blur-md text-black rounded-tl-[0.3rem] border border-white/50"
                                            )}
                                        >
                                            <p className="text-[13px] font-medium leading-[1.4] tracking-tight">{msg.text}</p>
                                            <div className={twMerge(
                                                "flex items-center gap-1 mt-1 opacity-40",
                                                msg.sender === 'me' ? "justify-end" : "justify-start"
                                            )}>
                                                <span className="text-[7px] font-bold uppercase tracking-widest leading-none">
                                                    {msg.time}
                                                </span>
                                                {msg.sender === 'me' && <UserCheck size={7} />}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center my-8">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20">Today</span>
                                    </div>
                                    <div className="self-start bg-white/80 backdrop-blur-md p-2 rounded-[1.8rem] border border-white/50 shadow-sm max-w-[75%] overflow-hidden">
                                        <div className="aspect-square rounded-[1.2rem] overflow-hidden mb-3">
                                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" className="w-full h-full object-cover" alt="Image share" />
                                        </div>
                                        <p className="text-[13px] font-medium px-3 pb-2 text-black/80">Check these out!</p>
                                    </div>
                                </div>

                                {/* Input Bar */}
                                <div className="p-8 pt-4">
                                    <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] p-2 flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus-within:bg-white focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all">
                                        <div className="flex items-center gap-1 pl-2">
                                            <button className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-black/30 hover:text-[#5E5CE6] transition-all">
                                                <Plus size={20} />
                                            </button>
                                            <button className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-black/30 hover:text-[#5E5CE6] transition-all">
                                                <ImageIcon size={20} />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none outline-none py-3 text-[14px] text-black placeholder:text-black/20 font-medium"
                                        />
                                        <div className="flex items-center gap-1 pr-1">
                                            <button className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center text-black/30 hover:text-[#5E5CE6] transition-all">
                                                <Mic size={20} />
                                            </button>
                                            <button
                                                className={twMerge(
                                                    "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                                                    message ? "bg-[#5E5CE6] text-white shadow-lg shadow-[#5E5CE6]/30" : "bg-black/5 text-black/10"
                                                )}
                                            >
                                                <Send size={18} fill={message ? "white" : "none"} className={message ? "translate-x-0.5 -translate-y-0.5" : ""} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
