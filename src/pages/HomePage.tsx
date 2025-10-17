import Feed from '../components/Feed';
import Trends from '../components/Trends';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { useFeed } from '../contexts/FeedContext';

export default function HomePage() {
  const {
    tweets,
    selectedCategory,
    setReplyingTo,
    setViewingProfileId,
    setIsComposeModalOpen,
  } = useFeed();
  const { settings } = useSiteSettings();
  
  return (
    <>
      <main className="flex-grow border-x border-border-primary max-w-[600px] w-full pb-20 sm:pb-0">
        <Feed 
          tweets={tweets}
          selectedCategory={selectedCategory}
          onReply={setReplyingTo}
          onViewProfile={setViewingProfileId}
          onOpenComposeModal={() => setIsComposeModalOpen(true)}
        />
      </main>
      <aside className="w-[350px] hidden lg:block px-2">
        {settings.showTrends && <Trends />}
      </aside>
    </>
  );
}
