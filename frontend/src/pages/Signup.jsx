import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = ({ isDark }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (res.ok) {
      // Signup ke waqt name bhi bhej rahe hain taaki DB mein save ho sake
      navigate('/otp-verify', { state: { phone, name } });
    } else {
      alert("OTP nahi bhej paye! Backend check karo.");
    }
  };

  const inputClass = `w-full rounded-2xl py-4 px-6 font-bold outline-none border-2 transition-all ${
    isDark ? 'bg-slate-900 border-slate-800 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-100 focus:border-blue-400 text-slate-900'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0f1a]' : 'bg-[#f4f7f6]'}`}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-md w-full p-10 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}
      >
        <h1 className="text-4xl font-black italic text-blue-500 text-center mb-2">InstaMed</h1>
        <p className={`text-center uppercase tracking-[0.2em] text-[10px] font-bold mb-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Create New Account</p>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className={`block text-[10px] uppercase font-black mb-2 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
            <input type="text" placeholder="Your Name" required className={inputClass} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className={`block text-[10px] uppercase font-black mb-2 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phone Number</label>
            <input type="tel" placeholder="+91 XXXXX XXXXX" required className={inputClass} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
            Sign Up & Get OTP
          </button>
        </form>

        <p className={`mt-8 text-center font-bold text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline ml-1">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;