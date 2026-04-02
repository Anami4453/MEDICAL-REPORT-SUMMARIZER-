import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- FIX: Summarize Logic ---
  const handleUpload = async () => {
    if (!file) return alert("Pehle file select karein!");
    
    setLoading(true);
    const formData = new FormData();
    // 'report' wahi naam hai jo backend mein upload.single('report') hai
    formData.append('report', file);

    try {
      console.log("Summarizing...");
      const res = await axios.post('http://localhost:5000/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSummary(res.data.summary);
      setActiveTab("summary"); 
      console.log("Summary success! ✅");
    } catch (err) {
      console.error("Summarize Error:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.error || "Backend connect nahi ho raha."));
    }
    setLoading(false);
  };

  // --- FIX: Chat Logic ---
  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input; // Input backup for API call
    setInput("");

    try {
      console.log("Asking AI...");
      // Chat mein FormData nahi, JSON bhejna hai
      const res = await axios.post('http://localhost:5000/chat', { 
        message: currentInput 
      });
      
      const aiMsg = { role: "ai", text: res.data.text };
      setMessages(prev => [...prev, aiMsg]);
      console.log("AI Replied! ✅");
    } catch (err) {
      console.error("Chat Error:", err.response?.data || err.message);
      setMessages(prev => [...prev, { 
        role: "ai", 
        text: "Server error: Chat connect nahi ho payi." 
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800 font-sans">
      
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/70 sticky top-0 z-10 py-4 px-8 flex justify-between items-center border-b border-white/20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
            <span className="text-white text-xl">🩺</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
            MedScan <span className="text-slate-400 font-light">AI</span>
          </h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 mt-4">
        
        {/* Left: Upload Section */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
            <h2 className="text-xl font-bold mb-6 text-slate-700">Upload Report</h2>
            
            <div className="group relative border-2 border-dashed border-blue-200 rounded-2xl p-8 bg-gradient-to-b from-white to-blue-50/50 text-center transition-all hover:border-blue-400">
              <input 
                type="file" 
                className="hidden" 
                id="fileInput" 
                accept="application/pdf, image/*"
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <label htmlFor="fileInput" className="cursor-pointer block">
                <div className="text-5xl mb-4 transition-transform group-hover:scale-110">📄</div>
                <p className="text-sm text-slate-600 font-semibold truncate px-2">
                  {file ? file.name : "Drop PDF or Photo here"}
                </p>
                <p className="text-xs text-slate-400 mt-2">Supports PDF, JPG, PNG</p>
              </label>
            </div>

            <button 
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? "Analyzing Data..." : "Generate Insights"}
            </button>
          </div>
        </div>

        {/* Right: Dashboard Section */}
        <div className="md:col-span-8 flex flex-col h-[75vh]">
          
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-slate-200/50 backdrop-blur-sm w-fit rounded-2xl mb-6 border border-slate-300/30">
            <button 
              onClick={() => setActiveTab("summary")}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "summary" ? 'bg-white text-blue-700 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab("chat")}
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "chat" ? 'bg-white text-blue-700 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Ask AI
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white/90 backdrop-blur-md flex-1 rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col">
            {activeTab === "summary" ? (
              <div className="p-10 overflow-y-auto">
                {!summary && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-60 mt-10">
                    <span className="text-7xl mb-4">🔬</span>
                    <p className="text-lg italic font-medium">Ready to decode your report...</p>
                  </div>
                )}
                <div className="prose prose-blue text-slate-700 whitespace-pre-line leading-relaxed">
                  {summary}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gradient-to-b from-transparent to-slate-50/50">
                  {messages.length === 0 && (
                    <div className="text-center py-10 opacity-40 italic">
                      Ask about your reports here...
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-5 py-3 rounded-3xl text-sm shadow-sm ${
                        m.role === 'user' 
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Input Field */}
                <form onSubmit={handleChat} className="p-6 bg-white border-t border-slate-100 flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Ask about your report..." 
                    className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-inner"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl active:scale-90 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;