'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { X, Terminal, Ticket, Users, Play, Trophy, ChevronDown, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { Moment } from '@/hooks/useMoments';
import { twMerge } from 'tailwind-merge';

interface RaffleConsoleProps {
    isOpen: boolean;
    onClose: () => void;
    moment: Moment | null;
}

export default function RaffleConsole({ isOpen, onClose, moment }: RaffleConsoleProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [tickets, setTickets] = useState<string[]>([]);
    const [isRaffling, setIsRaffling] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            if (moment?.raffleDate) {
                const target = new Date(moment.raffleDate).getTime();
                const now = new Date().getTime();
                const diff = target - now;

                if (diff > 0) {
                    setTimeLeft({
                        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                        s: Math.floor((diff % (1000 * 60)) / 1000)
                    });
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [moment]);

    useEffect(() => {
        if (isOpen && moment) {
            const userTickets = Array.from({ length: 3 }).map(() =>
                Math.random().toString(36).substring(2, 10).toUpperCase()
            );
            setTickets(userTickets);

            setLogs([
                `[SYSTEM] PROTOCOL INITIALIZED`,
                `[SYSTEM] SYNCING PARTICIPANT DATA...`,
                `[SYSTEM] 0x71C...92A TICKETS: ${userTickets.length}`,
                `[POOL] TOTAL ASSETS: ${moment.capacity.max * 4}`,
                `[STATUS] AWAITING OPERATOR INPUT`
            ]);
        }
    }, [isOpen, moment]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const runRaffle = () => {
        if (isRaffling) return;
        setIsRaffling(true);
        setWinner(null);

        let count = 0;
        const maxCounts = 20;

        const interval = setInterval(() => {
            const tempTicket = Math.random().toString(36).substring(2, 10).toUpperCase();
            setLogs(prev => [...prev.slice(-10), `[SCAN] SEARCHING... ${tempTicket}`]);
            count++;

            if (count >= maxCounts) {
                clearInterval(interval);
                const finalWinner = tickets[Math.floor(Math.random() * tickets.length)];
                setWinner(finalWinner);
                setLogs(prev => [...prev, `[SUCCESS] WINNER IDENTIFIED: ${finalWinner}`, `[SYSTEM] PROTOCOL COMPLETE.`]);
                setIsRaffling(false);
            }
        }, 150);
    };

    if (!moment) return null;

    return (
        <div className="fixed bottom-10 right-10 z-[300] flex flex-col items-end gap-6 pointer-events-none">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="w-[420px] h-[640px] bg-white border border-black/5 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pointer-events-auto backdrop-blur-3xl"
                    >
                        {/* Header */}
                        <div className="p-8 pb-6 flex items-center justify-between border-b border-black/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-black shadow-xl shadow-yellow-400/20">
                                    <Terminal size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mb-1">Operational Interface</span>
                                    <span className="text-sm font-black text-black uppercase tracking-tight truncate max-w-[180px]">{moment.title}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-3 text-black/10 hover:text-black hover:bg-black/5 rounded-2xl transition-all"
                                >
                                    <ChevronDown size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-3 text-black/10 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-6 space-y-8 pb-32">
                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 border border-black/5 p-5 rounded-[2rem] shadow-inner">
                                    <div className="flex items-center gap-3 mb-3 text-black/20">
                                        <Users size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Pool</span>
                                    </div>
                                    <span className="text-xl font-black text-black">{moment.capacity.current} Participants</span>
                                </div>
                                <div className="bg-gray-50 border border-black/5 p-5 rounded-[2rem] shadow-inner">
                                    <div className="flex items-center gap-3 mb-3 text-black/20">
                                        <Ticket size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-black/20">Volume</span>
                                    </div>
                                    <span className="text-xl font-black text-black">{moment.capacity.max * 4} Tickets</span>
                                </div>
                            </div>

                            {/* Rewards Preview */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-black/20 px-2 flex items-center gap-2">
                                    <Sparkles size={12} />
                                    Target Sub-Collection
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {moment.prizeImages?.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border border-black/5 shadow-lg group">
                                            <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Prize" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Date/Time Banner */}
                            <div className="bg-black rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-6 opacity-30 transform group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={40} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 block mb-3">Protocol Closed On</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black uppercase tracking-tight text-white">05.01 <span className="text-yellow-400">1:00PM</span></span>
                                        {timeLeft && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Ending In</span>
                                                <span className="text-xs font-black uppercase tracking-widest text-white/60">{timeLeft.d}D {timeLeft.h}G {timeLeft.m}M</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Logs Display (Modern Terminal) */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-black/20 px-2 flex items-center gap-2">
                                    <Terminal size={12} />
                                    System Logs
                                </h4>
                                <div
                                    ref={scrollRef}
                                    className="bg-gray-100/50 border border-black/5 rounded-[2.2rem] p-6 font-mono text-[10px] text-black/60 min-h-[140px] max-h-[140px] overflow-y-auto no-scrollbar space-y-1 shadow-inner"
                                >
                                    {logs.map((log, i) => (
                                        <div key={i} className={twMerge(
                                            "leading-relaxed",
                                            log.includes('SUCCESS') ? "text-cyan-600 font-bold" : "",
                                            log.includes('WINNER') ? "text-yellow-600 font-bold" : ""
                                        )}>
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Winner Overlay */}
                            <AnimatePresence>
                                {winner && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-cyan-500 rounded-[2.5rem] p-6 text-white flex items-center justify-between shadow-2xl shadow-cyan-500/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <Trophy size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Verified Winner</p>
                                                <p className="text-xl font-black uppercase tracking-tight truncate max-w-[150px]">{winner}</p>
                                            </div>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                            <ShieldCheck size={18} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Action Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent">
                            <button
                                onClick={runRaffle}
                                disabled={isRaffling}
                                className={twMerge(
                                    "w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3",
                                    isRaffling ? "bg-gray-100 text-black/20" : "bg-black text-white hover:bg-cyan-600"
                                )}
                            >
                                <Play size={14} fill="currentColor" />
                                {isRaffling ? 'PROTOCOL RUNNING...' : 'Initiate Distribution'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messenger Toggle Bubble */}
            <motion.button
                layout
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    if (isOpen) {
                        setIsMinimized(!isMinimized);
                    }
                }}
                className={twMerge(
                    "w-20 h-20 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto border transition-all duration-500 relative",
                    isOpen
                        ? (isMinimized ? "bg-cyan-500 border-cyan-400 text-white" : "bg-white border-black/5 text-black opacity-0 pointer-events-none translate-y-20")
                        : "bg-white border-black/5 text-black opacity-0 pointer-events-none translate-y-20"
                )}
            >
                {isMinimized && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[10px] font-black text-white">1</span>
                    </div>
                )}
                <MessageSquare size={28} />
                <div className="absolute -left-32 bg-black text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Console
                </div>
            </motion.button>
        </div>
    );
}
