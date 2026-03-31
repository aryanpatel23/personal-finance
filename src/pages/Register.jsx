import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0b1e] px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FinanceAI</span>
        </div>
        <div className="bg-[#1a1535] border border-[#2d2b4e] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
          <p className="text-[#9b99b5] mb-6">Start your financial journey today</p>
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#9b99b5] mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-3 text-white placeholder-[#4a4860] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                placeholder="Aryan Patel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9b99b5] mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-3 text-white placeholder-[#4a4860] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9b99b5] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0d0b1e] border border-[#2d2b4e] rounded-xl px-4 py-3 pr-12 text-white placeholder-[#4a4860] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4860] hover:text-[#9b99b5]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-center text-[#9b99b5] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
