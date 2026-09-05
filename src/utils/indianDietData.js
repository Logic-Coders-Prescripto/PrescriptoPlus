/**
 * INDIAN DIET & FOOD-DRUG INTERACTION MATRIX
 * Specialized clinical advisory tailored for Indian dietary patterns:
 * Dairy (Dahi/Chaas/Doodh), Chai/Filter Coffee, Haldi/Garam Masala, Desi Ghee & Fasting.
 */

export const INDIAN_DIET_RULES = [
  {
    id: 'diet-dairy-chelation',
    category: 'dairy',
    title: '🥛 Dairy / Dahi / Chaas Chelation Alert',
    hindiTitle: 'दूध, दही और छाछ के साथ नियम',
    foodItem: 'Milk, Curd (Dahi), Buttermilk (Chaas), Paneer',
    severity: 'high',
    triggerPattern: /(shelcal|calcium|bio d3|d3 must|cipro|oflox|doxy|tetracycline|choliv|iron|ferrous)/i,
    mechanism: 'Calcium and casein in Indian dairy bind with drug molecules, forming insoluble heavy metal chelates in the stomach that reduce gut absorption by 50% to 60%.',
    advice: 'Never take this medication directly with milk or lassi. Maintain a strict 2-HOUR INTERVAL between dairy consumption and taking this medicine.',
    hindiAdvice: 'इस दवाई को दूध या छाछ के साथ न लें। दवाई और दूध-दही के बीच कम से कम 2 घंटे का अंतर रखें।',
    safeAlternative: 'Take with plain lukewarm water.'
  },
  {
    id: 'diet-chai-coffee-tannins',
    category: 'tannins',
    title: '☕ Masala Chai / Coffee Tannin Warning',
    hindiTitle: 'चाय और कॉफ़ी के साथ सावधानी',
    foodItem: 'Indian Masala Chai, Assam/Darjeeling Tea, Filter Coffee',
    severity: 'high',
    triggerPattern: /(choliv|iron|ferrous|folic|ida|antoxipan|antoxid|multivitamin|neurokind)/i,
    mechanism: 'Polyphenols, catechins and tannins in boiled Indian chai precipitate non-heme elemental iron and micronutrients into insoluble complexes, blocking biological uptake by up to 75%.',
    advice: 'Do not take your hematinic / iron / antioxidant dose with morning tea. Take the medicine with water or fresh lemon water at least 1 hour before or 2 hours after drinking Chai.',
    hindiAdvice: 'सुबह की चाय के तुरंत बाद या साथ में आयरन/टॉनिक न लें। चाय पीने से 1 घंटा पहले या 2 घंटे बाद ही लें।',
    safeAlternative: 'Take with fresh nimbu-paani (Vitamin C boosts iron absorption).'
  },
  {
    id: 'diet-empty-stomach-khali-pet',
    category: 'empty_stomach',
    title: '🥣 Strict Empty Stomach (खाली पेट) Rule',
    hindiTitle: 'सुबह खाली पेट लेने का अनिवार्य नियम',
    foodItem: 'Morning Bed-Tea, Breakfast, Poha, Paratha, Biscuits',
    severity: 'high',
    triggerPattern: /(razo|rx it|rx-it|nexpro|esomac|dexite|doxite|pantocid|rabeprazole|esomeprazole)/i,
    mechanism: 'Proton Pump Inhibitors (PPIs) require systemic absorption before gastric proton pumps are stimulated by food. Taking them with or after breakfast cuts efficacy by 65%.',
    advice: 'Swallow whole with water 30-45 minutes before morning tea, biscuits, or breakfast. Do not crush or chew the capsule.',
    hindiAdvice: 'नाश्ता या सुबह की चाय से 30 से 45 मिनट पहले खाली पेट पानी के साथ लें। कैप्सूल को चबाएं नहीं।',
    safeAlternative: 'Drink one glass of lukewarm water upon waking, take medicine, wait 40 mins before eating.'
  },
  {
    id: 'diet-desi-ghee-fat-synergy',
    category: 'fat_soluble',
    title: '🧈 Desi Ghee & Healthy Fats (Synergy)',
    hindiTitle: 'घी और भोजन के साथ विटामिन अवशोषण',
    foodItem: 'Desi Cow Ghee, Roti with Ghee, Dal-Khichdi with fats',
    severity: 'low',
    triggerPattern: /(goldcal|d3 must|bio d3|calcitriol|cholecalciferol|vitamin a|vitamin e)/i,
    mechanism: 'Vitamin D3 is highly lipophilic (fat-soluble). Consuming it alongside healthy dietary lipids (desi ghee or whole milk) triggers biliary micelle formation, boosting absorption by 40%.',
    advice: 'Take this high-dose Vitamin D3 softgel / sachet immediately after a hearty meal containing ghee or milk (e.g. Sunday lunch).',
    hindiAdvice: 'विटामिन डी3 कैप्सूल को हमेशा दोपहर के भोजन (जिसमें घी या दूध शामिल हो) के बाद लें।',
    safeAlternative: 'Post-lunch with a glass of milk or regular home-cooked meal with ghee.'
  },
  {
    id: 'diet-spices-haldi-warning',
    category: 'spices',
    title: '🌶️ Turmeric (Haldi) & Spicy Tadka Caution',
    hindiTitle: 'हल्दी, मिर्च और तीखा तड़का सावधानी',
    foodItem: 'High-spice curries, Red chillies, Turmeric milk (Haldi doodh)',
    severity: 'moderate',
    triggerPattern: /(altraday|aceclofenac|ultracet|tramadol|drotin|emanzen|cremagel|fissure)/i,
    mechanism: 'Curcumin possesses mild antiplatelet properties and spicy capsicum exacerbates mucosal gastrointestinal irritation when taken with potent anti-inflammatories or during anal fissure healing.',
    advice: 'Maintain a bland, fiber-rich, low-spice diet. For acute anal fissures or gastritis, strictly avoid red chilli powder, fried samosas, and excessive garam masala.',
    hindiAdvice: 'मिर्च, तला हुआ खाना और तीखा मसाला बंद रखें। सादा, हल्का और रेशेदार (फाइबर) भोजन लें।',
    safeAlternative: 'Khichdi, boiled vegetables, oats, and fiber-rich papaya.'
  },
  {
    id: 'diet-coconut-water-hydration',
    category: 'hydration',
    title: '🥥 Coconut Water & Fluid Intake Directive',
    hindiTitle: 'नारियल पानी और पर्याप्त पानी की मात्रा',
    foodItem: 'Nariyal Paani, Plain Boiled Water, ORS',
    severity: 'moderate',
    triggerPattern: /(feburic|febuxostat|uric acid|puric|creatinine|radiculopathy)/i,
    mechanism: 'Febuxostat mobilizes crystallized uric acid from joints into the renal tubules. Low urinary flow can precipitate renal urate micro-calculi.',
    advice: 'Drink at least 3.0 Liters of water daily. Fresh tender coconut water is rich in potassium and helps alkalize urine, facilitating crystal excretion.',
    hindiAdvice: 'दिनभर में कम से कम 3 लीटर पानी पिएं। ताजा नारियल पानी यूरिक एसिड को शरीर से बाहर निकालने में मदद करता है।',
    safeAlternative: '2.5 to 3 Liters of filtered water and 1 tender coconut water daily.'
  }
];

