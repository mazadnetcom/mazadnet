import { useState } from 'react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSectionItem } from './SortableSectionItem';
import IconPickerModal from './IconPickerModal';

const ContentManagement = () => {
  const { sections, setSections, addSection } = useSiteSettings();
  const [newSectionName, setNewSectionName] = useState('');
  const [isIconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      addSection(newSectionName.trim());
      setNewSectionName('');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over?.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const openIconPicker = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setIconPickerOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">إدارة المحتوى</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-bg-secondary p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">إضافة قسم تجاري جديد</h2>
          <form onSubmit={handleAddSection} className="flex gap-2">
            <input type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} placeholder="اسم القسم الجديد" className="flex-grow bg-bg-primary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue" />
            <button type="submit" className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-md">إضافة</button>
          </form>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl lg:row-span-2">
          <h2 className="text-xl font-bold mb-4">الأقسام الحالية</h2>
          <p className="text-sm text-text-secondary mb-4">اسحب وأفلت لترتيب الأقسام.</p>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {sections.map(section => (
                  <SortableSectionItem key={section.id} section={section} onIconPickerOpen={openIconPicker} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      {selectedSectionId && (
        <IconPickerModal
          isOpen={isIconPickerOpen}
          onClose={() => setIconPickerOpen(false)}
          sectionId={selectedSectionId}
        />
      )}
    </div>
  );
};

export default ContentManagement;
