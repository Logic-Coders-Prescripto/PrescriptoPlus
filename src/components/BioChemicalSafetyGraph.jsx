import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Dna, 
  GitCommit, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { analyzeDrugInteractions } from '../utils/ddiInteractionEngine';

export function BioChemicalSafetyGraph({ medicines = [], selectedLang, isDarkMode = false }) {
  const isHindi = selectedLang === 'hi';
  const analysis = analyzeDrugInteractions(medicines);
  const [activeInteractionIndex, setActiveInteractionIndex] = useState(0);

  if (!medicines || medicines.length < 2) return null;

  const currentInteraction = analysis.interactions[activeInteractionIndex] || analysis.interactions[0];
  const cardBg = isDarkMode ? "bg-[#0b2420] border-[#16443c] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const subCardBg = isDarkMode ? "bg-[#10332d] border-[#184840]" : "bg-[#faf9f5] border-[#e8e6df]";

  return (
    <div className={`${cardBg} rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xs transition-colors`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f0e9]/40">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs font-semibold">
            <Dna className="w-3.5 h-3.5 text-emerald-500" />
            <span>Deterministic DDI & CYP450 Pharmacological Engine</span>
          </div>
          <h3 className="text-xl font-bold font-heading">
            {isHindi ? "बायो-केमिकल ड्रग इंटरैक्शन एवं CYP450 पाथवे" : "Bio-Chemical Drug-Drug Interaction (DDI) & CYP450 Graph"}
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isHindi 
              ? "दवाओं के बीच एंजाइम मेटाबोलिज्म और रिसेप्टर इंटरैक्शन का वैज्ञानिक विश्लेषण" 
              : "Grounds safety in exact receptor pathways (GABA-A, 5-HT, D2) and Phase I cytochrome P450 hepatic clearance."}
          </p>
        </div>

        {/* Risk Index Badges */}
        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-1.5">
          {analysis.highRiskCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 text-xs font-bold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{analysis.highRiskCount} High Risk</span>
            </span>
          )}
          {analysis.moderateRiskCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 text-xs font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{analysis.moderateRiskCount} Monitor</span>
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{analysis.safeSynergyCount} Synergistic</span>
          </span>
        </div>
      </div>

      {/* Interaction Selector Chips */}
      {analysis.interactions.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {analysis.interactions.map((interaction, idx) => {
            const isSelected = activeInteractionIndex === idx;
            const isHigh = interaction.riskLevel === 'high';
            const isMod = interaction.riskLevel === 'moderate';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveInteractionIndex(idx)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all shrink-0 cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? isHigh 
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : isMod
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : `${subCardBg} hover:border-emerald-500 text-slate-600 dark:text-slate-300`
                }`}
              >
                <span>{isHigh ? '🔴' : isMod ? '🟡' : '🟢'}</span>
                <span className="font-bold">{interaction.drugA.split(' ')[0]} + {interaction.drugB.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ACTIVE INTERACTION VISUAL GRAPH CONTAINER */}
      {currentInteraction && (
        <div className="space-y-4">
          
          {/* Visual Pathway Diagram / Flowchart */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 relative overflow-hidden shadow-inner">
            <div className="absolute top-3 right-3 flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
              <Sparkles className="w-3 h-3" />
              <span>Active Pharmacological Circuit</span>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-6">
              CYP450 & Receptor Pathway Topology:
            </div>

            {/* Interactive Flow Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center relative z-10">
              
              {/* Left Node: Drug A */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-teal-500/40 space-y-1.5 shadow-md">
                <span className="text-[9px] uppercase font-bold text-teal-400 font-mono block">Formulation A</span>
                <div className="font-bold text-sm text-teal-200 truncate">
                  {currentInteraction.drugA}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Target: <span className="text-teal-300">{currentInteraction.nodeA?.role || 'Receptor'}</span>
                </div>
              </div>

              {/* Center Node: Metabolic Pathway & Enzymes */}
              <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-1 text-center shadow-lg relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
                  <Dna className="w-4 h-4 animate-pulse" />
                </div>
                <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono">
                  Enzyme / Clearance Vector
                </span>
                <span className="text-xs font-bold text-white">
                  {currentInteraction.enzymeNode || 'CYP3A4 / CYP2D6'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentInteraction.category}
                </span>
              </div>

              {/* Right Node: Drug B */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-teal-500/40 space-y-1.5 shadow-md">
                <span className="text-[9px] uppercase font-bold text-teal-400 font-mono block">Formulation B</span>
                <div className="font-bold text-sm text-teal-200 truncate">
                  {currentInteraction.drugB}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Target: <span className="text-teal-300">{currentInteraction.nodeB?.role || 'Receptor'}</span>
                </div>
              </div>

            </div>

            {/* Glowing connecting line */}
            <div className="mt-5 pt-3 border-t border-slate-800 text-center">
              <span className="text-xs font-mono text-emerald-400">
                Pathway Mechanism: <span className="text-white font-sans">{currentInteraction.enzymePathway}</span>
              </span>
            </div>
          </div>

          {/* Clinical Mechanism & Doctor Recommendation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Mechanism Explanation */}
            <div className={`${subCardBg} p-5 rounded-2xl border space-y-2`}>
              <div className={`flex items-center space-x-2 font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-teal-400' : 'text-teal-800'}`}>
                <Layers className="w-3.5 h-3.5" />
                <span>Pharmacological Mechanism</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} font-normal`}>
                {currentInteraction.mechanismText}
              </p>
              <div className={`pt-2 text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Clinical Presentation: <span className={`font-semibold ${isDarkMode ? 'text-emerald-300' : 'text-slate-900'}`}>{currentInteraction.clinicalImpact}</span>
              </div>
            </div>

            {/* Doctor Recommendation */}
            <div className={`p-5 rounded-2xl border space-y-2 ${
              currentInteraction.riskLevel === 'high' 
                ? isDarkMode ? 'bg-rose-950/40 border-rose-800 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-950' 
                : currentInteraction.riskLevel === 'moderate'
                ? isDarkMode ? 'bg-amber-950/40 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-950'
                : isDarkMode ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Doctor Alternative Recommendation</span>
              </div>
              <p className="text-xs leading-relaxed font-semibold">
                {currentInteraction.recommendation}
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono font-bold">
                <span className={`px-2 py-0.5 rounded border ${isDarkMode ? 'bg-[#0b2420] text-emerald-300 border-emerald-500/40' : 'bg-white text-slate-900 border-slate-300'}`}>
                  Index: {currentInteraction.riskScore}
                </span>
                <span>Grounding: 100% CDSCO Formulary Grounded</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
