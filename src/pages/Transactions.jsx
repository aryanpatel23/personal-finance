import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Search } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Salary', 'Other'];

const MOCK_TRANSACTIONS = [
  { _id: '1', name: 'Grocery Store', amount: 85.50, category: 'Food', type: 'expense', date: '2024-03-15' },
  { _id: '2', name: 'Netflix', amount: 15.99, category: 'Entertainment', type: 'expense', date: '2024-03-10' },
  { _id: '3', name: 'Monthly Salary', amount: 5200, category: 'Salary', type: 'income', date: '2024-03-01' },
  { _id: '4', name: 'Electric Bill', amount: 120, category: 'Bills', type: 'expense', date: '2024-03-08' },
  { _id: '5', name: 'Uber', amount: 24.50, category: 'Transport', type: 'expense', date: '2024-03-12' },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ name: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/transactions').then(res => {
      if (res.data?.length) setTransactions(res.data);
    }).catch(() => {});
  }, []);

  const filtered = transactions.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || t.type === filterType;
    return matchSearch && matchType;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/transactions', { ...form, amount: parseFloat(form.amount) });
      setTransactions(prev => [res.data, ...prev]);
      setShowAdd(false);
      setForm({ name: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] });
    } catch {
      // Add locally for demo
      setTransactions(prev => [{ _id: Date.now().toString(), ...form, amount: parseFloat(form.amount) }, ...prev]);
      setShowAdd(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
    } catch {}
    setTransactions(prev => prev.filter(t => t._id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-[#9b99b5] mt-1">Track all your income and expenses</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-4">
          <div className="text-sm text-[#9b99b5] mb-1">Total Income</div>
          <div className="text-xl font-bold text-green-400">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-4">
          <div className="text-sm text-[#9b99b5] mb-1">Total Expenses</div>
          <div className="text-xl font-bold text-red-400">${totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4860]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-[#1a1535] border border-[#2d2b4e] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#4a4860] text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'income', 'expense'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition capitalize
                ${filterType === t ? 'bg-purple-600 text-white' : 'bg-[#1a1535] border border-[#2d2b4e] text-[#9b99b5] hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[#9b99b5]">No transactions found</div>
        ) : (
          <div className="divide-y divide-[#2d2b4e]">
            {filtered.map(t => (
              <div key={t._id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#1e1940] transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold
                  ${t.type === 'income' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                  {t.category?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{t.name}</div>
                  <div className="text-xs text-[#9b99b5]">{t.category} · {new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div className={`text-sm font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                </div>
                <button onClick={() => handleDelete(t._id)} className="text-[#4a4860] hover:text-red-400 transition ml-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-5">Add Transaction</h3>
            {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-[#9b99b5] mb-1.5">Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                  className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="Transaction name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#9b99b5] mb-1.5">Amount ($)</label>
                  <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required
                    className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm text-[#9b99b5] mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#9b99b5] mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#9b99b5] mb-1.5">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                    className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 bg-[#0d0b1e] border border-[#2d2b4e] text-[#9b99b5] rounded-xl py-2.5 text-sm font-medium hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-60">
                  {loading ? 'Adding...' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
