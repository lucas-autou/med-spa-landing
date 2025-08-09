// Safety and contraindication detection for med spa treatments
// This system helps identify when users should be referred to a specialist

export interface SafetyFlag {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: 'medical' | 'allergy' | 'medication' | 'condition';
  description: string;
  recommendation: string;
  requiresConsult: boolean;
}

// Contraindication keywords organized by category and severity
const SAFETY_KEYWORDS = {
  // High risk - requires immediate specialist consult
  high_risk: {
    medical: [
      'pregnant', 'pregnancy', 'expecting', 'gravid',
      'breastfeeding', 'nursing', 'lactating',
      'myasthenia gravis', 'muscle disease', 'muscular dystrophy',
      'lambert-eaton', 'neuromuscular disorder',
      'botulism', 'botulinum toxin allergy'
    ],
    medication: [
      'blood thinner', 'anticoagulant', 'warfarin', 'coumadin', 
      'heparin', 'aspirin therapy', 'plavix', 'eliquis',
      'aminoglycoside', 'antibiotic allergy'
    ],
    allergy: [
      'botulinum', 'botox allergy', 'dysport allergy', 
      'severe allergic reaction', 'anaphylaxis',
      'hyaluronic acid allergy', 'lidocaine allergy',
      'human albumin allergy'
    ]
  },
  
  // Medium risk - needs discussion but may proceed with precautions
  medium_risk: {
    medical: [
      'autoimmune', 'lupus', 'rheumatoid arthritis', 'scleroderma',
      'multiple sclerosis', 'ms', 'psoriasis', 'inflammatory',
      'infection', 'skin infection', 'cold sore', 'herpes',
      'keloid', 'scarring', 'healing problems'
    ],
    medication: [
      'retinol', 'tretinoin', 'accutane', 'isotretinoin',
      'steroid', 'prednisone', 'immunosuppressant',
      'chemotherapy', 'radiation therapy'
    ],
    condition: [
      'diabetes', 'bleeding disorder', 'hemophilia',
      'heart condition', 'pacemaker', 'metal implant',
      'recent surgery', 'facial surgery'
    ]
  },
  
  // Low risk - general screening questions
  low_risk: {
    allergy: [
      'seasonal allergies', 'environmental allergies',
      'food allergies', 'pollen', 'dust'
    ],
    medication: [
      'vitamins', 'supplements', 'birth control',
      'antidepressants', 'blood pressure medication'
    ]
  }
};

// Treatment-specific contraindications
const TREATMENT_CONTRAINDICATIONS = {
  botox: [
    'neuromuscular disorder', 'myasthenia gravis', 'lambert-eaton',
    'aminoglycoside antibiotics', 'botulinum allergy', 'pregnancy',
    'breastfeeding', 'infection at injection site'
  ],
  fillers: [
    'hyaluronic acid allergy', 'autoimmune disease', 'keloid formation',
    'pregnancy', 'breastfeeding', 'active skin infection',
    'blood thinners', 'lidocaine allergy'
  ],
  laser: [
    'pregnancy', 'active tan', 'skin cancer', 'photosensitive medication',
    'recent accutane', 'keloid formation', 'active infection',
    'metal implants in treatment area'
  ]
};

