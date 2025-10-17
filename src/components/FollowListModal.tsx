import { X } from 'lucide-react';
import { useUsers } from '../contexts/UsersContext';
import { FollowButton } from './FollowButton';
import { useFeed } from '../contexts/FeedContext';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface FollowListModalProps {
  title: string;
  userIds: string[];
  onClose: () => void;
}

const FollowListModal = ({ title, userIds, onClose }: FollowListModalProps) => {
  const { getUserById } = useUsers();
  const { setViewingProfileId } = useFeed();
  const { currentUser, isLoggedIn } = useAuth();
  const { settings } = useSiteSettings();

  const users = userIds.map(id => getUserById(id)).filter(Boolean);

  const handleViewProfile = (userId: string) => {
    onClose();
    // A small delay to allow the first modal to close before opening the next
    setTimeout(() => {
        setViewingProfileId(userId);
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex justify-center items-center" onClick={onClose}>
      <div className="bg-bg-primary rounded-2xl w-[600px] max-w-[90vw] h-[90vh] max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 p-2 sm:p-4 border-b border-border-primary sticky top-0 bg-bg-primary/80 backdrop-blur-md z-10">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {users.length > 0 ? (
            users.map(user => user && (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors">
                <div 
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleViewProfile(user.id)}
                >
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                  <div className="min-w-0">
                    <p className="font-bold hover:underline truncate">{user.name}</p>
                    <p className="text-sm text-text-secondary truncate">{user.username}</p>
                    {user.bio && <p className="text-sm mt-1 break-words">{user.bio}</p>}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {isLoggedIn && settings.allowFollowing && currentUser?.id !== user.id && (
                    <FollowButton targetUserId={user.id} />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-text-secondary">
              <p className="font-bold text-xl">لا يوجد مستخدمون لعرضهم</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
