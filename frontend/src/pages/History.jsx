import { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { motion } from 'framer-motion';

const History = ({ isDark }) => {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Humne Home.jsx mein 'medicalHistory' naam se save kiya tha, wahi yahan read karenge
    const data = JSON.parse(localStorage.getItem('medicalHistory') || '[]');
    setHistory(data);
  }, []);

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    
    // PDF Design
    doc.setFillColor(0, 168, 107); // Emerald Green color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("InstaMed AI Analysis", 20, 25);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Report Name: ${report.fileName || report.name}`, 20, 60);
    doc.text(`Date: ${report.date}`, 20, 70);
    doc.text(`Time: ${report.time || ''}`, 20, 80);
    
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(report.content || report.fullSummary || "No summary available", 170);
    doc.text(splitText, 20, 105);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Disclaimer: This is an AI-generated summary. Please consult a doctor.", 20, 280);
    
    doc.save(`${report.fileName || 'Report'}_Summary.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-10">
      <h2 className="text-4xl font-black italic text-emerald-500 mb-10 tracking-tighter">Medical History</h2>
      
      <div className="grid gap-4">
        {history.length === 0 ? (
          <div className="text-center py-20">
             <p className="text-5xl mb-4 opacity-20">📂</p>
             <p className="opacity-20 font-bold uppercase tracking-widest">No Records Found</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className={`p-6 rounded-[2rem] border-l-8 border-emerald-500 flex justify-between items-center transition-all hover:scale-[1.01] ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-lg'
            }`}>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{item.date} | {item.time}</p>
                <h3 className="text-lg font-bold">{item.fileName || item.name}</h3>
              </div>
              <button 
                onClick={() => setSelected(item)} 
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-600/20"
              >
                View Report
              </button>
            </div>
          ))
        )}
      </div>

      {/* Details Popup */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-2xl w-full p-10 rounded-[3rem] shadow-2xl border ${
              isDark ? 'bg-[#111827] text-white border-slate-800' : 'bg-white text-slate-900 border-slate-100'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-3xl font-black text-emerald-500 mb-1 italic">Quick Insights</h3>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em]">{selected.fileName}</p>
               </div>
               <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all">✕</button>
            </div>

            <div className={`p-6 rounded-2xl mb-8 text-sm leading-relaxed font-medium whitespace-pre-line overflow-y-auto max-h-[300px] ${
              isDark ? 'bg-slate-800/50' : 'bg-slate-50'
            }`}>
              {selected.content || selected.fullSummary}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => downloadPDF(selected)} 
                className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-600/20"
              >
                📥 Download PDF
              </button>
              <button 
                onClick={() => setSelected(null)} 
                className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default History;