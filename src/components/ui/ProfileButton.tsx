'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, Settings, LogOut, Wallet, Shield, ChevronRight } from 'lucide-react';

export default function ProfileButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className="pointer-events-auto flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl shadow-black/5 pr-4 pl-1.5 py-1.5 rounded-full hover:scale-102 active:scale-98 transition-all group"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-cyan-600 group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <User size={16} />
                </div>
                <div className="flex flex-col items-start leading-none pr-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-black/20 mb-0.5">Active</span>
                    <span className="text-[11px] font-black uppercase tracking-tight text-black/80">apo_123</span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-white/40 backdrop-blur-md z-[100]"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                            className="absolute right-0 top-14 w-72 bg-white border border-black/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] z-[101] overflow-hidden p-2"
                        >
                            <div className="flex flex-col items-center pt-8 pb-8 bg-gradient-to-b from-gray-50/50 to-transparent rounded-[2.2rem] mb-2">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-black/5 p-1.5 shadow-xl mb-4">
                                    <div className="w-full h-full rounded-[1.8rem] bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                                        <User size={40} className="text-cyan-600/40" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-black text-black uppercase tracking-tighter leading-none">apo_123</h2>
                                <span className="text-[9px] text-black/30 mt-3 bg-black/5 px-4 py-2 rounded-full font-mono font-black tracking-widest uppercase">0x71C...92A</span>
                            </div>

                            <div className="space-y-1">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-black/5 rounded-[1.8rem] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                                            <Wallet size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-black/20 leading-none mb-1">Balance</p>
                                            <p className="text-sm font-black text-black leading-none tracking-tight">420.00 MoCoins</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-black/10 group-hover:text-black transition-colors" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 hover:bg-black/5 rounded-[1.8rem] transition-colors group">
                                    <div className="flex items-center gap-4 text-black/60 group-hover:text-black">
                                        <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center">
                                            <Shield size={18} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Security</span>
                                    </div>
                                    <ChevronRight size={16} className="text-black/10 transition-colors group-hover:text-black" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 hover:bg-black/5 rounded-[1.8rem] transition-colors group">
                                    <div className="flex items-center gap-4 text-black/60 group-hover:text-black">
                                        <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center">
                                            <Settings size={18} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
                                    </div>
                                    <ChevronRight size={16} className="text-black/10 transition-colors group-hover:text-black" />
                                </button>

                                <button className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-[1.8rem] transition-colors group mt-2">
                                    <div className="w-10 h-10 rounded-2xl bg-red-100/50 flex items-center justify-center">
                                        <LogOut size={18} />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Disconnect</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
