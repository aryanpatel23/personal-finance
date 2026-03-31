import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AP';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[#9b99b5] mt-1">Manage your account preferences</p>
      </div>
      <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">{initials}</div>
          <div>
            <div className="text-lg font-semibold text-white">{user?.name || 'User'}</div>
            <div className="text-sm text-[#9b99b5]">{user?.email || ''}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[#0d0b1e] rounded-xl">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs text-[#9b99b5]">Full Name</div>
              <div className="text-sm text-white font-medium">{user?.name || 'Not set'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-[#0d0b1e] rounded-xl">
            <Mail className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs text-[#9b99b5]">Email Address</div>
              <div className="text-sm text-white font-medium">{user?.email || 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Account</h2>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium text-sm transition">
          <LogOut className="w-4 h-4" />Sign out of your account
        </button>
      </div>
    </div>
  );
}
