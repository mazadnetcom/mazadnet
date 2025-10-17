import { Check } from 'lucide-react';
import { useTheme, Theme } from '../hooks/useTheme';

interface DisplayPopoverProps {
  onClose: () => void;
}

const DisplayPopover = ({ onClose }: DisplayPopoverProps) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onClose();
  };

  const themes: { id: Theme; name: string; bg: string }[] = [
    { id: 'light', name: 'فاتح', bg: 'bg-white' },
    { id: 'dim', name: 'معتم', bg: 'bg-[#15202B]' },
  ];

  return (
    <div className="absolute bottom-full mb-2 w-[300px] bg-bg-primary shadow-lg rounded-2xl border border-border-primary p-4 z-20">
      <h3 className="text-xl font-bold text-center mb-2">خصص عرضك</h3>
      <p className="text-sm text-text-secondary text-center mb-4">
        تؤثر هذه الإعدادات على جميع حساباتك على هذا المتصفح.
      </p>
      <div className="bg-bg-secondary rounded-xl p-4">
        <div className="flex justify-around gap-4">
          {themes.map((t) => (
            <div key={t.id} className="flex-1">
              <button
                onClick={() => handleThemeChange(t.id)}
                className={`w-full h-16 rounded-lg ${t.bg} flex items-center justify-center border-2 ${theme === t.id ? 'border-twitter-blue' : 'border-gray-700'}`}
              >
                {theme === t.id && <div className="w-6 h-6 rounded-full bg-twitter-blue flex items-center justify-center"><Check size={16} className="text-white" /></div>}
              </button>
              <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme-radio"
                  checked={theme === t.id}
                  onChange={() => handleThemeChange(t.id)}
                  className="w-4 h-4 accent-twitter-blue"
                />
                <span className="text-sm">{t.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayPopover;
