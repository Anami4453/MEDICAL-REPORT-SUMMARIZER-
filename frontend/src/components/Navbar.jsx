import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={`px-10 py-5 flex items-center justify-between transition-all duration-500 sticky top-0 z-40 backdrop-blur-md ${
      isDark ? 'bg-[#0a0f1a]/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200 shadow-sm'
    }`}>
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">IM</div>
        <span className={`text-2xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>InstaMed</span>
      </div>

      {/* Navigation & Actions */}
      <div className="flex items-center gap-10">
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)} 
          className={`px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${
            isDark ? 'bg-slate-800 text-yellow-400 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {isDark ? '☀️ LIGHT' : '🌙 DARK'}
        </button>

        {/* Links Section - Yahan History Wapas Aa Gayi */}
        <div className={`flex gap-8 font-bold text-xs uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <Link to="/home" className="hover:text-blue-500 transition-colors">Home</Link>
          
          {/* 🔥 HISTORY LINK 🔥 */}
          <Link to="/history" className="hover:text-blue-500 transition-colors">History</Link>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;