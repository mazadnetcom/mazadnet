import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tweet as TweetType } from '../types';
import { MessageCircle, Repeat, Heart, BarChart2, MoreHorizontal, Trash2, Power, PowerOff, UserX, Gavel, Clock, Tag } from 'lucide-react';
import { WhatsAppIcon } from './icons';
import { cn } from '../lib/utils';
import { useUsers } from '../contexts/UsersContext';
import { useAuth } from '../contexts/AuthContext';
import { useSupervisors } from '../contexts/SupervisorsContext';
import { useFeed } from '../contexts/FeedContext';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { FollowButton } from './FollowButton';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface TweetProps {
  tweet: TweetType;
  onReply: (tweet: TweetType) => void;
  onViewProfile: (userId: string) => void;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
  let videoId = null;
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    videoId = match[1];
  }
  // Using standard youtube.com for better compatibility
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};


const Tweet = ({ tweet, onReply, onViewProfile }: TweetProps) => {
  const { getUserById, toggleBan } = useUsers();
  const { sections } = useSiteSettings();
  const { currentUser, isLoggedIn } = useAuth();
  const { getSupervisor } = useSupervisors();
  const { deleteTweet, toggleTweetStatus, setBiddingOnTweet, setViewingImages } = useFeed();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  
  const author = useMemo(() => getUserById(tweet.userId), [tweet.userId, getUserById]);

  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.stats.likes);
  const [retweetsCount, setRetweetsCount] = useState(tweet.stats.retweets);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(actionsRef, () => setShowActions(false));

  if (!author) return null;

  const isOwnTweet = currentUser?.id === tweet.userId;

  const commercialSectionNames = sections.map(s => s.name);
  const isCommercialTweet = tweet.category && commercialSectionNames.includes(tweet.category);
  const canShowWhatsapp = author.whatsappEnabled && author.showWhatsappInPosts && author.whatsappNumber && isCommercialTweet;
  const whatsappLink = `https://wa.me/${author.whatsappNumber}?text=${encodeURIComponent(`مهتم بالإعلان: ${tweet.content}`)}`;

  const supervisorData = currentUser ? getSupervisor(currentUser.id) : undefined;
  const canModerate = supervisorData && !isOwnTweet;

  const handleReplyClick = (e: React.MouseEvent) => { e.stopPropagation(); if (tweet.status !== 'inactive') onReply(tweet); };
  const handleLikeClick = (e: React.MouseEvent) => { e.stopPropagation(); if (tweet.status !== 'inactive') { setIsLiked(prev => !prev); setLikesCount(prev => isLiked ? prev - 1 : prev + 1); }};
  const handleRetweetClick = (e: React.MouseEvent) => { e.stopPropagation(); if (tweet.status !== 'inactive') { setIsRetweeted(prev => !prev); setRetweetsCount(prev => isRetweeted ? prev - 1 : prev + 1); }};
  const handleViewProfile = (e: React.MouseEvent) => { e.stopPropagation(); onViewProfile(author.id); };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه التغريدة؟')) {
      deleteTweet(tweet.id);
    }
    setShowActions(false);
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTweetStatus(tweet.id);
    setShowActions(false);
  };

  const handleBanUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`هل أنت متأكد من حظر المستخدم ${author.username}؟`)) {
      toggleBan(author.id);
    }
    setShowActions(false);
  };

  const handleNavigateToTweet = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || window.getSelection()?.toString()) {
      return;
    }
    navigate(`/status/${tweet.id}`);
  };

  const embedUrl = tweet.videoUrl ? getYouTubeEmbedUrl(tweet.videoUrl) : null;

  return (
    <article onClick={handleNavigateToTweet} className={cn("flex space-x-4 p-4 border-b border-border-primary hover:bg-bg-secondary/50 transition-colors duration-200 cursor-pointer", tweet.status === 'inactive' && 'opacity-60')}>
      <div className="flex-shrink-0">
        <button onClick={handleViewProfile} className="focus:outline-none rounded-full">
            <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
            <div className="flex-shrink min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                    <button onClick={handleViewProfile} className="font-bold hover:underline focus:outline-none">{author.name}</button>
                    <span className="text-text-secondary">{author.username}</span>
                    <span className="text-text-secondary">·</span>
                    <span className="text-text-secondary">{tweet.timestamp}</span>
                </div>
                {tweet.replyingTo && (
                    <p className="text-sm text-text-secondary">
                        رداً على <span className="text-twitter-blue">{tweet.replyingTo}</span>
                    </p>
                )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {isLoggedIn && settings.allowFollowing && !isOwnTweet && (
                  <FollowButton targetUserId={author.id} className="py-1 px-4" />
                )}
                {canModerate && (
                    <div className="relative" ref={actionsRef}>
                    <button onClick={(e) => { e.stopPropagation(); setShowActions(prev => !prev); }} className="p-2 rounded-full hover:bg-twitter-blue/10">
                        <MoreHorizontal size={18} className="text-text-secondary" />
                    </button>
                    {showActions && (
                        <div className="absolute left-0 mt-1 w-56 bg-bg-primary rounded-xl shadow-2xl border border-border-primary z-10 text-right overflow-hidden">
                        {supervisorData.permissions.canDeletePost && (
                            <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-bg-secondary transition-colors">
                            <Trash2 size={18} /> <span>حذف المنشور</span>
                            </button>
                        )}
                        {supervisorData.permissions.canTogglePostStatus && (
                            <button onClick={handleToggleStatus} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary transition-colors">
                            {tweet.status === 'inactive' ? <Power size={18} /> : <PowerOff size={18} />}
                            <span>{tweet.status === 'inactive' ? 'تنشيط المنشور' : 'إيقاف المنشور'}</span>
                            </button>
                        )}
                        {supervisorData.permissions.canBanUser && (
                            <button onClick={handleBanUser} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-bg-secondary transition-colors">
                            <UserX size={18} /> <span>حظر المستخدم</span>
                            </button>
                        )}
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>

        {tweet.status === 'inactive' && (
          <div className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1">
            <PowerOff size={16} />
            <span>هذا المنشور موقوف من قبل الإدارة.</span>
          </div>
        )}
        <p className="mt-1 whitespace-pre-wrap break-all">{tweet.content}</p>

        {tweet.imageUrls && tweet.imageUrls.length > 0 && (
            <div className={cn(
                "mt-3 grid gap-1 rounded-2xl border border-border-primary overflow-hidden",
                tweet.imageUrls.length === 1 ? "max-h-[510px]" : "max-h-[300px] sm:max-h-[500px]",
                tweet.imageUrls.length === 1 && "grid-cols-1",
                tweet.imageUrls.length > 1 && "grid-cols-2",
                tweet.imageUrls.length === 3 && "grid-rows-2",
            )}>
                {tweet.imageUrls.map((src, index) => (
                    <div 
                        key={index} 
                        className={cn(
                            "relative group cursor-pointer",
                            tweet.imageUrls?.length === 3 && index === 0 && "row-span-2"
                        )}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            if(tweet.imageUrls) {
                                setViewingImages({ images: tweet.imageUrls, startIndex: index });
                            }
                        }}
                    >
                        <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        )}

        {embedUrl && (
          <div className="mt-3 aspect-video">
            <iframe
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl border border-border-primary"
            ></iframe>
          </div>
        )}

        {tweet.category === 'المزادات' && tweet.auctionData && (
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm border border-border-primary rounded-lg p-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <Tag size={16} />
                <span>أعلى سعر</span>
                <span className="font-bold text-text-primary">{tweet.auctionData.currentBid.toLocaleString('ar-SA')} ريال</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock size={16} />
                <span>ينتهي في</span>
                <span className="font-bold text-text-primary">{tweet.auctionData.endTime}</span>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isLoggedIn) {
                  setBiddingOnTweet(tweet);
                } else {
                  alert('الرجاء تسجيل الدخول للمزايدة.');
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
            >
              <Gavel size={20} />
              <span>زايد الآن</span>
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 max-w-md text-text-secondary">
          <div className="flex items-center space-x-1 group cursor-pointer" onClick={handleReplyClick}>
            <div className="p-2 rounded-full group-hover:bg-twitter-blue/10">
              <MessageCircle size={18} className="group-hover:text-twitter-blue" />
            </div>
            <span className="text-sm group-hover:text-twitter-blue">{tweet.stats.comments}</span>
          </div>
          <div className="flex items-center space-x-1 group cursor-pointer" onClick={handleRetweetClick}>
            <div className="p-2 rounded-full group-hover:bg-green-500/10">
              <Repeat size={18} className={cn("group-hover:text-green-500 transition-colors", isRetweeted && "text-green-500")} />
            </div>
            <span className={cn("text-sm group-hover:text-green-500 transition-colors", isRetweeted && "text-green-500")}>{retweetsCount}</span>
          </div>
          <div className="flex items-center space-x-1 group cursor-pointer" onClick={handleLikeClick}>
            <div className="p-2 rounded-full group-hover:bg-pink-500/10">
              <Heart size={18} className={cn("group-hover:text-pink-500 transition-colors", isLiked && "text-pink-500 fill-current")} />
            </div>
            <span className={cn("text-sm group-hover:text-pink-500 transition-colors", isLiked && "text-pink-500")}>{likesCount}</span>
          </div>
          <div className="flex items-center space-x-1 group cursor-pointer">
             <div className="p-2 rounded-full group-hover:bg-twitter-blue/10">
              <BarChart2 size={18} className="group-hover:text-twitter-blue" />
            </div>
            <span className="text-sm group-hover:text-twitter-blue">{tweet.stats.views}</span>
          </div>
          {canShowWhatsapp && (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 group cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div className="p-2 rounded-full group-hover:bg-green-500/10">
                    <WhatsAppIcon className="w-[18px] h-[18px] text-green-500" />
                </div>
                <span className="text-sm text-green-500 hidden sm:inline">تواصل</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default Tweet;
