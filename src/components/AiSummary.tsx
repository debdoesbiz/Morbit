import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types.ts';
import { Sparkles, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface Props {
  transactions: Transaction[];
}

export default function AiSummary({ transactions }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    if (transactions.length === 0) return;
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze this financial transaction data and provide a concise, professional summary (max 100 words). Focus on growth patterns, most significant earnings/losses, and a brief "expert" advice. 
      Data: ${JSON.stringify(transactions.map(t => ({
        type: t.type,
        amount: t.amount,
        site: t.siteOrWork,
        date: t.date,
        desc: t.description
      })))}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setSummary(response.text || "Unable to generate summary at this time.");
    } catch (error) {
      console.error("Gemini Error:", error);
      setSummary("Error connecting to intelligence matrix. Please check your API configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {summary ? (
        <div className="bg-gradient-to-r from-brand/20 to-transparent border-l-4 border-brand p-6 rounded-r-2xl animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Gemini Intelligence Summary</h3>
          </div>
          <div className="text-sm text-white/80 leading-relaxed font-medium">
            {summary.split(' ').map((word, i) => (
              <span key={i} className={cn(
                word.includes('$') || word.match(/\d+%/) ? "text-brand font-bold" : "",
                i % 15 === 0 && i !== 0 ? "italic text-white" : ""
              )}>
                {word}{' '}
              </span>
            ))}
          </div>
          <button 
            onClick={generateSummary}
            disabled={loading}
            className="mt-4 text-[9px] uppercase font-black tracking-widest text-brand/60 hover:text-brand flex items-center gap-1.5 transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
            Refresh Intelligence Synthesis
          </button>
        </div>
      ) : (
        <div className="bg-surface-card border border-white/5 p-8 rounded-3xl text-center space-y-6">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-brand animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest">Neural Link Required</p>
            <p className="text-xs text-white/40 leading-relaxed max-w-[200px] mx-auto uppercase tracking-tighter">
              {transactions.length > 0 
                ? "Initiate intelligence synthesis to map your financial trajectory."
                : "Awaiting archival entries to commence market-optimized analysis."
              }
            </p>
          </div>
          <button 
            onClick={generateSummary}
            disabled={loading || transactions.length === 0}
            className="w-full bg-brand text-surface py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-brand/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Generate Synthesis</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
