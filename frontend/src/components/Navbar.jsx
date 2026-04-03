import React from 'react';

const Navbar = ({ isDark }) => {
  return (
    <header className="max-w-7xl mx-auto flex justify-between items-center py-6 px-8">
      <div className="flex items-center gap-3">
        {/* InstaMed Branding */}
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
           <span className="text-white font-black text-xl">IM</span>
        </div>
        <h1 className={`text-2xl font-black tracking-tight italic ${isDark ? 'text-white' : 'text-slate-900'}`}>
          InstaMed
        </h1>
      </div>
      
      <nav className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest opacity-80">
        <a href="/" className="hover:text-blue-500 transition-colors">Home</a>
        <a href="/history" className="hover:text-blue-500 transition-colors">History</a>
        <button className="bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 transition-all active:scale-95 shadow-md">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;