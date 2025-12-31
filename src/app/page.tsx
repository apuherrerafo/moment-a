'use client';

import WorldMap from '@/components/map/WorldMap';
import BottomSheet from '@/components/ui/BottomSheet';
import SearchBar from '@/components/ui/SearchBar';
import ProfileButton from '@/components/ui/ProfileButton';
import LiveRoom from '@/components/ui/LiveRoom';
import MomentView from '@/components/ui/MomentView';
import CreateFab from '@/components/ui/CreateFab';
import TrendingSorteos from '@/components/ui/TrendingSorteos';
import CommunityFeed from '@/components/ui/CommunityFeed';
import { useState, useEffect } from 'react';
import { useMoments, Moment, Influencer } from '@/hooks/useMoments';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Star, Gift, Crown, Info, Lock, Play, ChevronDown, Heart, MessageSquare, Terminal, Ticket, UserCheck, Share2, MoreHorizontal } from 'lucide-react';
import ContactRoom from '@/components/ui/ContactRoom';
import RaffleConsole from '@/components/ui/RaffleConsole';
import LoginLauncher from '@/components/auth/LoginLauncher';
import { twMerge } from 'tailwind-merge';

export default function Home() {
  const { moments, influencers, loading, addMoment } = useMoments();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [selectedContact, setSelectedContact] = useState<Influencer | null>(null);
  const [activeMoment, setActiveMoment] = useState<Moment | null>(null);
  const [unlockedMomentIds, setUnlockedMomentIds] = useState<string[]>([]);
  const [viewMoment, setViewMoment] = useState<Moment | null>(null);
  const [focusLocation, setFocusLocation] = useState<{ x: number; y: number } | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isPostDetail, setIsPostDetail] = useState(false);

  // Payment Flow State
  const [walletBalance, setWalletBalance] = useState(420);
  const [activeTab, setActiveTab] = useState<'info' | 'raffle' | 'market'>('info');
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!selectedMoment) {
      setIsPostDetail(false);
    }
  }, [selectedMoment]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (selectedMoment?.raffleDate) {
        const target = new Date(selectedMoment.raffleDate).getTime();
        const now = new Date().getTime();
        const diff = target - now;
        if (diff > 0) {
          setTimeLeft({
            d: Math.floor(diff / (1000 * 60 * 60 * 24)),
            h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((diff % (1000 * 60)) / 1000)
          });
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedMoment]);

  const handleLocationSelect = (x: number, y: number, name: string) => {
    setFocusLocation({ x, y });
  };

  const handleUnlock = (momentId: string) => {
    setUnlockedMomentIds(prev => [...prev, momentId]);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#eab308', '#ffffff']
    });
    if (selectedMoment?.isGiveaway) {
      setIsConsoleOpen(true);
    }
  };

  const handleCreate = () => {
    const newMoment: Moment = {
      id: Date.now().toString(),
      title: 'New Community Drop',
      host: 'You',
      avatarUrl: '/avatar-host.png',
      capacity: { current: 1, max: 100 },
      attendees: [{ name: 'You', avatar: '/avatar-host.png' }],
      viewers: 1,
      timeLeft: '24h',
      type: 'Open',
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      zone: 'Realtime',
      tags: ['New', 'Live']
    };
    addMoment(newMoment);
    setFocusLocation({ x: newMoment.x, y: newMoment.y });
    setTimeout(() => setSelectedMoment(newMoment), 500);
  };

  const handleConfirmPayment = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(e => console.log('Audio play blocked'));
    if (walletBalance >= 5) {
      setWalletBalance(prev => prev - 5);
      handleUnlock(selectedMoment?.id || '');
    } else {
      alert("Not enough MoCoins!");
    }
  };

  const handlePurchaseItem = (price: number, itemName: string) => {
    if (walletBalance >= price) {
      setWalletBalance(prev => prev - price);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#10b981', '#ffffff']
      });
      alert(`Successfully purchased ${itemName}!`);
    } else {
      alert("Not enough MoCoins for this item!");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isLoggedIn ? (
        <LoginLauncher key="launcher" onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <motion.main
          key="app"
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="h-screen w-screen overflow-hidden relative font-sans lg:p-6 p-0 text-black"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/login-bg.jpg"
              className="w-full h-full object-cover opacity-30"
              alt="Background"
            />
          </div>


          {/* Header Controls - Improved for Mobile */}
          <div className="absolute top-6 lg:top-12 left-0 right-0 z-20 px-6 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-3 w-full max-w-2xl pointer-events-auto">
              <div className="flex-1 bg-white/40 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl">
                <SearchBar onLocationSelect={handleLocationSelect} />
              </div>
              <div className="flex-shrink-0">
                <ProfileButton />
              </div>
            </div>
          </div>

          <div className="relative z-10 h-full w-full">
            <div className="h-full w-full bg-white/40 backdrop-blur-xl lg:border border-none border-white/20 lg:rounded-[4rem] rounded-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] flex overflow-hidden">
              <div className="hidden lg:block w-64 h-full border-r border-white/20 bg-white/30 backdrop-blur-md">
                <TrendingSorteos
                  sorteos={moments}
                  onSelect={(m) => {
                    setSelectedMoment(m);
                    setFocusLocation({ x: m.x, y: m.y });
                  }}
                />
              </div>

              <div className="flex-1 h-full relative bg-transparent">
                <div className="absolute inset-0 z-0">
                  <WorldMap
                    moments={moments}
                    influencers={influencers}
                    onMomentSelect={(m) => {
                      setSelectedMoment(m);
                      setActiveTab('info');
                    }}
                    onInfluencerSelect={(inf) => {
                      setSelectedContact(inf);
                    }}
                    focusLocation={focusLocation}
                  />
                </div>


                <div className="absolute bottom-8 right-8 z-10 pointer-events-auto">
                  <CreateFab onClick={handleCreate} />
                </div>
              </div>

              <div className="hidden xl:block w-80 h-full border-l border-white/20 bg-white/30 backdrop-blur-md">
                <CommunityFeed
                  unlockedMoments={moments.filter(m => unlockedMomentIds.includes(m.id))}
                  onMomentSelect={(m) => {
                    setSelectedMoment(m);
                    setActiveTab('info');
                  }}
                />
              </div>
            </div>
          </div>

          <BottomSheet
            isOpen={!!selectedMoment}
            onClose={() => setSelectedMoment(null)}
            title={selectedMoment?.title}
            className="bg-white/80 backdrop-blur-3xl"
          >
            {selectedMoment && (
              <div className="space-y-6 pb-20 no-scrollbar">
                {/* Header / Host Info */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-[1.5rem] border-2 shadow-2xl shadow-black/5 overflow-hidden p-0.5 ${selectedMoment.type === 'Shop' ? 'border-yellow-400 bg-yellow-400/10' : 'border-cyan-500 bg-cyan-500/10'}`}>
                        <img
                          src={selectedMoment.avatarUrl || '/avatar-host.png'}
                          alt={selectedMoment.host}
                          className="w-full h-full object-cover rounded-[1.3rem]"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-black leading-none tracking-tighter uppercase">
                          {selectedMoment.title}
                        </h2>
                        <p
                          onClick={() => {
                            const inf = influencers.find(i => i.id === selectedMoment.influencerId || i.handle === (selectedMoment.influencer || selectedMoment.host));
                            if (inf) setSelectedContact(inf);
                          }}
                          className="text-black/30 text-[9px] mt-2 flex items-center gap-2 font-black uppercase tracking-widest cursor-pointer hover:text-black transition-colors"
                        >
                          <span className={selectedMoment.type === 'Shop' ? "text-yellow-600 underline" : "text-cyan-600 underline"}>
                            {selectedMoment.influencer || selectedMoment.host}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-black/10"></span>
                          <span>{selectedMoment.zone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedMoment.voiceUrl && (
                        <button
                          onClick={() => {
                            const audio = new Audio(selectedMoment.voiceUrl);
                            audio.play().catch(e => console.log('Audio play blocked'));
                          }}
                          className="w-12 h-12 bg-black text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                        >
                          <Play size={16} fill="currentColor" />
                        </button>
                      )}

                      {selectedMoment.realPhotoUrl && !isPostDetail && (
                        <motion.div
                          layoutId="post-vibe-thumb"
                          onClick={() => setIsPostDetail(true)}
                          className="relative rotate-3 transform hover:rotate-0 transition-transform duration-300 cursor-pointer"
                        >
                          <div className="w-12 h-14 rounded-xl overflow-hidden border-2 border-black/5 shadow-2xl relative bg-zinc-100">
                            <img src={selectedMoment.realPhotoUrl} className="w-full h-full object-cover" alt="Real" />
                          </div>
                        </motion.div>
                      )}

                      {isPostDetail && (
                        <button
                          onClick={() => setIsPostDetail(false)}
                          className="px-6 py-3 bg-black/5 hover:bg-black/10 rounded-full transition-colors group flex items-center gap-2"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-black">Back</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {!isPostDetail && (
                    <div className="flex bg-gray-100 p-1 rounded-full border border-black/5 shadow-inner">
                      {[
                        { id: 'info', label: 'Moment' },
                        { id: 'raffle', label: 'Raffle' },
                        { id: 'market', label: 'Market' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={twMerge(
                            "flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-full transition-all relative flex items-center justify-center gap-2",
                            activeTab === tab.id
                              ? (tab.id === 'market' ? "bg-yellow-400 text-black shadow-lg" : "bg-black text-white shadow-xl")
                              : "text-black/30 hover:text-black/50"
                          )}
                        >
                          {tab.label}
                          {tab.id === 'market' && selectedMoment.marketItems && (
                            <span className={twMerge(
                              "px-2 py-0.5 rounded text-[8px] leading-none font-black",
                              activeTab === 'market' ? "bg-black text-yellow-400" : "bg-black/10 text-black/40"
                            )}>
                              {selectedMoment.marketItems.length}
                            </span>
                          )}
                          {tab.id === 'raffle' && selectedMoment.isGiveaway && (
                            <span className={twMerge(
                              "px-2 py-0.5 rounded text-[8px] leading-none font-black",
                              activeTab === 'raffle' ? "bg-yellow-400 text-black" : "bg-black/10 text-black/40"
                            )}>
                              1
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {isPostDetail ? (
                    <motion.div
                      key="post-detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-6"
                    >
                      <div className="bg-white border border-black/5 rounded-[3rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-8">
                        <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 bg-gray-50">
                          <img
                            src={selectedMoment.realPhotoUrl || selectedMoment.unlockedImageUrl}
                            className="w-full h-full object-cover"
                            alt="Moment Detail"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                          <div className="absolute bottom-6 left-6 flex flex-col gap-1">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 w-fit">
                              <span className="text-[8px] font-black text-white tracking-[0.2em] uppercase">Vibe captured</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            </div>
                            <span className="text-white font-black text-lg uppercase tracking-tighter">{selectedMoment.zone}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-8 px-2">
                          <div className="flex items-center gap-10">
                            <div className="flex items-center gap-3 group cursor-pointer">
                              <div className="p-4 rounded-3xl bg-pink-500/5 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                                <Heart size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black">102</span>
                                <span className="text-[9px] font-black text-black/20 uppercase tracking-[0.2em] leading-none mt-1">Likes</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                              <div className="p-4 rounded-3xl bg-cyan-500/5 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                                <MessageSquare size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black">{selectedMoment.comments?.length || 0}</span>
                                <span className="text-[9px] font-black text-black/20 uppercase tracking-[0.2em] leading-none mt-1">Comments</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6 pt-6 border-t border-black/5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-black/20">Community Feed</h4>
                            <div className="space-y-4">
                              {(selectedMoment.comments || [
                                { user: '@art_lover', text: 'THIS SCULPTURE IS AMAZING! 🔥' },
                                { user: '@limafan', text: 'CAN\'T WAIT FOR THE DROP.' }
                              ]).map((c, i) => (
                                <div key={i} className="flex gap-4">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-tight text-black">{c.user}</span>
                                    <span className="text-[11px] text-black/50 font-medium uppercase tracking-tight line-clamp-2">{c.text}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : activeTab === 'info' ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div
                        onClick={() => {
                          if (unlockedMomentIds.includes(selectedMoment.id) && selectedMoment.isGiveaway) {
                            setIsConsoleOpen(true);
                          }
                        }}
                        className={twMerge(
                          "relative group overflow-hidden rounded-[2.8rem] border border-black/5 bg-gray-100 aspect-[4/3] shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500",
                          unlockedMomentIds.includes(selectedMoment.id) ? "cursor-pointer" : ""
                        )}
                      >
                        <img
                          src={(unlockedMomentIds.includes(selectedMoment.id) && selectedMoment.unlockedImageUrl) ? selectedMoment.unlockedImageUrl : (selectedMoment.realPhotoUrl || '/host-real.png')}
                          className={`w-full h-full object-cover transition-all duration-1000 ${!unlockedMomentIds.includes(selectedMoment.id) ? 'blur-2xl scale-110 grayscale opacity-30 px-10' : 'blur-0 scale-100 opacity-100'}`}
                          alt="Story"
                        />
                        <div className="absolute top-6 left-6 flex flex-col gap-3">
                          <div className="flex items-center gap-2.5 px-4 py-2 bg-yellow-400 text-black rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl border border-yellow-500/20">
                            <Gift size={14} />
                            {selectedMoment.raffleDate ? `SORTEO 05.01 1:00PM` : `SORTEO ACTIVO`}
                          </div>
                          {timeLeft && (
                            <div className="px-4 py-2 bg-white/40 backdrop-blur-xl text-black rounded-full font-black text-[9px] uppercase tracking-widest flex items-center gap-3 border border-white/40 shadow-xl">
                              <span className="text-yellow-600">{timeLeft.d}D</span>
                              <span className="text-black/40">{timeLeft.h}H</span>
                              <span className="text-black/40">{timeLeft.m}M</span>
                              <span className="w-4 text-cyan-600">{timeLeft.s}S</span>
                            </div>
                          )}
                        </div>

                        {!unlockedMomentIds.includes(selectedMoment.id) && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/60 backdrop-blur-3xl">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-black/5 border border-black/5 flex items-center justify-center text-black/10 mb-2">
                              <Lock size={36} />
                            </div>
                            <div className="text-center px-10">
                              <h4 className="text-xl font-black text-black uppercase tracking-tighter leading-none mb-3">Locked Vibe</h4>
                              <p className="text-[10px] text-black/30 font-black uppercase tracking-[0.2em] leading-relaxed mb-6">Unlock to join the session & win exclusive pieces</p>
                              <div className="w-full max-w-[260px] mx-auto">
                                <button
                                  onClick={handleConfirmPayment}
                                  className="w-full py-5 bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
                                >
                                  Unlock for 5 MoCoins
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        {unlockedMomentIds.includes(selectedMoment.id) && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                            <div className="flex items-center gap-3">
                              <div className="px-4 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Unlocked</div>
                              <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Digital asset revealed</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedMoment.isGiveaway && (
                        <div className="bg-white border border-black/5 p-6 rounded-[2.8rem] shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Gift size={60} className="text-yellow-400" />
                          </div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-2xl bg-yellow-400 flex items-center justify-center text-black shadow-lg shadow-yellow-400/20">
                              <Gift size={16} />
                            </div>
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Active Giveaway Content</span>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {selectedMoment.prizes?.map((prize, i) => (
                              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-black/5 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                <span className="text-xs font-black text-black uppercase tracking-tight">{prize}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : activeTab === 'raffle' ? (
                    <motion.div
                      key="raffle"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-8"
                    >
                      <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                          <Terminal size={120} />
                        </div>
                        <div className="relative z-10 flex flex-col gap-8">
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em] mb-2">Live Sorteo Date</span>
                              <span className="text-2xl font-black uppercase tracking-tighter text-black">05.01 <span className="text-yellow-600">1:00PM</span></span>
                            </div>
                            <div className="w-16 h-16 rounded-3xl bg-yellow-400 flex items-center justify-center border border-yellow-500/20 shadow-xl shadow-yellow-400/20">
                              <Gift size={32} className="text-black" />
                            </div>
                          </div>
                          {timeLeft && (
                            <div className="grid grid-cols-4 gap-4">
                              {[
                                { val: timeLeft.d, label: 'Days' },
                                { val: timeLeft.h, label: 'Hrs' },
                                { val: timeLeft.m, label: 'Min' },
                                { val: timeLeft.s, label: 'Sec', color: 'text-cyan-600' }
                              ].map((t, i) => (
                                <div key={i} className="flex flex-col items-center p-5 rounded-[2rem] bg-gray-50 border border-black/5 shadow-inner">
                                  <span className={twMerge("text-2xl font-black tracking-tighter", t.color || "text-black")}>{t.val}</span>
                                  <span className="text-[9px] font-black text-black/20 uppercase tracking-widest mt-2">{t.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {unlockedMomentIds.includes(selectedMoment.id) && (
                        <button
                          onClick={() => setIsConsoleOpen(true)}
                          className="w-full py-6 bg-black text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all hover:translate-y-[-2px]"
                        >
                          <Terminal size={20} />
                          Launch Sorteo Interface
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="market"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      {selectedMoment.marketItems?.map((item) => (
                        <div key={item.id} className="bg-white border border-black/5 rounded-[2.8rem] p-6 flex items-center gap-6 group hover:shadow-xl transition-all shadow-sm">
                          <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-black/5 bg-gray-50 flex-shrink-0 shadow-inner group-hover:rotate-3 transition-transform">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-black text-black truncate uppercase tracking-tighter leading-none">{item.name}</h4>
                              <span className="text-[8px] font-black text-purple-600 uppercase tracking-widest">{item.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xl font-black text-black tracking-tighter">{item.price} M</div>
                              <button
                                onClick={() => handlePurchaseItem(item.price, item.name)}
                                className="px-8 py-3 bg-black text-white text-[11px] font-black rounded-2xl hover:bg-yellow-400 hover:text-black transition-all active:scale-95 uppercase tracking-widest shadow-xl"
                              >
                                Buy
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </BottomSheet>

          <LiveRoom isOpen={isLiveOpen} onClose={() => setIsLiveOpen(false)} moment={activeMoment} />

          <AnimatePresence>
            {viewMoment && <MomentView moment={viewMoment} onClose={() => setViewMoment(null)} />}
          </AnimatePresence>

          <ContactRoom
            isOpen={!!selectedContact}
            onClose={() => setSelectedContact(null)}
            contact={selectedContact}
          />

          <RaffleConsole
            isOpen={isConsoleOpen}
            onClose={() => setIsConsoleOpen(false)}
            moment={selectedMoment}
          />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
