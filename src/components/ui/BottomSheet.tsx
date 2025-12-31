'use client';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    className?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title, className }: BottomSheetProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const onDragEnd = (event: any, info: PanInfo) => {
        if (!isMobile) return;
        if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-white/40 backdrop-blur-md pointer-events-auto"
                    />

                    {/* Sheet / Modal Container */}
                    <motion.div
                        initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 20 }}
                        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
                        exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        drag={isMobile ? "y" : false}
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.05}
                        dragSnapToOrigin
                        onDragEnd={onDragEnd}
                        className={twMerge(
                            "relative z-50 overflow-hidden pointer-events-auto flex flex-col shadow-2xl transition-all duration-300",
                            isMobile
                                ? "w-full rounded-t-[40px] bg-white max-h-[92vh]"
                                : "w-[700px] rounded-[40px] bg-white/90 backdrop-blur-3xl border border-black/5 max-h-[85vh]",
                            className
                        )}
                    >
                        {/* Drag Handle (Mobile Only) */}
                        {isMobile && (
                            <div className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none shrink-0">
                                <div className="w-12 h-1.5 rounded-full bg-black/5" />
                            </div>
                        )}

                        {/* Top Bar for Desktop / Header for Mobile */}
                        <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
                            <div className="flex flex-col">
                                {title && <h2 className="text-xl font-black text-black uppercase tracking-tighter leading-none">{title}</h2>}
                                {!isMobile && <p className="text-[10px] text-black/20 font-black uppercase tracking-widest mt-2 ml-0.5">Moment Space Preview</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all active:scale-90"
                                aria-label="Close"
                            >
                                <X size={20} className="text-black/40" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10 custom-light-scroll">
                            <div className="text-black/80">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
