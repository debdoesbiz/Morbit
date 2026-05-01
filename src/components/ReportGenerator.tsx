import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText, FileCode, CheckCircle2 } from 'lucide-react';
import { AppState } from '../types.ts';
import { formatCurrency, cn } from '../lib/utils.ts';
import { format } from 'date-fns';

interface Props {
  state: AppState;
}

export default function ReportGenerator({ state }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const generatePdf = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    const { profile, transactions } = state;
    
    // Header
    doc.setFillColor(18, 18, 18);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(158, 145, 255);
    doc.setFontSize(28);
    doc.text('MORBIT', 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('FINANCIAL LOG ARCHIVE', 20, 32);
    
    // User Profile
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Proprietor: ${profile.name}`, 20, 50);
    doc.text(`Generated: ${format(new Date(), 'PPP p')}`, 20, 57);
    
    // Summary Stats
    const totalEarnings = transactions.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0);
    const totalLoss = transactions.filter(t => t.type === 'loss').reduce((s, t) => s + t.amount, 0);
    
    doc.setFontSize(14);
    doc.text('Executive Summary', 20, 75);
    doc.line(20, 77, 190, 77);
    
    doc.setFontSize(10);
    doc.text(`Total Earnings Captured: ${formatCurrency(totalEarnings, state.baseCurrency)}`, 20, 85);
    doc.text(`Total Market Losses: ${formatCurrency(totalLoss, state.baseCurrency)}`, 20, 92);
    doc.text(`Net Trajectory Profit: ${formatCurrency(totalEarnings - totalLoss, state.baseCurrency)}`, 20, 99);
    
    // Transactions Table
    doc.setFontSize(14);
    doc.text('Activity Register', 20, 115);
    doc.line(20, 117, 190, 117);
    
    let y = 125;
    transactions.forEach((tx, i) => {
      if (y > 270) {
        doc.addPage();
        y = 30;
      }
      doc.setFontSize(9);
      doc.setTextColor(tx.type === 'earning' ? 46 : 220, tx.type === 'earning' ? 125 : 38, tx.type === 'earning' ? 50 : 38);
      doc.text(`${tx.type.toUpperCase()}`, 20, y);
      
      doc.setTextColor(0, 0, 0);
      doc.text(`${tx.date}`, 45, y);
      doc.text(`${tx.siteOrWork} - ${tx.name}`, 70, y);
      doc.text(`${formatCurrency(tx.amount, state.baseCurrency)}`, 170, y, { align: 'right' });
      y += 6;
    });

    doc.save(`Morbit_Report_${format(new Date(), 'yyyyMMdd')}.pdf`);
    finishExport();
  };

  const generateTxt = () => {
    setIsExporting(true);
    const { profile, transactions } = state;
    const totalEarnings = transactions.filter(t => t.type === 'earning').reduce((s, t) => s + t.amount, 0);
    const totalLoss = transactions.filter(t => t.type === 'loss').reduce((s, t) => s + t.amount, 0);

    let content = `MORBIT FINANCIAL ARCHIVE\n`;
    content += `=========================\n\n`;
    content += `Owner: ${profile.name}\n`;
    content += `Date: ${format(new Date(), 'PPP p')}\n\n`;
    content += `SUMMARY:\n`;
    content += `Total Earnings: ${formatCurrency(totalEarnings, state.baseCurrency)}\n`;
    content += `Total Losses:   ${formatCurrency(totalLoss, state.baseCurrency)}\n`;
    content += `Net Profit:     ${formatCurrency(totalEarnings - totalLoss, state.baseCurrency)}\n\n`;
    content += `ACTIVITY LOG:\n`;
    content += `-------------------------\n`;
    
    transactions.forEach(t => {
      content += `[${t.date}] ${t.type.toUpperCase()}: ${formatCurrency(t.amount, state.baseCurrency)} | Source: ${t.siteOrWork} | Label: ${t.name}\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Morbit_Summary_${format(new Date(), 'yyyyMMdd')}.txt`;
    document.body.appendChild(element);
    element.click();
    finishExport();
  };

  const finishExport = () => {
    setIsExporting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-surface-accent rounded-[2rem] p-6 w-full lg:w-fit border border-white/5">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/40">Archive Export</h4>
      <div className="flex gap-3">
        <button 
          onClick={generatePdf}
          disabled={isExporting}
          className="flex-1 lg:w-24 flex flex-col items-center justify-center py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95"
          title="Export PDF"
        >
          <span className="text-brand text-2xl mb-1 font-bold group-hover:scale-110 transition-transform">
            {showSuccess ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : "PDF"}
          </span>
          <span className="text-[8px] uppercase tracking-tighter text-white/30 font-black">Visual Stats</span>
        </button>

        <button 
          onClick={generateTxt}
          disabled={isExporting}
          className="flex-1 lg:w-24 flex flex-col items-center justify-center py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group active:scale-95"
          title="Export TXT"
        >
          <span className="text-white/60 text-2xl mb-1 font-bold group-hover:scale-110 transition-transform">TXT</span>
          <span className="text-[8px] uppercase tracking-tighter text-white/30 font-black">Raw Data</span>
        </button>
      </div>
    </div>
  );
}
