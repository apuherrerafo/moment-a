'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface LoginLauncherProps {
    onLoginSuccess: () => void;
}

export default function LoginLauncher({ onLoginSuccess }: LoginLauncherProps) {
    const [step, setStep] = useState<'welcome' | 'options' | 'login'>('welcome');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Mock login
        setTimeout(() => {
            if (email === 'pruebamomenta@gmail.com' && password === 'momenta') {
                onLoginSuccess();
            } else {
                setError('Invalid credentials. Try: pruebamomenta@gmail.com / momenta');
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden bg-white flex items-center justify-center font-sans">
            {/* BACKGROUND: Cozy Anime Roadtrip Vibe */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/login-bg.jpg"
                    className="w-full h-full object-cover"
                    alt="Cozy Anime Background"
                />
            </div>

            {/* TOP BAR */}
            <div className="absolute top-10 left-10 right-10 z-10 flex items-center justify-end pointer-events-none">
                <div className="bg-black/90 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 border border-white/10 pointer-events-auto">
                    <span className="text-white font-black uppercase tracking-[0.5em] text-[11px]">moment-a</span>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
                </div>
            </div>

            {/* LAUNCHER CARD */}
            <AnimatePresence mode="wait">
                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                        className="relative z-10 w-full max-w-[480px] p-20 bg-white/30 backdrop-blur-[50px] border border-white/40 rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] flex flex-col items-center text-center"
                    >
                        <div className="w-32 h-32 mb-12 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                            <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=peace&backgroundColor=b6e3f4" className="w-24 h-24 relative z-10 object-contain drop-shadow-2xl" alt="Logo" />
                        </div>

                        <div className="mb-8 px-4">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Sparkles size={16} className="text-purple-600" />
                                <span className="text-[10px] font-black text-black uppercase tracking-[0.15em]">
                                    Donde los Creadores Conocen a su Comunidad
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-black tracking-tight leading-[1.1] mb-6">
                                Apoya a los Creadores,<br />
                                Gana Premios Increíbles
                            </h1>
                        </div>

                        <p className="text-black text-[11px] font-medium leading-relaxed mb-12 px-12 max-w-md">
                            Únete a niveles de membresía exclusivos de tus creadores favoritos y obtén entradas automáticas a increíbles eventos de sorteos.
                        </p>

                        <button
                            onClick={() => setStep('options')}
                            className="w-full max-w-[200px] py-4 bg-[#2563EB] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-blue-500/40"
                        >
                            Start
                        </button>
                    </motion.div>
                )}

                {step === 'options' && (
                    <motion.div
                        key="options"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="relative z-10 w-full max-w-[480px] p-20 bg-white/80 backdrop-blur-[50px] border border-white rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] flex flex-col items-center"
                    >
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-10">Bienvenido</h2>

                        <div className="w-full space-y-4">
                            <button
                                onClick={() => setStep('login')}
                                className="w-full py-5 bg-[#2563EB] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
                            >
                                <Sparkles size={16} />
                                Login to Account
                            </button>
                            <button
                                className="w-full py-5 bg-black/5 border border-black/10 text-black/40 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black/10 transition-all flex items-center justify-center gap-3"
                            >
                                <Zap size={16} />
                                Create Account
                            </button>
                        </div>

                        <button
                            onClick={() => setStep('welcome')}
                            className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            Back to Start
                        </button>
                    </motion.div>
                )}

                {step === 'login' && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10 w-full max-w-[480px] p-20 bg-white/80 backdrop-blur-[50px] border border-white rounded-[3.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] flex flex-col items-center"
                    >
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-10 self-start">Login</h2>

                        <form onSubmit={handleLogin} className="w-full space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-black/5 border border-black/10 rounded-2xl py-5 px-8 text-black placeholder:text-black/10 focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] ml-2">Secure Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/5 border border-black/10 rounded-2xl py-5 px-8 text-black placeholder:text-black/10 focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={twMerge(
                                    "w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3",
                                    loading
                                        ? "bg-black/10 text-black/20 cursor-wait"
                                        : "bg-[#2563EB] text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95 shadow-blue-500/30"
                                )}
                            >
                                {loading ? "Verifying..." : "Access Dashboard"}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <button
                            onClick={() => setStep('options')}
                            className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            Back to Options
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }} />
        </div>
    );
}
