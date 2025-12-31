'use client';

import { motion } from 'framer-motion';
import { Star, Zap, Crown, Check, Ticket, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface TierProps {
    id: string;
    name: string;
    price: string;
    icon: React.ReactNode;
    features: string[];
    raffleEntries: number;
    popular?: boolean;
    color: string;
    bgHover: string;
}

const TIERS: TierProps[] = [
    {
        id: 'bronze',
        name: 'Bronze',
        price: '9.99',
        icon: <Star size={24} />,
        color: 'text-gray-400',
        bgHover: 'hover:border-gray-300',
        raffleEntries: 1,
        features: [
            'Access to exclusive content',
            'Monthly Q&A session',
            'Exclusive Discord channel',
            'Early access to new content'
        ]
    },
    {
        id: 'silver',
        name: 'Silver',
        price: '19.99',
        icon: <Zap size={24} />,
        color: 'text-purple-500',
        bgHover: 'hover:border-purple-300',
        popular: true,
        raffleEntries: 3,
        features: [
            'All Bronze benefits',
            'Weekly live streams',
            'Personalized mentions',
            'Behind-the-scenes content',
            'Priority support'
        ]
    },
    {
        id: 'gold',
        name: 'Gold',
        price: '49.99',
        icon: <Crown size={24} />,
        color: 'text-yellow-500',
        bgHover: 'hover:border-yellow-300',
        raffleEntries: 10,
        features: [
            'All Silver benefits',
            'Monthly 1-on-1 video call',
            'Custom content requests',
            'Exclusive merchandise',
            'VIP event access',
            'Name in credits'
        ]
    }
];

export default function MembershipTiers({ onSubscribe }: { onSubscribe: (tier: string) => void }) {
    return (
        <div className="w-full h-full overflow-y-auto no-scrollbar py-12 px-6 lg:px-12 bg-white/10 backdrop-blur-3xl rounded-[3rem]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4 block"
                    >
                        Premium Access
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tighter mb-4"
                    >
                        Membership <span className="text-purple-600">Tiers</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em]"
                    >
                        Support your favorite creators & unlock the ecosystem
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {TIERS.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                            className={twMerge(
                                "relative p-8 lg:p-10 rounded-[3rem] bg-white border-2 border-transparent transition-all duration-500 flex flex-col h-full",
                                tier.popular
                                    ? "border-purple-500/30 shadow-[0_40px_80px_-15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/10"
                                    : "border-black/5 shadow-xl shadow-black/5",
                                tier.bgHover
                            )}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-purple-600/30 z-10 whitespace-nowrap">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-10 flex flex-col items-center">
                                <div className={twMerge(
                                    "w-16 h-16 rounded-[1.8rem] flex items-center justify-center mb-6 shadow-sm border border-black/5",
                                    tier.id === 'bronze' ? "bg-gray-50 text-gray-500" :
                                        tier.id === 'silver' ? "bg-purple-500 text-white shadow-purple-500/20" :
                                            "bg-yellow-500 text-white shadow-yellow-500/20"
                                )}>
                                    {tier.icon}
                                </div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-black tracking-tighter">${tier.price}</span>
                                    <span className="text-[10px] font-black text-black/20 uppercase tracking-widest">/mo</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-10 pt-8 border-t border-black/5">
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 p-1 rounded-full bg-green-500/10 text-green-600 shrink-0">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-[11px] font-black text-black/40 uppercase tracking-tight group-hover:text-black transition-colors">{feature}</span>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-black/5">
                                    <div className="flex items-center gap-3 text-purple-600">
                                        <Ticket size={14} className="animate-pulse" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">{tier.raffleEntries}x entries per raffle</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onSubscribe(tier.id)}
                                className={twMerge(
                                    "w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl",
                                    tier.popular
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-600/20 hover:shadow-purple-600/40"
                                        : "bg-gray-100 text-black/40 hover:bg-black hover:text-white"
                                )}
                            >
                                Subscribe Now
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
                        Cancellations are as easy as a single tap. Member status updates instantly across the orbital ecosystem.
                    </p>
                </div>
            </div>
        </div>
    );
}
