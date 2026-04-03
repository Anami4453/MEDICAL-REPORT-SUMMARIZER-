import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ isDark }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === formData.email)) return alert("User exists!");
      users.push(formData);
      localStorage.setItem('users', JSON.stringify(users));
      navigate("/verify-otp");
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = "/"; 
      } else alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <div className={`max-w-md w-full p-12 rounded-[3rem] shadow-2xl border transition-all ${
        isDark ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200'
      }`}>
        <h2 className="text-4xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-500 italic tracking-tighter">
          {isSignup ? "Create" : "Welcome"}
        </h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">Cyber Health AI</p>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <input required type="text" placeholder="Full Name" className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50'}`} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          )}
          <input required type="email" placeholder="Email" className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50'}`} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input required type="password" placeholder="Password" className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50'}`} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <button className="w-full bg-gradient-to-br from-emerald-500 to-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all">
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <button onClick={() => setIsSignup(!isSignup)} className="w-full mt-8 text-xs font-black text-emerald-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">
          {isSignup ? "Already registered? Login" : "New User? Create Account"}
        </button>
      </div>
    </div>
  );
};

export default Login;