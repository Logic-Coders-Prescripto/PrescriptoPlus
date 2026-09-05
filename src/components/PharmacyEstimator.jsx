import React, { useState } from 'react';
import { 
  PiggyBank, 
  TrendingDown, 
  Check, 
  Store, 
  MapPin, 
  Truck, 
  DollarSign, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function PharmacyEstimator({ medications = [], onOpenExport }) {
  const [selectedPharmacy, setSelectedPharmacy] = useState('costplus');
  const [orderSent, setOrderSent] = useState(false);

  // Price calculations
  const totalBrandCost = medications.reduce((acc, m) => acc + (m.avgPriceBrand || 18), 0);
  const totalGenericCost = medications.reduce((acc, m) => acc + (m.avgPriceGeneric || 5), 0);
  const totalSavings = Math.max(0, totalBrandCost - totalGenericCost);
  const percentageSaved = totalBrandCost > 0 ? Math.round((totalSavings / totalBrandCost) * 100) : 0;

  const mockPharmacies = [
    {
      id: 'costplus',
      name: 'Mark Cuban Cost Plus Drugs',
      type: 'Direct Online Mail-Order',
      distance: 'Free 2-Day Delivery',
      genericDiscount: 'Up to 75% Off',
      inStock: true,
      priceMultiplier: 0.9,
      badge: 'Best Value Generic'
    },
    {
      id: 'goodrx',
      name: 'GoodRx Gold Pharmacy Network',
      type: 'Community Discount Card',
      distance: 'Accepted at 70,000+ Stores',
      genericDiscount: 'Up to 65% Off',
      inStock: true,
      priceMultiplier: 1.0,
      badge: 'Most Widely Accepted'
    },
    {
      id: 'cvs',
      name: 'CVS Health Pharmacy',
      type: 'Physical Retail Store',
      distance: '0.8 miles away (Drive-Thru open)',
      genericDiscount: 'Insurance & Copay Ready',
      inStock: true,
      priceMultiplier: 1.25,
      badge: 'Fastest 1-Hour Pickup'
    },
    {
      id: 'walgreens',
      name: 'Walgreens 24/7 Pharmacy',
      type: 'Physical Retail Store',
      distance: '1.4 miles away (24h Express)',
      genericDiscount: 'Express Refill Network',
      inStock: true,
      priceMultiplier: 1.3,
      badge: 'Open 24 Hours'
    }
  ];

  const handleSendToPharmacy = () => {
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Savings Highlight Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Smart Generic Substitution Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Save up to <span className="text-emerald-400 font-mono">${totalSavings.toFixed(2)}</span> with Bioequivalent Generics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              FDA-approved generic drugs have the exact same active molecular ingredient, strength, safety, and dosage efficacy as brand-name prescriptions at a fraction of the cost.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-center w-full max-w-xs space-y-2 shadow-xl">
              <span className="text-xs text-slate-300 font-medium">Estimated Generic Savings</span>
              <div className="text-4xl font-black text-emerald-300 font-mono">
                {percentageSaved}% OFF
              </div>
              <p className="text-[11px] text-slate-400">
                Brand: <span className="line-through text-slate-500">${totalBrandCost.toFixed(2)}</span> → Generic: <span className="text-emerald-400 font-bold">${totalGenericCost.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Item-by-Item Price Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Prescription Price Breakdown
          </h3>
          <span className="text-xs text-slate-400">Monthly Supply Estimate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Prescribed Medicine</th>
                <th className="pb-3 font-semibold">Generic Molecule</th>
                <th className="pb-3 font-semibold text-right">Brand Est.</th>
                <th className="pb-3 font-semibold text-right">Generic Est.</th>
                <th className="pb-3 font-semibold text-right">You Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {medications.map((med, idx) => {
                const brand = med.avgPriceBrand || 18;
                const gen = med.avgPriceGeneric || 5;
                const save = Math.max(0, brand - gen);
                const percent = Math.round((save / brand) * 100);

                return (
                  <tr key={med.id || idx} className="hover:bg-slate-900/40">
                    <td className="py-3 font-bold text-white">
                      {med.brandName} <span className="text-slate-400 font-normal">({med.strength})</span>
                    </td>
                    <td className="py-3 text-emerald-300 font-medium">{med.genericName}</td>
                    <td className="py-3 text-right text-slate-400 font-mono">${brand.toFixed(2)}</td>
                    <td className="py-3 text-right text-emerald-400 font-mono font-bold">${gen.toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-300">
                      -${save.toFixed(2)} ({percent}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-700 font-bold text-sm">
                <td colSpan="2" className="pt-4 text-white">Total Estimated Regimen Cost</td>
                <td className="pt-4 text-right text-slate-400 font-mono">${totalBrandCost.toFixed(2)}</td>
                <td className="pt-4 text-right text-emerald-400 font-mono">${totalGenericCost.toFixed(2)}</td>
                <td className="pt-4 text-right text-emerald-300 font-mono font-black">
                  -${totalSavings.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Simulated Pharmacy Fulfillment Options */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-teal-400" />
              Compare Nearby & Online Fulfillment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select your preferred pharmacy to transmit digital prescription order</p>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Based on local zip 10021
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {mockPharmacies.map((pharmacy) => {
            const isSelected = selectedPharmacy === pharmacy.id;
            const estimatedCost = (totalGenericCost * pharmacy.priceMultiplier).toFixed(2);

            return (
              <div
                key={pharmacy.id}
                onClick={() => setSelectedPharmacy(pharmacy.id)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/60'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-500/20">
                      {pharmacy.badge}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{pharmacy.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{pharmacy.type} • {pharmacy.distance}</p>
                  </div>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-emerald-400 text-slate-950' : 'border border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{pharmacy.genericDiscount}</span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Est. Regimen</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">${estimatedCost}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button & Confirmation */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital prescription is encrypted with 256-bit medical TLS.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenExport}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Export Printable PDF
            </button>
            <button
              onClick={handleSendToPharmacy}
              disabled={orderSent}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                orderSent
                  ? 'bg-emerald-500 text-slate-950 cursor-default'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {orderSent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Prescription Transmitted!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Rx to Selected Pharmacy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {orderSent && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Fulfillment Request Sent:</strong> Your digital prescription token <code>#RX-78921-E</code> has been transmitted to {mockPharmacies.find(p => p.id === selectedPharmacy)?.name}. You will receive an SMS when ready for pickup/delivery!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
