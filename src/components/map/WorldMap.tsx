'use client';
import React, { useState, useEffect } from 'react';
import { Moment, Influencer } from '@/hooks/useMoments';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { ShoppingCart, Zap, Gift } from 'lucide-react';

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

  const [lastPinchDist, setLastPinchDist] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (focusLocation) {
      setOffset({
        x: (50 - focusLocation.x) * 10,
        y: (50 - focusLocation.y) * 10
      });
      setScale(1.5);
    }
  }, [focusLocation]);

  // Handle Mouse Move for Background Waves
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsMoving(true);
  };

  // Handle Zoom Scroll (PC)
  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.3, scale + delta), 4);
    setScale(newScale);
  };

  // Handle Pinch Zoom & Waves (Mobile)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setIsMoving(true);
    }

    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );

      if (lastPinchDist !== null) {
        const delta = (dist - lastPinchDist) * 0.01;
        setScale(prev => Math.min(Math.max(0.3, prev + delta), 4));
      }
      setLastPinchDist(dist);
    }
  };

  const handleTouchEnd = () => {
    setLastPinchDist(null);
    setTimeout(() => setIsMoving(false), 1000);
  };

  return (
    <div
      className="relative w-full h-full bg-[#f8f9fa] overflow-hidden flex items-center justify-center touch-none"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsMoving(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ecosystem Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 via-white to-gray-50"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Animated Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/30 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-100/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* INTERACTIVE MOUSE WAVES (Ripple Effect) */}
        <AnimatePresence>
          {isMoving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none fixed inset-0 z-0"
              style={{ left: 0, top: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  initial={{ width: 0, height: 0, opacity: 0.6, x: mousePos.x, y: mousePos.y }}
                  animate={{
                    width: 500,
                    height: 500,
                    opacity: 0,
                    x: mousePos.x - 250,
                    y: mousePos.y - 250
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

        {/* Moments Layer (Icons/Hotspots) */}
        <AnimatePresence>
          {moments.map((moment, idx) => {
            const isShop = moment.type === 'Shop';
            const isGiveaway = moment.isGiveaway;

            return (
              <motion.div
                key={moment.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.2, zIndex: 100 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: `${moment.x}%`, top: `${moment.y}%` }}
                onClick={() => onMomentSelect?.(moment)}
              >
                <div className="relative group/moment">
                  <div className={twMerge(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all duration-300",
                    isShop
                      ? "bg-yellow-400 border-yellow-500 text-black shadow-yellow-400/20"
                      : "bg-black border-white/10 text-white shadow-black/20"
                  )}>
                    {isShop ? <ShoppingCart size={18} /> : <Zap size={18} fill="currentColor" />}

                    {/* Giveaway Badge */}
                    {isGiveaway && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg animate-bounce">
                        <Gift size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Subtle Radar Ripple */}
                  <div className={twMerge(
                    "absolute inset-0 rounded-2xl animate-ping opacity-20",
                    isShop ? "bg-yellow-400" : "bg-cyan-400"
                  )} style={{ animationDuration: '3s' }} />

                  {/* Label on Hover */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/moment:opacity-100 transition-all bg-black px-2 py-1 rounded text-[7px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                    {moment.title}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Profiles / Ecosystem Inhabitants */}
        <AnimatePresence>
          {influencers.map((inf, idx) => {
            const connectedMoments = moments.filter(m => m.influencerId === inf.id);
            const isVerified = inf.tier === 'verified';
            const isLive = inf.isLive;

            // Tier based styling
            const isFriend = inf.tier === 'friend';
            const borderColor = isVerified
              ? 'border-yellow-400'
              : inf.tier === 'influencer'
                ? 'border-cyan-500'
                : isFriend
                  ? 'border-green-500'
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
                onClick={() => onInfluencerSelect?.(inf)}
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
                    isVerified && "shadow-[0_0_40px_rgba(250,204,21,0.6)] border-yellow-400",
                    isFriend && "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
                    isLive && "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                  )}>
                    <img src={inf.avatar} className="w-full h-full object-cover rounded-full" alt={inf.name} />

                    {/* Intermittent Sparkle / Live Indicator */}
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

                  {/* LIVE / FEED BADGE */}
                  <div className={twMerge(
                    "absolute -top-2 -right-2 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase z-20 border border-white/20 shadow-lg transition-colors",
                    isLive
                      ? "bg-red-500 text-white animate-[pulse_1s_infinite]"
                      : "bg-black text-white"
                  )}>
                    {isLive ? 'LIVE' : 'FEED'}
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
