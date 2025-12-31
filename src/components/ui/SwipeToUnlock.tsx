'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface SwipeToUnlockProps {
    onUnlock: () => void;
    price: number;
    disabled?: boolean;
}

export default function SwipeToUnlock({ onUnlock, price, disabled }: SwipeToUnlockProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Calculate swipe range based on container width
    const [swipeRange, setSwipeRange] = useState(200);

    useEffect(() => {
        if (containerRef.current) {
            setSwipeRange(containerRef.current.offsetWidth - 60); // Refined for light version
        }
    }, []);

    const opacity = useTransform(x, [0, swipeRange * 0.4], [1, 0]);
    const background = useTransform(
        x,
        [0, swipeRange],
        ['rgba(0,0,0,0.03)', 'rgba(34,197,94,0.08)']
    );

    const handleDragEnd = () => {
        if (x.get() >= swipeRange - 10) {
            setIsUnlocked(true);
            onUnlock();
        } else {
            x.set(0);
        }
    };

    return (
        <motion.div
            ref={containerRef}
            style={{ background }}
            className={`relative h-14 rounded-full p-1 border border-black/5 overflow-hidden flex items-center shadow-inner ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: swipeRange }}
                dragElastic={0.05}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="z-20 w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-black/5 group"
            >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black group-active:scale-95 transition-transform">
                    <ChevronRight size={18} strokeWidth={3} />
                </div>
            </motion.div>

            <motion.div
                style={{ opacity }}
                className="absolute inset-x-0 flex items-center justify-center pointer-events-none"
            >
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/15 ml-8">
                    Swipe to Pay
                </span>
            </motion.div>

            <div className="absolute right-3 pointer-events-none flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
                <span className="text-[10px] font-black text-black leading-none">{price}</span>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center text-[7px] text-black font-black">M</div>
            </div>
        </motion.div>
    );
}
