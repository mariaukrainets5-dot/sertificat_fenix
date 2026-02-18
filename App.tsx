import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  RefreshCw, 
  History, 
  Trash2, 
  Printer, 
  ShieldAlert,
  Ticket,
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Certificate } from './types';
import { PRESET_AMOUNTS } from './constants';
import { Button } from './components/Button';
import { CertificatePreview } from './components/CertificatePreview';

const RULES = [
  'Сертифікат діє до зазначеної дати включно',
  'Використовується одноразово для оплати товарів або послуг',
  'Обміну на готівку не підлягає',
  'При втраті сертифікат не відновлюється',
  'Залишок суми після часткового використання зберігається',
  'Підтвердження автентичності — за кодом у системі FENIX',
];

function App() {
  // State
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [manager, setManager] = useState<string>('Менеджер');
  const [history, setHistory] = useState<Certificate[]>([]);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showRules, setShowRules] = useState<boolean>(false);
  
  // Date logic: Default 6 months from now
  const defaultExpiry = new Date();
  defaultExpiry.setMonth(defaultExpiry.getMonth() + 6);
  const [expiryDate, setExpiryDate] = useState<string>(defaultExpiry.toISOString().split('T')[0]);

  useEffect(() => {
    generateRandomCodeString();
    const saved = localStorage.getItem('fenix_certs');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const generateRandomCodeString = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const year = new Date().getFullYear();
    const code = `FNX-${year}-${result}`;
    setCurrentCode(code);
    return code;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const finalCode = generateRandomCodeString();
      const finalAmount = customAmount ? parseInt(customAmount) : amount;
      
      const newCert: Certificate = {
        id: uuidv4(),
        code: finalCode,
        amount: finalAmount,
        recipientName: recipient,
        managerName: manager,
        createdAt: new Date().toISOString(),
        expiryDate: expiryDate,
        status: 'active'
      };

      const updatedHistory = [newCert, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('fenix_certs', JSON.stringify(updatedHistory));
      
      setIsGenerating(false);
      setActiveTab('history');
    }, 800);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatForCRM = (cert: Certificate) => {
    return `СЕРТИФІКАТ FENIX\nКод: ${cert.code}\nСума: ${cert.amount} грн\nДіє до: ${cert.expiryDate}\nСтворив: ${cert.managerName}`;
  };

  const clearHistory = () => {
    if(confirm('Ви впевнені, що хочете очистити історію?')) {
      setHistory([]);
      localStorage.removeItem('fenix_certs');
    }
  };

  const previewData: Partial<Certificate> = {
    amount: customAmount ? parseInt(customAmount) || 0 : amount,
    recipientName: recipient,
    code: currentCode,
    expiryDate: expiryDate.split('-').reverse().join('.')
  };

  return (
    <>
    <div id="screen-view" className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-orange-500/30 selection:text-orange-200 font-sans overflow-x-hidden relative flex flex-col">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

      {/* Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50 supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <motion.div 
               initial={{ rotate: -90, opacity: 0 }}
               animate={{ rotate: 0, opacity: 1 }}
               className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)]"
             >
              <ShieldAlert className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-wider uppercase leading-none text-white">
                Fenix <span className="text-orange-500">Admin</span>
              </h1>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Active
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 rounded-full border border-white/5 shadow-inner">
            <span className="text-xs font-mono text-zinc-400">KEY CRM: <span className="text-emerald-500">CONNECTED</span></span>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Custom Tabs */}
            <div className="flex p-1 bg-zinc-900/50 rounded-xl border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden ${
                  activeTab === 'create' ? 'text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {activeTab === 'create' && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-zinc-800 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2 font-display uppercase tracking-wider text-xs font-bold">
                  <Zap size={14} className={activeTab === 'create' ? "text-orange-500" : ""} /> Генератор
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative overflow-hidden ${
                  activeTab === 'history' ? 'text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {activeTab === 'history' && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-zinc-800 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2 font-display uppercase tracking-wider text-xs font-bold">
                  <History size={14} className={activeTab === 'history' ? "text-orange-500" : ""} /> Реєстр
                  {history.length > 0 && <span className="bg-zinc-700 text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.2rem]">{history.length}</span>}
                </span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'create' ? (
                <motion.div 
                  key="create"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden group">
                    {/* Glossy highlight */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-700"></div>

                    <h2 className="text-lg font-display font-bold uppercase mb-8 flex items-center gap-2 text-white relative z-10 tracking-widest">
                      <span className="w-1 h-6 bg-orange-500 rounded-full mr-2"></span>
                      Конфігурація
                    </h2>

                    {/* Amount Selection */}
                    <div className="space-y-4 mb-8">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block ml-1">Номінал</label>
                      <div className="grid grid-cols-2 gap-3">
                        {PRESET_AMOUNTS.map((val) => (
                          <button
                            key={val}
                            onClick={() => { setAmount(val); setCustomAmount(''); }}
                            className={`group relative py-4 px-4 rounded-xl font-mono font-bold text-lg transition-all duration-300 border overflow-hidden ${
                              amount === val && !customAmount
                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                                : 'bg-zinc-900/30 text-zinc-400 border-white/5 hover:border-white/10 hover:bg-zinc-800'
                            }`}
                          >
                            <span className="relative z-10">{val} ₴</span>
                            {amount === val && !customAmount && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer"></div>}
                          </button>
                        ))}
                      </div>
                      <div className="relative group">
                        <input 
                          type="number" 
                          placeholder="Власна сума"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full bg-zinc-900/30 border border-white/5 rounded-xl py-4 px-4 pl-12 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono"
                        />
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${customAmount ? 'text-orange-500' : 'text-zinc-700'}`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 text-xs font-mono uppercase tracking-widest">UAH</span>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-6 mb-8">
                      <div className="group">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">Отримувач</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="ПІБ або позивний"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-zinc-900/30 border border-white/5 rounded-xl py-4 px-4 pl-12 text-white placeholder-zinc-700 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-sans"
                          />
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 w-5 h-5 group-focus-within:text-white transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                           <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">Термін дії</label>
                           <div className="relative">
                             <input 
                               type="date"
                               value={expiryDate}
                               onChange={(e) => setExpiryDate(e.target.value)}
                               className="w-full bg-zinc-900/30 border border-white/5 rounded-xl py-4 px-4 pl-10 text-sm text-zinc-300 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none" 
                             />
                             <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-700 w-4 h-4 group-focus-within:text-white transition-colors" />
                           </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 ml-1">Менеджер</label>
                           <div className="relative opacity-60">
                             <input 
                                type="text"
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                                className="w-full bg-zinc-900/30 border border-white/5 rounded-xl py-4 px-4 text-sm text-zinc-500 focus:outline-none cursor-not-allowed font-mono" 
                                readOnly
                             />
                           </div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      fullWidth 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="h-16 text-lg tracking-[0.2em]"
                      icon={isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                    >
                      {isGenerating ? 'ОБРОБКА...' : 'ЗГЕНЕРУВАТИ'}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[700px]"
                >
                  <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="font-display font-bold uppercase text-zinc-400 text-xs tracking-widest flex items-center gap-2">
                      <History size={14} className="text-orange-500" /> Останні операції
                    </h3>
                    <button onClick={clearHistory} className="text-zinc-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg group" title="Очистити історію">
                      <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    <AnimatePresence>
                      {history.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="text-center py-20 text-zinc-700 flex flex-col items-center gap-4"
                        >
                          <History size={48} className="opacity-10" />
                          <p className="text-xs font-mono uppercase tracking-widest">Історія порожня</p>
                        </motion.div>
                      ) : (
                        history.map((cert, index) => (
                          <motion.div 
                            key={cert.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl hover:border-orange-500/30 transition-all group relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-3 relative z-10">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-orange-500 font-bold text-lg tracking-wider group-hover:text-orange-400 transition-colors">{cert.code}</span>
                                  {index === 0 && <span className="bg-orange-500 text-[#050505] text-[9px] px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wider">New</span>}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-1 flex items-center gap-2 uppercase tracking-wide">
                                  <span>{new Date(cert.createdAt).toLocaleDateString('uk-UA')}</span>
                                  <span className="w-0.5 h-3 bg-zinc-800"></span>
                                  <span>{cert.managerName}</span>
                                  <span className="w-0.5 h-3 bg-zinc-800"></span>
                                  <Calendar size={10} className="text-zinc-600" />
                                  <span>до {cert.expiryDate.split('-').reverse().join('.')}</span>
                                </div>
                              </div>
                              <span className="bg-white/5 text-zinc-200 px-3 py-1.5 rounded text-sm font-bold font-mono border border-white/5 shadow-sm">
                                {cert.amount} ₴
                              </span>
                            </div>
                            
                            {cert.recipientName && (
                              <div className="text-xs text-zinc-500 mb-4 flex items-center gap-2 relative z-10 pl-1 border-l-2 border-zinc-800">
                                <User size={12} className="text-zinc-600" /> 
                                <span className="uppercase tracking-wide">{cert.recipientName}</span>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 mt-3 relative z-10">
                              <button 
                                onClick={() => copyToClipboard(cert.code, `code-${cert.id}`)}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-black hover:bg-zinc-900 text-xs text-zinc-300 transition-all border border-zinc-800 hover:border-zinc-700 active:scale-95 group/btn"
                              >
                                {copiedId === `code-${cert.id}` ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-zinc-600 group-hover/btn:text-white transition-colors" />}
                                <span>Код</span>
                              </button>
                              <button 
                                onClick={() => copyToClipboard(formatForCRM(cert), `crm-${cert.id}`)}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-orange-950/20 hover:bg-orange-950/40 text-xs text-orange-400 transition-all border border-orange-500/10 hover:border-orange-500/30 active:scale-95 group/btn"
                              >
                                {copiedId === `crm-${cert.id}` ? <CheckCircle2 size={14} className="text-orange-500" /> : <ShieldCheck size={14} className="text-orange-500/50 group-hover/btn:text-orange-500 transition-colors" />}
                                <span>CRM</span>
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Preview & Context */}
          <div className="lg:col-span-7 flex flex-col gap-6 sticky top-32">
            
            {/* Live Preview Container */}
            <div className="relative">
               {/* Decorative backdrop lines */}
               <div className="absolute -top-10 -right-10 w-32 h-32 border-r border-t border-white/5 rounded-tr-[3rem]"></div>
               <div className="absolute -bottom-10 -left-10 w-32 h-32 border-l border-b border-white/5 rounded-bl-[3rem]"></div>

               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-[#080808]/80 border border-white/10 rounded-3xl p-8 lg:p-16 flex flex-col items-center justify-center relative overflow-hidden min-h-[550px] backdrop-blur-xl shadow-2xl"
               >
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 mix-blend-overlay" style={{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}></div>
                
                <div className="absolute top-8 left-8 flex items-center gap-3">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                    Live Preview Mode
                  </h3>
                </div>

                <div id="certificate-print" className="w-full transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 z-10">
                  <CertificatePreview data={previewData} isGenerating={isGenerating} />
                </div>

                <div className="mt-12 flex flex-col items-center gap-4 relative z-10">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                    Доступні дії
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs uppercase tracking-wider font-bold border border-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                      <Printer size={14} /> PDF
                    </button>
                    <button onClick={() => setShowRules(true)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs uppercase tracking-wider font-bold border border-white/5 hover:border-white/20">
                      <ShieldCheck size={14} /> Правила
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Instructions Panel - Minimalist */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 flex items-center justify-between px-6 py-4 bg-zinc-900/30 border border-white/5 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                   <Zap size={18} />
                 </div>
                 <div>
                   <h4 className="text-zinc-200 text-sm font-bold">Швидкий старт</h4>
                   <p className="text-zinc-500 text-xs">Створіть код &rarr; Скопіюйте в CRM</p>
                 </div>
              </div>
              <a href="#" className="text-xs text-orange-500 hover:text-orange-400 border-b border-orange-500/20 hover:border-orange-500 pb-0.5 transition-all">Документація</a>
            </motion.div>
          </div>

        </div>
      </main>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowRules(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0A0A0B] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold uppercase text-white text-lg tracking-wider mb-6 flex items-center gap-3">
              <ShieldCheck className="text-orange-500" size={20} />
              Умови використання сертифіката
            </h3>
            <ul className="space-y-4">
              {RULES.map((rule, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-400">
                  <span className="text-orange-500 font-mono font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="mt-8 w-full py-3 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-xs uppercase tracking-widest font-bold"
            >
              Закрити
            </button>
          </motion.div>
        </div>
      )}
    </div>

    {/* Print view — outside screen-view so it's not hidden with it */}
    <div id="print-view" style={{display:'none'}}>
      {/* Page 1: Certificate */}
      <div className="print-page">
        <div style={{width:'80%', maxWidth:'660px'}}>
          <CertificatePreview data={previewData} isGenerating={false} />
        </div>
      </div>
      {/* Page 2: Rules */}
      <div className="print-rules-page">
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px'}}>
          <div style={{width:'4px', height:'32px', background:'#f97316', borderRadius:'2px'}}></div>
          <h2 style={{color:'#ffffff', fontFamily:'Rajdhani, sans-serif', fontSize:'22px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', margin:0}}>
            Умови використання сертифіката
          </h2>
        </div>
        <div style={{marginBottom:'28px'}}>
          <span style={{color:'#a1a1aa', fontFamily:'"Share Tech Mono", monospace', fontSize:'11px', letterSpacing:'0.15em', textTransform:'uppercase'}}>
            FENIX ARMY STORE — fenix-voentorg.com.ua
          </span>
        </div>
        <ol style={{listStyle:'none', padding:0, margin:0}}>
          {RULES.map((rule, i) => (
            <li key={i} style={{display:'flex', gap:'20px', marginBottom:'14px', alignItems:'flex-start'}}>
              <span style={{color:'#f97316', fontFamily:'"Share Tech Mono", monospace', fontSize:'13px', fontWeight:'bold', minWidth:'24px'}}>{String(i+1).padStart(2,'0')}</span>
              <span style={{color:'#d4d4d8', fontFamily:'"Share Tech Mono", monospace', fontSize:'13px', lineHeight:'1.6'}}>{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
    </>
  );
}

export default App;