export type ToneType = 'neutral' | 'animated' | 'empathetic';

/**
 * Classifies the tone of assistant text to determine avatar video state
 * Rule of thumb: promotional/enthusiastic → animated; factual → neutral; objection/concern → empathetic
 */
export function classifyTone(text: string): ToneType {
  const lowerText = text.toLowerCase();
  
  // Keywords that suggest animated/enthusiastic tone
  const animatedKeywords = [
    'amazing', 'fantastic', 'incredible', 'wonderful', 'perfect', 'excellent',
    'love', 'excited', 'thrilled', 'awesome', 'great', 'boost', 'increase',
    'transform', 'revolutionary', 'game-changer', '!', 'never miss', 'fill your calendar'
  ];
  
  // Keywords that suggest empathetic tone
  const empatheticKeywords = [
    'understand', 'concern', 'worry', 'problem', 'difficult', 'challenge',
    'help', 'support', 'sorry', 'unfortunately', 'however', 'but', 'issue',
    'struggled', 'frustrated', 'overwhelmed', 'busy', 'time-consuming'
  ];
  
  // Count keyword matches
  const animatedMatches = animatedKeywords.filter(keyword => 
    lowerText.includes(keyword)
  ).length;
  
  const empatheticMatches = empatheticKeywords.filter(keyword => 
    lowerText.includes(keyword)
  ).length;
  
  // Check for promotional phrases (animated)
  const promotionalPhrases = [
    'setup', 'hire now', 'start', 'get started', 'book', 'schedule',
    '24/7', 'never miss', 'boost', 'increase leads'
  ];
  
  const hasPromotional = promotionalPhrases.some(phrase => 
    lowerText.includes(phrase)
  );
  
  // Decision logic
  if (empatheticMatches > animatedMatches && empatheticMatches > 0) {
    return 'empathetic';
  }
  
  if (animatedMatches > 0 || hasPromotional || lowerText.includes('!')) {
    return 'animated';
  }
  
  return 'neutral';
}

/**
 * Get the appropriate avatar video state based on tone
 */
export function getAvatarStateFromTone(tone: ToneType): 'talking_neutral' | 'talking_animated' | 'talking_empathetic' {
  return `talking_${tone}` as const;
}