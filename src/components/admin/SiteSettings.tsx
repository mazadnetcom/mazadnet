import { useRef, useState } from 'react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { MazadnetLogo } from '../icons';
import { cn } from '../../lib/utils';
import { Upload } from 'lucide-react';

const SiteSettings = () => {
  const { settings, setSiteName, setLogoUrl, toggleTrends, toggleImageUpload, toggleVideoUpload, toggleMessaging, toggleFollowing } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localSiteName, setLocalSiteName] = useState(settings.siteName);

  const handleSiteNameSave = () => {
    setSiteName(localSiteName);
    alert('تم حفظ اسم الموقع بنجاح!');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const logoUrl = URL.createObjectURL(file);
      setLogoUrl(logoUrl);
    }
  };

  const Toggle = ({ label, enabled, onToggle }: { label: string, enabled: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between">
      <span className="font-semibold">{label}</span>
      <button onClick={onToggle} className={cn('w-12 h-6 rounded-full p-1 transition-colors', enabled ? 'bg-twitter-blue' : 'bg-gray-500')}>
        <div className={cn('w-4 h-4 bg-white rounded-full transition-transform', enabled ? 'transform translate-x-6' : '')} />
      </button>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">إعدادات الموقع</h1>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="bg-bg-secondary p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">اسم الموقع</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={localSiteName}
              onChange={(e) => setLocalSiteName(e.target.value)}
              placeholder="أدخل اسم الموقع"
              className="flex-grow bg-bg-primary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue"
            />
            <button onClick={handleSiteNameSave} className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-md">
              حفظ
            </button>
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">شعار الموقع</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-bg-primary rounded-full flex items-center justify-center border border-border-primary overflow-hidden">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="شعار الموقع" className="w-full h-full object-cover" />
              ) : (
                <MazadnetLogo className="w-16 h-16 fill-text-primary" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-text-secondary mb-2">ارفع شعارًا مخصصًا. يفضل أن يكون مربعًا.</p>
              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleLogoUpload} />
              <button onClick={() => fileInputRef.current?.click()} className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-md flex items-center gap-2">
                <Upload size={18} />
                <span>تحميل شعار</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold mb-2">تفعيل الميزات</h2>
          <Toggle label="إظهار قسم (ما يتجه الآن)" enabled={settings.showTrends} onToggle={toggleTrends} />
          <Toggle label="السماح برفع الصور" enabled={settings.allowImageUpload} onToggle={toggleImageUpload} />
          <Toggle label="السماح بإضافة روابط يوتيوب" enabled={settings.allowVideoUpload} onToggle={toggleVideoUpload} />
          <Toggle label="تفعيل الرسائل الخاصة بين الأعضاء" enabled={settings.allowMessaging} onToggle={toggleMessaging} />
          <Toggle label="تفعيل خاصية المتابعة بين الأعضاء" enabled={settings.allowFollowing} onToggle={toggleFollowing} />
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
