import React from 'react';
import { 
  Scan, 
  CalendarCheck, 
  ShieldAlert, 
  PiggyBank, 
  History, 
  PlusCircle, 
  HeartPulse,
  Activity,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onNewUpload, savedCount = 0 }) {
  const navItems = [
    { id: 'scanner', label: 'Digitizer & OCR', icon: Scan },
    { id: 'schedule', label: 'Dose Schedule', icon: CalendarCheck },
    { id: 'safety', label: 'Safety & Interactions', icon: ShieldAlert },
    { id: 'savings', label: 'Pharmacy & Savings', icon: PiggyBank },
    { id: 'history', label: `Saved Records (${savedCount})`, icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                  Prescripto<span className="text-emerald-400">Plus</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                  <Sparkles className="w-2.5 h-2.5" /> AI v3.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Smart Prescription Digitizer & Health Vault</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 p-1.5 rounded-2xl shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onNewUpload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/10 transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Upload New</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between gap-1 overflow-x-auto py-2.5 border-t border-slate-800/60 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
