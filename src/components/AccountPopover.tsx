import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Brush, ChevronRight, ArrowRight, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme, Theme } from '../hooks/useTheme';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

const DisplayMenu = ({ onBack }: { onBack: () => void }) => {
  const { theme, setTheme } = useTheme();
  const themes: { id: Theme; name: string; bg: string }[] = [ { id: 'light', name: 'فاتح', bg: 'bg-white' }, { id: 'dim', name: 'معتم', bg: 'bg-[#15202B]' }, ];
  return (
    <div>
      <div className="flex items-center p-2 border-b border-border-primary mb-2">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-bg-secondary"><ArrowRight size={20} /></button>
        <h3 className="text-lg font-bold mr-4">خصص عرضك</h3>
      </div>
      <p className="text-sm text-text-secondary text-center mb-4 px-4">تؤثر هذه الإعدادات على جميع حساباتك على هذا المتصفح.</p>
      <div className="bg-bg-secondary rounded-xl p-4 mx-2 mb-2">
        <div className="flex justify-around gap-4">
          {themes.map((t) => (
            <div key={t.id} className="flex-1">
              <button onClick={() => setTheme(t.id)} className={`w-full h-12 rounded-lg ${t.bg} flex items-center justify-center border-2 ${theme === t.id ? 'border-twitter-blue' : 'border-gray-700'}`}>
                {theme === t.id && <div className="w-5 h-5 rounded-full bg-twitter-blue flex items-center justify-center"><Check size={14} className="text-white" /></div>}
              </button>
              <label className="flex items-center justify-center gap-2 mt-2 cursor-pointer">
                <input type="radio" name="theme-radio" checked={theme === t.id} onChange={() => setTheme(t.id)} className="w-4 h-4 accent-twitter-blue" />
                <span className="text-sm">{t.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AccountPopover = ({ onClose, onOpenProfile }: { onClose: () => void; onOpenProfile: () => void; }) => {
  const { logout } = useAuth();
  const [view, setView] = useState<'main' | 'display'>('main');
  const popoverRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(popoverRef, onClose);

  const handleLogout = () => { logout(); onClose(); };

  const MainMenu = (
    <div>
      <div className="p-4 border-b border-border-primary flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="https://i.pravatar.cc/150?u=currentuser" alt="User avatar" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">المدير العام</p>
            <p className="text-sm text-text-secondary">@admin</p>
          </div>
        </div>
        <Check size={20} className="text-twitter-blue" />
      </div>
      <div className="py-2 border-b border-border-primary">
        <button onClick={() => { onOpenProfile(); onClose(); }} className="w-full flex items-center gap-3 text-right px-4 py-3 hover:bg-bg-secondary transition-colors duration-200 font-bold">
            <User size={20} />
            <span>الملف الشخصي</span>
        </button>
        <Link to="/admin" onClick={onClose} className="w-full flex items-center gap-3 text-right px-4 py-3 hover:bg-bg-secondary transition-colors duration-200 font-bold">
            <LayoutDashboard size={20} />
            <span>لوحة التحكم</span>
        </Link>
        <button className="w-full text-right px-4 py-3 hover:bg-bg-secondary transition-colors duration-200 font-bold">إضافة حساب موجود</button>
        <button onClick={handleLogout} className="w-full text-right px-4 py-3 hover:bg-bg-secondary transition-colors duration-200 font-bold">تسجيل الخروج من @admin</button>
      </div>
      <div className="py-2">
         <button onClick={() => setView('display')} className="w-full flex justify-between items-center text-right px-4 py-3 hover:bg-bg-secondary transition-colors duration-200">
          <div className="flex items-center gap-3"><Brush size={20} /><span className="font-bold">العرض</span></div>
          <ChevronRight size={20} className="transform -rotate-180" />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={popoverRef} className="absolute bottom-full mb-2 w-[300px] bg-bg-primary shadow-2xl rounded-2xl border border-border-primary z-30 overflow-hidden">
      {view === 'main' ? MainMenu : <DisplayMenu onBack={() => setView('main')} />}
    </div>
  );
};
