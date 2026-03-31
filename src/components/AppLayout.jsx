import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ArrowLeftRight, PieChart, TrendingUp,
  BarChart3, Settings, LogOut, TrendingUp as TrendingUpIcon, Menu, X, Bell
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
  { label: 'Budgets', icon: PieChart, path: '/budgets' },
  { label: 'Income', icon: TrendingUp, path: '/income' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AP';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#0d0b1e]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#130f2a] border-r border-[#2d2b4e] z-30 transform transition-transform duration-300 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#2d2b4e]">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUpIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">FinanceAI</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-[#9b99b5] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                    : 'text-[#9b99b5] hover:bg-[#1e1940] hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user section */}
        <div className="px-3 py-4 border-t border-[#2d2b4e] space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9b99b5] hover:bg-[#1e1940] hover:text-white transition"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9b99b5] hover:bg-red-900/30 hover:text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-[#0d0b1e]/80 backdrop-blur border-b border-[#2d2b4e] px-4 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[#9b99b5] hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <button className="relative text-[#9b99b5] hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
                <div className="text-xs text-[#9b99b5]">{user?.email || ''}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
