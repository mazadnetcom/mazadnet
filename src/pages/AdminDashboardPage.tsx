import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardHome from '../components/admin/DashboardHome';
import UserManagement from '../components/admin/UserManagement';
import ContentManagement from '../components/admin/ContentManagement';
import SiteSettings from '../components/admin/SiteSettings';
import SupervisorManagement from '../components/admin/SupervisorManagement';

type AdminView = 'home' | 'users' | 'content' | 'settings' | 'supervisors';

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState<AdminView>('home');

  const renderView = () => {
    switch (activeView) {
      case 'home': return <DashboardHome />;
      case 'users': return <UserManagement />;
      case 'content': return <ContentManagement />;
      case 'supervisors': return <SupervisorManagement />;
      case 'settings': return <SiteSettings />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="bg-bg-primary min-h-screen text-text-primary flex">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}
