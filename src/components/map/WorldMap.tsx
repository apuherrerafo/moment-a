'use client';
import React, { useState, useEffect } from 'react';
import { Moment, Influencer } from '@/hooks/useMoments';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface WorldMapProps {
  moments?: Moment[];
  influencers?: Influencer[];
  onMomentSelect?: (moment: Moment) => void;
  onInfluencerSelect?: (influencer: Influencer) => void;
  focusLocation?: { x: number; y: number } | null;
}

export default function WorldMap({
  moments = [],
  influencers = [],
  onMomentSelect,
  onInfluencerSelect,
  focusLocation
}: WorldMapProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Concentric Rings Configuration
  const RINGS = [
    { radius: 15, opacity: 0.15, dash: "4 8" },
    { radius: 25, opacity: 0.1, dash: "2 4" },
    { radius: 35, opacity: 0.08, dash: "0" },
    { radius: 45, opacity: 0.05, dash: "8 16" },
  ];

  useEffect(() => {
    if (focusLocation) {
      setOffset({
        x: (50 - focusLocation.x) * 10,
        y: (50 - focusLocation.y) * 10
      });
      setScale(1.5);
    }
  }, [focusLocation]);

  return (
    <div className="relative w-full h-full bg-[#f8f9fa] overflow-hidden flex items-center justify-center">
      {/* Ecosystem Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 via-white to-gray-50"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Animated Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/30 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-100/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        className="relative w-[300%] lg:w-[200%] h-[300%] lg:h-[200%] cursor-grab active:cursor-grabbing flex items-center justify-center"
        drag
        dragMomentum={false}
        animate={{
          scale: scale,
          x: offset.x,
          y: offset.y
        }}
        transition={{ type: "spring", stiffness: 60, damping: 25 }}
      >
        {/* Orbital Rings Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {RINGS.map((ring, i) => (
            <motion.circle
              key={i}
              cx="50%"
              cy="50%"
              r={`${ring.radius}%`}
              fill="none"
              stroke="rgba(0,0,0,1)"
              strokeWidth="0.5"
              strokeDasharray={ring.dash}
              style={{ opacity: ring.opacity }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: ring.opacity }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          ))}
        </svg>

        {/* Central Core (User) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="w-12 h-12 rounded-full bg-black shadow-2xl flex items-center justify-center border-4 border-white">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
        </div>

        {/* Profiles / Ecosystem Inhabitants */}
        <AnimatePresence>
          {influencers.map((inf, idx) => {
            const connectedMoments = moments.filter(m => m.influencerId === inf.id);
            const isVerified = inf.tier === 'verified';

            // Tier based styling
            const borderColor = isVerified
              ? 'border-yellow-400'
              : inf.tier === 'influencer'
                ? 'border-cyan-500'
                : 'border-white';

            return (
              <motion.div
                key={inf.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -10, 0], // Subtle floating animation
                }}
                transition={{
                  scale: { duration: 0.5, delay: idx * 0.05 },
                  y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.1, zIndex: 110 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                style={{ left: `${inf.x}%`, top: `${inf.y}%` }}
                onClick={() => {
                  if (connectedMoments.length > 0) {
                    onMomentSelect?.(connectedMoments[0]);
                  } else {
                    onInfluencerSelect?.(inf);
                  }
                }}
              >
                <div className="relative">
                  {/* GOLD GLOW INTERMITTENTE (Premium Subscription Effect) */}
                  {isVerified && (
                    <>
                      <div className="absolute -inset-6 rounded-full bg-yellow-400/20 blur-3xl animate-[pulse_1.5s_infinite] mix-blend-screen" />
                      <div className="absolute -inset-2 rounded-full border border-yellow-400/30 animate-[spin_4s_linear_infinite]" />
                    </>
                  )}

                  <div className={twMerge(
                    "w-16 h-16 rounded-full border-4 shadow-2xl transition-all duration-500 bg-white p-0.5 relative z-10",
                    borderColor,
                    isVerified && "shadow-[0_0_40px_rgba(250,204,21,0.6)] border-yellow-400"
                  )}>
                    <img src={inf.avatar} className="w-full h-full object-cover rounded-full" alt={inf.name} />

                    {/* Intermittent Sparkle */}
                    {isVerified && (
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                      >
                        <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                      </motion.div>
                    )}
                  </div>

                  {/* Badges / Interactions Count */}
                  <div className="absolute -top-2 -right-2 bg-black text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase z-20 border border-white/20">
                    {connectedMoments.length > 0 ? 'Live' : 'Feed'}
                  </div>

                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black/90 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap z-30 border border-white/10 shadow-2xl">
                    <span className={isVerified ? "text-yellow-400" : ""}>{inf.handle}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
