import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useUsers } from '../../contexts/UsersContext';

const GenderChart = () => {
  const { users } = useUsers();
  const maleCount = users.filter(u => u.gender === 'male').length;
  const femaleCount = users.filter(u => u.gender === 'female').length;

  const data = [
    { name: 'ذكور', value: maleCount },
    { name: 'إناث', value: femaleCount },
  ];

  const COLORS = ['#1D9BF0', '#F91880']; // Twitter Blue and Pink

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'العدد']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GenderChart;
