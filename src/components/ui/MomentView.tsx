import { motion, AnimatePresence } from 'framer-motion';
import { Moment } from '@/hooks/useMoments';
import { X, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

interface MomentViewProps {
    moment: Moment | null;
    onClose: () => void;
}

export default function MomentView({ moment, onClose }: MomentViewProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(102);
    const [comments, setComments] = useState(moment?.comments || []);
    const [newComment, setNewComment] = useState("");

    if (!moment) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = { user: "@you", text: newComment };
        setComments([...comments, comment]);
        setNewComment("");
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur rounded-full text-white/80 hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Image Section - Cropped & Styled */}
                    <div className="relative aspect-[4/5] w-full bg-gray-900 shrink-0 overflow-hidden">
                        {/* Image positioned to crop top (BeReal logo) */}
                        <img
                            src={moment.realPhotoUrl || '/host-real.png'}
                            alt={moment.title}
                            className="w-full h-[115%] object-cover object-bottom -mt-[15%]"
                        />

                        {/* Overlay Gradient for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        {/* Text Info - Bottom Positioned */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                            <div className="flex flex-col gap-1">
                                <div className="px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10 flex items-center gap-1.5 w-fit">
                                    <span className="text-[10px] font-black text-white tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">MOMENT-A</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_cyan]"></span>
                                </div>
                                <p className="text-white text-xs font-medium drop-shadow-md">Miraflores, Lima</p>
                            </div>
                            <p className="text-white/80 text-xs font-mono drop-shadow-md">4:20 PM</p>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 flex flex-col bg-zinc-900 text-white overflow-hidden">
                        <div className="p-4 overflow-y-auto flex-1">
                            {/* Host Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden">
                                    <img src={moment.avatarUrl} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm leading-tight">{moment.influencer || moment.host}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Hosted by Pro Creator</p>
                                </div>
                            </div>

                            {/* Caption */}
                            <p className="text-sm text-gray-200 mb-4 font-light leading-relaxed">
                                {moment.description || "Live from the moment! 📸"}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-6 mb-6 border-b border-white/5 pb-4">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
                                >
                                    <Heart size={20} className={isLiked ? "fill-pink-500" : "group-hover:fill-pink-500"} />
                                    <span className="text-xs font-medium">{likesCount}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                                    <MessageCircle size={20} />
                                    <span className="text-xs font-medium">{comments.length}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors ml-auto">
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-3 pb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Comments</p>
                                {comments.map((comment, i) => (
                                    <div key={i} className="flex gap-2 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <span className="font-bold text-white shrink-0">{comment.user}</span>
                                        <span className="text-gray-400">{comment.text}</span>
                                    </div>
                                ))}
                                {comments.length === 0 && (
                                    <p className="text-xs text-gray-600 italic">No comments yet. Be the first!</p>
                                )}
                            </div>
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleAddComment} className="p-3 bg-black/40 border-t border-white/5 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-zinc-800/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                            />
                            {newComment.trim() && (
                                <button
                                    type="submit"
                                    className="text-cyan-400 font-bold text-xs px-3 hover:text-cyan-300 transition-colors"
                                >
                                    POST
                                </button>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
