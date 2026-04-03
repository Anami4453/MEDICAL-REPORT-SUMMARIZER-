import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const ChatFloatingIcon = ({ isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en'); 
  const [userCity, setUserCity] = useState("Detecting..."); 
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState("");
  const [bookingStep, setBookingStep] = useState({ hospital: null, doctor: null });

  // Hospital Database with Phone Numbers
  const allHospitals = [
    { id: 'h1', name: 'AIIMS Bhopal', city: 'Bhopal', phone: '+91-755-2433000', doctors: ['Dr. Chouhan', 'Dr. Sharma'] },
    { id: 'h2', name: 'MY Hospital', city: 'Indore', phone: '+91-731-2527301', doctors: ['Dr. Agrawal', 'Dr. Gupta'] },
    { id: 'h3', name: 'J.A. Hospital', city: 'Gwalior', phone: '+91-751-2403100', doctors: ['Dr. Pandey', 'Dr. Vats'] },
    { id: 'h4', name: 'Birla Hospital', city: 'Gwalior', phone: '+91-751-2432000', doctors: ['Dr. Singh', 'Dr. Khan'] }
  ];

  const t = {
    en: { welcome: "Hello! How can I help you?", placeholder: "Type your query here...", loc: "Location", hospTitle: "Nearby Hospitals:", drTitle: "Available Doctors:", conf: "✅ APPOINTMENT BOOKED!", call: "Call Hospital:" },
    hi: { welcome: "नमस्ते! मैं आपकी क्या मदद कर सकता हूँ?", placeholder: "यहाँ लिखें...", loc: "स्थान", hospTitle: "नज़दीकी अस्पताल:", drTitle: "उपलब्ध डॉक्टर्स:", conf: "✅ अपॉइंटमेंट बुक हो गया है!", call: "अस्पताल को कॉल करें:" }
  };

  useEffect(() => {
    if (isOpen && userCity === "Detecting...") {
      requestLocationAccess();
    }
  }, [isOpen]);

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          const data = await res.json();
          const city = data.address.city || data.address.town || "Gwalior";
          setUserCity(city.replace("District", "").trim());
        } catch (e) { setUserCity("Gwalior"); }
      }, () => setUserCity("Gwalior"));
    }
  };

  const addMessage = (text, sender, type = 'text', options = null) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender, type, options }]);
  };

  // --- FIXED: handleSendMessage Logic Added ---
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const input = inputText.toLowerCase();
    addMessage(inputText, 'user');
    setInputText("");

    setTimeout(() => {
      if (input.includes('hospital') || input.includes('nearby') || input.includes('gwalior') || input.includes('bhopal')) {
        const filtered = allHospitals.filter(h => 
          input.includes(h.city.toLowerCase()) || 
          userCity.toLowerCase().includes(h.city.toLowerCase())
        );
        const list = filtered.length > 0 ? filtered : allHospitals;
        addMessage(t[lang].hospTitle, 'ai', 'hospitals', list.map(h => h.name));
      } else {
        addMessage(lang === 'en' ? "I can help you find hospitals in " + userCity : "मैं " + userCity + " में आपकी मदद कर सकता हूँ।", 'ai');
      }
    }, 1000);
  };

  const handleAction = (type, value) => {
    if (type === 'hosp_selected') {
      const hosp = allHospitals.find(h => h.name === value);
      setBookingStep({ ...bookingStep, hospital: hosp });
      addMessage(`${value}`, 'user');
      setTimeout(() => addMessage(t[lang].drTitle, 'ai', 'dr_options', hosp.doctors), 600);
    } 
    else if (type === 'dr_selected') {
      setBookingStep({ ...bookingStep, doctor: value });
      addMessage(`${value}`, 'user');
      setTimeout(() => addMessage(lang === 'en' ? "Select Time Slot:" : "समय चुनें:", 'ai', 'slots', ["10:00 AM", "02:00 PM", "05:00 PM"]), 600);
    }
    else if (type === 'slot_selected') {
      addMessage(value, 'user');
      setTimeout(() => {
        addMessage(`${t[lang].conf}\n\nHospital: ${bookingStep.hospital.name}\nDoctor: ${bookingStep.doctor}\nTime: ${value}\n\n📞 ${t[lang].call} ${bookingStep.hospital.phone}`, 'ai');
      }, 800);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`absolute bottom-20 right-0 w-80 md:w-[26rem] rounded-[2rem] shadow-2xl border overflow-hidden ${isDark ? 'bg-[#1a1c23] border-slate-700' : 'bg-white border-slate-200'}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] p-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[11px] uppercase tracking-widest">Health AI</h3>
                  <p className="text-[9px] font-bold">📍 {userCity}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {lang === 'en' ? 'हिन्दी' : 'English'}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-xl">✕</button>
                </div>
              </div>
            </div>

            <div className="h-80 p-6 overflow-y-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-[85%] text-[12px] font-medium leading-relaxed ${
                    msg.sender === 'user' ? 'bg-[#4F46E5] text-white rounded-br-none' : (isDark ? 'bg-[#2d313a] text-gray-100' : 'bg-gray-100 text-gray-800') + ' rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                  
                  {msg.type === 'hospitals' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.options.map(name => (
                        <button key={name} onClick={() => handleAction('hosp_selected', name)} className="bg-indigo-50 border-2 border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">{name}</button>
                      ))}
                    </div>
                  )}

                  {msg.type === 'dr_options' && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.options.map(name => (
                        <button key={name} onClick={() => handleAction('dr_selected', name)} className="bg-emerald-50 border-2 border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm">{name}</button>
                      ))}
                    </div>
                  )}

                  {msg.type === 'slots' && (
                    <div className="grid grid-cols-2 gap-2 mt-3 w-full">
                      {msg.options.map(slot => (
                        <button key={slot} onClick={() => handleAction('slot_selected', slot)} className="bg-blue-50 border-2 border-blue-100 text-blue-700 px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">{slot}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={`p-4 border-t flex gap-2 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={t[lang].placeholder} className={`flex-1 px-4 py-3 rounded-2xl text-[11px] outline-none ${isDark ? 'bg-[#2d313a] text-white border-none' : 'bg-gray-50 border border-gray-200'}`} />
              <button onClick={handleSendMessage} className="bg-[#4F46E5] text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-all">➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-[2rem] bg-white border-2 border-indigo-600 flex items-center justify-center cursor-pointer shadow-2xl">
        <span className="text-2xl">🤖</span>
      </motion.div>
    </div>
  );
};

export default ChatFloatingIcon;