/**
 * Returns tailored Indian diet recommendations matching current medications
 */
export function getIndianDietRecommendations(medicines = []) {
  const matchedRules = [];
  const textCorpus = medicines.map(m => `${m.brandName || ''} ${m.genericSalt || ''} ${m.purpose || ''}`).join(' ').toLowerCase();

  for (const rule of INDIAN_DIET_RULES) {
    if (rule.triggerPattern.test(textCorpus)) {
      // Find which specific medicines triggered this rule
      const matchingMeds = medicines.filter(m => 
        rule.triggerPattern.test(`${m.brandName || ''} ${m.genericSalt || ''}`)
      ).map(m => m.brandName);

      matchedRules.push({
        ...rule,
        applicableMeds: matchingMeds.length > 0 ? matchingMeds : ['Active Prescription Formulation']
      });
    }
  }

  // If no specific triggers, return general Indian wellness nutrition guidance
  if (matchedRules.length === 0) {
    matchedRules.push({
      id: 'diet-general-safe',
      category: 'general',
      title: '🥗 Balanced Home-Cooked Indian Diet Rule',
      hindiTitle: 'संतुलित घर का भोजन और पानी का नियम',
      foodItem: 'Home-cooked Dal, Roti, Sabzi, Rice, Salad',
      severity: 'low',
      advice: 'Always take prescribed tablets with a full glass of lukewarm water. Avoid lying down immediately for 20 minutes after swallowing tablets.',
      hindiAdvice: 'गोलियां हमेशा एक गिलास गुनगुने पानी के साथ लें। दवाई खाने के तुरंत बाद 20 मिनट तक लेटें नहीं।',
      safeAlternative: 'Light home-cooked meals at regular 4-hour intervals.',
      applicableMeds: medicines.map(m => m.brandName).slice(0, 2)
    });
  }

  return matchedRules;
}
