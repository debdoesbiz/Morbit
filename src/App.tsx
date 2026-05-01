import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquarePlus, 
  TrendingUp, 
  User, 
  Settings,
  History,
  Wallet,
  Camera
} from 'lucide-react';
import { AppState, UserProfile, Transaction } from './types.ts';
import { cn } from './lib/utils.ts';

// Components
import DashboardTab from './components/DashboardTab.tsx';
import NoticeTab from './components/NoticeTab.tsx';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Investor User',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notice'>('dashboard');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('morbit_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure baseCurrency exists for older saved states
      if (!parsed.baseCurrency) parsed.baseCurrency = '' as any; 
      return parsed;
    }
    return {
      transactions: [],
      profile: DEFAULT_PROFILE,
      baseCurrency: '' as any
    };
  });

  const selectBaseCurrency = (currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY') => {
    setState(prev => ({ ...prev, baseCurrency: currency }));
  };

  useEffect(() => {
    localStorage.setItem('morbit_state', JSON.stringify(state));
  }, [state]);

  const addTransaction = (tx: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [tx, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6 overflow-x-hidden">
      <AnimatePresence>
        {!state.baseCurrency && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface-card border border-white/10 p-10 rounded-[3rem] max-w-md w-full shadow-2xl space-y-8 text-center"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 bg-brand/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-10 h-10 text-brand" />
                </div>
                <h2 className="text-3xl font-black italic tracking-tighter text-white">CHOOSE YOUR ENGINE CURRENCY.</h2>
                <p className="text-white/40 text-sm uppercase tracking-widest leading-relaxed">
                  Select your primary currency for all financial synthesis. This can be modified in settings later.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['USD', 'EUR', 'GBP', 'INR', 'JPY'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => selectBaseCurrency(curr)}
                    className="py-4 bg-white/5 border border-white/5 rounded-2xl font-black text-xs hover:bg-brand hover:text-surface transition-all active:scale-95"
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Navigation - Artistic Flair Style */}
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto w-full z-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <h1 className="text-4xl font-black italic tracking-tighter text-brand">MORBIT.</h1>
          </div>
          
          <nav className="flex bg-surface-card rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "nav-pill",
                activeTab === 'dashboard' ? "nav-pill-active shadow-lg shadow-brand/20" : "nav-pill-inactive"
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('notice')}
              className={cn(
                "nav-pill",
                activeTab === 'notice' ? "nav-pill-active shadow-lg shadow-brand/20" : "nav-pill-inactive"
              )}
            >
              Notice
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {state.baseCurrency && (
            <select 
              value={state.baseCurrency}
              onChange={(e) => selectBaseCurrency(e.target.value as any)}
              className="bg-surface-card border border-white/10 rounded-full px-4 py-2 text-xs font-bold text-white/70 outline-none focus:border-brand transition-colors cursor-pointer hidden md:block"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
            </select>
          )}

          <div className="text-right hidden sm:block">
            <input 
              type="text" 
              value={state.profile.name} 
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="bg-transparent text-white font-bold text-right outline-none border-b border-transparent focus:border-brand block w-40 cursor-text" 
            />
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Pro Member</p>
          </div>
          <div 
            className="w-12 h-12 rounded-full border-2 border-brand overflow-hidden relative shrink-0 cursor-pointer group active:scale-95 transition-all shadow-lg hover:shadow-brand/20"
            onClick={handleAvatarClick}
            title="Change profile picture"
          >
            <img 
              src={state.profile.avatarUrl} 
              alt={state.profile.name}
              className="w-full h-full object-cover bg-surface-accent group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-brand/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white drop-shadow-md" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          {state.baseCurrency && (
            activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                <DashboardTab 
                  state={state} 
                  updateProfile={updateProfile} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="notice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                <NoticeTab 
                  onAdd={addTransaction} 
                  transactions={state.transactions}
                  onDelete={deleteTransaction}
                  baseCurrency={state.baseCurrency}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-10 flex justify-between text-[10px] text-white/20 uppercase tracking-[0.2em] font-mono border-t border-white/5 pt-6 max-w-7xl mx-auto w-full">
        <div>Most earning done by: <span className="text-white/50">{state.transactions.filter(t => t.type === 'earning')[0]?.siteOrWork || 'N/A'}</span></div>
        <div>Last update: <span className="text-white/50 text-[8px]">ACTIVE NOW</span></div>
        <div className="hidden sm:block tracking-widest">MORBIT ENGINE v1.02</div>
      </footer>
    </div>
  );
}
