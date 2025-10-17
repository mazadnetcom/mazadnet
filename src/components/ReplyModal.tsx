import { X } from 'lucide-react';
import { Tweet as TweetType } from '../types';
import ComposeArea from './ComposeArea';
import { useUsers } from '../contexts/UsersContext';

interface ReplyModalProps {
  isOpen: boolean;
  tweet: TweetType | null;
  onClose: () => void;
  onPostReply: (
    data: { content: string; imageUrls?: string[]; videoUrl?: string },
    options: { replyingToTweetId?: string; replyingToUser?: string; category?: TweetType['category'] }
  ) => void;
}

const ReplyModal = ({ isOpen, tweet, onClose, onPostReply }: ReplyModalProps) => {
  const { getUserById } = useUsers();
  const author = tweet ? getUserById(tweet.userId) : null;

  if (!isOpen || !tweet || !author) return null;

  const handlePostReply = (data: { content: string; imageUrls?: string[]; videoUrl?: string }) => {
    onPostReply(data, { 
        replyingToTweetId: tweet.id,
        replyingToUser: author.username, 
        category: tweet.category 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-10 sm:pt-20" onClick={onClose}>
      <div className="bg-bg-primary rounded-2xl w-[600px] max-w-[90vw] p-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary">
          <X size={20} />
        </button>
        
        <div className="mt-2 flex space-x-4">
           <div className="flex flex-col items-center">
                <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full" />
                <div className="w-0.5 h-full bg-border-primary my-2"></div>
           </div>
           <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <h3 className="font-bold">{author.name}</h3>
                    <span className="text-text-secondary">{author.username}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{tweet.content}</p>
                <p className="mt-4 text-sm text-text-secondary">
                    رداً على <span className="text-twitter-blue">{author.username}</span>
                </p>
           </div>
        </div>

        <div className="mt-4 flex space-x-4">
            <img src="https://i.pravatar.cc/150?u=currentuser" alt="Your avatar" className="w-12 h-12 rounded-full" />
            <ComposeArea
              placeholder="غرد بردك!"
              buttonText="رد"
              onPost={handlePostReply}
            />
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
