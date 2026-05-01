import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { AppState } from '../types.ts';
import { formatCurrency, cn } from '../lib/utils.ts';
import { format, parseISO } from 'date-fns';

interface Props {
  transactions: AppState['transactions'];
  baseCurrency: string;
}

export default function EarningChart({ transactions, baseCurrency }: Props) {
  // Process transactions for the chart
  // Group by date and sum amounts
  const chartData = [...transactions]
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .reduce((acc: any[], curr) => {
      const dateStr = format(parseISO(curr.date), 'MMM dd');
      const existing = acc.find(item => item.date === dateStr);
      const amount = curr.type === 'earning' ? curr.amount : -curr.amount;
      
      if (existing) {
        existing.amount += amount;
        existing.details.push(curr);
      } else {
        acc.push({ 
          date: dateStr, 
          amount, 
          details: [curr] 
        });
      }
      return acc;
    }, []);

  // Calculate cumulative growth for a smoother looking line
  let cumulative = 0;
  const cumulativeData = chartData.map(item => {
    cumulative += item.amount;
    return { ...item, cumulative };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 border-brand/20 shadow-2xl animate-in fade-in zoom-in duration-200">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{data.date}</p>
          <p className={cn(
            "text-lg font-bold mb-3",
            data.amount >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {formatCurrency(data.cumulative, baseCurrency)}
          </p>
          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
            {data.details.map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center text-xs space-x-4">
                <span className="text-gray-300 font-medium truncate max-w-[100px]">{tx.siteOrWork}</span>
                <span className={tx.type === 'earning' ? "text-green-500" : "text-red-500"}>
                  {tx.type === 'earning' ? '+' : '-'}{formatCurrency(tx.amount, baseCurrency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cumulativeData}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9e91ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#9e91ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            hide={true} 
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9e91ff33', strokeWidth: 2 }} />
          <Area 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#9e91ff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
