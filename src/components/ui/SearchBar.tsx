'use client';
import { Search, MapPin, Sparkles, Target } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface SearchBarProps {
    onLocationSelect: (x: number, y: number, name: string) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');

    const SEARCH_SUGGESTIONS = [
        { name: 'Larcomar Hotspot', desc: 'Shop & Events', x: 50, y: 50, type: 'active', tag: 'Trending' },
        { name: 'Barranco Vibes', desc: 'Music & Art', x: 55, y: 60, type: 'zone', tag: 'Live Now' },
        { name: 'Miraflores Central', desc: 'Active Moments', x: 45, y: 35, type: 'zone', tag: 'Busy' },
        { name: 'San Isidro Biz', desc: 'Networking', x: 25, y: 45, type: 'zone', tag: 'Open' },
        { name: 'After Beach Party', desc: 'Social & Fun', x: 48, y: 52, type: 'active', tag: 'New' },
    ];

    const filteredSuggestions = useMemo(() => {
        if (!query) return SEARCH_SUGGESTIONS;
        return SEARCH_SUGGESTIONS.filter(s =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.desc.toLowerCase().includes(query.toLowerCase()) ||
            s.tag.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const handleSelect = (loc: typeof SEARCH_SUGGESTIONS[0]) => {
        onLocationSelect(loc.x, loc.y, loc.name);
        setIsExpanded(false);
        setQuery('');
    };

    return (
        <div className="flex-1 w-full">
            <motion.div
                layout
                initial={{ borderRadius: '9999px' }}
                animate={{
                    borderRadius: isExpanded ? '48px' : '9999px',
                }}
                className={twMerge(
                    "bg-white/40 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden w-full transition-all duration-500",
                    isExpanded ? "bg-white/90" : ""
                )}
            >
                <div className="flex items-center lg:px-8 px-4 py-4 lg:py-6">
                    <div className={`w-6 h-6 flex items-center justify-center lg:mr-4 mr-2 transition-colors ${isExpanded ? 'text-black' : 'text-black/20'}`}>
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH"
                        className="bg-transparent border-none outline-none text-black w-full placeholder:text-black/10 text-[11px] font-black uppercase tracking-[0.2em] focus:placeholder:text-black/5 transition-all"
                        value={query}
                        onFocus={() => setIsExpanded(true)}
                        onBlur={() => !query && setTimeout(() => setIsExpanded(false), 200)}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-black/5 rounded-full" />
                        <button className="text-black/20 hover:text-black transition-colors">
                            <Target size={18} />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-black/5 bg-white/50"
                        >
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-10 pt-2">
                                {!query && (
                                    <div className="flex gap-2.5 px-1 py-4 overflow-x-auto no-scrollbar">
                                        {['LATEST DROPS', 'TRENDING', 'NEAR ME', 'GIVEAWAYS'].map(chip => (
                                            <button
                                                key={chip}
                                                onClick={() => setQuery(chip)}
                                                className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-[9px] font-black text-black/40 hover:text-black hover:bg-gray-100 whitespace-nowrap uppercase tracking-widest shadow-sm transition-all"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="px-3 py-2 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">
                                        {query ? 'Global Results' : 'Suggested Hotspots'}
                                    </span>
                                    {!query && <span className="text-[8px] font-black text-black/10 uppercase tracking-widest">5 Local active</span>}
                                </div>

                                <div className="space-y-2">
                                    {filteredSuggestions.map((loc, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(loc)}
                                            className="w-full flex items-center p-4 hover:bg-white rounded-[2.2rem] transition-all group border border-transparent hover:border-black/5 hover:shadow-xl hover:shadow-black/5"
                                        >
                                            <div className={`w-14 h-14 rounded-[1.3rem] flex items-center justify-center mr-5 shadow-sm 
                                                ${loc.type === 'active' ? 'bg-cyan-500/5 text-cyan-600 border border-cyan-500/10' : 'bg-gray-100 text-black/20 border border-black/5'}`}>
                                                {loc.type === 'active' ? <Sparkles size={22} /> : <MapPin size={22} />}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-black font-black text-sm uppercase tracking-tighter truncate leading-none mr-4">{loc.name}</span>
                                                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black leading-none uppercase tracking-widest whitespace-nowrap
                                                        ${loc.tag === 'Trending' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-black/30'}`}>
                                                        {loc.tag}
                                                    </div>
                                                </div>
                                                <div className="text-black/20 text-[10px] font-black uppercase tracking-wider">{loc.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
