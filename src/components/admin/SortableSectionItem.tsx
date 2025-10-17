import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Image, UserCog } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { useUsers } from '../../contexts/UsersContext';
import { CommercialSection } from '../../types';
import { DynamicIcon } from '../DynamicIcon';
import { useSupervisors } from '../../contexts/SupervisorsContext';

interface SortableSectionItemProps {
  section: CommercialSection;
  onIconPickerOpen: (sectionId: string) => void;
}

export const SortableSectionItem = ({ section, onIconPickerOpen }: SortableSectionItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const { users } = useUsers();
  const { supervisors } = useSupervisors();
  const { updateSection, deleteSection } = useSiteSettings();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const supervisorUsers = users.filter(user => supervisors.some(s => s.userId === user.id));

  const handleSupervisorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSection(section.id, { supervisorId: e.target.value || null });
  };
  
  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${section.name}"؟`)) {
      deleteSection(section.id);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-bg-primary p-3 rounded-lg shadow-sm">
      <button {...attributes} {...listeners} className="cursor-grab p-1 text-text-secondary hover:text-text-primary">
        <GripVertical size={20} />
      </button>
      <div className="w-10 h-10 bg-bg-secondary rounded-md flex items-center justify-center">
        <DynamicIcon name={section.icon} size={24} className="text-text-secondary" />
      </div>
      <div className="flex-grow">
        <p className="font-bold">{section.name}</p>
        <div className="flex items-center gap-2 text-sm mt-1">
            <UserCog size={16} className="text-text-secondary" />
            <select value={section.supervisorId || ''} onChange={handleSupervisorChange} className="bg-transparent border-0 text-text-primary focus:outline-none focus:ring-0">
                <option value="">غير معين</option>
                {supervisorUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onIconPickerOpen(section.id)} className="text-xs flex items-center gap-1 bg-bg-secondary text-text-primary px-2 py-1.5 rounded-md hover:bg-border-primary">
          <Image size={14} />
          <span>الأيقونة</span>
        </button>
        <button onClick={handleDelete} className="text-xs flex items-center gap-1 bg-red-500/10 text-red-500 px-2 py-1.5 rounded-md hover:bg-red-500/20">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
