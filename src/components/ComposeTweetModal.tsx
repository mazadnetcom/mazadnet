import { X } from 'lucide-react';
import { Tweet } from '../types';
import ComposeArea from './ComposeArea';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface ComposeTweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostTweet: (data: { content: string; imageUrls?: string[]; videoUrl?: string; startingPrice?: number; auctionDuration?: number }, options: { category?: Tweet['category'] }) => void;
  activeCategory: string;
}

const ComposeTweetModal = ({ isOpen, onClose, onPostTweet, activeCategory }: ComposeTweetModalProps) => {
  const { sections } = useSiteSettings();
  const [postCategory, setPostCategory] = useState(activeCategory === 'الرئيسية' ? 'General' : activeCategory);
  const [startingPrice, setStartingPrice] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPostCategory(activeCategory === 'الرئيسية' ? 'General' : activeCategory);
      setStartingPrice('');
      setAuctionDuration('');
    }
  }, [isOpen, activeCategory]);

  if (!isOpen) return null;

  const handlePostTweet = (data: { content: string; imageUrls?: string[]; videoUrl?: string }) => {
    const auctionDetails = postCategory === 'المزادات'
      ? { startingPrice: parseFloat(startingPrice) || 0, auctionDuration: parseInt(auctionDuration) || 1 }
      : {};
      
    onPostTweet({ ...data, ...auctionDetails }, { category: postCategory });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-10 sm:pt-20" onClick={onClose}>
      <div className="bg-bg-primary rounded-2xl w-[600px] max-w-[90vw] p-4" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border-primary pb-3 mb-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary"><X size={20} /></button>
        </div>

        <div className="mb-4">
            <label htmlFor="category-select" className="text-sm font-bold text-text-secondary">النشر في:</label>
            <select
                id="category-select"
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full mt-1 bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue"
            >
                <option value="General">القسم العام (الرئيسية)</option>
                {sections.map(section => (
                    <option key={section.id} value={section.name}>{section.name}</option>
                ))}
            </select>
        </div>

        {postCategory === 'المزادات' && (
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startingPrice" className="block text-sm font-medium text-text-secondary mb-1">سعر بدء المزاد</label>
                    <input 
                      type="number" 
                      id="startingPrice" 
                      value={startingPrice} 
                      onChange={(e) => setStartingPrice(e.target.value)} 
                      placeholder="بالريال" 
                      className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue" 
                    />
                </div>
                <div>
                    <label htmlFor="auctionDuration" className="block text-sm font-medium text-text-secondary mb-1">مدة المزاد</label>
                    <input 
                      type="number" 
                      id="auctionDuration" 
                      value={auctionDuration} 
                      onChange={(e) => setAuctionDuration(e.target.value)} 
                      placeholder="بالأيام" 
                      className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue" 
                    />
                </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
            <img src="https://i.pravatar.cc/150?u=currentuser" alt="Your avatar" className="w-12 h-12 rounded-full" />
            <ComposeArea placeholder="ماذا يحدث؟" buttonText="غرد" onPost={handlePostTweet} />
        </div>
      </div>
    </div>
  );
};

export default ComposeTweetModal;
