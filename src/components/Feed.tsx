import { useState, useEffect } from 'react';
import Tweet from './Tweet';
import { Tweet as TweetType } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useNotifications } from '../contexts/NotificationsContext';
import NotificationItem from './NotificationItem';

interface FeedProps {
  tweets: TweetType[];
  onAddTweet?: (data: { content: string; imageUrl?: string; videoUrl?: string }) => void;
  selectedCategory: string;
  onReply: (tweet: TweetType) => void;
  onViewProfile: (userId: string) => void;
  onOpenComposeModal: () => void;
}

const Feed = ({ tweets, selectedCategory, onReply, onViewProfile, onOpenComposeModal }: FeedProps) => {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  const { isLoggedIn } = useAuth();
  const { sections } = useSiteSettings();
  const { notifications, markAllAsRead } = useNotifications();
  
  const allCategories = ['الرئيسية', ...sections.map(s => s.name), 'الإشعارات'];
  const categoryToFilter = selectedCategory;
  const filteredTweets = selectedCategory === 'الرئيسية'
    ? tweets.filter(t => t.category === 'General' || !t.category) // Include old tweets without category
    : tweets.filter(t => t.category === categoryToFilter);

  const showFeedContent = allCategories.includes(selectedCategory) && !['الإشعارات'].includes(selectedCategory);

  useEffect(() => {
    if (selectedCategory === 'الإشعارات') {
        markAllAsRead();
    }
  }, [selectedCategory, markAllAsRead]);

  return (
    <div className="w-full">
      <div className="sticky top-0 bg-bg-primary/80 backdrop-blur-md z-10 border-b border-border-primary">
        <div className="px-4 pt-3 pb-0">
          <h2 className="text-xl font-bold">{selectedCategory}</h2>
        </div>
        {selectedCategory === 'الرئيسية' && (
            <div className="flex">
                <button onClick={() => setActiveTab('foryou')} className="flex-1 text-center font-semibold text-[15px] py-3 hover:bg-bg-secondary transition-colors duration-200 relative">
                    <span className={cn(activeTab === 'foryou' ? 'text-text-primary' : 'text-text-secondary')}>لك</span>
                    {activeTab === 'foryou' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-twitter-blue rounded-full"></div>}
                </button>
                <button onClick={() => setActiveTab('following')} className="flex-1 text-center font-semibold text-[15px] py-3 hover:bg-bg-secondary transition-colors duration-200 relative">
                    <span className={cn(activeTab === 'following' ? 'text-text-primary' : 'text-text-secondary')}>متابع</span>
                    {activeTab === 'following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full"></div>}
                </button>
            </div>
        )}
      </div>
      {showFeedContent ? (
        <>
          {isLoggedIn && selectedCategory === 'الرئيسية' && (
            <div className="p-4 border-b border-border-primary flex space-x-4 cursor-pointer hover:bg-bg-secondary/50" onClick={onOpenComposeModal}>
              <img src="https://i.pravatar.cc/150?u=currentuser" alt="User avatar" className="w-12 h-12 rounded-full" />
              <div className="flex-1 flex items-center">
                <p className="text-xl text-text-secondary">ماذا يحدث؟</p>
              </div>
            </div>
          )}
          <div>
            {selectedCategory === 'الرئيسية' && activeTab === 'following' ? (
              <div className="text-center p-8 text-text-secondary"><p className="font-bold text-2xl">لا توجد تغريدات بعد</p><p>عندما تتابع أشخاصًا، ستظهر تغريداتهم هنا.</p></div>
            ) : filteredTweets.length > 0 ? (
              filteredTweets.map((tweet) => (<Tweet key={tweet.id} tweet={tweet} onReply={onReply} onViewProfile={onViewProfile} />))
            ) : (
              <div className="text-center p-8 text-text-secondary"><p className="font-bold text-xl">لا توجد تغريدات لعرضها</p><p>عندما يتم نشر تغريدات في هذا القسم، ستظهر هنا.</p></div>
            )}
          </div>
        </>
      ) : selectedCategory === 'الإشعارات' ? (
        <div>
            {notifications.map(n => <NotificationItem key={n.id} notification={n} onViewProfile={onViewProfile} />)}
        </div>
      ) : (
        <div className="text-center p-8 text-text-secondary"><p className="font-bold text-2xl">هذه الصفحة غير متاحة بعد</p><p>لا تقلق، نحن نعمل على تجهيزها!</p></div>
      )}
    </div>
  );
};

export default Feed;
