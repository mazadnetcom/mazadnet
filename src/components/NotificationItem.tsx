import { Heart, Repeat, MessageCircle, UserPlus } from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onViewProfile: (userId: string) => void;
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'like': return <Heart size={24} className="text-pink-500" />;
    case 'retweet': return <Repeat size={24} className="text-green-500" />;
    case 'reply': return <MessageCircle size={24} className="text-twitter-blue" />;
    case 'follow': return <UserPlus size={24} className="text-twitter-blue" />;
    default: return null;
  }
};

const NotificationItem = ({ notification, onViewProfile }: NotificationItemProps) => {
  const mainUser = notification.fromUsers[0];
  const otherUsersCount = notification.fromUsers.length - 1;

  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    onViewProfile(userId);
  };

  const renderText = () => {
    const userButton = (
      <button
        onClick={(e) => handleProfileClick(e, mainUser.id)}
        className="font-bold hover:underline focus:outline-none"
      >
        {mainUser.name}
      </button>
    );
    const othersSpan = otherUsersCount > 0 ? ` و ${otherUsersCount} آخرون` : '';

    switch (notification.type) {
      case 'like': return <>{userButton}{othersSpan} أعجبوا بتغريدتك</>;
      case 'retweet': return <>{userButton}{othersSpan} أعادوا تغريد تغريدتك</>;
      case 'reply': return <>{userButton} رد على تغريدتك</>;
      case 'follow': return <>{userButton} تابعك</>;
      default: return '';
    }
  };

  return (
    <article className={cn("flex space-x-4 p-4 border-b border-border-primary", !notification.isRead && "bg-twitter-blue/5")}>
      <div className="w-12 flex justify-end">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex mb-1">
            {notification.fromUsers.slice(0, 3).map((user) => (
                <button
                  key={user.id}
                  onClick={(e) => handleProfileClick(e, user.id)}
                  className="focus:outline-none -mr-2"
                  title={user.name}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-bg-primary hover:opacity-80 transition-opacity"
                  />
                </button>
            ))}
        </div>
        <p className="mb-1">{renderText()}</p>
        {notification.tweetContent && <p className="text-text-secondary break-words">{notification.tweetContent}</p>}
      </div>
    </article>
  );
};

export default NotificationItem;
