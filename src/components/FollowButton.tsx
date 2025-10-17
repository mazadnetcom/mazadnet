import { useUsers } from '../contexts/UsersContext';
import { cn } from '../lib/utils';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export const FollowButton = ({ targetUserId, className }: FollowButtonProps) => {
  const { followingIds, toggleFollow } = useUsers();
  const isFollowing = followingIds.has(targetUserId);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow(targetUserId);
  };

  return (
    <button
      onClick={handleFollowClick}
      className={cn(
        "font-bold py-1.5 px-4 rounded-full text-sm transition-colors duration-200 w-28 text-center",
        isFollowing
          ? "bg-transparent border border-border-primary text-text-primary hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
          : "bg-text-primary text-bg-primary",
        className
      )}
      onMouseEnter={(e) => { if (isFollowing) e.currentTarget.textContent = 'إلغاء المتابعة'; }}
      onMouseLeave={(e) => { if (isFollowing) e.currentTarget.textContent = 'تتابع'; }}
    >
      {isFollowing ? 'تتابع' : 'متابعة'}
    </button>
  );
};
