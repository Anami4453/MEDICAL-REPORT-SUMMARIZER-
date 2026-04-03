import React from 'react';

const Home = ({ isDark }) => {
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f1a] text-white' : 'bg-white text-black'} p-10`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side: Upload Section */}
        <div className={`p-10 rounded-3xl border-2 ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-gray-50 border-gray-200'} shadow-xl`}>
          <h2 className="text-4xl font-black mb-4">Analyze Your Report</h2>
          <p className="opacity-70 mb-10">Upload your medical scans or blood reports for AI analysis.</p>
          
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-20 flex flex-col items-center justify-center bg-black/20 hover:border-emerald-500 transition-all cursor-pointer">
            <span className="font-bold opacity-60 text-lg text-center uppercase tracking-widest">Upload Report</span>
          </div>

          <button className="w-full mt-10 bg-[#00a36c] hover:bg-[#008f5d] text-white font-black py-5 rounded-2xl shadow-lg transition-all text-xl uppercase">
            Start AI Analysis
          </button>
        </div>

        {/* Right Side: AI Insights */}
        <div className={`p-10 rounded-3xl border-2 ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-gray-50 border-gray-200'} shadow-xl min-h-[500px]`}>
          <h2 className="text-3xl font-black text-blue-500 mb-6 italic">AI Insights</h2>
          <p className="opacity-50 font-bold text-xl mt-10">Waiting for report...</p>
        </div>

      </div>
    </div>
  );
};

export default Home;