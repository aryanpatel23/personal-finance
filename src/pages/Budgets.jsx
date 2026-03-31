import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
const COLORS = ['#7c3aed', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#8b5cf6'];

const MOCK_BUDGETS = [
  { _id: '1', category: 'Food', maximum: 500, spent: 320, theme: '#7c3aed' },
  { _id: '2', category: 'Entertainment', maximum: 150, spent: 89, theme: '#3b82f6' },
  { _id: '3', category: 'Transport', maximum: 200, spent: 145, theme: '#22c55e' },
  { _id: '4', category: 'Bills', maximum: 400, spent: 400, theme: '#f59e0b' },
];

export default function Budgets() {
  const [budgets, setBudgets] = useState(MOCK_BUDGETS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: 'Food', maximum: '', theme: '#7c3aed' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/budgets').then(res => { if (res.data?.length) setBudgets(res.data); }).catch(() => {});
  }, []);

  const totalBudget = budgets.reduce((s, b) => s + b.maximum, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/budgets', { ...form, maximum: parseFloat(form.maximum) });
      setBudgets(prev => [...prev, res.data]);
    } catch {
      setBudgets(prev => [...prev, { _id: Date.now().toString(), ...form, maximum: parseFloat(form.maximum), spent: 0 }]);
    } finally {
      setLoading(false);
      setShowAdd(false);
      setForm({ category: 'Food', maximum: '', theme: '#7c3aed' });
    }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/budgets/${id}`); } catch {}
    setBudgets(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-[#9b99b5] mt-1">Manage your spending limits</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm">
          <Plus className="w-4 h-4" />Add Budget
        </button>
      </div>

      {/* Summary */}
      <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#9b99b5]">Total spent vs budget</span>
          <span className="text-sm font-medium text-white">${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
        </div>
        <div className="h-3 bg-[#0d0b1e] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`, backgroundColor: totalSpent > totalBudget ? '#ef4444' : '#7c3aed' }}
          />
        </div>
        <div className="text-xs text-[#9b99b5] mt-2">{Math.round((totalSpent / totalBudget) * 100)}% of total budget used</div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(budget => {
          const pct = Math.min(((budget.spent || 0) / budget.maximum) * 100, 100);
          const over = (budget.spent || 0) > budget.maximum;
          return (
            <div key={budget._id} className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: budget.theme || '#7c3aed' }} />
                  <span className="font-semibold text-white">{budget.category}</span>
                </div>
                <button onClick={() => handleDelete(budget._id)} className="text-[#4a4860] hover:text-red-400 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-xs text-[#9b99b5] mb-0.5">Spent</div>
                  <div className={`text-lg font-bold ${over ? 'text-red-400' : 'text-white'}`}>
                    ${(budget.spent || 0).toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#9b99b5] mb-0.5">Budget</div>
                  <div className="text-lg font-bold text-[#9b99b5]">${budget.maximum.toLocaleString()}</div>
                </div>
              </div>
              <div className="h-2 bg-[#0d0b1e] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : budget.theme || '#7c3aed' }}
                />
              </div>
              <div className="text-xs text-[#9b99b5] mt-2">
                {over ? <span className="text-red-400">Over budget by ${((budget.spent || 0) - budget.maximum).toFixed(2)}</span>
                  : `$${(budget.maximum - (budget.spent || 0)).toFixed(2)} remaining`}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-5">Add Budget</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-[#9b99b5] mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#9b99b5] mb-1.5">Monthly Budget ($)</label>
                <input type="number" min="1" value={form.maximum} onChange={e => setForm({...form, maximum: e.target.value})} required
                  className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="500" />
              </div>
              <div>
                <label className="block text-sm text-[#9b99b5] mb-1.5">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({...form, theme: c})}
                      className={`w-8 h-8 rounded-full border-2 transition ${form.theme === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 bg-[#0d0b1e] border border-[#2d2b4e] text-[#9b99b5] rounded-xl py-2.5 text-sm font-medium hover:text-white transition">Cancel</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-60">
                  {loading ? 'Adding...' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
