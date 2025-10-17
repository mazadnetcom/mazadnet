import { Settings, MoreHorizontal } from 'lucide-react';
import { useUsers } from '../contexts/UsersContext';
import { useFeed } from '../contexts/FeedContext';
import { FollowButton } from './FollowButton';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const trendsData = [ { category: 'كرة القدم · تتجه', topic: 'الدوري السعودي', tweets: '34.5 ألف تغريدة' }, { category: 'الأعمال والتمويل · تتجه', topic: '#رؤية_2030', tweets: '120 ألف تغريدة' }, { category: 'تقنية · تتجه', topic: 'الذكاء الاصطناعي', tweets: '78.2 ألف تغريدة' }, { category: 'الفن والثقافة · تتجه', topic: 'موسم الرياض', tweets: '95 ألف تغريدة' }, ];

const Trends = () => {
  const { users, followingIds } = useUsers();
  const { setViewingProfileId } = useFeed();
  const { isLoggedIn } = useAuth();
  const { settings } = useSiteSettings();

  const whoToFollowData = users.filter(user => 
    user.id !== 'currentUser' && !followingIds.has(user.id)
  ).slice(0, 3);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-bg-secondary rounded-2xl p-4">
        <div className="flex justify-between items-center"><h3 className="text-xl font-bold">ما يتجه الآن</h3><Settings size={20} className="text-text-secondary cursor-pointer" /></div>
        <div className="mt-4 space-y-4">
          {trendsData.map((trend, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="flex justify-between items-start">
                  <div className="min-w-0 break-all"><p className="text-sm text-text-secondary">{trend.category}</p><p className="font-bold">{trend.topic}</p><p className="text-sm text-text-secondary">{trend.tweets}</p></div>
                  <div className="p-2 rounded-full group-hover:bg-twitter-blue/10"><MoreHorizontal size={18} className="text-text-secondary group-hover:text-twitter-blue" /></div>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="text-twitter-blue mt-4 block">عرض المزيد</a>
      </div>
      {isLoggedIn && settings.allowFollowing && (
        <div className="bg-bg-secondary rounded-2xl p-4">
          <h3 className="text-xl font-bold">من تتابع</h3>
          <div className="mt-4 space-y-4">
            {whoToFollowData.map((user) => (
                <div key={user.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3 cursor-pointer min-w-0" onClick={() => setViewingProfileId(user.id)}>
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div className="min-w-0 break-all"><p className="font-bold hover:underline truncate">{user.name}</p><p className="text-sm text-text-secondary truncate">{user.username}</p></div>
                  </div>
                  <FollowButton targetUserId={user.id} />
                </div>
              )
            )}
          </div>
          <a href="#" className="text-twitter-blue mt-4 block">عرض المزيد</a>
        </div>
      )}
    </div>
  );
};

export default Trends;
