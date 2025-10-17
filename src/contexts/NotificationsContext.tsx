import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Notification } from '../types';

const initialNotifications: Notification[] = [
    { id: '1', type: 'like', fromUsers: [{ id: '2', name: 'فاطمة علي', avatar: 'https://i.pravatar.cc/150?u=user2' }, { id: '4', name: 'سارة عبدالله', avatar: 'https://i.pravatar.cc/150?u=user5' }], tweetContent: 'بناء واجهة مستخدم جديدة باستخدام React...', timestamp: 'ساعة واحدة', isRead: false },
    { id: '2', type: 'follow', fromUsers: [{ id: '3', name: 'خالد العامري', avatar: 'https://i.pravatar.cc/150?u=user4' }], timestamp: '3 ساعات', isRead: false },
    { id: '3', type: 'retweet', fromUsers: [{ id: '1', name: 'محمد الأحمد', avatar: 'https://i.pravatar.cc/150?u=user1' }], tweetContent: 'ما هو أفضل كتاب قرأتموه هذا العام؟', timestamp: '5 ساعات', isRead: true },
    { id: '4', type: 'reply', fromUsers: [{ id: '2', name: 'فاطمة علي', avatar: 'https://i.pravatar.cc/150?u=user2' }], tweetContent: 'رداً على تغريدتك: "بالتأكيد، كتاب العادات الذرية..."', timestamp: 'يوم واحد', isRead: true },
];


interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications => prevNotifications.map(n => ({ ...n, isRead: true })));
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    markAllAsRead
  }), [notifications, unreadCount, markAllAsRead]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
