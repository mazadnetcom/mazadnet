import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, ArrowLeft, UserCheck } from 'lucide-react';
import { MazadnetLogo } from '../icons';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

const AdminSidebar = ({ activeView, setActiveView }: AdminSidebarProps) => {
  const navItems = [
    { id: 'home', text: 'لوحة التحكم', icon: <LayoutDashboard /> },
    { id: 'users', text: 'إدارة المستخدمين', icon: <Users /> },
    { id: 'content', text: 'إدارة المحتوى', icon: <FileText /> },
    { id: 'supervisors', text: 'إدارة المشرفين', icon: <UserCheck /> },
    { id: 'settings', text: 'إعدادات الموقع', icon: <Settings /> },
  ];

  return (
    <aside className="w-64 bg-bg-secondary border-l border-border-primary flex flex-col p-4">
      <div className="flex items-center gap-2 mb-10">
        <MazadnetLogo className="w-8 h-8 fill-twitter-blue" />
        <h1 className="text-xl font-bold">لوحة التحكم</h1>
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn('flex items-center gap-3 p-3 rounded-lg text-right transition-colors',
              activeView === item.id ? 'bg-twitter-blue/10 text-twitter-blue font-bold' : 'hover:bg-bg-primary'
            )}
          >
            {item.icon}
            <span>{item.text}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-primary transition-colors">
          <ArrowLeft />
          <span>العودة للموقع</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
