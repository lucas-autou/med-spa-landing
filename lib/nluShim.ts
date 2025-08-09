// NLU shim for mapping user input to intents
// Deterministic keyword/regex matching - no external LLM required

export type Intent = 'book_botox' | 'pricing' | 'reschedule' | 'faq' | 'unknown';

interface IntentMatch {
  intent: Intent;
  confidence: number;
  topic?: string; // for FAQ subtopic
}

// Safety keywords that trigger medical consultation
const CONTRAINDICATION_KEYWORDS = [
  /\b(pregnant|pregnancy|expecting|baby)\b/i,
  /\b(myasthenia gravis|muscle disorder)\b/i,
  /\b(allergic|allergy)\s+to\s+(botox|botulinum|dysport)\b/i,
  /\b(blood thinner|warfarin|aspirin|coumadin)\b/i,
  /\b(neuromuscular|nerve|muscle)\s+(disease|disorder|condition)\b/i
];

// Intent patterns
const INTENT_PATTERNS = {
  book_botox: [
    /\b(book|schedule|appointment|slot|botox|consultation)\b/i,
    /\b(available|availability|open|free)\s*(time|slot|appointment)?\b/i,
    /\b(when|what time|this week|next week|today|tomorrow)\b/i,
    /\b(make|get|need)\s+(appointment|booking)\b/i,
  ],
  pricing: [
    /\b(price|cost|pricing|how much|expensive|cheap|rate|fee)\b/i,
    /\b(dollar|money|\$|payment|pay)\b/i,
    /\b(what.*cost|costs.*much|price.*botox)\b/i,
  ],
  reschedule: [
    /\b(reschedule|change|move|cancel|different time|new time)\b/i,
    /\b(booked|appointment).*\b(change|move|reschedule)\b/i,
    /\b(can't make|won't make|conflict)\b/i,
  ],
  faq: [
    /\b(prep|preparation|before|ready)\b/i,
    /\b(pain|hurt|painful|sore|bruise|swelling)\b/i,
    /\b(downtime|recovery|after|results)\b/i,
    /\b(no.?show|late|policy|cancel)\b/i,
    /\b(side effect|risk|safe|safety)\b/i,
    /\b(how long|duration|last|wear off)\b/i,
  ]
};

// FAQ topic detection
const FAQ_TOPICS = {
  prep: [/\b(prep|preparation|before|ready|alcohol|blood thinner)\b/i],
  pain: [/\b(pain|hurt|painful|sore|numb)\b/i],
  downtime: [/\b(downtime|recovery|after|results|bruise|swelling)\b/i],
  policy: [/\b(no.?show|late|policy|cancel|fee)\b/i],
  duration: [/\b(how long|duration|last|wear off|results)\b/i],
  safety: [/\b(side effect|risk|safe|safety)\b/i]
};

export function detectContraindications(input: string): boolean {
  return CONTRAINDICATION_KEYWORDS.some(pattern => pattern.test(input));
}

export function classifyIntent(input: string): IntentMatch {
  const normalizedInput = input.toLowerCase().trim();
  
  // Check for contraindications first
  if (detectContraindications(input)) {
    return {
      intent: 'faq',
      confidence: 1.0,
      topic: 'safety'
    };
  }

  // Score each intent
  const scores: Record<Intent, number> = {
    book_botox: 0,
    pricing: 0,
    reschedule: 0,
    faq: 0,
    unknown: 0
  };

  // Calculate intent scores
  Object.entries(INTENT_PATTERNS).forEach(([intent, patterns]) => {
    patterns.forEach(pattern => {
      const matches = normalizedInput.match(pattern);
      if (matches) {
        scores[intent as Intent] += 1;
      }
    });
  });

  // Find highest scoring intent
  const bestIntent = Object.entries(scores)
    .filter(([intent]) => intent !== 'unknown')
    .reduce((a, b) => scores[a[0] as Intent] > scores[b[0] as Intent] ? a : b);

  // If no clear intent, return unknown
  if (scores[bestIntent[0] as Intent] === 0) {
    return {
      intent: 'unknown',
      confidence: 0
    };
  }

  // For FAQ, detect specific topic
  let topic: string | undefined;
  if (bestIntent[0] === 'faq') {
    for (const [topicName, patterns] of Object.entries(FAQ_TOPICS)) {
      if (patterns.some(pattern => pattern.test(normalizedInput))) {
        topic = topicName;
        break;
      }
    }
  }

  return {
    intent: bestIntent[0] as Intent,
    confidence: Math.min(scores[bestIntent[0] as Intent] / 3, 1.0), // Normalize
    topic
  };
}

// Quick intent check for common phrases
export function getQuickResponse(input: string): string | null {
  const intent = classifyIntent(input);
  
  if (intent.confidence < 0.3) return null;
  
  switch (intent.intent) {
    case 'pricing':
      return 'Botox starts at $12/unit; average treatment $240–400. New clients get a quick consult first.';
    case 'reschedule':
      return 'I found your visit for Friday 10:20 AM. Let me show you new times.';
    default:
      return null;
  }
}