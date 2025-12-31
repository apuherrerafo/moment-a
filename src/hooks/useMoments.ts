import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Attendee {
    name: string;
    avatar: string;
}

export interface MarketItem {
    id: string;
    name: string;
    price: number;
    image: string;
    type: 'Access Key' | 'Digital Item' | 'NFT';
    description: string;
    perks?: string[];
}

export interface Influencer {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    tier: 'verified' | 'influencer' | 'friend'; // Updated tiers
    x: number;
    y: number;
}

export interface Moment {
    id: string;
    title: string;
    host: string;
    avatarUrl: string;
    realPhotoUrl?: string;
    influencerId?: string;
    influencer?: string;
    description?: string;
    specialOffer?: string;
    comments?: { user: string; text: string }[];
    capacity: { current: number; max: number };
    attendees: Attendee[];
    viewers: number;
    timeLeft: string;
    type: 'Live' | 'Secret' | 'Open' | 'Shop';
    x: number;
    y: number;
    zone: string;
    tags: string[];
    marketItems?: MarketItem[];
    isGiveaway?: boolean;
    prizes?: string[];
    subscriptionRequired?: boolean;
    storyContentUrl?: string;
    unlockedImageUrl?: string;
    voiceUrl?: string;
    raffleDate?: string;
    prizeImages?: string[];
}

export const MOCK_INFLUENCERS: Influencer[] = [
    { id: 'i1', name: 'Andy Merino', handle: '@andymns', avatar: 'https://i.pravatar.cc/150?u=i1', tier: 'verified', x: 40, y: 30 },
    { id: 'i2', name: 'Marcelo Wong', handle: '@marcelowong', avatar: 'https://i.pravatar.cc/150?u=i2', tier: 'verified', x: 52, y: 48 },
    { id: 'i3', name: 'Punk 420', handle: '@punk420', avatar: 'https://i.pravatar.cc/150?u=i3', tier: 'influencer', x: 44, y: 34 },
    { id: 'i4', name: 'Jazz Queen', handle: '@jazzqueen', avatar: 'https://i.pravatar.cc/150?u=i4', tier: 'influencer', x: 56, y: 62 },
    { id: 'i5', name: 'Tech Master', handle: '@techmaster', avatar: 'https://i.pravatar.cc/150?u=i5', tier: 'verified', x: 24, y: 44 },
    { id: 'i6', name: 'Vibe Curator', handle: '@vibecurator', avatar: 'https://i.pravatar.cc/150?u=i6', tier: 'influencer', x: 47, y: 53 },
    { id: 'i7', name: 'Crypto King', handle: '@cryptoking', avatar: 'https://i.pravatar.cc/150?u=i7', tier: 'verified', x: 30, y: 25 },
    { id: 'i8', name: 'Sofia Lima', handle: '@sofialima', avatar: 'https://i.pravatar.cc/150?u=i8', tier: 'friend', x: 60, y: 40 },
    { id: 'i9', name: 'Chef Pedro', handle: '@chefpedro', avatar: 'https://i.pravatar.cc/150?u=i9', tier: 'friend', x: 65, y: 50 },
    { id: 'i10', name: 'Elena Art', handle: '@elena_art', avatar: 'https://i.pravatar.cc/150?u=i10', tier: 'influencer', x: 35, y: 55 },
    { id: 'i11', name: 'Julio Dev', handle: '@julio_dev', avatar: '/avatar-host.png', tier: 'friend', x: 20, y: 60 },
    { id: 'i12', name: 'Satoshi Lima', handle: '@satoshilima', avatar: 'https://i.pravatar.cc/150?u=i12', tier: 'influencer', x: 70, y: 30 },
    { id: 'i13', name: 'Carla NFT', handle: '@carlanft', avatar: 'https://i.pravatar.cc/150?u=i13', tier: 'influencer', x: 80, y: 45 },
    { id: 'i14', name: 'Alex Vibe', handle: '@alex_vibe', avatar: '/avatar-guy.png', tier: 'friend', x: 15, y: 35 },
    { id: 'i15', name: 'Maria Sculpt', handle: '@mariasculpt', avatar: 'https://i.pravatar.cc/150?u=i15', tier: 'influencer', x: 85, y: 65 },
    { id: 'i16', name: 'Pepo Punk', handle: '@pepopunk', avatar: 'https://i.pravatar.cc/150?u=i16', tier: 'friend', x: 10, y: 50 },
    { id: 'i17', name: 'Luna Star', handle: '@lunastar', avatar: '/avatar-girl.png', tier: 'friend', x: 90, y: 20 },
    { id: 'i18', name: 'Rafa Tech', handle: '@rafatech', avatar: 'https://i.pravatar.cc/150?u=i18', tier: 'friend', x: 28, y: 70 },
    { id: 'i19', name: 'Gabi Music', handle: '@gabimusic', avatar: 'https://i.pravatar.cc/150?u=i19', tier: 'friend', x: 75, y: 75 },
    { id: 'i20', name: 'Nico Wave', handle: '@nicowave', avatar: 'https://i.pravatar.cc/150?u=i20', tier: 'friend', x: 5, y: 80 },
];

