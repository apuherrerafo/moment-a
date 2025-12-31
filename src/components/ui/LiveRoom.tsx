'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X, Send, User, Users, MessageCircle, Gift, Sparkles, Mic, Play, Smile } from 'lucide-react';
import { Moment } from '@/hooks/useMoments';
import { twMerge } from 'tailwind-merge';

interface LiveRoomProps {
    isOpen: boolean;
    onClose: () => void;
    moment: Moment | null;
}

const MOCK_MESSAGES = [
    { id: 1, user: 'CryptoPunk #420', text: 'Yooo this view is insane! 🔥', avatar: '/avatar-host.png', isMe: false },
    { id: 2, user: 'Alice', text: 'Coming in 5 mins!', avatar: '/avatar-girl.png', isMe: false },
    { id: 3, user: 'Dave', text: 'Is the bar open yet?', avatar: '/avatar-guy.png', isMe: false },
    { id: 4, user: 'You', text: 'Just unlocked! Where are you guys?', avatar: '/avatar-host.png', isMe: true },
    { id: 5, user: 'Eve', text: 'By the DJ booth! 🎵', avatar: '/avatar-girl.png', isMe: false },
    { id: 6, user: 'Alex', text: '', avatar: '/avatar-guy.png', isMe: false, voiceNote: { duration: '0:08', waveform: [40, 70, 50, 90, 60, 30, 80, 40] } },
];

export default function LiveRoom({ isOpen, onClose, moment }: LiveRoomProps) {
    const [activeTab, setActiveTab] = useState<'chat' | 'people'>('chat');
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, activeTab]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg = {
            id: Date.now(),
            user: 'You',
            text: inputValue,
            avatar: '/avatar-host.png',
            isMe: true
        };
        setMessages([...messages, newMsg]);
        setInputValue('');
    };

    if (!moment) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[400] flex items-end lg:items-center justify-center pointer-events-none p-0 lg:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-white/40 backdrop-blur-md pointer-events-auto"
                    />

                    <motion.div
                        initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 40 }}
                        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
                        exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={twMerge(
                            "relative z-50 flex flex-col pointer-events-auto shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] transition-all duration-300 overflow-hidden",
                            isMobile
                                ? "w-full h-[94vh] rounded-t-[3.5rem] bg-[#f8f8fa]"
                                : "w-[520px] h-[780px] max-h-[85vh] rounded-[3.5rem] bg-[#f8f8fa] border border-black/5"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 pb-4 bg-white/50 backdrop-blur-xl border-b border-black/5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[1.3rem] overflow-hidden border-2 border-cyan-500/50 p-0.5 relative shadow-xl shadow-cyan-500/10">
                                    <img src={moment.avatarUrl || '/avatar-host.png'} className="w-full h-full object-cover rounded-[1rem]" alt="Host" />
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-black text-black uppercase tracking-tighter leading-none mb-2">{moment.title}</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                        <span className="text-[9px] text-black/30 font-black uppercase tracking-[0.2em] leading-none">Live Protocol Active</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-4 rounded-2xl bg-black/5 text-black/20 hover:text-black hover:bg-black/10 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Custom Tabs (Web3 Pill Style) */}
                        <div className="mx-8 mt-6">
                            <div className="flex p-1.5 bg-gray-200/50 rounded-[1.8rem] gap-1 shadow-inner border border-black/5">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={twMerge(
                                        "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all",
                                        activeTab === 'chat' ? "bg-white text-black shadow-xl" : "text-black/30 hover:text-black/50"
                                    )}
                                >
                                    <MessageCircle size={14} /> Feed
                                </button>
                                <button
                                    onClick={() => setActiveTab('people')}
                                    className={twMerge(
                                        "flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all",
                                        activeTab === 'people' ? "bg-white text-black shadow-xl" : "text-black/30 hover:text-black/50"
                                    )}
                                >
                                    <Users size={14} /> Hub ({moment.capacity.current})
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative p-8">
                            {activeTab === 'chat' ? (
                                <div className="space-y-8 pb-32">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={twMerge("flex gap-4 items-end", msg.isMe ? "flex-row-reverse" : "")}>
                                            <div className="w-10 h-10 rounded-[1rem] overflow-hidden shrink-0 border border-black/5 shadow-sm bg-white p-0.5">
                                                <img src={msg.avatar} className="w-full h-full object-cover rounded-[0.8rem]" alt={msg.user} />
                                            </div>
                                            <div className={twMerge(
                                                "max-w-[80%] p-5 rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border transition-all",
                                                msg.isMe
                                                    ? "bg-black text-white rounded-br-none border-black"
                                                    : "bg-white text-black rounded-bl-none border-black/5"
                                            )}>
                                                {!msg.isMe && <p className="text-[8px] text-black/20 font-black uppercase tracking-[0.2em] mb-2">{msg.user}</p>}
                                                {msg.text && <p className="text-xs font-black uppercase tracking-tight leading-relaxed">{msg.text}</p>}

                                                {(msg as any).voiceNote && (
                                                    <div className="flex items-center gap-4 mt-2 min-w-[160px] bg-cyan-500/5 p-3 rounded-2xl border border-cyan-500/10">
                                                        <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform">
                                                            <Play size={16} fill="white" />
                                                        </div>
                                                        <div className="flex-1 flex gap-1 items-end h-8">
                                                            {(msg as any).voiceNote.waveform.map((h: number, i: number) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex-1 bg-cyan-500/20 rounded-full"
                                                                    style={{ height: `${h}%` }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-6 pb-24">
                                    {moment.attendees.concat([{ name: 'You', avatar: '/avatar-host.png' }]).map((person, i) => (
                                        <div key={i} className="group flex flex-col items-center gap-3">
                                            <div className="w-24 h-24 rounded-[2rem] border-2 border-black/5 overflow-hidden bg-white p-1.5 relative shadow-sm group-hover:shadow-xl transition-all group-hover:scale-105 duration-500">
                                                <img src={person.avatar} className="w-full h-full rounded-[1.6rem] object-cover" alt="" />
                                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                                            </div>
                                            <span className="text-[10px] text-black/30 font-black uppercase tracking-widest">{person.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Floating Interaction Bar */}
                        {activeTab === 'chat' && (
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="p-3 bg-white/90 backdrop-blur-2xl border border-black/5 rounded-[2.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                        className="flex gap-4 items-center"
                                    >
                                        <button type="button" className="p-3 text-black/10 hover:text-black transition-colors ml-2">
                                            <Smile size={20} />
                                        </button>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="SAY SOMETHING..."
                                            className="flex-1 bg-transparent text-[11px] font-black uppercase tracking-widest text-black placeholder:text-black/10 focus:outline-none"
                                        />
                                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-black/5 shadow-inner">
                                            <button
                                                type="button"
                                                onClick={() => setIsRecording(!isRecording)}
                                                className={twMerge(
                                                    "w-12 h-12 flex items-center justify-center transition-all rounded-[1.2rem]",
                                                    isRecording ? "bg-red-500 text-white animate-pulse" : "text-black/30 hover:text-cyan-600 hover:bg-white"
                                                )}
                                            >
                                                <Mic size={20} />
                                            </button>
                                            <button
                                                type="submit"
                                                className="w-12 h-12 bg-black rounded-[1.2rem] flex items-center justify-center text-white shadow-xl shadow-black/10 active:scale-95 transition-all"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </form>

                                    {isRecording && (
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black px-6 py-2.5 rounded-full shadow-2xl uppercase tracking-[0.2em] flex items-center gap-3 border border-white/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            Live Recording...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
