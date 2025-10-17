import { useState, useEffect } from 'react';
import { X, Gavel } from 'lucide-react';
import { Tweet as TweetType } from '../types';
import { useFeed } from '../contexts/FeedContext';

interface BidModalProps {
  isOpen: boolean;
  tweet: TweetType | null;
  onClose: () => void;
}

const BidModal = ({ isOpen, tweet, onClose }: BidModalProps) => {
  const { placeBid } = useFeed();
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  const currentBid = tweet?.auctionData?.currentBid || 0;

  useEffect(() => {
    if (isOpen) {
      setBidAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !tweet || !tweet.auctionData) return null;

  const handlePlaceBid = () => {
    const newBid = parseFloat(bidAmount);
    if (isNaN(newBid) || newBid <= currentBid) {
      setError(`يجب أن يكون مزادك أعلى من ${currentBid.toLocaleString('ar-SA')} ريال`);
      return;
    }
    placeBid(tweet.id, newBid);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-bg-primary rounded-2xl w-[500px] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-xl font-bold">المزايدة على</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-text-secondary break-words">{tweet.content}</p>
          <div className="bg-bg-secondary p-4 rounded-lg text-center">
            <p className="text-sm text-text-secondary">السعر الحالي</p>
            <p className="text-3xl font-bold text-twitter-blue">{currentBid.toLocaleString('ar-SA')} ريال</p>
          </div>
          <div>
            <label htmlFor="bidAmount" className="block text-sm font-medium text-text-secondary mb-1">ضع مزادك</label>
            <div className="relative">
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value);
                  setError('');
                }}
                placeholder={`أعلى من ${currentBid.toLocaleString('ar-SA')}`}
                className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue text-lg"
              />
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">ريال</span>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            onClick={handlePlaceBid}
            disabled={!bidAmount}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Gavel size={20} />
            <span>زايد</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
