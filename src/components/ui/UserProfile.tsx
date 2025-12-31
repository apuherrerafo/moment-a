'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Star, ChevronRight, ShieldCheck, Instagram, Twitter } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface UserProfileProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        handle: string;
        avatar: string;
    } | null;
}

export default function UserProfile({ isOpen, onClose, user }: UserProfileProps) {
    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Profile Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative z-50 w-full max-w-[360px] bg-white rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto border border-black/5"
                    >
                        {/* Header Background */}
                        <div className="h-24 bg-gradient-to-br from-cyan-400/20 to-purple-400/20" />

                        {/* Top Action */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/50 backdrop-blur-md text-black/40 hover:bg-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="px-8 pb-10 -mt-12 flex flex-col items-center">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-[2.5rem] bg-white shadow-xl p-1 relative mb-4">
                                <img
                                    src={user.avatar}
                                    className="w-full h-full object-cover rounded-[2.2rem]"
                                    alt={user.handle}
                                />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-full border-4 border-white flex items-center justify-center text-white">
                                    <ShieldCheck size={14} />
                                </div>
                            </div>

                            {/* Name & Title */}
                            <h2 className="text-xl font-black text-black leading-none mb-1 uppercase tracking-tighter">{user.handle}</h2>
                            <p className="text-[10px] text-black/30 font-black uppercase tracking-widest mb-6">Verified Creator</p>

                            {/* Stats */}
                            <div className="flex w-full justify-between px-4 mb-8">
                                <div className="text-center">
                                    <p className="text-sm font-black text-black">12.4K</p>
                                    <p className="text-[8px] text-black/30 font-black uppercase tracking-tight">Followers</p>
                                </div>
                                <div className="w-px h-8 bg-black/5" />
                                <div className="text-center">
                                    <p className="text-sm font-black text-black">842</p>
                                    <p className="text-[8px] text-black/30 font-black uppercase tracking-tight">Moments</p>
                                </div>
                                <div className="w-px h-8 bg-black/5" />
                                <div className="text-center">
                                    <p className="text-sm font-black text-black">98.2</p>
                                    <p className="text-[8px] text-black/30 font-black uppercase tracking-tight">Trust Score</p>
                                </div>
                            </div>

                            {/* Social Buttons */}
                            <div className="w-full space-y-3">
                                <button className="w-full py-4 bg-black text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95">
                                    <UserPlus size={16} />
                                    Follow {user.handle}
                                </button>
                                <button className="w-full py-4 bg-cyan-400 text-black rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-cyan-300 transition-all active:scale-95 shadow-lg shadow-cyan-400/20">
                                    <Star size={16} />
                                    Subscribe for $5/mo
                                </button>
                            </div>

                            {/* Links */}
                            <div className="w-full mt-8 space-y-1">
                                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-white transition-colors">
                                            <Instagram size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-black/40 uppercase tracking-widest group-hover:text-black transition-colors">Instagram</span>
                                    </div>
                                    <ChevronRight size={14} className="text-black/10 group-hover:text-black/40 transition-colors" />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/40 group-hover:bg-white transition-colors">
                                            <Twitter size={14} />
                                        </div>
                                        <span className="text-[10px] font-black text-black/40 uppercase tracking-widest group-hover:text-black transition-colors">Twitter (X)</span>
                                    </div>
                                    <ChevronRight size={14} className="text-black/10 group-hover:text-black/40 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
