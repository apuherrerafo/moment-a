'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Moment, Influencer } from '@/hooks/useMoments';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Zap, Star, Gift, ShieldCheck } from 'lucide-react';

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

  const HOTSPOTS = [
    { name: 'Miraflores', x: 45, y: 35, color: 'rgba(34, 211, 238, 0.2)', size: '200px' },
    { name: 'Larcomar', x: 50, y: 50, color: 'rgba(250, 204, 21, 0.15)', size: '180px' },
    { name: 'Barranco', x: 55, y: 60, color: 'rgba(168, 85, 247, 0.2)', size: '220px' },
    { name: 'San Isidro', x: 25, y: 45, color: 'rgba(59, 130, 246, 0.2)', size: '160px' },
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
    <div className="relative w-full h-full bg-[#f0f0f3] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#f0f0f3]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <motion.div
        className="relative w-[300%] lg:w-[200%] h-[300%] lg:h-[200%] cursor-grab active:cursor-grabbing"
        drag
        dragMomentum={false}
        animate={{
          scale: scale,
          x: offset.x - (typeof window !== 'undefined' && window.innerWidth < 1024 ? 350 : 200),
          y: offset.y - (typeof window !== 'undefined' && window.innerWidth < 1024 ? 350 : 200)
        }}
        transition={{ type: "spring", stiffness: 60, damping: 25 }}
      >
        <img
          src="/miraflores-map.jpg"
          alt="Map"
          className="w-full h-full object-cover pointer-events-none select-none opacity-40 grayscale contrast-125"
        />

        {HOTSPOTS.map((spot, i) => (
          <div
            key={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] animate-pulse pointer-events-none"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: spot.size,
              height: spot.size,
              backgroundColor: spot.color,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}

        {/* SVG Layer for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(0,0,0,0.1)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(0,0,0,0.4)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {moments.map(m => {
            const influencer = influencers.find(inf => inf.id === m.influencerId);
            if (!influencer) return null;

            const x1 = influencer.x;
            const y1 = influencer.y;
            const x2 = m.x;
            const y2 = m.y;

            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2 - 5;

            return (
              <motion.path
                key={`line-${m.id}`}
                d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="0.2"
                strokeDasharray="1 1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{
                  vectorEffect: 'non-scaling-stroke',
                  transform: 'none'
                }}
              />
            );
          })}
        </svg>

        {/* Unified Influencers & Friends layer */}
        <AnimatePresence>
          {influencers.map((inf) => {
            const connectedMoments = moments.filter(m => m.influencerId === inf.id);
            const hasMarket = connectedMoments.some(m => m.type === 'Shop');
            const hasRaffle = connectedMoments.some(m => m.isGiveaway);
            const hasMoment = connectedMoments.some(m => m.type === 'Live' || m.type === 'Secret' || m.type === 'Open');

            // Color mapping
            const borderColor = inf.tier === 'verified' ? 'border-cyan-500 shadow-cyan-500/20' :
              inf.tier === 'influencer' ? 'border-yellow-400 shadow-yellow-400/20' :
                'border-green-500 shadow-green-500/20';

            return (
              <motion.div
                key={inf.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
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
                  {/* Main Avatar Bubble */}
                  <div className={`
                                w-16 h-16 rounded-full border-4 shadow-2xl transition-all duration-500
                                ${borderColor}
                                bg-white backdrop-blur-md p-0.5 relative z-10
                            `}>
                    <img src={inf.avatar} className="w-full h-full object-cover rounded-full" alt={inf.name} />

                    {/* Verification Badge */}
                    {inf.tier === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full border-2 border-white flex items-center justify-center text-white z-30 shadow-lg">
                        <ShieldCheck size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>

                  {/* Bordering Icons (Activities) */}
                  <AnimatePresence>
                    {hasMarket && (
                      <motion.div
                        initial={{ scale: 0, x: 10 }} animate={{ scale: 1, x: 0 }}
                        className="absolute -right-3 bottom-4 w-7 h-7 bg-white rounded-full border border-black/5 shadow-xl flex items-center justify-center text-cyan-600 z-20"
                      >
                        <ShoppingCart size={14} strokeWidth={3} />
                      </motion.div>
                    )}

                    {hasRaffle && (
                      <motion.div
                        initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }}
                        className="absolute -left-3 top-2 w-7 h-7 bg-yellow-400 rounded-full border border-white shadow-xl flex items-center justify-center text-black z-20"
                      >
                        <Gift size={14} strokeWidth={3} />
                      </motion.div>
                    )}

                    {hasMoment && (
                      <motion.div
                        initial={{ scale: 0, x: 10, y: -10 }} animate={{ scale: 1, x: 0, y: 0 }}
                        className="absolute -right-2 -top-1 w-7 h-7 bg-black rounded-full border border-white shadow-xl flex items-center justify-center text-white z-20"
                      >
                        <Zap size={14} strokeWidth={3} fill="white" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Glow for Verified */}
                  {inf.tier === 'verified' && (
                    <div className="absolute -inset-3 border-2 border-cyan-500/20 rounded-full animate-pulse pointer-events-none" />
                  )}

                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black/90 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap z-30 border border-white/10 shadow-2xl">
                    {inf.handle}
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
