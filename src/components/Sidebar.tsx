import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Bell, Mail, Plus } from 'lucide-react';
import { MazadnetLogo } from './icons';
import { AccountPopover } from './AccountPopover';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { cn } from '../lib/utils';
import { DynamicIcon } from './DynamicIcon';

interface NavItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  hasNotification?: boolean;
}

const NavItem = ({ icon, text, active, onClick, disabled, hasNotification }: NavItemProps) => (
  <button onClick={!disabled ? onClick : undefined} className={cn(
    'flex items-center justify-center xl:justify-start w-full space-x-4 p-3 rounded-full hover:bg-bg-secondary/80 transition-colors duration-200 relative text-right',
    active ? 'font-bold' : '',
    disabled ? 'text-text-secondary cursor-not-allowed' : 'cursor-pointer'
  )}>
    <div className="relative">
        {icon}
        {hasNotification && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
    </div>
    <span className="text-xl hidden xl:inline">{text}</span>
  </button>
);


interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onComposeTweet: () => void;
  onOpenProfile: () => void;
}

const Sidebar = ({ selectedCategory, onSelectCategory, onComposeTweet, onOpenProfile }: SidebarProps) => {
  const { isLoggedIn, login, isAccountPopoverOpen, setAccountPopoverOpen } = useAuth();
  const { settings, sections } = useSiteSettings();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'الرئيسية', text: 'الرئيسية', icon: <Home size={26} /> },
    ...sections.map(s => ({ id: s.name, text: s.name, icon: <DynamicIcon name={s.icon} size={26} /> })),
    { id: 'الإشعارات', text: 'الإشعارات', icon: <Bell size={26} />, disabled: !isLoggedIn, hasNotification: unreadCount > 0 },
    { id: 'الرسائل', text: 'الرسائل', icon: <Mail size={26} />, disabled: !isLoggedIn || !settings.allowMessaging, path: '/messages' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.disabled) return;
    if (item.path) {
        navigate(item.path);
    } else {
        onSelectCategory(item.id);
        if (location.pathname !== '/') {
            navigate('/');
        }
    }
  };

  const LogoComponent = () => {
    if (settings.logoUrl) {
        return <img src={settings.logoUrl} alt="شعار الموقع" className="w-8 h-8 rounded-full object-cover" />
    }
    return <MazadnetLogo className="w-7 h-7 fill-text-primary" />;
  }

  return (
    <header className="h-screen flex flex-col justify-between p-2 xl:p-4 border-l border-border-primary w-[88px] xl:w-[275px]">
      <div className="flex flex-col items-center xl:items-stretch space-y-2">
        <Link to="/" className="flex items-center gap-3 p-3 hover:bg-bg-secondary/80 rounded-full transition-colors duration-200 w-fit xl:w-full" onClick={() => onSelectCategory('الرئيسية')}>
          <LogoComponent />
          <span className="font-bold text-xl hidden xl:inline">{settings.siteName}</span>
        </Link>
        <nav className="w-full">
          {navItems.map((item) => {
            const isActive = item.path 
                ? location.pathname.startsWith(item.path)
                : location.pathname === '/' && selectedCategory === item.id;

            return (
              <NavItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                active={isActive}
                onClick={() => handleNavClick(item)}
                disabled={item.disabled}
                hasNotification={item.hasNotification}
              />
            );
          })}
        </nav>
        {isLoggedIn && (
          <button onClick={onComposeTweet} className="mt-4 bg-twitter-blue hover:bg-twitter-blue/90 text-white font-bold rounded-full transition-colors duration-200 xl:w-full w-14 h-14 flex items-center justify-center xl:h-auto xl:py-3">
            <span className="hidden xl:inline">غرد</span>
            <Plus size={28} className="inline xl:hidden" />
          </button>
        )}
      </div>
      <div className="relative">
        {isLoggedIn ? (
          <div className="w-full flex justify-center xl:justify-start">
            <button onClick={() => setAccountPopoverOpen(true)} className="p-3 hover:bg-bg-secondary/80 rounded-full flex items-center space-x-3 cursor-pointer w-fit xl:w-full text-right">
              <img src="https://i.pravatar.cc/150?u=currentuser" alt="User avatar" className="w-10 h-10 rounded-full" />
              <div className="hidden xl:inline flex-grow">
                <p className="font-bold">المدير العام</p>
                <p className="text-sm text-text-secondary">@admin</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="px-0 xl:px-4">
            <button onClick={login} className="mt-4 bg-twitter-blue hover:bg-twitter-blue/90 text-white font-bold rounded-full transition-colors duration-200 w-full py-3">تسجيل الدخول</button>
          </div>
        )}
        {isAccountPopoverOpen && <AccountPopover onClose={() => setAccountPopoverOpen(false)} onOpenProfile={onOpenProfile} />}
      </div>
    </header>
  );
};

export default Sidebar;
