import { useState } from 'react';
import * as Icons from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { DynamicIcon } from '../DynamicIcon';
import { X, Search } from 'lucide-react';

const iconNames = Object.keys(Icons).filter(key => !/^[a-z]/.test(key) && key !== 'createLucideIcon' && key !== 'icons' && key !== 'LucideIcon');

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
}

const IconPickerModal = ({ isOpen, onClose, sectionId }: IconPickerModalProps) => {
  const { updateSection } = useSiteSettings();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    updateSection(sectionId, { icon: iconName });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div
        className="bg-bg-primary rounded-2xl w-full max-w-2xl h-[70vh] flex flex-col p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-border-primary pb-3 mb-4">
          <h2 className="text-xl font-bold">اختر أيقونة</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-secondary">
            <X size={20} />
          </button>
        </div>
        <div className="relative mb-4">
            <input
                type="text"
                placeholder="ابحث عن أيقونة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg-secondary border border-border-primary rounded-md px-10 py-2 outline-none focus:border-twitter-blue"
            />
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {filteredIcons.map(iconName => (
              <button
                key={iconName}
                onClick={() => handleIconSelect(iconName)}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-bg-secondary aspect-square transition-colors"
                title={iconName}
              >
                <DynamicIcon name={iconName} size={28} />
                <span className="text-xs text-text-secondary truncate w-full text-center">{iconName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPickerModal;
