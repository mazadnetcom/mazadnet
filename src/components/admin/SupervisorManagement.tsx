import { useState } from 'react';
import { useUsers } from '../../contexts/UsersContext';
import { useSupervisors } from '../../contexts/SupervisorsContext';
import { cn } from '../../lib/utils';
import { ShieldCheck, ShieldX, Trash2 } from 'lucide-react';

const Toggle = ({ label, enabled, onToggle }: { label: string, enabled: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm">{label}</span>
    <button onClick={onToggle} className={cn('w-10 h-5 rounded-full p-0.5 transition-colors', enabled ? 'bg-twitter-blue' : 'bg-gray-500')}>
      <div className={cn('w-4 h-4 bg-white rounded-full transition-transform', enabled ? 'transform translate-x-5' : '')} />
    </button>
  </div>
);

const SupervisorManagement = () => {
  const { users } = useUsers();
  const { supervisors, isSupervisor, addSupervisor, removeSupervisor, updateSupervisorPermissions } = useSupervisors();
  const [selectedUser, setSelectedUser] = useState('');

  const nonSupervisors = users.filter(u => !isSupervisor(u.id) && u.id !== 'currentUser');

  const handleAddSupervisor = () => {
    if (selectedUser) {
      addSupervisor(selectedUser);
      setSelectedUser('');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">إدارة المشرفين</h1>
      
      <div className="bg-bg-secondary p-6 rounded-xl mb-8">
        <h2 className="text-xl font-bold mb-4">إضافة مشرف جديد</h2>
        <div className="flex gap-2">
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="flex-grow bg-bg-primary border border-border-primary rounded-md px-3 py-2 outline-none focus:border-twitter-blue"
          >
            <option value="" disabled>اختر مستخدمًا لترقيته...</option>
            {nonSupervisors.map(user => (
              <option key={user.id} value={user.id}>{user.name} ({user.username})</option>
            ))}
          </select>
          <button
            onClick={handleAddSupervisor}
            disabled={!selectedUser}
            className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShieldCheck size={18} />
            <span>إضافة</span>
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="border-b border-border-primary">
            <tr>
              <th className="p-4">المشرف</th>
              <th className="p-4">الصلاحيات</th>
              <th className="p-4">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {supervisors.map(supervisor => {
              const user = users.find(u => u.id === supervisor.userId);
              if (!user) return null;
              
              return (
                <tr key={supervisor.userId} className="border-b border-border-primary last:border-b-0">
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-text-secondary">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="space-y-2 max-w-xs">
                       <Toggle 
                         label="حذف المنشورات"
                         enabled={supervisor.permissions.canDeletePost}
                         onToggle={() => updateSupervisorPermissions(supervisor.userId, { canDeletePost: !supervisor.permissions.canDeletePost })}
                       />
                       <Toggle 
                         label="تنشيط/إيقاف المنشورات"
                         enabled={supervisor.permissions.canTogglePostStatus}
                         onToggle={() => updateSupervisorPermissions(supervisor.userId, { canTogglePostStatus: !supervisor.permissions.canTogglePostStatus })}
                       />
                       <Toggle 
                         label="حظر المستخدمين"
                         enabled={supervisor.permissions.canBanUser}
                         onToggle={() => updateSupervisorPermissions(supervisor.userId, { canBanUser: !supervisor.permissions.canBanUser })}
                       />
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <button
                      onClick={() => removeSupervisor(supervisor.userId)}
                      className="bg-red-500/10 text-red-500 font-bold px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-red-500/20"
                    >
                      <Trash2 size={16} />
                      <span>إزالة</span>
                    </button>
                  </td>
                </tr>
              )
            })}
             {supervisors.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center p-8 text-text-secondary">
                        <ShieldX size={40} className="mx-auto mb-2" />
                        <p className="font-bold">لا يوجد مشرفون حاليًا</p>
                        <p className="text-sm">استخدم النموذج أعلاه لإضافة مشرف جديد.</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupervisorManagement;
