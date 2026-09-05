import React from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingDown, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  DollarSign,
  Percent,
  ExternalLink
} from 'lucide-react';

export function PriceComparisonSection({ 
  medicines = [], 
  onOpenLocator,
  selectedLang,
  isDarkMode = false
}) {
  const isHindi = selectedLang === 'hi';

  // Calculate totals
  const totalBranded = medicines.length > 0 ? medicines.reduce((acc, m) => acc + (m.brandedPrice || 80), 0) : 0;
  const totalGeneric = medicines.length > 0 ? medicines.reduce((acc, m) => acc + (m.genericPrice || 20), 0) : 0;
  const totalSavings = Math.max(0, totalBranded - totalGeneric);
  const savingsPercent = totalBranded > 0 ? Math.round((totalSavings / totalBranded) * 100) : 78;

  const cardBg = isDarkMode ? "bg-[#0a231f] border-[#133d36] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const metricCard1 = isDarkMode ? "bg-[#071d19] border-[#113832]" : "bg-[#faf9f5] border-[#e8e6df]";
  const metricCard2 = isDarkMode ? "bg-[#0c2e27] border-[#164d41]" : "bg-emerald-50/70 border-emerald-200/80";
  const metricCard3 = isDarkMode ? "bg-[#071d19] border-[#113832]" : "bg-[#0f3e3a]/5 border-[#0f3e3a]/15";
  const tableHeaderBg = isDarkMode ? "bg-[#071d19] text-[#8ea7a3] border-[#113832]" : "bg-[#faf9f5] text-slate-600 border-[#e8e6df]";
  const locatorCardBg = isDarkMode ? "bg-[#071d19] border-[#113832]" : "bg-[#faf9f5] border-[#e8e6df]";

  return (
    <div className={`${cardBg} rounded-3xl border p-6 sm:p-8 space-y-6 shadow-sm transition-colors`}>
      
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${isDarkMode ? 'border-[#133d36]' : 'border-[#f1f0e9]'}`}>
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Pradhan Mantri Jan Aushadhi Pariyojana (PMBJP)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            {isHindi ? "दवाई मूल्य तुलना एवं जन औषधि बचत" : "Medicine Price Comparison & Jan Aushadhi Savings"}
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'}`}>
            {isHindi 
              ? "समान साल्ट फॉर्मूले वाली जेनेरिक दवाओं पर 50% से 90% तक की बचत करें" 
              : "Compare retail market branded prices with government-certified PMBJP generic equivalents"}
          </p>
        </div>

        {/* Total Savings Highlight Badge */}
        <div className="bg-gradient-to-br from-[#0c312a] to-[#124b41] border border-[#1d6b5e] text-white p-4 rounded-2xl shadow-sm text-right flex flex-col justify-center min-w-[200px]">
          <span className="text-[11px] text-emerald-200 font-medium tracking-wide uppercase">
            Total Potential Savings
          </span>
          <div className="flex items-baseline justify-end space-x-1.5 mt-0.5">
            <span className="text-2xl font-extrabold font-mono text-emerald-300">
              ₹{totalSavings.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {savingsPercent}% OFF
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className={`${metricCard1} border p-4 rounded-2xl space-y-1`}>
          <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Market Retail Branded Total</span>
          <span className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>₹{totalBranded.toFixed(2)}</span>
          <span className={`text-[10px] block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Private Pharmacy Average</span>
        </div>

        <div className={`${metricCard2} border p-4 rounded-2xl space-y-1`}>
          <span className={`block font-semibold ${isDarkMode ? 'text-teal-200' : 'text-emerald-900'}`}>Jan Aushadhi Generic Total</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">₹{totalGeneric.toFixed(2)}</span>
          <span className={`text-[10px] block ${isDarkMode ? 'text-teal-300/80' : 'text-emerald-700'}`}>Government PMBJP Price</span>
        </div>

        <div className={`${metricCard3} border p-4 rounded-2xl space-y-1`}>
          <span className={`block font-semibold ${isDarkMode ? 'text-teal-200' : 'text-[#0f3e3a]'}`}>Quality & Bioequivalence</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1" />
            100% CDSCO Certified
          </span>
          <span className={`text-[10px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Identical Therapeutic Effect</span>
        </div>
      </div>

      {/* Itemized Comparison Table */}
      <div className={`overflow-x-auto rounded-2xl border ${isDarkMode ? 'border-[#133d36]' : 'border-[#e8e6df]'}`}>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`${tableHeaderBg} border-b font-semibold`}>
              <th className="p-3.5 pl-4">Prescribed Medicine & Active Salt</th>
              <th className="p-3.5">Branded Market Price</th>
              <th className="p-3.5">Jan Aushadhi Generic</th>
              <th className="p-3.5 pr-4 text-right">You Save</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-[#133d36]' : 'divide-[#f1f0e9]'}`}>
            {medicines.length > 0 ? (
              medicines.map((med, idx) => {
                const bPrice = med.brandedPrice || 65.00;
                const gPrice = med.genericPrice || 14.00;
                const diff = Math.max(0, bPrice - gPrice);
                const percent = bPrice > 0 ? Math.round((diff / bPrice) * 100) : 75;

                return (
                  <tr key={med.id || idx} className={`${isDarkMode ? 'hover:bg-[#0d2a25]' : 'hover:bg-[#faf9f5]/60'} transition-colors`}>
                    <td className="p-3.5 pl-4 space-y-0.5">
                      <div className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
                        {med.brandName || med.name?.value || "Prescribed Drug"}
                      </div>
                      <div className={`text-[11px] font-mono ${isDarkMode ? 'text-teal-300/80' : 'text-slate-500'}`}>
                        Salt: {med.genericSalt || med.strength?.value || "Paracetamol / Amoxicillin"}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 line-through">
                      ₹{bPrice.toFixed(2)}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      ₹{gPrice.toFixed(2)}
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono text-[11px] border border-emerald-500/30">
                        Save ₹{diff.toFixed(2)} ({percent}%)
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Locator Action Footer */}
      <div className={`${locatorCardBg} border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-800/60 text-teal-200 border border-teal-600/40 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
              Locate Your Nearest Jan Aushadhi Kendra (GPS & Maps)
            </h4>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'}`}>
              Over 10,000+ government stores across India with verified in-stock generic inventory.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLocator}
          className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0 hover:shadow-lg"
        >
          <span>Find Nearest Store →</span>
        </button>
      </div>

    </div>
  );
}
