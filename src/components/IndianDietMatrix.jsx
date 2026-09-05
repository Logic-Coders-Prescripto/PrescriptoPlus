import React, { useState } from 'react';
import { 
  Utensils, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Coffee, 
  Milk, 
  Sparkles, 
  Info,
  Flame,
  Droplets
} from 'lucide-react';
import { getIndianDietRecommendations } from '../utils/indianDietData';

export function IndianDietMatrix({ medicines = [], selectedLang, isDarkMode = false }) {
  const isHindi = selectedLang === 'hi';
  const dietRules = getIndianDietRecommendations(medicines);
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!medicines || medicines.length === 0) return null;

  const filteredRules = selectedCategory === 'all' 
    ? dietRules 
    : dietRules.filter(r => r.category === selectedCategory);

  // Theme-aware tokens ensuring 100% contrast and visibility
  const cardBg = isDarkMode 
    ? "bg-[#0b2420] border-[#16443c] text-white" 
    : "bg-white border-[#e8e6df] text-[#1c2726]";
  
  const subCardBg = isDarkMode 
    ? "bg-[#10332d] border-[#184840]" 
    : "bg-[#faf9f5] border-[#e8e6df]";

  const textHeading = isDarkMode ? "text-emerald-300" : "text-[#0f3e3a]";
  const textSub = isDarkMode ? "text-slate-400" : "text-slate-600";
  const textBody = isDarkMode ? "text-slate-200" : "text-slate-800";
  const textTitle = isDarkMode ? "text-amber-300" : "text-[#0f3e3a]";

  return (
    <div className={`${cardBg} rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xs transition-colors`}>
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${isDarkMode ? 'border-[#1b4840]' : 'border-[#f1f0e9]'}`}>
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 font-semibold border border-amber-500/30 text-xs">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Tailored for 1.4 Billion Indian Citizens</span>
          </div>
          <h3 className={`text-xl font-bold font-heading ${textHeading}`}>
            {isHindi ? "भारतीय खानपान एवं दवा सुरक्षा गाइड" : "Indian Diet & Food-Drug Interaction Matrix"}
          </h3>
          <p className={`text-xs ${textSub}`}>
            {isHindi 
              ? "दूध, दही, छाछ, चाय, घी और मसालों के साथ दवाइयों का सही समय और परहेज" 
              : "Personalized warnings for Indian diet: Dairy chelation (dahi/chaas), chai tannins, and ghee absorption rules."}
          </p>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto shadow-xs ${
          isDarkMode 
            ? 'bg-amber-950/70 text-amber-300 border-amber-500/40' 
            : 'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          {dietRules.length} {dietRules.length === 1 ? 'Dietary Warning' : 'Dietary Warnings'}
        </span>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Indian Food Rules' },
          { id: 'dairy', label: '🥛 Dairy / Dahi / Chaas' },
          { id: 'tannins', label: '☕ Masala Chai / Coffee' },
          { id: 'empty_stomach', label: '🥣 Empty Stomach (खाली पेट)' },
          { id: 'fat_soluble', label: '🧈 Desi Ghee Synergy' },
          { id: 'spices', label: '🌶️ Haldi / Spices' }
        ].map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-semibold border transition-all shrink-0 cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                  : isDarkMode
                  ? 'bg-[#10332d] text-slate-200 border-[#184840] hover:border-amber-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Diet Warning Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const isHigh = rule.severity === 'high';
          const isModerate = rule.severity === 'moderate';

          return (
            <div
              key={rule.id}
              className={`${subCardBg} rounded-2xl border p-5 space-y-3 relative hover:border-amber-500 transition-colors shadow-xs flex flex-col justify-between`}
            >
              <div className="space-y-2.5">
                
                {/* Card Title & Severity Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`font-bold text-sm sm:text-base ${textTitle}`}>
                    {isHindi ? rule.hindiTitle || rule.title : rule.title}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shrink-0 border ${
                    isHigh 
                      ? isDarkMode ? 'bg-rose-950/80 text-rose-300 border-rose-500/50' : 'bg-rose-100 text-rose-900 border-rose-300' 
                      : isModerate
                      ? isDarkMode ? 'bg-amber-950/80 text-amber-300 border-amber-500/50' : 'bg-amber-100 text-amber-950 border-amber-300'
                      : isDarkMode ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  }`}>
                    {isHigh ? 'High Precaution' : isModerate ? 'Moderate Caution' : 'Beneficial Synergy'}
                  </span>
                </div>

                {/* Applicable medicines */}
                {rule.applicableMeds && rule.applicableMeds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Triggered by:</span>
                    {rule.applicableMeds.map((med, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shadow-2xs ${
                          isDarkMode 
                            ? 'bg-[#0b2420] text-amber-300 border-amber-500/30' 
                            : 'bg-amber-50 text-amber-950 border-amber-200'
                        }`}
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                )}

                {/* Food item impacted */}
                <div className={`text-xs font-bold flex items-center space-x-1.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-800'}`}>
                  <Utensils className="w-3.5 h-3.5 shrink-0" />
                  <span>Dietary Items: {rule.foodItem}</span>
                </div>

                {/* Bio-chemical Mechanism */}
                <p className={`text-xs leading-relaxed ${textBody} font-normal`}>
                  {rule.mechanism}
                </p>
              </div>

              {/* Actionable Advice & Alternative */}
              <div className={`pt-3 border-t ${isDarkMode ? 'border-[#1b4840]' : 'border-[#e8e6df]'} space-y-2`}>
                <div className={`text-xs font-bold flex items-start space-x-2 ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{isHindi ? rule.hindiAdvice || rule.advice : rule.advice}</span>
                </div>

                {rule.safeAlternative && (
                  <div className={`text-[11px] font-semibold flex items-center space-x-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    <span>✓ Recommended: {rule.safeAlternative}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* QUICK INDIAN MEAL TIMELINE GUIDE */}
      <div className={`p-5 rounded-2xl border text-xs space-y-3 ${
        isDarkMode 
          ? 'bg-[#08221d] border-[#13493e]' 
          : 'bg-[#fffaf0] border-[#fde68a]'
      }`}>
        <div className={`font-bold text-sm flex items-center space-x-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-950'}`}>
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Quick Rule of Thumb for Indian Families:</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className={`p-3.5 rounded-xl border space-y-1 shadow-2xs ${
            isDarkMode 
              ? 'bg-[#0d2e28] border-[#1b5044] text-slate-200' 
              : 'bg-white border-[#fde68a] text-slate-800'
          }`}>
            <span className={`font-bold text-xs block ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              1. खाली पेट (Empty Stomach)
            </span>
            <p className="text-[11px] leading-relaxed">
              Take 45 mins before the first sip of morning chai or breakfast.
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 shadow-2xs ${
            isDarkMode 
              ? 'bg-[#0d2e28] border-[#1b5044] text-slate-200' 
              : 'bg-white border-[#fde68a] text-slate-800'
          }`}>
            <span className={`font-bold text-xs block ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              2. 2-Hour Dairy Separation
            </span>
            <p className="text-[11px] leading-relaxed">
              Never swallow calcium, iron, or antibiotics with milk or dahi.
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1 shadow-2xs ${
            isDarkMode 
              ? 'bg-[#0d2e28] border-[#1b5044] text-slate-200' 
              : 'bg-white border-[#fde68a] text-slate-800'
          }`}>
            <span className={`font-bold text-xs block ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              3. 1-Hour Tea/Chai Gap
            </span>
            <p className="text-[11px] leading-relaxed">
              Do not wash down iron or multivitamin pills with hot tea or coffee.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
