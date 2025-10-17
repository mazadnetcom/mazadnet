import { X, Camera } from 'lucide-react';
import { useUsers } from '../contexts/UsersContext';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { AdminUser } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Toggle = ({ label, enabled, onToggle }: { label: string, enabled: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between py-3">
      <span className="font-semibold">{label}</span>
      <button onClick={onToggle} className={cn('w-12 h-6 rounded-full p-1 transition-colors', enabled ? 'bg-twitter-blue' : 'bg-gray-500')}>
        <div className={cn('w-4 h-4 bg-white rounded-full transition-transform', enabled ? 'transform translate-x-6' : '')} />
      </button>
    </div>
);


const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { getUserById, updateUser } = useUsers();
  const currentUser = getUserById('currentUser');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setWhatsappNumber(currentUser.whatsappNumber || '');
      setShowWhatsapp(!!currentUser.showWhatsappInPosts);
      setAvatarPreview(null);
      setBannerPreview(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      if (type === 'avatar') {
        setAvatarPreview(fileUrl);
      } else {
        setBannerPreview(fileUrl);
      }
    }
  };

  const handleSave = () => {
    const updatedData: Partial<AdminUser> = {
      name,
      bio,
      location,
      whatsappNumber,
      showWhatsappInPosts: showWhatsapp,
    };
    if (avatarPreview) updatedData.avatar = avatarPreview;
    if (bannerPreview) updatedData.banner = bannerPreview;

    updateUser('currentUser', updatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-bg-primary rounded-2xl w-[600px] max-w-[90vw] h-[90vh] max-h-[800px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border-primary sticky top-0 bg-bg-primary z-10">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary"><X size={20} /></button>
                <h2 className="text-xl font-bold">تعديل الملف الشخصي</h2>
            </div>
            <button onClick={handleSave} className="bg-text-primary text-bg-primary font-bold py-1.5 px-4 rounded-full">حفظ</button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
                <img src={bannerPreview || currentUser.banner} alt="User banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <input type="file" accept="image/*" hidden ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} />
                    <button onClick={() => bannerInputRef.current?.click()} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                        <Camera size={24} />
                    </button>
                </div>
                <div className="absolute -bottom-16 left-4">
                    <div className="relative w-32 h-32">
                        <img src={avatarPreview || currentUser.avatar} alt={currentUser.name} className="w-32 h-32 rounded-full border-4 border-bg-primary bg-bg-primary" />
                        <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                            <input type="file" accept="image/*" hidden ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} />
                            <button onClick={() => avatarInputRef.current?.click()} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                                <Camera size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-4 space-y-6 mt-16">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">الاسم</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue" />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-1">النبذة التعريفية</label>
                    <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue resize-none"></textarea>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1">الموقع</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue" />
                </div>
                <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-text-secondary mb-1">رقم الواتساب</label>
                    <input type="text" id="whatsappNumber" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="مثال: 966501234567 (بدون +)" className="w-full bg-bg-secondary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue" />
                </div>
                <div className="border-t border-border-primary">
                    <Toggle label="إظهار زر التواصل (واتساب) في منشوراتك" enabled={showWhatsapp} onToggle={() => setShowWhatsapp(prev => !prev)} />
                    <p className="text-xs text-text-secondary mt-1">ملاحظة: ستظهر أيقونة الواتساب فقط في منشورات الأقسام التجارية.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
