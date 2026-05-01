import { useState, FormEvent } from 'react';
import { 
  Save, 
  Trash2, 
  Plus, 
  Calendar, 
  Shield, 
  Briefcase, 
  MapPin, 
  CreditCard,
  History,
  TrendingDown,
  TrendingUp,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction, Currency } from '../types.ts';
import { formatCurrency, cn } from '../lib/utils.ts';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onAdd: (tx: Transaction) => void;
  transactions: Transaction[];
  onDelete: (id: string) => void;
  baseCurrency: Currency;
}

export default function NoticeTab({ onAdd, transactions, onDelete, baseCurrency }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    siteOrWork: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'earning' as 'earning' | 'loss'
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      siteOrWork: formData.siteOrWork,
      amount: parseFloat(formData.amount),
      currency: baseCurrency,
      description: formData.description,
      date: formData.date,
      type: formData.type
    });

    setFormData({
      name: '',
      siteOrWork: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'earning'
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Financial Notices</h2>
          <p className="text-gray-400">Record your earnings and document market fluctuations</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center space-x-2 active:scale-95",
            isAdding ? "bg-white/5 text-white" : "bg-brand text-surface shadow-brand/20 hover:scale-105"
          )}
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
          <span>{isAdding ? 'Close Portal' : 'New Transaction'}</span>
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 border-brand/20 bg-brand/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    Project Name
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Logo Design"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    Platform / Site
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Behance / Dribbble"
                    value={formData.siteOrWork}
                    onChange={e => setFormData({...formData, siteOrWork: e.target.value})}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    Amount ({baseCurrency})
                  </label>
                  <div className="flex gap-2">
                    <input 
                      required
                      type="number" 
                      placeholder="2500"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                     Settlement Date
                  </label>
                  <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors" 
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                     Transaction Type
                  </label>
                  <div className="flex p-1 bg-surface rounded-xl border border-white/10">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'earning'})}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all",
                        formData.type === 'earning' ? "bg-brand text-surface" : "text-white/40 hover:text-white"
                      )}
                    >
                      Earning
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'loss'})}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all",
                        formData.type === 'loss' ? "bg-red-500 text-white" : "text-white/40 hover:text-white"
                      )}
                    >
                      Loss
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                     Description
                  </label>
                  <textarea 
                    placeholder="Detailed scope..."
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="w-full bg-brand text-surface py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand/20 hover:opacity-90 active:scale-95 transition-all">
                  SAVE ENTRY
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Recent Archive
          </h3>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Plus className="text-gray-700 w-8 h-8" />
                </div>
                <p className="text-gray-400 font-medium">No ledger entries detected</p>
                <p className="text-sm text-gray-500">Add your first transaction to begin mapping your trajectory.</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  className={cn(
                    "glass-card p-5 border-white/5 flex items-center justify-between group hover:border-brand/40 transition-all cursor-pointer",
                    tx.type === 'loss' ? "bg-red-500/5 hover:bg-red-500/10" : "bg-green-500/5 hover:bg-green-500/10"
                  )}
                >
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      tx.type === 'earning' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {tx.type === 'earning' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white truncate">{tx.name}</h4>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {tx.siteOrWork} • {tx.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right mr-4">
                      <p className={cn(
                        "text-lg font-black tracking-tight",
                        tx.type === 'earning' ? "text-green-400" : "text-red-400"
                      )}>
                        {tx.type === 'earning' ? '+' : '-'}{formatCurrency(tx.amount, baseCurrency)}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Verified Flow</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(tx.id);
                      }}
                      className="p-2 bg-white/5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all z-10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-8 h-fit bg-gradient-to-br from-brand/5 to-transparent sticky top-8 border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand" />
            Session Statistics
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>Earning Ratio</span>
                <span className="text-brand">88%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-brand w-[88%] shadow-[0_0_10px_rgba(158,145,255,0.4)]"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Volatile Risks</p>
                <p className="text-xl font-black text-white">0.42%</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Growth Index</p>
                <p className="text-xl font-black text-white">+14.2</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedTx && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-surface/80 backdrop-blur-md"
            onClick={() => setSelectedTx(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-surface-card border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedTx(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                    selectedTx.type === 'earning' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {selectedTx.type === 'earning' ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter">{selectedTx.name}</h3>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest">{selectedTx.siteOrWork}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Value Synthesis</p>
                    <p className={cn(
                      "text-2xl font-black tracking-tight",
                      selectedTx.type === 'earning' ? "text-green-400" : "text-red-400"
                    )}>
                      {selectedTx.type === 'earning' ? '+' : '-'}{formatCurrency(selectedTx.amount, baseCurrency)}
                    </p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Temporal Stamp</p>
                    <p className="text-lg font-black text-white truncate">{selectedTx.date}</p>
                  </div>
                </div>

                <div className="bg-brand/5 border border-brand/20 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand">Project Narrative</h4>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "{selectedTx.description || 'No detailed narrative provided for this archival entry.'}"
                  </p>
                </div>

                <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-widest pt-4 border-t border-white/5">
                  <div>Ref ID: {selectedTx.id}</div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Integrity Verified
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
