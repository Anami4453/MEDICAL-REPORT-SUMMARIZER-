import { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { motion } from 'framer-motion';

const History = ({ isDark }) => {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('scanHistory') || '[]'));
  }, []);

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("MedScan AI Analysis", 20, 20);
    doc.setFontSize(10);
    doc.text(`Report: ${report.name}`, 20, 30);
    doc.text(`Date: ${report.date}`, 20, 37);
    doc.save(`${report.name}_Summary.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto p-10">
      <h2 className="text-4xl font-black italic text-emerald-500 mb-10 tracking-tighter">Medical History</h2>
      
      <div className="grid gap-4">
        {history.length === 0 ? (
          <p className="text-center opacity-20 py-20 font-bold">No Records Found</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className={`p-6 rounded-[2rem] border-l-8 border-emerald-500 flex justify-between items-center ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
            }`}>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase">{item.date}</p>
                <h3 className="text-lg font-bold">{item.name}</h3>
              </div>
              <button onClick={() => setSelected(item)} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Analyze</button>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className={`max-w-md w-full p-8 rounded-[3rem] ${isDark ? 'bg-slate-900 text-white' : 'bg-white'}`}>
            <h3 className="text-2xl font-black text-emerald-500 mb-4">Quick Insights</h3>
            <p className="text-sm opacity-80 mb-8">{selected.fullSummary}</p>
            <div className="flex gap-4">
              <button onClick={() => downloadPDF(selected)} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase">Download</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase">Close</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default History;