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

  // Style-specific guidance
  const styleGuidance = {
    'Traditional': 'Bold, clean outlines with solid color fills and minimal shading. Classic tattoo aesthetic.',
    'Realism': 'Photo-realistic detail with smooth gradients, fine shading, and lifelike depth.',
    'Watercolor': 'Soft edges, color splashes, and minimal outlines. Artistic, painterly effect.',
    'Geometric': 'Precise lines, perfect symmetry, and sharp angles. Mathematical precision.',
    'Tribal': 'Bold black lines forming flowing patterns. Strong contrast and negative space.',
    'Japanese': 'Traditional irezumi style with bold outlines, vibrant colors, and flowing composition.',
    'Minimalist': 'Simple, clean lines with minimal detail. Elegant and understated.',
    'Blackwork': 'Solid black ink with strong contrast. Bold and graphic.',
  }[style] || `${style} style with appropriate techniques and aesthetics`;

  return `STRICT INSTRUCTION: EDIT THE INPUT IMAGE. DO NOT GENERATE A NEW IMAGE.
You are an expert tattoo artist and photo editor. Your task is to digitally INK the requested tattoo onto the user's photo.

CRITICAL: PRESERVE THE ORIGINAL IMAGE.
- Keep the original arm/body part, angle, lighting, skin tone, and background EXACTLY as they are.
- Do NOT replace the body part with a generic one.
- Do NOT change the camera angle or zoom.
- ONLY add the tattoo ink to the skin.

INPUT:
- Image: A photo of a person.
- Request: Add a "${size.toLowerCase()}" tattoo of "${subject}" in "${style}" style on the "${bodyPart}".
- Color: ${color}.

STEP-BY-STEP INSTRUCTIONS:

1. ANALYZE the body part (${bodyPart}) in the image:
   - Identify the exact skin tone, lighting direction, and shadow patterns.
   - Note the body part's curvature, muscle contours, and bone structure.
   - Observe skin texture details (pores, fine lines, freckles, blemishes).
   - Account for any flexion or movement that affects the surface.

2. DESIGN the tattoo ("${subject}") for this specific placement:
   - Style: ${styleGuidance}
   - Size: ${sizeGuidance.dimensions} (${sizeGuidance.coverage}).
   - Placement: ${sizeGuidance.placement}.
   - Ensure the design is appropriate for the body part's shape and size.

3. INK CHARACTERISTICS:
   - Color: ${color === 'Black and Gray' ? 'Use pure black with gray wash shading. No color.' : color === 'Color' ? 'Use vibrant, saturated colors appropriate for fresh tattoo ink.' : color}.
   - Depth: The tattoo must appear embedded in the dermis layer, not painted on the surface.
   - Texture: Match the ink to the skin's natural texture—it should follow pores and fine lines.
   - Finish: Keep the tattoo matte with subtle highlights only where skin naturally reflects light.

4. SKIN TEXTURE INTEGRATION:
   - The tattoo ink must appear UNDER the skin's surface layer, not floating on top.
   - Preserve the skin's natural texture (pores, fine lines) over the tattoo area.
   - For a fresh tattoo look: Keep edges crisp and colors vibrant.
   - Ensure the tattoo follows every contour, wrinkle, and fold of the skin.

5. COMPOSITE the tattoo onto the skin:
   - Warp the design to follow the body's exact curvature and anatomy.
   - Apply the scene's lighting and shadows to the tattoo so it integrates seamlessly.
   - The tattoo should be affected by the same light source as the rest of the body.
   - Adjust the tattoo's appearance based on skin stretching, bending, or flexing.

6. FINAL QUALITY CHECK:
   - Is the original photo preserved? (CRITICAL)
   - Is there EXACTLY ONE tattoo?
   - Is it on the correct body part (${bodyPart})?
   - Does it match the requested size (${size})?
   - Does the style match (${style})?
   - Is the rest of the image completely unchanged?
   - Does the tattoo look like it's IN the skin, not ON the skin?

CRITICAL CONSTRAINTS (NEGATIVE PROMPT):
- NO generating a new image.
- NO changing the person's pose, body type, or background.
- NO extra tattoos anywhere on the body.
- NO text unless explicitly part of the subject description.
- NO nudity or inappropriate content.
- NO covering the entire body part if the size is "Small" or "Medium".
- NO floating or painted-on appearance—the tattoo must be embedded in the skin.
- NO unrealistic colors or glowing effects.

OUTPUT:
Return the ORIGINAL image with the single, photorealistic tattoo seamlessly integrated into the skin.`;
}