import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Components
import Navbar from './components/Navbar';
import ChatFloatingIcon from './components/ChatFloatingIcon';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History'; 
import OTPVerify from './pages/OTPVerify';

// Helper component to manage Layout
const AppContent = ({ isDark, setIsDark }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Hide Navbar on Login and OTP pages
  const hideNavbarOn = ['/login', '/verify-otp'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className={`min-h-screen transition-all duration-700 font-sans ${
      isDark ? 'bg-[#0a0f1a] text-slate-200' : 'bg-[#f4f7f6] text-slate-900'
    }`}>
      
      {/* Nayi Navbar sirf home aur history par dikhegi */}
      {shouldShowNavbar && <Navbar isDark={isDark} setIsDark={setIsDark} />}
      
      <main className={`${shouldShowNavbar ? 'pt-6 pb-20' : ''} min-h-screen`}> 
        <Routes>
          <Route path="/login" element={<Login isDark={isDark} />} />
          <Route path="/verify-otp" element={<OTPVerify isDark={isDark} />} />
          
          {/* Protected Routes */}
          <Route path="/" element={isLoggedIn ? <Home isDark={isDark} /> : <Navigate to="/login" />} />
          <Route path="/history" element={isLoggedIn ? <History isDark={isDark} /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<div className="flex items-center justify-center h-[70vh] font-black text-4xl opacity-10 uppercase">404 | NOT FOUND</div>} />
        </Routes>
      </main>

      {/* Chatbot hamesha accessible rahega */}
      <ChatFloatingIcon isDark={isDark} />
    </div>
  );
};

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <AppContent isDark={isDark} setIsDark={setIsDark} />
    </Router>
  );
}

export default App;