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

  return `You are an expert tattoo artist and photo editor. Your task is to realistically visualize a tattoo on a person's body.

INPUT:
- Image: A photo of a person.
- Request: Add a "${size.toLowerCase()}" tattoo of a "${subject}" in "${style}" style on the "${bodyPart}".
- Color: ${color}.

STEP-BY-STEP INSTRUCTIONS:
1. ANALYZE the body part (${bodyPart}) in the image. Identify the skin tone, lighting, shadows, and curvature.
2. DESIGN the tattoo ("${subject}") specifically for this placement.
   - Style: ${style} (Ensure the linework and shading match this style).
   - Size: ${sizeGuidance.dimensions} (${sizeGuidance.coverage}).
   - Placement: ${sizeGuidance.placement}.
3. COMPOSITE the tattoo onto the skin.
   - Warp the design to follow the body's curvature.
   - Apply the skin's lighting and shadows to the tattoo so it looks like it's IN the skin, not floating on top.
   - Adjust opacity slightly to mimic healed ink if appropriate for the style, or keep it vibrant for fresh ink.
4. FINAL CHECK:
   - Is there ONLY ONE tattoo?
   - Is it on the correct body part?
   - Is the rest of the image unchanged?

CRITICAL CONSTRAINTS (NEGATIVE PROMPT):
- NO extra tattoos.
- NO changes to the person's face, clothes, or background.
- NO text unless explicitly asked for in the subject.
- NO nudity or inappropriate content.
- DO NOT cover the entire body part if the size is "Small" or "Medium".

OUTPUT:
Return the modified image with the single tattoo applied.`;
}