'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Repeat2, MessageCircle, Share, Image as ImageIcon, MapPin, Search, ChevronRight, Mic, Play, Pause, Terminal, Gift, Smile } from 'lucide-react';
import { useState } from 'react';
import { Moment } from '@/hooks/useMoments';
import ProfileButton from './ProfileButton';
import { twMerge } from 'tailwind-merge';

interface FeedPost {
    id: number;
    user: string;
    handle: string;
    avatar: string;
    content: string;
    image?: string;
    time: string;
    sharedEvent?: {
        title: string;
        type: string;
        prizes: string[];
    };
    voiceNote?: {
        duration: string;
        waveform: number[];
    };
    likes: number;
    comments: number;
}

interface CommunityFeedProps {
    unlockedMoments: Moment[];
    onMomentSelect: (m: Moment) => void;
}

export default function CommunityFeed({ unlockedMoments, onMomentSelect }: CommunityFeedProps) {
    const [view, setView] = useState<'feed' | 'moments'>('feed');
    const [isRecording, setIsRecording] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [posts] = useState<FeedPost[]>([
        {
            id: 1,
            user: 'Satoshi',
            handle: '@satoshi_bit',
            avatar: '/avatar-guy.png',
            content: '¿Ya vieron el sorteo de @MarceloWong? Las piezas están de otro nivel. ¡Suerte a todos! 🎨✨',
            time: '2m',
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            user: 'CryptoLover',
            handle: '@clover_nft',
            avatar: '/avatar-girl.png',
            content: '¡Acabo de desbloquear el acceso VIP! Miren esta belleza que me tocó en el drop anterior. 😍',
            image: '/marcelo-sculpture.png',
            time: '15m',
            likes: 42,
            comments: 12
        },
        {
            id: 3,
            user: 'Julio.eth',
            handle: '@julio_dev',
            avatar: '/avatar-host.png',
            content: 'Gente, el mapa se está poniendo caliente en Larcomar. ¡Aprovechen el evento antes que termine! 🔥',
            sharedEvent: {
                title: 'Secret Rooftop Party',
                type: 'Live Giveaway',
                prizes: ['0.1 ETH', 'VIP Pass']
            },
            time: 'Just now',
            likes: 8,
            comments: 2
        },
        {
            id: 4,
            user: 'Alex',
            handle: '@alex_vibe',
            avatar: '/avatar-guy.png',
            content: '',
            voiceNote: {
                duration: '0:12',
                waveform: [20, 40, 60, 80, 50, 30, 70, 90, 40, 20, 60, 30]
            },
            time: '5m',
            likes: 12,
            comments: 3
        }
    ]);

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
            {/* TOP HEADER */}
            <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="p-1.5 bg-gray-200/50 rounded-full flex gap-1 relative w-full max-w-[220px] shadow-inner border border-black/5">
                        <motion.div
                            initial={false}
                            animate={{ x: view === 'feed' ? 0 : '100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            className="absolute inset-y-1.5 left-1.5 w-[46%] bg-white rounded-full shadow-md z-0"
                        />
                        <button
                            onClick={() => setView('feed')}
                            className={twMerge(
                                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] z-10 transition-all duration-300",
                                view === 'feed' ? 'text-black' : 'text-black/30'
                            )}
                        >
                            Feed
                        </button>
                        <button
                            onClick={() => setView('moments')}
                            className={twMerge(
                                "flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] z-10 transition-all duration-300",
                                view === 'moments' ? 'text-black' : 'text-black/30'
                            )}
                        >
                            History
                        </button>
                    </div>
                    <ProfileButton />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-black/20 group-focus-within:text-black transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH"
                        className="w-full bg-white border border-black/5 rounded-[2.2rem] py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.2em] placeholder:text-black/10 focus:outline-none shadow-sm focus:shadow-xl transition-all"
                    />
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto px-8 no-scrollbar pb-40 pt-4">
                <AnimatePresence mode="wait">
                    {view === 'feed' ? (
                        <motion.div
                            key="feed-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[1.3rem] bg-gray-100 p-0.5 border border-black/5 relative shadow-sm">
                                                <img src={post.avatar} className="w-full h-full object-cover rounded-[1.1rem]" alt={post.user} />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight text-black leading-none mb-1.5">{post.user}</p>
                                                <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">{post.handle}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">{post.time}</span>
                                    </div>

                                    {post.image && (
                                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 border border-black/5 shadow-inner bg-gray-50">
                                            <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Post" />
                                            <div className="absolute top-6 right-6 p-3 bg-white/40 backdrop-blur-md rounded-full shadow-xl text-white border border-white/20">
                                                <ImageIcon size={16} />
                                            </div>
                                        </div>
                                    )}

                                    {post.sharedEvent && (
                                        <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-[2.2rem] p-6 mb-6 space-y-4 relative overflow-hidden group/event cursor-pointer">
                                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/event:opacity-10 transition-opacity">
                                                <Gift size={60} className="text-yellow-600" />
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 rounded-[0.8rem] bg-yellow-400 flex items-center justify-center text-black shadow-lg shadow-yellow-400/20">
                                                    <Gift size={12} />
                                                </div>
                                                <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{post.sharedEvent.type}</span>
                                            </div>
                                            <h4 className="text-base font-black text-black uppercase tracking-tighter leading-tight">{post.sharedEvent.title}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {post.sharedEvent.prizes.map((p, i) => (
                                                    <span key={i} className="text-[9px] px-3 py-1.5 bg-yellow-400 text-black rounded-xl font-black uppercase tracking-[0.1em] border border-yellow-500/20 shadow-sm">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {post.voiceNote && (
                                        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-[2.2rem] p-6 mb-6 flex items-center gap-5 group/voice cursor-pointer hover:bg-cyan-500/10 transition-colors">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 active:scale-95 transition-transform">
                                                <Play size={16} fill="white" />
                                            </div>
                                            <div className="flex-1 flex gap-1 items-end h-10">
                                                {post.voiceNote.waveform.map((h: number, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 bg-cyan-500/20 rounded-full group-hover/voice:bg-cyan-500/40 transition-colors"
                                                        style={{ height: `${h}%` }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">{post.voiceNote.duration}</span>
                                        </div>
                                    )}

                                    {post.content && (
                                        <p className="text-sm font-black text-black/50 leading-relaxed uppercase tracking-tight mb-8">
                                            {post.content}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between border-t border-black/5 pt-6">
                                        <div className="flex items-center gap-8">
                                            <button className="flex items-center gap-3 group/btn">
                                                <div className="w-10 h-10 rounded-2xl bg-cyan-500/5 flex items-center justify-center text-cyan-600 group-hover/btn:bg-cyan-500 group-hover/btn:text-white transition-all shadow-sm">
                                                    <MessageCircle size={16} />
                                                </div>
                                                <span className="text-[11px] font-black text-black/30">{post.comments}</span>
                                            </button>
                                            <button className="flex items-center gap-3 group/btn">
                                                <div className="w-10 h-10 rounded-2xl bg-pink-500/5 flex items-center justify-center text-pink-500 group-hover/btn:bg-pink-500 group-hover/btn:text-white transition-all shadow-sm">
                                                    <Heart size={16} />
                                                </div>
                                                <span className="text-[11px] font-black text-black/30">{post.likes}</span>
                                            </button>
                                        </div>
                                        <button className="p-3 text-black/10 hover:text-black transition-colors">
                                            <Repeat2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moments-view"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between px-3 mb-4">
                                <h3 className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em]">Active Protocols</h3>
                                <div className="px-3 py-1 bg-cyan-500/10 text-cyan-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{unlockedMoments.length}</div>
                            </div>

                            {unlockedMoments.map((moment) => (
                                <div
                                    key={moment.id}
                                    onClick={() => onMomentSelect(moment)}
                                    className="bg-white border border-black/5 rounded-[2.5rem] p-6 cursor-pointer hover:shadow-2xl hover:translate-y-[-2px] transition-all shadow-sm group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-[1.3rem] border-2 border-yellow-400 p-0.5 relative overflow-hidden shadow-lg shadow-yellow-400/10">
                                            <img src={moment.avatarUrl} className="w-full h-full rounded-[1.1rem] object-cover" alt="" />
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white shadow-sm" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-black text-black uppercase tracking-tighter truncate leading-none mb-2">{moment.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                                            <img src={`/avatar-${i === 1 ? 'guy' : 'girl'}.png`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[9px] text-black/20 font-black uppercase tracking-widest">Global Session</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-black/10 group-hover:text-black group-hover:bg-cyan-500/10 transition-all">
                                            <ChevronRight size={22} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* FLOATING ACTION BOTTOM BAR */}
            <div className="absolute bottom-10 left-8 right-8 z-50">
                <div className="bg-white/95 backdrop-blur-3xl border border-black/5 p-3 rounded-[2.8rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center gap-5">
                    <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={twMerge(
                            "w-12 h-12 rounded-[1.3rem] flex items-center justify-center transition-all shadow-sm",
                            isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-black/20 hover:text-cyan-600 hover:bg-white"
                        )}
                    >
                        <Mic size={20} />
                    </button>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="PUBLISH VIBE..."
                        className="flex-1 bg-transparent text-[11px] font-black uppercase tracking-[0.2em] text-black border-none focus:outline-none placeholder:text-black/10"
                    />
                    <div className="flex items-center gap-4">
                        <button className="text-black/10 hover:text-black transition-colors">
                            <Smile size={20} />
                        </button>
                        <button
                            className="h-12 px-8 bg-black text-white rounded-[1.3rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-600 active:scale-95 transition-all"
                            onClick={() => setInputValue('')}
                        >
                            POST
                        </button>
                    </div>
                </div>

                {isRecording && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black px-6 py-2.5 rounded-full shadow-2xl uppercase tracking-[0.2em] flex items-center gap-3 border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Transmitting...
                    </div>
                )}
            </div>
        </div>
    );
}
