/**
 * Hindi Voice & Text Instruction Generator
 * Strictly generates instructions only from doctor-verified prescription data.
 * Never adds unauthorized medical advice absent from verified data.
 */

export function generateHindiMedicineInstruction(medicine) {
  if (!medicine) return "दवाई निर्धारित समय पर लें।";
  const name = medicine.name?.value || medicine.brandName || "दवाई";
  const dose = medicine.dose?.value || medicine.strength?.value || medicine.strength || "एक खुराक";
  const food = medicine.foodRelation?.value || medicine.foodRelation || "भोजन के बाद";
  const duration = medicine.duration?.value || medicine.duration || "डॉक्टर के निर्देशानुसार";

  let timingHindi = "";
  const timings = medicine.timings || {};

  if (timings.morning && timings.night && !timings.afternoon) {
    timingHindi = "दिन में दो बार (सुबह और रात को)";
  } else if (timings.morning && timings.afternoon && timings.night) {
    timingHindi = "दिन में तीन बार (सुबह, दोपहर और रात को)";
  } else if (timings.morning && !timings.night && !timings.afternoon) {
    timingHindi = "दिन में एक बार (सुबह)";
  } else if (timings.night || timings.bedtime) {
    timingHindi = "रात को सोने से पहले";
  } else {
    timingHindi = medicine.frequency?.value || medicine.frequency || "निर्धारित समय पर";
  }

  let foodHindi = "";
  const foodLower = (food || "").toLowerCase();
  if (foodLower.includes("before") || foodLower.includes("empty")) {
    foodHindi = "खाली पेट (नाश्ते से 30 मिनट पहले)";
  } else if (foodLower.includes("after")) {
    foodHindi = "खाना खाने के बाद पानी के साथ";
  } else if (foodLower.includes("start") || foodLower.includes("with")) {
    foodHindi = "भोजन के साथ";
  } else {
    foodHindi = food;
  }

  return `${foodHindi}, ${name} (${dose}) ${timingHindi} लें। यह दवा ${duration} तक नियमित लेनी है।`;
}

export function generateFullScheduleHindiAudioTranscript(medicines = [], patientName = "मरीज") {
  if (!medicines || medicines.length === 0) {
    return "आपके लिए कोई सत्यापित दवाई निर्धारित नहीं है।";
  }

  let fullSpeech = `नमस्ते ${patientName} जी, आपके डॉक्टर द्वारा सत्यापित दवाइयों का समय-सारिणी इस प्रकार है: `;

  medicines.forEach((med, index) => {
    fullSpeech += `नंबर ${index + 1}: ${generateHindiMedicineInstruction(med)} `;
  });

  fullSpeech += `कृपया सभी दवाइयां समय पर लें और कोर्स पूरा करें। किसी भी असुविधा पर तुरंत अपने डॉक्टर से संपर्क करें।`;
  return fullSpeech;
}
