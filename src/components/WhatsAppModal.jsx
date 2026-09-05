import React, { useState } from 'react';
import { X, Share2, Check, Bell, MessageSquare, Send, Phone, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WhatsAppModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  medicines = [], 
  selectedLang 
}) {
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone || '9876543210');
  const [isSent, setIsSent] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  if (!isOpen) return null;

  const isHindi = selectedLang === 'hi';

  // Build structured message text for WhatsApp
  const generateWhatsAppMessage = () => {
    const name = userProfile?.name || 'Patient';
    let msg = isHindi 
      ? `*📋 Prescripto दवाई टाइम-टेबल — ${name}*\n\n`
      : `*📋 Prescripto Medication Schedule — ${name}*\n\n`;

    const morningMeds = medicines.filter(m => m.schedule?.includes('morning'));
    const afternoonMeds = medicines.filter(m => m.schedule?.includes('afternoon'));
    const nightMeds = medicines.filter(m => m.schedule?.includes('night'));
    const bedtimeMeds = medicines.filter(m => m.schedule?.includes('bedtime'));

    if (morningMeds.length > 0) {
      msg += `🌅 *सुबह (Morning 8:00 AM)*\n` + morningMeds.map(m => `• ${m.brandName || m.name?.value} (${(m.foodRelation?.value || m.foodRelation || 'After food').split('(')[0].trim()})`).join('\n') + '\n\n';
    }
    if (afternoonMeds.length > 0) {
      msg += `☀️ *दोपहर (Afternoon 2:00 PM)*\n` + afternoonMeds.map(m => `• ${m.brandName || m.name?.value} (${(m.foodRelation?.value || m.foodRelation || 'After food').split('(')[0].trim()})`).join('\n') + '\n\n';
    }
    if (nightMeds.length > 0) {
      msg += `🌙 *रात (Night 8:00 PM)*\n` + nightMeds.map(m => `• ${m.brandName || m.name?.value} (${(m.foodRelation?.value || m.foodRelation || 'After food').split('(')[0].trim()})`).join('\n') + '\n\n';
    }

    msg += `✅ *Prescripto Healthcare AI द्वारा स्वचालित रिमाइंडर सक्रिय*`;
    return msg;
  };

  const handleSend = () => {
    const text = generateWhatsAppMessage();
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    setIsSent(true);
    setShowNotificationToast(true);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setShowNotificationToast(false);
    }, 6000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border border-[#e8e6df] max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl relative my-6 text-[#1c2726] space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0f3e3a] border border-emerald-200 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0f3e3a] font-heading">
              {isHindi ? "WhatsApp दवाई रिमाइंडर सक्रिय करें" : "Set WhatsApp Medication Reminders"}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? "सीधे अपने WhatsApp पर टाइम-टेबल और अलार्म प्राप्त करें" : "Receive automated daily dosage alerts on WhatsApp"}
            </p>
          </div>
        </div>

        {/* WhatsApp Mobile Input */}
        <div className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-[#0f3e3a] mb-1">
              {isHindi ? "अपना WhatsApp मोबाइल नंबर दर्ज करें:" : "WhatsApp Phone Number:"}
            </label>
            <div className="flex items-center bg-[#f6f5ef] border border-[#e8e6df] focus-within:border-[#0f3e3a] rounded-xl px-3 py-2">
              <span className="text-xs text-slate-500 font-mono mr-2">+91</span>
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="bg-transparent text-sm text-slate-800 w-full focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Schedule Preview Message */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              {isHindi ? "संदेश का पूर्वावलोकन (Preview):" : "Message Preview:"}
            </label>
            <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#e8e6df] font-mono text-[11px] text-slate-700 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {generateWhatsAppMessage()}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="w-full py-3.5 rounded-xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>{isHindi ? "WhatsApp पर भेजें और अलार्म चालू करें" : "Send & Activate WhatsApp Alerts"}</span>
          </button>

          {showNotificationToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 animate-fade-in flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {isHindi 
                  ? `+91 ${phoneNumber} पर WhatsApp रिमाइंडर सक्रिय हो गया है!` 
                  : `WhatsApp alert successfully dispatched to +91 ${phoneNumber}!`}
              </span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
