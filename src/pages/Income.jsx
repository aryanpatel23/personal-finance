import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

const FREQ_COLORS = {
  weekly: 'text-blue-400 bg-blue-900/30',
  biweekly: 'text-purple-400 bg-purple-900/30',
  monthly: 'text-green-400 bg-green-900/30',
  yearly: 'text-amber-400 bg-amber-900/30',
};

const MOCK_INCOME = [
  { _id: '1', source: 'Software Engineer Salary', amount: 5200, frequency: 'monthly', date: '2024-03-01', description: 'Main job salary' },
  { _id: '2', source: 'Freelance Project', amount: 800, frequency: 'monthly', date: '2024-03-15', description: 'Web dev project' },
  { _id: '3', source: 'Dividend Income', amount: 150, frequency: 'monthly', date: '2024-03-20', description: 'Stock dividends' },
];

export default function Income() {
  const [incomes, setIncomes] = useState(MOCK_INCOME);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ source: '', amount: '', frequency: 'monthly', description: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/income').then(res => { if (res.data?.length) setIncomes(res.data); }).catch(() => {});
  }, []);

  const totalMonthly = incomes.filter(i => i.frequency === 'monthly').reduce((s, i) => s + i.amount, 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/income', { ...form, amount: parseFloat(form.amount) });
      setIncomes(prev => [res.data, ...prev]);
    } catch {
      setIncomes(prev => [{ _id: Date.now().toString(), ...form, amount: parseFloat(form.amount) }, ...prev]);
    } finally {
      setLoading(false);
      setShowAdd(false);
      setForm({ source: '', amount: '', frequency: 'monthly', description: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/income/${id}`); } catch { /* ignore – already removed locally */ }
    setIncomes(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Income</h1>
          <p className="text-[#9b99b5] mt-1">Track your income sources</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm">
          <Plus className="w-4 h-4" />Add Income
        </button>
      </div>

      <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <div className="text-sm text-[#9b99b5]">Total Monthly Income</div>
            <div className="text-2xl font-bold text-green-400">${totalMonthly.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {incomes.map(income => (
          <div key={income._id} className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 text-green-400 text-xs font-bold">
              {income.source?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{income.source}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${FREQ_COLORS[income.frequency] || 'text-[#9b99b5] bg-[#2d2b4e]'}`}>
                  {income.frequency}
                </span>
                {income.description && <span className="text-xs text-[#9b99b5] truncate">{income.description}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-base font-bold text-green-400">+${income.amount.toLocaleString()}</div>
              <div className="text-xs text-[#9b99b5]">{new Date(income.date).toLocaleDateString()}</div>
            </div>
            <button onClick={() => handleDelete(income._id)} className="text-[#4a4860] hover:text-red-400 transition ml-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-5">Add Income Source</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-[#9b99b5] mb-1.5">Source name</label>
                <input value={form.source} onChange={e => setForm({...form, source: e.target.value})} required
                  className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="e.g. Salary, Freelance" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#9b99b5] mb-1.5">Amount ($)</label>
                  <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required
                    className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm text-[#9b99b5] mb-1.5">Frequency</label>
                  <select value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})}
                    className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9b99b5] mb-1.5">Description (optional)</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="Optional notes" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 bg-[#0d0b1e] border border-[#2d2b4e] text-[#9b99b5] rounded-xl py-2.5 text-sm font-medium hover:text-white transition">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-60">
                  {loading ? 'Adding...' : 'Add Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
