export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  currentBid?: number;
  image: string;
  video?: string;
  tags: string[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  location: {
    lat: number;
    lng: number;
    distance: number;
    address: string;
  };
  bids: Bid[];
  createdAt: string;
  status: 'active' | 'sold' | 'pending';
}

export interface Bid {
  id: string;
  bidder: {
    id: string;
    name: string;
    avatar: string;
  };
  amount: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  item: {
    id: string;
    title: string;
    image: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'escrow';
  date: string;
  type: 'purchase' | 'sale';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  totalSales: number;
  totalPurchases: number;
  memberSince: string;
}

// Mock user profile
export const currentUser: UserProfile = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  rating: 4.8,
  totalSales: 24,
  totalPurchases: 15,
  memberSince: '2023-01-15',
};

// Mock items
export const mockItems: Item[] = [
  {
    id: 'item-1',
    title: 'Vintage Camera',
    description: 'Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts.',
    price: 350,
    currentBid: 380,
    image: 'https://images.unsplash.com/photo-1606412540918-c59e5af0d0f1?w=500',
    tags: ['Electronics', 'Vintage', 'Photography'],
    seller: {
      id: 'seller-1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4.9,
    },
    location: {
      lat: 40.7128,
      lng: -74.0060,
      distance: 2.3,
      address: 'Manhattan, NY',
    },
    bids: [
      {
        id: 'bid-1',
        bidder: {
          id: 'user-2',
          name: 'Mike Wilson',
          avatar: 'https://i.pravatar.cc/150?img=8',
        },
        amount: 380,
        timestamp: '2026-01-20T10:30:00Z',
      },
      {
        id: 'bid-2',
        bidder: {
          id: 'user-3',
          name: 'Emily Chen',
          avatar: 'https://i.pravatar.cc/150?img=9',
        },
        amount: 365,
        timestamp: '2026-01-20T09:15:00Z',
      },
    ],
    createdAt: '2026-01-18T14:00:00Z',
    status: 'active',
  },
  {
    id: 'item-2',
    title: 'Mountain Bike',
    description: 'Full suspension mountain bike, barely used. Includes helmet and accessories.',
    price: 800,
    currentBid: 850,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500',
    tags: ['Sports', 'Outdoor', 'Bikes'],
    seller: {
      id: 'seller-2',
      name: 'Tom Bradley',
      avatar: 'https://i.pravatar.cc/150?img=13',
      rating: 4.7,
    },
    location: {
      lat: 40.7589,
      lng: -73.9851,
      distance: 5.8,
      address: 'Times Square, NY',
    },
    bids: [
      {
        id: 'bid-3',
        bidder: {
          id: 'user-1',
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/150?img=12',
        },
        amount: 850,
        timestamp: '2026-01-20T11:45:00Z',
      },
    ],
    createdAt: '2026-01-17T10:00:00Z',
    status: 'active',
  },
  {
    id: 'item-3',
    title: 'Designer Watch',
    description: 'Luxury automatic watch with leather strap. Comes with original box and certificate.',
    price: 1200,
    currentBid: 1350,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500',
    tags: ['Fashion', 'Luxury', 'Accessories'],
    seller: {
      id: 'seller-3',
      name: 'Alex Martinez',
      avatar: 'https://i.pravatar.cc/150?img=14',
      rating: 5.0,
    },
    location: {
      lat: 40.7282,
      lng: -74.0776,
      distance: 3.2,
      address: 'SoHo, NY',
    },
    bids: [
      {
        id: 'bid-4',
        bidder: {
          id: 'user-4',
          name: 'David Lee',
          avatar: 'https://i.pravatar.cc/150?img=15',
        },
        amount: 1350,
        timestamp: '2026-01-20T12:00:00Z',
      },
    ],
    createdAt: '2026-01-19T08:00:00Z',
    status: 'active',
  },
  {
    id: 'item-4',
    title: 'Gaming Console',
    description: 'Latest generation gaming console with two controllers and 5 games included.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500',
    tags: ['Gaming', 'Electronics', 'Entertainment'],
    seller: {
      id: 'seller-4',
      name: 'Jessica Lee',
      avatar: 'https://i.pravatar.cc/150?img=16',
      rating: 4.6,
    },
    location: {
      lat: 40.7484,
      lng: -73.9857,
      distance: 4.1,
      address: 'Midtown, NY',
    },
    bids: [],
    createdAt: '2026-01-20T07:00:00Z',
    status: 'active',
  },
  {
    id: 'item-5',
    title: 'Acoustic Guitar',
    description: 'Professional acoustic guitar with case. Great sound quality and well maintained.',
    price: 550,
    currentBid: 600,
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
    tags: ['Music', 'Instruments', 'Acoustic'],
    seller: {
      id: 'seller-5',
      name: 'Chris Anderson',
      avatar: 'https://i.pravatar.cc/150?img=17',
      rating: 4.8,
    },
    location: {
      lat: 40.7306,
      lng: -73.9352,
      distance: 6.5,
      address: 'Brooklyn, NY',
    },
    bids: [
      {
        id: 'bid-5',
        bidder: {
          id: 'user-5',
          name: 'Lisa Park',
          avatar: 'https://i.pravatar.cc/150?img=18',
        },
        amount: 600,
        timestamp: '2026-01-20T13:20:00Z',
      },
    ],
    createdAt: '2026-01-19T15:00:00Z',
    status: 'active',
  },
  {
    id: 'item-6',
    title: 'Vintage Record Player',
    description: 'Fully restored vintage turntable with modern features. Sounds amazing!',
    price: 280,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500',
    tags: ['Audio', 'Vintage', 'Music'],
    seller: {
      id: 'seller-6',
      name: 'Rachel Green',
      avatar: 'https://i.pravatar.cc/150?img=19',
      rating: 4.9,
    },
    location: {
      lat: 40.7580,
      lng: -73.9855,
      distance: 1.8,
      address: 'Hell\'s Kitchen, NY',
    },
    bids: [],
    createdAt: '2026-01-20T09:00:00Z',
    status: 'active',
  },
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    item: {
      id: 'item-7',
      title: 'Laptop Stand',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    },
    amount: 45,
    status: 'completed',
    date: '2026-01-18T14:00:00Z',
    type: 'purchase',
  },
  {
    id: 'trans-2',
    item: {
      id: 'item-8',
      title: 'Desk Lamp',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    },
    amount: 65,
    status: 'escrow',
    date: '2026-01-19T10:30:00Z',
    type: 'sale',
  },
  {
    id: 'trans-3',
    item: {
      id: 'item-9',
      title: 'Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    amount: 180,
    status: 'pending',
    date: '2026-01-20T08:15:00Z',
    type: 'purchase',
  },
];

export const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoor',
  'Music',
  'Gaming',
  'Vintage',
  'Luxury',
];
