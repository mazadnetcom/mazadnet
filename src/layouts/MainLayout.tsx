import { Outlet } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ReplyModal from '../components/ReplyModal';
import ComposeTweetModal from '../components/ComposeTweetModal';
import ProfileModal from '../components/ProfileModal';
import { useAuth } from '../contexts/AuthContext';
import UserProfileModal from '../components/UserProfileModal';
import { useFeed } from '../contexts/FeedContext';
import BottomNav from '../components/BottomNav';
import BidModal from '../components/BidModal';
import ImageViewerModal from '../components/ImageViewerModal';

export default function MainLayout() {
  const { isLoggedIn } = useAuth();
  const {
    selectedCategory,
    setSelectedCategory,
    replyingTo,
    setReplyingTo,
    isComposeModalOpen,
    setIsComposeModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    viewingProfileId,
    setViewingProfileId,
    addTweet,
    biddingOnTweet,
    setBiddingOnTweet,
    viewingImages,
    setViewingImages,
  } = useFeed();

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary flex justify-center">
      <div className="flex w-full max-w-[1300px]">
        <div className="flex-shrink-0 hidden sm:block h-screen sticky top-0">
          <Sidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onComposeTweet={() => setIsComposeModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        </div>
        
        <Outlet />
        
      </div>

      {/* --- MOBILE UI --- */}
      <div className="sm:hidden">
        <BottomNav />
        {isLoggedIn && (
          <button
            onClick={() => setIsComposeModalOpen(true)}
            className="fixed bottom-20 right-4 bg-twitter-blue hover:bg-twitter-blue/90 text-white font-bold rounded-full transition-all duration-200 w-14 h-14 flex items-center justify-center shadow-lg z-40"
          >
            <Plus size={28} />
          </button>
        )}
      </div>
      {/* --- END MOBILE UI --- */}

      <ReplyModal isOpen={isLoggedIn && !!replyingTo} tweet={replyingTo} onClose={() => setReplyingTo(null)} onPostReply={addTweet} />
      <ComposeTweetModal isOpen={isLoggedIn && isComposeModalOpen} onClose={() => setIsComposeModalOpen(false)} onPostTweet={addTweet} activeCategory={selectedCategory} />
      <ProfileModal isOpen={isLoggedIn && isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      {viewingProfileId && <UserProfileModal userId={viewingProfileId} onClose={() => setViewingProfileId(null)} />}
      <BidModal isOpen={isLoggedIn && !!biddingOnTweet} tweet={biddingOnTweet} onClose={() => setBiddingOnTweet(null)} />
      {viewingImages && (
        <ImageViewerModal
          images={viewingImages.images}
          startIndex={viewingImages.startIndex}
          onClose={() => setViewingImages(null)}
        />
      )}
    </div>
  );
}
