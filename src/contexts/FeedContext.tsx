import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Tweet } from '../types';

const initialTweets: Tweet[] = [
  { id: '1', userId: '1', content: 'بناء واجهة مستخدم جديدة باستخدام React و Tailwind CSS هو أمر ممتع للغاية! 🚀 #تطوير_ويب', timestamp: '58د', stats: { comments: 12, retweets: 34, likes: 152, views: '12.3ألف' }, category: 'General', status: 'active' },
  { id: 'car-1', userId: '2', content: 'سيارة سيدان عائلية موديل 2025 للبيع بحالة ممتازة.', timestamp: '1س', stats: { comments: 5, retweets: 10, likes: 45, views: '8.9ألف' }, category: 'بيع السيارات', imageUrls: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop'], status: 'active' },
  { id: '2', userId: '2', content: 'ما هو أفضل كتاب قرأتموه هذا العام؟', timestamp: '2س', stats: { comments: 88, retweets: 105, likes: 430, views: '50.1ألف' }, category: 'General', status: 'active' },
  { 
    id: 'video-1', 
    userId: '4', 
    content: 'شاهد هذا الفيديو الرائع عن الطبيعة! 🏞️', 
    timestamp: '3س', 
    stats: { comments: 20, retweets: 50, likes: 250, views: '40ألف' }, 
    category: 'General', 
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', 
    status: 'active' 
  },
  { id: 'auction-1', userId: 'currentUser', content: 'مجموعة من الساعات النادرة في مزاد علني يوم الجمعة القادم.', timestamp: '3س', stats: { comments: 18, retweets: 25, likes: 90, views: '15ألف' }, category: 'المزادات', status: 'active', auctionData: { currentBid: 7500, endTime: 'يوم واحد، 5 ساعات', bidCount: 12 } },
  { id: 'estate-1', userId: '1', content: 'فيلا فاخرة للبيع في حي الياسمين. 5 غرف نوم، مسبح خاص.', timestamp: '4س', stats: { comments: 22, retweets: 30, likes: 110, views: '25 ألف' }, category: 'العقارات', status: 'active' },
  { id: 'fashion-1', userId: '4', content: 'تخفيضات نهاية الموسم تصل إلى 50% على تشكيلتنا الجديدة.', timestamp: '8س', stats: { comments: 15, retweets: 40, likes: 200, views: '33 ألف' }, category: 'الأزياء', status: 'active' },
];

interface ViewingImagesState {
  images: string[];
  startIndex: number;
}

interface FeedContextType {
  tweets: Tweet[];
  addTweet: (data: { content: string; imageUrls?: string[]; videoUrl?: string; startingPrice?: number; auctionDuration?: number }, options?: { replyingToTweetId?: string; replyingToUser?: string; category?: Tweet['category'] }) => void;
  deleteTweet: (tweetId: string) => void;
  toggleTweetStatus: (tweetId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  replyingTo: Tweet | null;
  setReplyingTo: (tweet: Tweet | null) => void;
  isComposeModalOpen: boolean;
  setIsComposeModalOpen: (isOpen: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (isOpen: boolean) => void;
  viewingProfileId: string | null;
  setViewingProfileId: (userId: string | null) => void;
  biddingOnTweet: Tweet | null;
  setBiddingOnTweet: (tweet: Tweet | null) => void;
  placeBid: (tweetId: string, amount: number) => void;
  viewingImages: ViewingImagesState | null;
  setViewingImages: (data: ViewingImagesState | null) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
  const [selectedCategory, setSelectedCategory] = useState<string>('الرئيسية');
  const [replyingTo, setReplyingTo] = useState<Tweet | null>(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [biddingOnTweet, setBiddingOnTweet] = useState<Tweet | null>(null);
  const [viewingImages, setViewingImages] = useState<ViewingImagesState | null>(null);

  const addTweet = useCallback((data: { content: string; imageUrls?: string[]; videoUrl?: string; startingPrice?: number; auctionDuration?: number }, options: { replyingToTweetId?: string; replyingToUser?: string; category?: Tweet['category'] } = {}) => {
    const { replyingToTweetId, replyingToUser, category = 'General' } = options;
    const newTweet: Tweet = {
      id: new Date().toISOString(),
      userId: 'currentUser',
      content: data.content,
      imageUrls: data.imageUrls,
      videoUrl: data.videoUrl,
      timestamp: 'الآن',
      stats: { comments: 0, retweets: 0, likes: 0, views: '0' },
      category: category,
      replyingTo: replyingToUser,
      replyingToTweetId: replyingToTweetId,
      status: 'active',
    };

    if (category === 'المزادات' && data.startingPrice && data.auctionDuration) {
      newTweet.auctionData = {
        currentBid: data.startingPrice,
        endTime: `ينتهي بعد ${data.auctionDuration} يوم`,
        bidCount: 0,
      };
    }

    setTweets(prevTweets => {
        if (replyingToTweetId) {
            const parentIndex = prevTweets.findIndex(t => t.id === replyingToTweetId);
            
            if (parentIndex !== -1) {
              const newTweets = [...prevTweets];
              const parentTweet = newTweets[parentIndex];
              newTweets[parentIndex] = {
                ...parentTweet,
                stats: { ...parentTweet.stats, comments: parentTweet.stats.comments + 1 },
              };
    
              let insertIndex = parentIndex;
              while (
                insertIndex + 1 < newTweets.length &&
                newTweets[insertIndex + 1].replyingToTweetId === replyingToTweetId
              ) {
                insertIndex++;
              }
              newTweets.splice(insertIndex + 1, 0, newTweet);
              return newTweets;
            }
          }
          return [newTweet, ...prevTweets];
    });

    setIsComposeModalOpen(false);
    setReplyingTo(null);
  }, []);

  const deleteTweet = useCallback((tweetId: string) => {
    setTweets(prev => prev.filter(t => t.id !== tweetId));
  }, []);

  const toggleTweetStatus = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(t =>
      t.id === tweetId
        ? { ...t, status: t.status === 'inactive' ? 'active' : 'inactive' }
        : t
    ));
  }, []);

  const placeBid = useCallback((tweetId: string, amount: number) => {
    setTweets(prev => prev.map(t => {
      if (t.id === tweetId && t.auctionData) {
        return {
          ...t,
          auctionData: {
            ...t.auctionData,
            currentBid: amount,
            bidCount: t.auctionData.bidCount + 1,
          }
        };
      }
      return t;
    }));
  }, []);

  const value = useMemo(() => ({
    tweets,
    addTweet,
    deleteTweet,
    toggleTweetStatus,
    selectedCategory,
    setSelectedCategory,
    replyingTo,
    setReplyingTo,
    isComposeModalOpen,
    setIsComposeModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    viewingProfileId,
    setViewingProfileId,
    biddingOnTweet,
    setBiddingOnTweet,
    placeBid,
    viewingImages,
    setViewingImages,
  }), [tweets, addTweet, deleteTweet, toggleTweetStatus, selectedCategory, replyingTo, isComposeModalOpen, isProfileModalOpen, viewingProfileId, biddingOnTweet, placeBid, viewingImages]);

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
