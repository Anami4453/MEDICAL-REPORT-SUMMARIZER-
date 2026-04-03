import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OTPVerify = ({ isDark }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp === "1234") {
      alert("Verified!");
      navigate("/login");
    } else alert("Try 1234");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className={`max-w-md w-full p-12 rounded-[3rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        <h2 className="text-3xl font-black text-emerald-500 mb-2">Security Check</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Enter 1234 to proceed</p>
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            maxLength="4"
            className={`w-full text-center text-4xl font-black py-5 rounded-2xl mb-6 outline-none border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50'}`}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl">
            Verify Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;