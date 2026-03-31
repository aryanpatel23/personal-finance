import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const MONTHLY_DATA = [
  { month: 'Oct', income: 5200, expenses: 3200 },
  { month: 'Nov', income: 5200, expenses: 2800 },
  { month: 'Dec', income: 6000, expenses: 4100 },
  { month: 'Jan', income: 5200, expenses: 3600 },
  { month: 'Feb', income: 5200, expenses: 2900 },
  { month: 'Mar', income: 6150, expenses: 3400 },
];

const CATEGORY_DATA = [
  { name: 'Food', value: 520, color: '#7c3aed' },
  { name: 'Bills', value: 400, color: '#3b82f6' },
  { name: 'Transport', value: 145, color: '#22c55e' },
  { name: 'Entertainment', value: 89, color: '#f59e0b' },
  { name: 'Shopping', value: 230, color: '#ef4444' },
  { name: 'Other', value: 116, color: '#8b5cf6' },
];

const SAVINGS_DATA = [
  { month: 'Oct', savings: 2000 },
  { month: 'Nov', savings: 2400 },
  { month: 'Dec', savings: 1900 },
  { month: 'Jan', savings: 1600 },
  { month: 'Feb', savings: 2300 },
  { month: 'Mar', savings: 2750 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-[#9b99b5] mt-1">Visualize your financial trends</p>
      </div>

      {/* Income vs Expenses */}
      <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-5">Income vs Expenses (6 months)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={MONTHLY_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2b4e" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#9b99b5', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9b99b5', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#130f2a', border: '1px solid #2d2b4e', borderRadius: 12, color: '#fff' }} formatter={v => `$${v.toLocaleString()}`} />
            <Legend wrapperStyle={{ color: '#9b99b5', fontSize: 12 }} />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expenses" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Spending by Category</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={CATEGORY_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#130f2a', border: '1px solid #2d2b4e', borderRadius: 8, color: '#fff' }} formatter={v => `$${v}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {CATEGORY_DATA.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#9b99b5]">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">${item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings Trend */}
        <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Savings Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={SAVINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2b4e" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#9b99b5', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9b99b5', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#130f2a', border: '1px solid #2d2b4e', borderRadius: 8, color: '#fff' }} formatter={v => [`$${v.toLocaleString()}`, 'Savings']} />
              <Line type="monotone" dataKey="savings" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
