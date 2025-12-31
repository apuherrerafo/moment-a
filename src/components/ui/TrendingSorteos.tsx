'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { Moment } from '@/hooks/useMoments';

interface TrendingSorteosProps {
    sorteos: Moment[];
    onSelect: (m: Moment) => void;
    onStake?: () => void;
}

export default function TrendingSorteos({ sorteos, onSelect, onStake }: TrendingSorteosProps) {
    return (
        <div className="flex flex-col h-full bg-transparent p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[1.2rem] bg-white shadow-xl shadow-black/5 flex items-center justify-center text-cyan-600 border border-black/5">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black leading-none">Trending</h2>
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/20 mt-1.5 block">Live Sorteos</span>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/20">
                    <Sparkles size={14} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 no-scrollbar pb-10">
                {sorteos.filter(s => s.isGiveaway).map((s) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        onClick={() => onSelect(s)}
                        className="p-5 rounded-[2.5rem] border border-black/5 bg-white cursor-pointer transition-all relative overflow-hidden group shadow-[0_15px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)]"
                    >
                        <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-100 transition-all text-yellow-500 transform group-hover:scale-110">
                            <Gift size={24} />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[1.2rem] border-2 border-yellow-400 p-0.5 shadow-xl shadow-yellow-400/10">
                                <img src={s.avatarUrl} alt="" className="w-full h-full rounded-[1rem] object-cover" />
                            </div>
                            <div className="min-w-0 pr-4">
                                <h3 className="text-sm font-black text-black truncate uppercase tracking-tighter leading-none mb-1.5">{s.title}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                    <p className="text-[9px] text-black/30 font-black uppercase tracking-widest leading-none">Active Drop</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <div className="flex -space-x-1.5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                        <img src={`/avatar-${i === 1 ? 'guy' : 'girl'}.png`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[6px] font-black text-black/40 shadow-sm uppercase">+12</div>
                            </div>

                            <div className="flex items-center gap-1.5 text-cyan-600">
                                <span className="text-[9px] font-black uppercase tracking-widest">Join</span>
                                <ChevronRight size={10} strokeWidth={4} />
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* PROMO CARD (Matching refernce style) */}
                <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-[2.8rem] p-8 text-white relative overflow-hidden shadow-[0_30px_60px_-10px_rgba(8,145,178,0.3)] group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <Sparkles className="mb-4 opacity-40" size={24} />
                    <h4 className="text-xl font-black uppercase tracking-tighter leading-tight mb-2">Unlock Premium Creators</h4>
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest leading-relaxed mb-6">Gain access to exclusive collections and early drops.</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStake?.();
                        }}
                        className="w-full py-3 bg-white text-cyan-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl hover:bg-black hover:text-white transition-all"
                    >
                        STAKE NOW
                    </button>
                </div>
            </div>

            {/* MAP LEGEND */}
            <div className="mt-auto pt-8 border-t border-black/5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Verified Creators</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Influencers</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Family & Friends</span>
                </div>
            </div>
        </div>
    );
}
