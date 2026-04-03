import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OTPVerify = ({ isDark }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Signup/Login se aaya hua data nikalna
  const { phone, name } = location.state || { phone: '', name: 'User' };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const res = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // --- DATA SAVING ---
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', name || 'User'); // User ka naam save ho gaya
        
        navigate('/home');
      } else {
        alert("Ghalat OTP hai bhai, check karke phir se dalo.");
      }
    } catch (err) {
      alert("Server error! Backend check karo.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ${isDark ? 'bg-[#0a0f1a]' : 'bg-[#f4f7f6]'}`}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className={`max-w-md w-full p-10 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}
      >
        <h1 className="text-4xl font-black italic text-blue-500 text-center mb-2">Verify</h1>
        <p className={`text-center uppercase tracking-[0.2em] text-[10px] font-bold mb-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Sent to {phone}
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className={`block text-[10px] uppercase font-black mb-2 ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>6-Digit OTP</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="0 0 0 0 0 0" 
              required 
              className={`w-full rounded-2xl py-4 px-6 font-bold text-center text-2xl tracking-[0.5em] outline-none border-2 transition-all ${
                isDark ? 'bg-slate-900 border-slate-800 focus:border-blue-600 text-white' : 'bg-slate-50 border-slate-100 focus:border-blue-400 text-slate-900'
              }`}
              onChange={(e) => setOtp(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isVerifying}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            {isVerifying ? "Verifying..." : "Verify & Start"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OTPVerify;