const MOCK_MOMENTS: Moment[] = [
    {
        id: 'm1',
        title: 'Secret Rooftop Party',
        host: 'CryptoPunks Lima',
        avatarUrl: 'https://i.pravatar.cc/150?u=i3',
        realPhotoUrl: '/host-real.png',
        influencerId: 'i3',
        influencer: '@Punk420',
        description: "Vibe check desde el rooftop! 🌅 Bring your wallets, we are minting live.",
        comments: [
            { user: "@alice", text: "Omg that view! 😍" },
            { user: "@bob", text: "On my way!!" },
            { user: "@charlie", text: "Is the bar open yet? 🍻" }
        ],
        capacity: { current: 142, max: 200 },
        attendees: [
            { name: 'Alice', avatar: '/avatar-girl.png' },
            { name: 'Bob', avatar: '/avatar-guy.png' },
            { name: 'Charlie', avatar: '/avatar-host.png' }
        ],
        viewers: 142,
        timeLeft: '2h 15m',
        type: 'Live',
        x: 45,
        y: 35,
        zone: 'Miraflores',
        tags: ['Party', 'Crypto', 'Networking'],
        isGiveaway: true,
        prizes: ['0.1 ETH', 'VIP Access Pass', 'Exclusive NFT'],
        subscriptionRequired: true,
        unlockedImageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop',
        voiceUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
    },
    {
        id: 'm10',
        title: 'Marcelo Wong Pop-up',
        host: 'Marcelo Wong',
        avatarUrl: 'https://i.pravatar.cc/150?u=i2',
        realPhotoUrl: '/marcelo-sculpture.png',
        influencerId: 'i2',
        influencer: '@MarceloWong',
        specialOffer: '25% OFF',
        description: "Exclusive drop: 'The chubby Series'. First 15 unlocks get 25% off. Own a piece of Lima's art history. 🎨✨",
        capacity: { current: 3, max: 15 },
        attendees: [
            { name: 'ArtFan', avatar: '/avatar-girl.png' }
        ],
        viewers: 342,
        timeLeft: '59m',
        type: 'Shop',
        x: 50,
        y: 50,
        zone: 'Larcomar',
        tags: ['Art', 'Shop', 'Limited'],
        isGiveaway: true,
        raffleDate: '2026-01-05T13:00:00',
        prizeImages: ['/marcelo-sculpture.png'],
        prizes: ['Original Sculpture', 'Signed Art Book', '100 MoCoins'],
        unlockedImageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop',
        marketItems: [
            {
                id: 'wong-1',
                name: 'The Chubby King',
                price: 150,
                type: 'NFT',
                image: '/marcelo-sculpture.png',
                description: 'A digital representation of the iconic sculpture.',
                perks: ['3 Private Meetings/Year', 'VIP Discord Access', 'Limited Physical Edition']
            },
            {
                id: 'wong-2',
                name: 'Artist Pass',
                price: 25,
                type: 'Access Key',
                image: '/avatar-guy.png',
                description: 'Early access to all future Marcelo Wong drops.',
                perks: ['Early Drop Access', '10% Discount on Art']
            }
        ]
    },
    {
        id: 'm2',
        title: 'Midnight Jazz Session',
        host: 'Barranco Jam',
        avatarUrl: 'https://i.pravatar.cc/150?u=i4',
        realPhotoUrl: '/host-real.png',
        influencerId: 'i4',
        influencer: '@JazzQueen',
        capacity: { current: 89, max: 100 },
        attendees: [
            { name: 'Dave', avatar: '/avatar-guy.png' },
            { name: 'Eve', avatar: '/avatar-girl.png' }
        ],
        viewers: 89,
        timeLeft: '1h 30m',
        type: 'Open',
        x: 55,
        y: 60,
        zone: 'Barranco',
        tags: ['Music', 'Jazz', 'Live'],
        unlockedImageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'm3',
        title: 'Tech Founders Meetup',
        host: 'StartUPC',
        avatarUrl: 'https://i.pravatar.cc/150?u=i5',
        realPhotoUrl: '/host-real.png',
        influencerId: 'i5',
        influencer: '@TechMaster',
        capacity: { current: 55, max: 80 },
        attendees: [
            { name: 'Frank', avatar: '/avatar-host.png' }
        ],
        viewers: 55,
        timeLeft: '45m',
        type: 'Live',
        x: 25,
        y: 45,
        zone: 'San Isidro',
        tags: ['Tech', 'Startup', 'Live'],
        unlockedImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'm4',
        title: 'After Beach Party',
        host: 'Sunkissed',
        avatarUrl: 'https://i.pravatar.cc/150?u=i6',
        realPhotoUrl: '/host-real.png',
        influencerId: 'i6',
        influencer: '@VibeCurator',
        capacity: { current: 200, max: 300 },
        attendees: [],
        viewers: 1200,
        timeLeft: '6h',
        type: 'Open',
        x: 48,
        y: 52,
        zone: 'Larcomar',
        tags: ['After', 'Music', 'Trending'],
        unlockedImageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop'
    }
];

export function useMoments() {
    const [moments, setMoments] = useState<Moment[]>(MOCK_MOMENTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            console.log('Supabase not configured. Using mock data.');
            setLoading(false);
            return;
        }

        const fetchMoments = async () => {
            if (!supabase) return;

            const { data, error } = await supabase
                .from('moments')
                .select('*')
                .eq('status', 'active');

            if (error) {
                console.error('Error fetching moments:', error);
            } else if (data) {
                setMoments(data as any);
            }
            setLoading(false);
        };

        fetchMoments();

        const channel = supabase
            .channel('public:moments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'moments' }, (payload) => {
                fetchMoments();
            })
            .subscribe();

        return () => {
            supabase?.removeChannel(channel);
        };
    }, []);

    const addMoment = (moment: Moment) => {
        setMoments(prev => [moment, ...prev]);
    };

    return { moments, influencers: MOCK_INFLUENCERS, loading, addMoment };
}
