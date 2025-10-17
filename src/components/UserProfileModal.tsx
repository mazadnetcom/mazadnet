import { useState } from 'react';
import { X, Mail, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../contexts/UsersContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { FollowButton } from './FollowButton';
import { useAuth } from '../contexts/AuthContext';
import FollowListModal from './FollowListModal';

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
}

const UserProfileModal = ({ userId, onClose }: UserProfileModalProps) => {
  const { users, getUserById } = useUsers();
  const { settings } = useSiteSettings();
  const { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const user = getUserById(userId);

  const [followList, setFollowList] = useState<{
    isOpen: boolean;
    type: 'followers' | 'following';
    title: string;
    userIds: string[];
  }>({ isOpen: false, type: 'followers', title: '', userIds: [] });

  if (!user) return null;

  const isOwnProfile = currentUser?.id === userId;

  const handleMessageClick = () => {
    navigate(`/messages/${userId}`);
    onClose();
  };
  
  const getMockFollowIds = (targetUserId: string, type: 'followers' | 'following'): string[] => {
    const otherUsers = users.filter(u => u.id !== targetUserId && u.id !== 'currentUser');
    if (type === 'followers') {
      return otherUsers.slice(0, 3).map(u => u.id);
    } else {
      return otherUsers.slice(1, 4).map(u => u.id);
    }
  };

  const openFollowList = (type: 'followers' | 'following') => {
    setFollowList({
      isOpen: true,
      type: type,
      title: type === 'followers' ? `المتابعون لـ ${user.name}` : `${user.name} يتابع`,
      userIds: getMockFollowIds(user.id, type)
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
        <div className="bg-bg-primary rounded-2xl w-[600px] max-w-[90vw] h-[90vh] max-h-[700px] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-2 sticky top-0 bg-bg-primary/80 backdrop-blur-md z-10">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary"><X size={20} /></button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
              {user.banner && <img src={user.banner} alt="User banner" className="w-full h-full object-cover" />}
              <div className="absolute -bottom-16 left-4">
                <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-bg-primary bg-bg-primary" />
              </div>
            </div>
            <div className="p-4 pt-4">
              <div className="flex justify-end items-center gap-2">
                {isLoggedIn && settings.allowMessaging && !isOwnProfile && (
                  <button onClick={handleMessageClick} className="border border-border-primary hover:bg-bg-secondary font-bold p-2 rounded-full">
                    <Mail size={20} />
                  </button>
                )}
                {isLoggedIn && settings.allowFollowing && !isOwnProfile && (
                  <FollowButton targetUserId={userId} />
                )}
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-text-secondary">{user.username}</p>
              </div>
              {user.bio && <p className="mt-3 break-words">{user.bio}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-text-secondary mt-3">
                {user.location && <div className="flex items-center gap-1"><MapPin size={16} /><span>{user.location}</span></div>}
                {user.joinDate && <div className="flex items-center gap-1"><Calendar size={16} /><span>انضم في {user.joinDate}</span></div>}
              </div>
              <div className="flex gap-4 mt-3">
                <button onClick={() => openFollowList('following')} className="hover:underline">
                  <span className="font-bold">{user.following}</span> <span className="text-text-secondary">يتابع</span>
                </button>
                <button onClick={() => openFollowList('followers')} className="hover:underline">
                  <span className="font-bold">{user.followers}</span> <span className="text-text-secondary">متابع</span>
                </button>
              </div>
            </div>
            {/* Placeholder for user's tweets */}
            <div className="text-center p-8 border-t border-border-primary text-text-secondary">
              <p className="font-bold text-xl">لا توجد تغريدات بعد</p>
            </div>
          </div>
        </div>
      </div>

      {followList.isOpen && (
        <FollowListModal
          title={followList.title}
          userIds={followList.userIds}
          onClose={() => setFollowList(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </>
  );
};

export default UserProfileModal;
