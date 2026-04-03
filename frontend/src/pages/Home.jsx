import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Home = ({ isDark }) => {
  const [userName, setUserName] = useState('User');
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Storage se naam nikal kar state mein daalna
    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setSummary(null);
    }
  };

  const handleSummarize = () => {
    if (!file) return alert("Bhai, pehle file select karo!");
    
    setIsAnalyzing(true);

    // Fake Detailed AI Logic
    setTimeout(() => {
      const detailedResult = {
        id: Date.now(),
        fileName: file.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        content: `Detailed Medical Insights for ${userName}:\n\n` +
                 `1. Analysis of ${file.name} is complete.\n` +
                 `2. All blood markers (Hemoglobin, WBC, Platelets) are within the safe reference range.\n` +
                 `3. No signs of infection or acute inflammation detected in the document.\n` +
                 `4. Blood Glucose levels (Fasting) appear stable.\n\n` +
                 `Conclusion: Based on the uploaded data, your health status is stable. Keep following your current routine!`
      };

      setSummary(detailedResult.content);
      setIsAnalyzing(false);

      // Save to History (LocalStorage)
      const existingHistory = JSON.parse(localStorage.getItem('medicalHistory') || '[]');
      localStorage.setItem('medicalHistory', JSON.stringify([detailedResult, ...existingHistory]));
    }, 3000);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="mb-12"
      >
        <h1 className={`text-5xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Welcome, <span className="text-blue-500">{userName}</span>!
        </h1>
        <p className={`mt-2 font-bold uppercase tracking-[0.3em] text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Instant Medical Report Analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Upload Card */}
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${isDark ? 'bg-[#111827] border-slate-800 text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
          <h2 className="text-4xl font-black mb-3 italic text-blue-500">Analyze Report</h2>
          <p className="opacity-50 mb-10 font-bold text-sm uppercase tracking-widest">PDF & Images Supported</p>
          
          <label className={`relative border-2 border-dashed rounded-3xl p-16 text-center mb-10 block cursor-pointer transition-all ${isDark ? 'border-slate-700 bg-slate-900/50 hover:border-blue-500' : 'border-slate-300 bg-slate-50 hover:border-blue-400'}`}>
            <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileChange} />
            <div className="text-5xl mb-4">{file ? "✅" : "📄"}</div>
            <p className="font-black text-sm uppercase opacity-40">{file ? file.name : "Drop Medical Report Here"}</p>
          </label>

          <button 
            onClick={handleSummarize} 
            disabled={isAnalyzing} 
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              isAnalyzing ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.02] shadow-green-500/20'
            }`}
          >
            {isAnalyzing ? "Processing... ⚡" : "Generate Detailed Summary"}
          </button>
        </motion.div>

        {/* AI Insights Card */}
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${isDark ? 'bg-[#111827] border-slate-800 text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
          <h2 className="text-3xl font-black text-blue-500 italic mb-8 underline decoration-blue-500/20 underline-offset-8">Detailed Insights</h2>
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="space-y-4">
                <p className="font-bold text-blue-400 animate-pulse italic">Scanning layers of your document...</p>
                <div className={`h-3 rounded-full animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                <div className={`h-3 rounded-full animate-pulse w-2/3 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
              </div>
            ) : summary ? (
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 whitespace-pre-line leading-relaxed font-medium italic">
                {summary}
              </div>
            ) : (
              <div className="text-center py-20 opacity-30">
                <p className="italic font-black text-xl uppercase tracking-tighter text-slate-500">Waiting for Report...</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;