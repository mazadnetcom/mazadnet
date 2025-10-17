import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeed } from '../contexts/FeedContext';
import Tweet from '../components/Tweet';
import ComposeArea from '../components/ComposeArea';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UsersContext';

const TweetDetailPage = () => {
  const { tweetId } = useParams<{ tweetId: string }>();
  const navigate = useNavigate();
  const { tweets, addTweet, setReplyingTo, setViewingProfileId } = useFeed();
  const { isLoggedIn } = useAuth();
  const { getUserById } = useUsers();

  const mainTweet = tweets.find(t => t.id === tweetId);
  const replies = tweets.filter(t => t.replyingToTweetId === tweetId);
  const author = mainTweet ? getUserById(mainTweet.userId) : null;

  if (!mainTweet) {
    return (
      <main className="flex-grow border-x border-border-primary max-w-[600px] w-full p-8 text-center">
        <h2 className="font-bold text-xl">التغريدة غير موجودة</h2>
        <p className="text-text-secondary mt-2">ربما تم حذفها أو أن الرابط غير صحيح.</p>
        <button onClick={() => navigate('/')} className="mt-4 bg-twitter-blue text-white font-bold py-2 px-4 rounded-full">
          العودة إلى الصفحة الرئيسية
        </button>
      </main>
    );
  }

  const handlePostReply = (data: { content: string; imageUrl?: string; videoUrl?: string }) => {
    if (!author) return;
    addTweet(data, {
      replyingToTweetId: mainTweet.id,
      replyingToUser: author.username,
      category: mainTweet.category,
    });
  };

  return (
    <main className="flex-grow border-x border-border-primary max-w-[600px] w-full pb-20 sm:pb-0">
      <div className="sticky top-0 bg-bg-primary/80 backdrop-blur-md z-10 flex items-center gap-4 p-2 border-b border-border-primary">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-bg-secondary">
          <ArrowRight size={20} />
        </button>
        <h2 className="text-xl font-bold">تغريدة</h2>
      </div>

      <Tweet
        tweet={mainTweet}
        onReply={setReplyingTo}
        onViewProfile={setViewingProfileId}
      />

      {isLoggedIn && (
        <div className="p-4 border-b border-border-primary flex space-x-4">
          <img src="https://i.pravatar.cc/150?u=currentuser" alt="Your avatar" className="w-12 h-12 rounded-full" />
          <ComposeArea
            placeholder="غرد بردك!"
            buttonText="رد"
            onPost={handlePostReply}
          />
        </div>
      )}

      <div className="divide-y divide-border-primary">
        {replies.length > 0 ? (
          replies.map(reply => (
            <Tweet
              key={reply.id}
              tweet={reply}
              onReply={setReplyingTo}
              onViewProfile={setViewingProfileId}
            />
          ))
        ) : (
          <div className="text-center p-8 text-text-secondary">
            <p className="font-bold">لا توجد ردود بعد</p>
            <p>كن أول من يرد!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default TweetDetailPage;