export function detectSafetyFlags(text: string, treatmentType?: string): SafetyFlag[] {
  const flags: SafetyFlag[] = [];
  const lowerText = text.toLowerCase();
  
  // Check high-risk keywords first
  for (const [category, keywords] of Object.entries(SAFETY_KEYWORDS.high_risk)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        flags.push({
          id: `high_${category}_${keyword.replace(/\s+/g, '_')}`,
          severity: 'high',
          category: category as SafetyFlag['category'],
          description: `High-risk condition detected: ${keyword}`,
          recommendation: 'Immediate specialist consultation required before any treatment',
          requiresConsult: true
        });
      }
    }
  }
  
  // Check medium-risk keywords
  for (const [category, keywords] of Object.entries(SAFETY_KEYWORDS.medium_risk)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        flags.push({
          id: `medium_${category}_${keyword.replace(/\s+/g, '_')}`,
          severity: 'medium',
          category: category as SafetyFlag['category'],
          description: `Potential concern detected: ${keyword}`,
          recommendation: 'Specialist consultation recommended to ensure safe treatment',
          requiresConsult: true
        });
      }
    }
  }
  
  // Check treatment-specific contraindications
  if (treatmentType && TREATMENT_CONTRAINDICATIONS[treatmentType as keyof typeof TREATMENT_CONTRAINDICATIONS]) {
    const treatmentContras = TREATMENT_CONTRAINDICATIONS[treatmentType as keyof typeof TREATMENT_CONTRAINDICATIONS];
    for (const contra of treatmentContras) {
      if (lowerText.includes(contra)) {
        flags.push({
          id: `treatment_${treatmentType}_${contra.replace(/\s+/g, '_')}`,
          severity: 'high',
          category: 'medical',
          description: `${treatmentType} contraindication: ${contra}`,
          recommendation: `Specialist consultation required for ${treatmentType} treatment`,
          requiresConsult: true
        });
      }
    }
  }
  
  // Check low-risk items (for completeness, may not require consult)
  for (const [category, keywords] of Object.entries(SAFETY_KEYWORDS.low_risk)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        flags.push({
          id: `low_${category}_${keyword.replace(/\s+/g, '_')}`,
          severity: 'low',
          category: category as SafetyFlag['category'],
          description: `General screening item: ${keyword}`,
          recommendation: 'Standard screening questions will be asked during consultation',
          requiresConsult: false
        });
      }
    }
  }
  
  return flags;
}

// Generate appropriate responses based on safety flags
export function generateSafetyResponse(flags: SafetyFlag[]): string {
  if (flags.length === 0) {
    return "Great! Based on your responses, you're a good candidate for treatment. Let's proceed with booking.";
  }
  
  const highRiskFlags = flags.filter(f => f.severity === 'high');
  const mediumRiskFlags = flags.filter(f => f.severity === 'medium');
  
  if (highRiskFlags.length > 0) {
    return "I want to make sure you receive the safest care possible. Based on your responses, I'd like to connect you with one of our specialists who can provide personalized guidance for your specific situation. They'll ensure we create the perfect treatment plan for you.";
  }
  
  if (mediumRiskFlags.length > 0) {
    return "Thanks for letting me know! To ensure you get the best and safest treatment, our specialist will want to discuss this with you during your consultation. They're experts at working with clients who have similar considerations.";
  }
  
  return "Perfect! Our specialists will cover all the safety basics during your consultation to make sure everything goes smoothly.";
}

// Quick safety check for common scenarios
export function quickSafetyCheck(responses: string[]): {
  isSafe: boolean;
  flags: SafetyFlag[];
  requiresConsult: boolean;
} {
  const allText = responses.join(' ').toLowerCase();
  const flags = detectSafetyFlags(allText);
  
  const requiresConsult = flags.some(flag => flag.requiresConsult);
  const isSafe = flags.filter(f => f.severity === 'high').length === 0;
  
  return {
    isSafe,
    flags,
    requiresConsult
  };
}

// Common safety questions for different treatments
export const SAFETY_QUESTIONS = {
  botox: [
    "Any allergies to botulinum toxin products?",
    "Are you pregnant, planning to become pregnant, or breastfeeding?", 
    "Any neuromuscular disorders (myasthenia gravis, etc.)?",
    "Currently taking any antibiotics or blood thinners?",
    "Any infections or skin conditions in the treatment area?"
  ],
  fillers: [
    "Any allergies to hyaluronic acid or lidocaine?",
    "Are you pregnant or breastfeeding?",
    "Any autoimmune conditions or healing disorders?", 
    "Currently taking blood thinners or aspirin?",
    "History of cold sores around the treatment area?"
  ],
  laser: [
    "Are you pregnant or could you be pregnant?",
    "Recently used Accutane or other photosensitive medications?",
    "Any history of skin cancer or abnormal moles?",
    "Recent sun exposure or current tan?",
    "Any metal implants or devices in the treatment area?"
  ]
};

// Generate contextual safety questions based on treatment
export function getSafetyQuestions(treatmentType: string): string[] {
  return SAFETY_QUESTIONS[treatmentType as keyof typeof SAFETY_QUESTIONS] || [
    "Any allergies or medical conditions I should know about?",
    "Are you currently pregnant or breastfeeding?",
    "Taking any medications or supplements?",
    "Any previous reactions to cosmetic treatments?"
  ];
}