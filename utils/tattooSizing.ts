import type { TattooSize } from '../types';

interface SizeGuidance {
  dimensions: string;
  placement: string;
  coverage: string;
}

// Body-part specific size guidance
const BODY_PART_SIZE_MAP: Record<string, Record<TattooSize, SizeGuidance>> = {
  // Ankle/Lower leg
  ankle: {
    'Tiny': { dimensions: '1-2 inches', placement: 'just around the ankle bone', coverage: 'a small accent near the ankle' },
    'Small': { dimensions: '2-4 inches', placement: 'wrapping partially around the ankle or on the side', coverage: 'about the size of a large coin' },
    'Medium': { dimensions: '4-6 inches', placement: 'extending from ankle up the lower calf', coverage: 'roughly the size of a smartphone screen' },
    'Large': { dimensions: '6-10 inches', placement: 'covering the ankle and extending up the calf', coverage: 'a significant portion of the lower leg' },
    'Extra Large': { dimensions: '10+ inches', placement: 'covering the entire ankle to mid-calf area', coverage: 'the majority of the lower leg and ankle' }
  },

  // Foot  
  foot: {
    'Tiny': { dimensions: '1-2 inches', placement: 'on the top of the foot near toes or ankle', coverage: 'a small design the size of a quarter' },
    'Small': { dimensions: '2-4 inches', placement: 'across the top of the foot or on the side', coverage: 'about the size of a business card' },
    'Medium': { dimensions: '4-6 inches', placement: 'covering most of the foot top', coverage: 'roughly half the visible foot area' },
    'Large': { dimensions: '6-8 inches', placement: 'covering the entire top of the foot', coverage: 'the majority of the foot surface' },
    'Extra Large': { dimensions: '8+ inches', placement: 'covering the entire foot and possibly extending to ankle', coverage: 'the complete foot area' }
  },

  // Forearm
  forearm: {
    'Tiny': { dimensions: '1-2 inches', placement: 'a small spot on the forearm', coverage: 'a coin-sized area' },
    'Small': { dimensions: '2-4 inches', placement: 'on the outer or inner forearm', coverage: 'about 1/4 of the forearm width' },
    'Medium': { dimensions: '4-7 inches', placement: 'covering a good portion of the forearm', coverage: 'roughly 1/3 to 1/2 of the forearm area' },
    'Large': { dimensions: '7-10 inches', placement: 'extending across most of the forearm', coverage: 'a significant portion of the forearm' },
    'Extra Large': { dimensions: '10+ inches', placement: 'covering the entire forearm from wrist to elbow', coverage: 'the full forearm area' }
  },

  // Default for other body parts
  default: {
    'Tiny': { dimensions: '1-2 inches', placement: 'in a small area', coverage: 'a compact, coin-sized design' },
    'Small': { dimensions: '2-4 inches', placement: 'in a modest area', coverage: 'a business card-sized design' },
    'Medium': { dimensions: '4-7 inches', placement: 'covering a moderate area', coverage: 'a smartphone-sized design' },
    'Large': { dimensions: '7-12 inches', placement: 'covering a substantial area', coverage: 'a tablet-sized design' },
    'Extra Large': { dimensions: '12+ inches', placement: 'covering a major area', coverage: 'a large, prominent design' }
  }
};

export function getSizeGuidance(bodyPart: string, size: TattooSize): SizeGuidance {
  // Normalize body part for matching
  const normalizedBodyPart = bodyPart.toLowerCase().trim();
  
  // Find the best matching body part category
  if (normalizedBodyPart.includes('ankle') || normalizedBodyPart.includes('lower leg')) {
    return BODY_PART_SIZE_MAP.ankle[size];
  }
  
  if (normalizedBodyPart.includes('foot') || normalizedBodyPart.includes('toe')) {
    return BODY_PART_SIZE_MAP.foot[size];
  }
  
  if (normalizedBodyPart.includes('forearm') || normalizedBodyPart.includes('arm')) {
    return BODY_PART_SIZE_MAP.forearm[size];
  }
  
  // Add more body parts as needed...
  
  return BODY_PART_SIZE_MAP.default[size];
}

export function generateSizedPrompt(
  subject: string,
  style: string,
  bodyPart: string,
  color: string,
  size: TattooSize
): string {
  const sizeGuidance = getSizeGuidance(bodyPart, size);
  
  return `Using the provided image of a person, add a SINGLE realistic-looking tattoo. The tattoo is of a ${subject}. It should be in the ${style} style, located on the person's ${bodyPart}. The tattoo's color should be ${color}.

CRITICAL REQUIREMENTS:
- Add ONLY ONE tattoo - the one described above
- Do NOT add any other tattoos, markings, or body art anywhere else on the person
- Keep all existing skin clean and natural except for the single requested tattoo
- The tattoo should be ${sizeGuidance.dimensions} in size (${sizeGuidance.coverage})
- It should be positioned ${sizeGuidance.placement}
- DO NOT cover the entire visible body part - keep the tattoo appropriately sized as a ${size.toLowerCase()} tattoo
- The tattoo should look proportional to the body part, not overwhelming it
- Leave plenty of natural skin visible around the tattoo

Make sure ONLY the requested tattoo appears on the person. Do not add any additional tattoos or body art anywhere else.`;
}