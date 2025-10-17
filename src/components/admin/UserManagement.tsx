import { useUsers } from '../../contexts/UsersContext';
import { cn } from '../../lib/utils';
import { WhatsAppIcon } from '../icons';

const UserManagement = () => {
  const { users, toggleBan, toggleWhatsapp } = useUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">إدارة المستخدمين</h1>
      <div className="bg-bg-secondary rounded-xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="border-b border-border-primary">
            <tr>
              <th className="p-4">المستخدم</th>
              <th className="p-4">رقم الهاتف</th>
              <th className="p-4">الحالة</th>
              <th className="p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-border-primary last:border-b-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-sm text-text-secondary">{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-sm">{user.phone}</td>
                <td className="p-4">
                  <span className={cn('px-2 py-1 text-xs font-bold rounded-full', user.isBanned ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500')}>
                    {user.isBanned ? 'محظور' : 'نشط'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => toggleBan(user.id)} className={cn('px-3 py-1 text-sm rounded-md', user.isBanned ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}>
                      {user.isBanned ? 'رفع الحظر' : 'حظر'}
                    </button>
                    <button onClick={() => toggleWhatsapp(user.id)} className={cn('px-3 py-1 text-sm rounded-md flex items-center gap-1', user.whatsappEnabled ? 'bg-gray-500 text-white' : 'bg-green-500 text-white')}>
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>{user.whatsappEnabled ? 'تعطيل' : 'تفعيل'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
