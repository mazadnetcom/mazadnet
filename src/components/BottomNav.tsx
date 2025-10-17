import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { cn } from '../lib/utils';
import { useFeed } from '../contexts/FeedContext';

interface BottomNavItemProps {
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  hasNotification?: boolean;
}

const BottomNavItem = ({ icon, active, onClick, disabled, hasNotification }: BottomNavItemProps) => (
  <button onClick={!disabled ? onClick : undefined} className={cn(
    'flex-1 flex justify-center items-center p-3 relative h-full',
    active ? 'text-text-primary' : 'text-text-secondary',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
  )}>
    <div className="relative">
      {icon}
      {hasNotification && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg-primary"></span>}
    </div>
  </button>
);

const BottomNav = () => {
  const { isLoggedIn } = useAuth();
  const { settings } = useSiteSettings();
  const { unreadCount } = useNotifications();
  const { selectedCategory, setSelectedCategory } = useFeed();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (id: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      setSelectedCategory(id);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const isHomeActive = location.pathname === '/' && !['الإشعارات', 'الرسائل'].includes(selectedCategory);
  const isNotificationsActive = location.pathname === '/' && selectedCategory === 'الإشعارات';
  const isMessagesActive = location.pathname.startsWith('/messages');

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-bg-primary/80 backdrop-blur-md border-t border-border-primary flex items-center justify-around sm:hidden z-40">
      <BottomNavItem
        icon={<Home size={26} strokeWidth={isHomeActive ? 2.5 : 2} />}
        active={isHomeActive}
        onClick={() => handleNavClick('الرئيسية')}
      />
      <BottomNavItem
        icon={<Search size={26} />}
        onClick={() => alert('ميزة البحث قيد التطوير!')}
      />
      <BottomNavItem
        icon={<Bell size={26} strokeWidth={isNotificationsActive ? 2.5 : 2} />}
        active={isNotificationsActive}
        onClick={() => handleNavClick('الإشعارات')}
        disabled={!isLoggedIn}
        hasNotification={unreadCount > 0}
      />
      <BottomNavItem
        icon={<Mail size={26} strokeWidth={isMessagesActive ? 2.5 : 2} />}
        active={isMessagesActive}
        onClick={() => handleNavClick('الرسائل', '/messages')}
        disabled={!isLoggedIn || !settings.allowMessaging}
      />
    </div>
  );
};

export default BottomNav;
