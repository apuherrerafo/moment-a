'use client';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CreateFabProps {
    onClick: () => void;
}

export default function CreateFab({ onClick }: CreateFabProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="w-16 h-16 rounded-[2.2rem] bg-white text-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto border border-black/5 hover:bg-black hover:text-white transition-all group"
        >
            <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />

            <div className="absolute -top-12 right-0 bg-black text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                Create Vibe
            </div>
        </motion.button>
    );
}
