import { useState, useRef, ChangeEvent } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Camera,
  Download,
  Sparkles,
  PieChart,
  Target,
  Plus,
  Wallet
} from 'lucide-react';
import { AppState, UserProfile } from '../types.ts';
import { formatCurrency, cn } from '../lib/utils.ts';
import EarningChart from './EarningChart.tsx';
import AiSummary from './AiSummary.tsx';
import ReportGenerator from './ReportGenerator.tsx';
import { subDays, isAfter, parseISO } from 'date-fns';

interface Props {
  state: AppState;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

export default function DashboardTab({ state, updateProfile }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.profile.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Time-based calculations
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sixtyDaysAgo = subDays(now, 60);

  // Filter transactions by period
  const currentTxs = state.transactions.filter(t => isAfter(parseISO(t.date), thirtyDaysAgo));
  const previousTxs = state.transactions.filter(t => 
    isAfter(parseISO(t.date), sixtyDaysAgo) && !isAfter(parseISO(t.date), thirtyDaysAgo)
  );

  // Current performance
  const totalEarnings = state.transactions
    .filter(t => t.type === 'earning')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalLosses = state.transactions
    .filter(t => t.type === 'loss')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalEarnings - totalLosses;

  // Percentage calculations
  const calculateChange = (currentVal: number, previousVal: number) => {
    if (previousVal === 0) return currentVal > 0 ? '+100%' : '0%';
    const change = ((currentVal - previousVal) / Math.abs(previousVal)) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const currentEarnings = currentTxs.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0);
  const previousEarnings = previousTxs.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0);
  
  const currentLosses = currentTxs.filter(t => t.type === 'loss').reduce((s, t) => s + t.amount, 0);
  const previousLosses = previousTxs.filter(t => t.type === 'loss').reduce((s, t) => s + t.amount, 0);

  const currentNet = currentEarnings - currentLosses;
  const previousNet = previousEarnings - previousLosses;

  const earningsTrend = calculateChange(currentEarnings, previousEarnings);
  const lossesTrend = calculateChange(currentLosses, previousLosses);
  const netTrend = calculateChange(currentNet, previousNet);

  // Group by site/work for "Most Earnings Grouping"
  const grouping = state.transactions
    .filter(t => t.type === 'earning')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.siteOrWork] = (acc[t.siteOrWork] || 0) + t.amount;
      return acc;
    }, {});

  const mostEarningSite = Object.entries(grouping)
    .sort(([, a], [, b]) => b - a)[0];

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

  const handleNameSave = () => {
    updateProfile({ name: tempName });
    setIsEditingName(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-grow space-y-4">
          <h2 className="text-5xl font-black tracking-tighter">{formatCurrency(netProfit, state.baseCurrency)}</h2>
          <p className="text-brand flex items-center gap-2 font-mono font-bold">
            <span className="text-xs">{netTrend.startsWith('+') ? '▲' : '▼'}</span> {netTrend} <span className="text-white/30 text-[10px] ml-2 tracking-[0.2em] uppercase">vs last session</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-card p-2 rounded-2xl border border-white/10 shrink-0">
          <ReportGenerator state={state} />
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { 
          label: 'Total Net Profit', 
          val: formatCurrency(netProfit, state.baseCurrency), 
          icon: Wallet, 
          trend: netTrend, 
          color: 'text-brand'
        },
        { 
          label: 'Gross Earnings', 
          val: formatCurrency(totalEarnings, state.baseCurrency), 
          icon: TrendingUp, 
          trend: earningsTrend, 
          color: 'text-green-400'
        },
        { 
          label: 'Total Losses', 
          val: formatCurrency(totalLosses, state.baseCurrency), 
          icon: TrendingDown, 
          trend: lossesTrend, 
          color: 'text-red-400'
        },
        { 
          label: 'Top Source', 
          val: mostEarningSite ? mostEarningSite[0] : 'N/A', 
          icon: Target, 
          sub: mostEarningSite ? formatCurrency(mostEarningSite[1], state.baseCurrency) : '',
          color: 'text-blue-400'
        }
      ].map((stat, i) => (
        <div key={i} className="glass-card p-6 hover:scale-[1.02] transition-all bg-surface-card w-full">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-2xl">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            {stat.trend && (
              <div className={cn("text-[10px] font-black flex items-center gap-1 uppercase", stat.trend.startsWith('+') ? "text-brand" : "text-red-500")}>
                {stat.trend} <span className="opacity-40">{stat.trend.startsWith('+') ? '▲' : '▼'}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-bold tracking-tight">{stat.val}</p>
            {stat.sub && <p className="text-[10px] text-brand/60 font-mono tracking-tighter uppercase">{stat.sub}</p>}
          </div>
        </div>
      ))}
    </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-brand" />
                Growth Trajectory
              </h3>
              <p className="text-sm text-gray-400">Cumulative earnings performance over time</p>
            </div>
            <div className="flex gap-2">
              {['1W', '1M', '3M', 'ALL'].map(p => (
                <button key={p} className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  p === '1M' ? "bg-brand text-surface" : "bg-white/5 text-gray-400 hover:text-white"
                )}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <EarningChart transactions={state.transactions} baseCurrency={state.baseCurrency} />
        </div>

        {/* AI Column */}
        <div className="space-y-8">
          <div className="glass-card p-6 bg-gradient-to-br from-brand/10 to-transparent">
             <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand animate-pulse" />
              <h3 className="text-lg font-bold">Smart Insights</h3>
            </div>
            <AiSummary transactions={state.transactions} />
          </div>

          <div className="glass-card p-6 min-h-[300px]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                <p className="text-sm font-bold group-hover:text-brand transition-colors">Set Daily Goal</p>
                <p className="text-xs text-gray-500">Currently at 0% of your $500 target</p>
              </button>
              <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group">
                <p className="text-sm font-bold group-hover:text-brand transition-colors">Risk Assessment</p>
                <p className="text-xs text-gray-500">Your loss frequency is currently Low</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
