import { useState, useRef } from 'react';
import { Image, Film, X } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { cn } from '../lib/utils';

interface ComposeAreaData { content: string; imageUrls?: string[]; videoUrl?: string; }
interface ComposeAreaProps { placeholder: string; buttonText: string; onPost: (data: ComposeAreaData) => void; }

const MAX_IMAGES = 4;

const ComposeArea = ({ placeholder, buttonText, onPost }: ComposeAreaProps) => {
  const [content, setContent] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useSiteSettings();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const remainingSlots = MAX_IMAGES - imagePreviews.length;
      const filesToProcess = files.slice(0, remainingSlots);
      
      if (files.length > remainingSlots) {
        alert(`يمكنك تحميل ${MAX_IMAGES} صور كحد أقصى.`);
      }

      const newPreviews = filesToProcess.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setVideoUrl('');
    }
  };
  
  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoClick = () => {
    const url = prompt('الرجاء إدخال رابط فيديو يوتيوب:');
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      setVideoUrl(url);
      setImagePreviews([]);
    } else if (url) {
      alert('الرابط غير صالح. الرجاء إدخال رابط يوتيوب صحيح.');
    }
  };

  const handlePost = () => {
    if (content.trim() === '' && imagePreviews.length === 0 && !videoUrl) return;
    onPost({ content, imageUrls: imagePreviews, videoUrl: videoUrl || undefined });
    setContent(''); setImagePreviews([]); setVideoUrl('');
    if (fileInputRef.current) { fileInputRef.current.value = ""; }
  };

  return (
    <div className="flex-1">
      <textarea placeholder={placeholder} className="w-full bg-transparent text-xl outline-none resize-none placeholder-text-secondary" rows={content.length > 50 ? 4 : 2} value={content} onChange={(e) => setContent(e.target.value)} />
      
      {imagePreviews.length > 0 && (
        <div className={cn(
            "mt-3 grid gap-1 rounded-2xl border border-border-primary overflow-hidden",
            imagePreviews.length === 1 && "grid-cols-1",
            imagePreviews.length > 1 && "grid-cols-2",
            imagePreviews.length === 3 && "grid-rows-2",
        )}>
            {imagePreviews.map((src, index) => (
                <div key={index} className={cn(
                    "relative group",
                    imagePreviews.length === 3 && index === 0 && "row-span-2"
                )}>
                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover aspect-video" />
                    <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
      )}

      {videoUrl && (<div className="relative mt-2 text-sm text-text-secondary border border-border-primary rounded-lg p-2 flex justify-between items-center"><span className="truncate pr-2">رابط الفيديو: {videoUrl}</span><button onClick={() => setVideoUrl('')} className="text-text-secondary flex-shrink-0"><X size={18} /></button></div>)}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-1 text-twitter-blue">
          {settings.allowImageUpload && <><input type="file" accept="image/*" multiple hidden ref={fileInputRef} onChange={handleImageSelect} /><button onClick={() => fileInputRef.current?.click()} disabled={imagePreviews.length >= MAX_IMAGES} className="cursor-pointer hover:text-twitter-blue/80 p-2 rounded-full hover:bg-twitter-blue/10 disabled:opacity-50 disabled:cursor-not-allowed"><Image size={20} /></button></>}
          {settings.allowVideoUpload && <button onClick={handleVideoClick} className="cursor-pointer hover:text-twitter-blue/80 p-2 rounded-full hover:bg-twitter-blue/10"><Film size={20} /></button>}
        </div>
        <button className="bg-twitter-blue hover:bg-twitter-blue/90 text-white font-bold py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={content.trim() === '' && imagePreviews.length === 0 && !videoUrl} onClick={handlePost}>{buttonText}</button>
      </div>
    </div>
  );
};

export default ComposeArea;
