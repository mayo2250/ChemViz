import React, { useState } from 'react';
import { loginUser, uploadCSV, getHistory, downloadReport } from './api'; 
import Dashboard from './components/Dashboard';
import { User, LogOut, Moon, Sun, Beaker, History, FileText, X, UploadCloud, ArrowRight, CheckCircle, Calendar, Activity, Droplets, Thermometer, Gauge, ChevronRight, Zap, Play } from 'lucide-react';
import StatsCard from './components/StatsCard';
import UploadZone from './components/UploadZone';

function App() {
  // --- UI STATE
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // --- DATA STATE
  const [chartData, setChartData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [file, setFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ records: 0, flow: 0, pressure: 0, temp: 0 });

  // --- AUTHENTICATION STATE
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // --- HANDLERS
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setToken(localStorage.getItem('access_token'));
      setAuthError('');
    } catch (err) {
      setAuthError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setShowProfileMenu(false);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    try {
      const res = await uploadCSV(file);
      const data = res.data;

      setStats({ 
          records: data.total_equipment, 
          flow: data.avg_flowrate, 
          pressure: data.avg_pressure, 
          temp: data.avg_temperature 
      });
      setChartData(data.equipment_distribution);
      
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    }
    setLoading(false);
  };

  const handleGetHistory = async () => {
    try {
      const res = await getHistory();
      setHistoryData(res.data);
      setShowHistory(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      await downloadReport();
    } catch (err) {
      console.error(err);
      alert("Failed to download report.");
    }
  };

  if (!token) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <form onSubmit={handleLogin} className="space-y-4">
                    <h1 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-white">ChemViz Login</h1>
                    {authError && <div className="text-red-500 text-center">{authError}</div>}
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white" placeholder="Username" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white" placeholder="Password" />
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">Sign In</button>
                </form>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
        
        {/* NAV BAR */}
        <nav className="fixed top-0 w-full z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg text-white"><Beaker size={20} /></div>
             <span className="text-xl font-bold">ChemViz</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><Sun size={20}/></button>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold">{username ? username[0].toUpperCase() : 'U'}</button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 text-left"><LogOut size={16} /> Log Out</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
          
          <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {username || 'User'}</h1>
                <p className="text-slate-500 dark:text-slate-400">Analysis Dashboard</p>
            </div>
            <div className="flex gap-3">
                <button onClick={handleGetHistory} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg font-medium transition">
                    <History size={18} /> History
                </button>
                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-lg shadow-green-500/20">
                    <FileText size={18} /> Report
                </button>
            </div>
          </div>

          {/* 🟢 NEW UPLOAD & ANALYZE SECTION  */}
          <div className="mb-10 flex flex-col lg:flex-row gap-6 h-auto lg:h-48">
            
            {/* 1. Drop Zone (Takes remaining space) */}
            <div className="flex-grow h-48 lg:h-full">
                <UploadZone 
                    onFileSelect={handleFileSelect} 
                    fileName={file?.name} 
                    isUploading={false}
                />
            </div>

            {/* 2. The New Control Panel Button  */}
            <button
                onClick={handleUploadClick}
                disabled={!file || loading}
                className={`
                    group relative lg:w-64 w-full h-24 lg:h-full
                    flex flex-col items-center justify-center gap-3
                    rounded-2xl border-2 transition-all duration-300
                    ${!file 
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-600' 
                        : 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 cursor-pointer'
                    }
                `}
            >
                

                {loading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <span className="text-sm font-medium animate-pulse">Processing...</span>
                    </div>
                ) : (
                    <>
                        <div className={`p-3 rounded-xl transition-all ${file ? 'bg-white/10 group-hover:bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {file ? <Zap size={32} fill="currentColor" /> : <Play size={32} />}
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold tracking-wide">Run Analysis</span>
                            <span className={`text-xs uppercase tracking-wider ${file ? 'text-indigo-200' : 'text-slate-400'}`}>
                                {/* {file ? 'Ready to Start' : 'No Input'} */}
                            </span>
                        </div>
                    </>
                )}
            </button>

          </div>
          {/* 🟢 END NEW SECTION */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Records" value={stats.records} unit="entries" icon="📄" isDarkMode={isDarkMode} />
            <StatsCard title="Avg Flow Rate" value={stats.flow} unit="L/hr" icon="🌊" isDarkMode={isDarkMode} />
            <StatsCard title="Avg Pressure" value={stats.pressure} unit="psi" icon="⚡" isDarkMode={isDarkMode} />
            <StatsCard title="Avg Temp" value={stats.temp} unit="°C" icon="🌡️" isDarkMode={isDarkMode} />
          </div>

          <Dashboard distribution={chartData} isDarkMode={isDarkMode} />

        </main>

        {/* HISTORY MODAL */}
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <History className="text-blue-500" /> Upload History
                    </h2>
                    <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {historyData.length > 0 ? (
                        historyData.map((item, i) => (
                          <div key={i} className="p-4 bg-white dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
                             <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    <Activity size={16} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 dark:text-white">Upload #{item.id}</p>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                      <Calendar size={12} /> {new Date(item.uploaded_at).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">
                                  {item.total_equipment} Items
                                </span>
                             </div>
                             <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                  <Droplets size={14} className="text-cyan-500" />
                                  <span>{item.avg_flowrate} L/hr</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                  <Gauge size={14} className="text-purple-500" />
                                  <span>{item.avg_pressure} psi</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                  <Thermometer size={14} className="text-red-500" />
                                  <span>{item.avg_temperature} °C</span>
                                </div>
                             </div>
                          </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                          <p>No history records found.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;