import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerify from './pages/OTPVerify';
import History from './pages/History'; // 🔥 Naya import add kiya
import ChatFloatingIcon from './components/ChatFloatingIcon';

const AppContent = ({ isDark, setIsDark }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Login/Signup/Root par Navbar hide karne ke liye logic
  const hideNavbarOn = ['/login', '/signup', '/otp-verify', '/'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-[#0a0f1a]' : 'bg-[#f4f7f6]'}`}>
      {shouldShowNavbar && <Navbar isDark={isDark} setIsDark={setIsDark} />}
      
      <main className={shouldShowNavbar ? 'pt-4 pb-20' : ''}>
        <Routes>
          <Route path="/login" element={<Login isDark={isDark} />} />
          <Route path="/signup" element={<Signup isDark={isDark} />} />
          <Route path="/otp-verify" element={<OTPVerify isDark={isDark} />} />
          
          {/* Authenticated Routes */}
          <Route path="/home" element={isAuthenticated ? <Home isDark={isDark} /> : <Navigate to="/login" />} />
          
          {/* 🔥 HISTORY ROUTE YAHAN ADD KIYA 🔥 */}
          <Route path="/history" element={isAuthenticated ? <History isDark={isDark} /> : <Navigate to="/login" />} />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>

      {/* Chatbot tabhi dikhega jab user login hoga */}
      {isAuthenticated && <ChatFloatingIcon isDark={isDark} />}
    </div>
  );
};

function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) { return true; }
  });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <Router>
      <AppContent isDark={isDark} setIsDark={setIsDark} />
    </Router>
  );
}

export default App;