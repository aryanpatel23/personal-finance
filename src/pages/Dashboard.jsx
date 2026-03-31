import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, PiggyBank,
  Brain, AlertTriangle, CheckCircle, X, Sparkles, ArrowUpRight
} from 'lucide-react';

const MOCK_SPENDING = [
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 2800 },
  { month: 'Dec', amount: 4100 },
  { month: 'Jan', amount: 3600 },
  { month: 'Feb', amount: 2900 },
  { month: 'Mar', amount: 3400 },
];

const MOCK_INSIGHTS = {
  healthScore: 72,
  insights: [
    'Your dining expenses increased 23% this month',
    "You're on track to meet your savings goal",
    'Entertainment spending is within budget',
  ],
  alert: 'Grocery spending is 15% above your monthly budget.',
  recommendation: 'Consider setting up automatic transfers to your savings account to build an emergency fund.',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [insights, setInsights] = useState(MOCK_INSIGHTS);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Grocery spending is 15% above monthly budget' },
    { id: 2, type: 'info', message: "You've saved $340 more than last month — great job!" },
  ]);
  const [metrics, setMetrics] = useState({
    balance: 12450,
    income: 5200,
    expenses: 3400,
    savingsRate: 35,
  });
  const [spendingData] = useState(MOCK_SPENDING);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [txRes, incRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/income'),
        ]);
        const transactions = txRes.data || [];
        const incomes = incRes.data || [];

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyExpenses = transactions
          .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
          .reduce((s, t) => s + Math.abs(t.amount), 0);
        const monthlyIncome = incomes
          .filter(i => i.frequency === 'monthly')
          .reduce((s, i) => s + i.amount, 0);

        if (monthlyIncome > 0 || monthlyExpenses > 0) {
          setMetrics(prev => ({
            ...prev,
            income: monthlyIncome || prev.income,
            expenses: monthlyExpenses || prev.expenses,
            savingsRate: monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : prev.savingsRate,
          }));
        }
      } catch {
        // Keep mock data
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadInsights = async () => {
      setLoadingInsights(true);
      try {
        const res = await api.get('/insights');
        if (res.data) setInsights(res.data);
      } catch {
        // Keep mock insights
      } finally {
        setLoadingInsights(false);
      }
    };
    loadInsights();
  }, []);

  const dismissAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const scoreColor = insights.healthScore >= 70 ? 'text-green-400' : insights.healthScore >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreRingColor = insights.healthScore >= 70 ? 'stroke-green-400' : insights.healthScore >= 50 ? 'stroke-yellow-400' : 'stroke-red-400';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting}, {firstName}! 👋</h1>
          <p className="text-[#9b99b5] mt-1">Here's your financial overview for today</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm text-[#9b99b5]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* AI Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm
                ${alert.type === 'warning'
                  ? 'bg-amber-900/20 border-amber-700/40 text-amber-300'
                  : 'bg-blue-900/20 border-blue-700/40 text-blue-300'
                }`}
            >
              {alert.type === 'warning'
                ? <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                : <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              }
              <span className="flex-1">{alert.message}</span>
              <button onClick={() => dismissAlert(alert.id)} className="flex-shrink-0 opacity-60 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Balance"
          value={`$${metrics.balance.toLocaleString()}`}
          icon={DollarSign}
          trend="+2.5%"
          positive
          color="purple"
        />
        <MetricCard
          label="Monthly Income"
          value={`$${metrics.income.toLocaleString()}`}
          icon={TrendingUp}
          trend="+5.1%"
          positive
          color="green"
        />
        <MetricCard
          label="Monthly Expenses"
          value={`$${metrics.expenses.toLocaleString()}`}
          icon={TrendingDown}
          trend="-3.2%"
          positive={false}
          color="red"
        />
        <MetricCard
          label="Savings Rate"
          value={`${metrics.savingsRate}%`}
          icon={PiggyBank}
          trend="+1.8%"
          positive
          color="blue"
        />
      </div>

      {/* Charts + AI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <div className="lg:col-span-2 bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Spending Overview</h2>
              <p className="text-sm text-[#9b99b5]">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#9b99b5]">
              <div className="w-3 h-3 rounded-sm bg-purple-500" />
              Expenses
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={spendingData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2b4e" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#9b99b5', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9b99b5', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#130f2a', border: '1px solid #2d2b4e', borderRadius: 12, color: '#fff' }}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Expenses']}
              />
              <Bar dataKey="amount" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-600/30 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Insights</h2>
              <p className="text-xs text-[#9b99b5]">Powered by Gemini</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="flex items-center gap-4 mb-5 p-4 bg-[#0d0b1e] rounded-xl">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#2d2b4e" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  className={scoreRingColor}
                  strokeWidth="3"
                  strokeDasharray={`${(insights.healthScore / 100) * 97.4} 97.4`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreColor}`}>
                {insights.healthScore}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Financial Health</div>
              <div className={`text-xs font-semibold mt-0.5 ${scoreColor}`}>
                {insights.healthScore >= 70 ? 'Good' : insights.healthScore >= 50 ? 'Fair' : 'Needs Work'}
              </div>
              <div className="text-xs text-[#9b99b5] mt-1">Score out of 100</div>
            </div>
          </div>

          {/* Insights list */}
          {loadingInsights ? (
            <div className="flex items-center gap-2 text-[#9b99b5] text-sm">
              <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />
              Generating insights...
            </div>
          ) : (
            <ul className="space-y-3 flex-1">
              {insights.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#9b99b5]">
                  <ArrowUpRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  {insight}
                </li>
              ))}
            </ul>
          )}

          {insights.recommendation && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-700/30 rounded-xl text-xs text-purple-300">
              <span className="font-semibold">💡 Tip: </span>{insights.recommendation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, trend, positive, color }) {
  const colors = {
    purple: { bg: 'bg-purple-600/20', text: 'text-purple-400', icon: 'text-purple-400' },
    green: { bg: 'bg-green-600/20', text: 'text-green-400', icon: 'text-green-400' },
    red: { bg: 'bg-red-600/20', text: 'text-red-400', icon: 'text-red-400' },
    blue: { bg: 'bg-blue-600/20', text: 'text-blue-400', icon: 'text-blue-400' },
  };
  const c = colors[color] || colors.purple;

  return (
    <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          positive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
        }`}>{trend}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-[#9b99b5]">{label}</div>
    </div>
  );
}
