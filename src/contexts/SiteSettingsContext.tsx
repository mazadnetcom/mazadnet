import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { SiteSettings, CommercialSection } from '../types';

const initialSections: CommercialSection[] = [
    { id: 'cars', name: 'بيع السيارات', supervisorId: '1', icon: 'Car' },
    { id: 'realty', name: 'العقارات', supervisorId: '2', icon: 'Building2' },
    { id: 'fashion', name: 'الأزياء', supervisorId: null, icon: 'Shirt' },
    { id: 'auctions', name: 'المزادات', supervisorId: null, icon: 'Gavel' },
];

interface SiteSettingsContextType {
  settings: SiteSettings;
  setSiteName: (name: string) => void;
  setLogoUrl: (url: string) => void;
  toggleTrends: () => void;
  toggleImageUpload: () => void;
  toggleVideoUpload: () => void;
  toggleMessaging: () => void;
  toggleFollowing: () => void;
  sections: CommercialSection[];
  setSections: (sections: CommercialSection[]) => void;
  addSection: (name: string) => void;
  updateSection: (id: string, updatedData: Partial<CommercialSection>) => void;
  deleteSection: (id: string) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'MAZADNET',
    logoUrl: undefined,
    showTrends: true,
    allowImageUpload: true,
    allowVideoUpload: true,
    allowMessaging: true,
    allowFollowing: true,
  });
  const [sections, setSections] = useState<CommercialSection[]>(initialSections);

  const setSiteName = useCallback((name: string) => {
    setSettings(s => ({ ...s, siteName: name }));
  }, []);

  const setLogoUrl = useCallback((url: string) => {
    setSettings(s => ({ ...s, logoUrl: url }));
  }, []);

  const toggleTrends = useCallback(() => {
    setSettings(s => ({ ...s, showTrends: !s.showTrends }));
  }, []);

  const toggleImageUpload = useCallback(() => {
    setSettings(s => ({ ...s, allowImageUpload: !s.allowImageUpload }));
  }, []);

  const toggleVideoUpload = useCallback(() => {
    setSettings(s => ({ ...s, allowVideoUpload: !s.allowVideoUpload }));
  }, []);

  const toggleMessaging = useCallback(() => {
    setSettings(s => ({ ...s, allowMessaging: !s.allowMessaging }));
  }, []);

  const toggleFollowing = useCallback(() => {
    setSettings(s => ({ ...s, allowFollowing: !s.allowFollowing }));
  }, []);

  const addSection = useCallback((name: string) => {
    const newSection: CommercialSection = {
        id: new Date().toISOString(),
        name,
        supervisorId: null,
        icon: 'Tag'
    };
    setSections(s => [...s, newSection]);
  }, []);

  const updateSection = useCallback((id: string, updatedData: Partial<CommercialSection>) => {
    setSections(prevSections => prevSections.map(s => s.id === id ? { ...s, ...updatedData } : s));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections(prevSections => prevSections.filter(s => s.id !== id));
  }, []);

  const setSectionsCallback = useCallback((newSections: CommercialSection[]) => {
    setSections(newSections);
  }, []);

  const value = useMemo(() => ({
    settings, setSiteName, setLogoUrl, toggleTrends, toggleImageUpload, toggleVideoUpload, toggleMessaging, toggleFollowing, sections, setSections: setSectionsCallback, addSection, updateSection, deleteSection
  }), [settings, setSiteName, setLogoUrl, toggleTrends, toggleImageUpload, toggleVideoUpload, toggleMessaging, toggleFollowing, sections, setSectionsCallback, addSection, updateSection, deleteSection]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
