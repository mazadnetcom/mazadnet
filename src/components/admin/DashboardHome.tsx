import { Users, BarChart, MessageSquare } from 'lucide-react';
import GenderChart from '../charts/GenderChart';
import { useUsers } from '../../contexts/UsersContext';

const DashboardHome = () => {
    const { users } = useUsers();
    const totalUsers = users.length;
    const bannedUsers = users.filter(u => u.isBanned).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم الرئيسية</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-secondary p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-twitter-blue/10 rounded-full"><Users className="text-twitter-blue" size={28} /></div>
          <div>
            <p className="text-text-secondary text-sm">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 rounded-full"><BarChart className="text-pink-500" size={28} /></div>
          <div>
            <p className="text-text-secondary text-sm">مستخدمين محظورين</p>
            <p className="text-2xl font-bold">{bannedUsers}</p>
          </div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full"><MessageSquare className="text-green-500" size={28} /></div>
          <div>
            <p className="text-text-secondary text-sm">إجمالي التغريدات (وهمي)</p>
            <p className="text-2xl font-bold">1,254</p>
          </div>
        </div>
      </div>
      <div className="bg-bg-secondary p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">توزيع المستخدمين حسب الجنس</h2>
        <div style={{ width: '100%', height: 300 }}>
          <GenderChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
