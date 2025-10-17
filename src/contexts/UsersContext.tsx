import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { AdminUser } from '../types';

const initialUsers: AdminUser[] = [
  { id: 'currentUser', name: 'المدير العام', username: '@admin', avatar: 'https://i.pravatar.cc/150?u=currentuser', gender: 'male', phone: '+966500000000', isBanned: false, whatsappEnabled: true, whatsappNumber: '+966500000000', showWhatsappInPosts: true, banner: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2070&auto=format&fit=crop', bio: 'مؤسس وصاحب الموقع. مهتم بالتقنية وريادة الأعمال.', location: 'الرياض، المملكة العربية السعودية', joinDate: 'يناير 2025', followers: 12500, following: 0 },
  { id: '1', name: 'محمد الأحمد', username: '@mohammed', avatar: 'https://i.pravatar.cc/150?u=user1', gender: 'male', phone: '+966501234567', isBanned: false, whatsappEnabled: true, whatsappNumber: '+966501234567', showWhatsappInPosts: false, banner: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop', bio: 'مطور واجهات أمامية ومحب للقهوة المختصة.', location: 'جدة', joinDate: 'فبراير 2025', followers: 320, following: 150 },
  { id: '2', name: 'فاطمة علي', username: '@fatima', avatar: 'https://i.pravatar.cc/150?u=user2', gender: 'female', phone: '+966559876543', isBanned: false, whatsappEnabled: true, whatsappNumber: '+966559876543', showWhatsappInPosts: true, banner: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop', bio: 'مصممة جرافيك ومهتمة بالفن الرقمي.', location: 'دبي', joinDate: 'مارس 2025', followers: 1800, following: 400 },
  { id: '3', name: 'خالد العامري', username: '@khalid', avatar: 'https://i.pravatar.cc/150?u=user4', gender: 'male', phone: '+966541122334', isBanned: true, whatsappEnabled: false, banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', bio: 'مستخدم محظور', location: 'غير معروف', joinDate: 'أبريل 2025', followers: 10, following: 5 },
  { id: '4', name: 'سارة عبدالله', username: '@sara', avatar: 'https://i.pravatar.cc/150?u=user5', gender: 'female', phone: '+966567788990', isBanned: false, whatsappEnabled: true, banner: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop', bio: 'خبيرة تسويق رقمي.', location: 'الدمام', joinDate: 'مايو 2025', followers: 540, following: 210 },
];

interface UsersContextType {
  users: AdminUser[];
  getUserById: (userId: string) => AdminUser | undefined;
  updateUser: (userId: string, data: Partial<AdminUser>) => void;
  toggleBan: (userId: string) => void;
  toggleWhatsapp: (userId: string) => void;
  followingIds: Set<string>;
  toggleFollow: (targetUserId: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [followingIds, setFollowingIds] = useState(new Set<string>());

  const getUserById = useCallback((userId: string) => {
    return users.find(u => u.id === userId);
  }, [users]);

  const updateUser = useCallback((userId: string, data: Partial<AdminUser>) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === userId ? { ...u, ...data } : u))
    );
  }, []);

  const toggleBan = useCallback((userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, isBanned: !u.isBanned } : u
      )
    );
  }, []);

  const toggleWhatsapp = useCallback((userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, whatsappEnabled: !u.whatsappEnabled } : u
      )
    );
  }, []);

  const toggleFollow = useCallback((targetUserId: string) => {
    setFollowingIds(prevFollowingIds => {
      const newFollowingIds = new Set(prevFollowingIds);
      const isFollowing = newFollowingIds.has(targetUserId);

      if (isFollowing) {
        newFollowingIds.delete(targetUserId);
      } else {
        newFollowingIds.add(targetUserId);
      }

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user.id === 'currentUser') {
            return { ...user, following: (user.following || 0) + (isFollowing ? -1 : 1) };
          }
          if (user.id === targetUserId) {
            return { ...user, followers: (user.followers || 0) + (isFollowing ? -1 : 1) };
          }
          return user;
        })
      );

      return newFollowingIds;
    });
  }, []);

  const value = useMemo(() => ({
    users,
    getUserById,
    updateUser,
    toggleBan,
    toggleWhatsapp,
    followingIds,
    toggleFollow,
  }), [users, followingIds, getUserById, updateUser, toggleBan, toggleWhatsapp, toggleFollow]);

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
