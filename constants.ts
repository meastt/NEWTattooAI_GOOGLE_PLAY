
import type { TattooStyle, TattooColor, TattooSize } from './types';

// Organized tattoo styles with categories for better user experience
export const TATTOO_STYLES: TattooStyle[] = [
  // Traditional & Classic
  'American Traditional',
  'Japanese Irezumi', 
  'Neo-Traditional',
  'Traditional Sailor',
  
  // Modern & Contemporary
  'Fine Line',
  'Minimalist',
  'Geometric',
  'Abstract',
  'Watercolor',
  'Sketch Style',
  
  // Black & Bold
  'Blackwork',
  'Tribal',
  'Dotwork', 
  'Ornamental',
  'Mandala',
  
  // Realistic & Portrait
  'Realism',
  'Photorealism',
  'Portrait',
  'Biomechanical',
  
  // Text & Lettering
  'Script/Cursive',
  'Old English',
  'Sans Serif',
  'Serif/Roman',
  'Calligraphy',
  'Gothic Lettering',
  'Graffiti Style',
  'Hand Lettered',
  
  // Cultural & Spiritual
  'Celtic',
  'Norse/Viking',
  'Polynesian',
  'Aztec/Mayan',
  'Hindu/Buddhist',
  'Chinese',
  
  // Artistic & Unique  
  'Surrealism',
  'Pop Art',
  'Comic Book',
  'Gothic',
  'Art Nouveau',
  'Chicano',
  
  // Fun & Playful
  'Cartoon',
  'Anime/Manga',
  'Retro/Vintage',
  'Pin-Up',
  'Kawaii/Cute',
];

export const TATTOO_COLORS: TattooColor[] = [
  'Full Color',
  'Black and Grey',
  'Outline Only',
];

export const TATTOO_SIZES: TattooSize[] = [
  'Tiny',
  'Small', 
  'Medium',
  'Large',
  'Extra Large',
];

// Size descriptions for user guidance
export const TATTOO_SIZE_DESCRIPTIONS = {
  'Tiny': '1-2 inches (coin size) - initials, small symbols',
  'Small': '2-4 inches (business card size) - simple designs, small animals', 
  'Medium': '4-7 inches (smartphone size) - detailed designs, portraits',
  'Large': '7-12 inches (tablet size) - statement pieces, large scenes',
  'Extra Large': '12+ inches (covers major body area) - full sleeves, back pieces'
};

// Style descriptions for user guidance
export const TATTOO_STYLE_DESCRIPTIONS: Record<TattooStyle, string> = {
  // Traditional & Classic
  'American Traditional': 'Bold outlines, solid colors, classic designs (anchors, roses, eagles)',
  'Japanese Irezumi': 'Traditional Japanese art with dragons, koi, cherry blossoms, waves',
  'Neo-Traditional': 'Modern twist on traditional with enhanced shading and color',
  'Traditional Sailor': 'Classic nautical themes - ships, anchors, pin-ups, swallows',
  
  // Modern & Contemporary
  'Fine Line': 'Delicate, thin lines with minimal shading - elegant and subtle',
  'Minimalist': 'Simple, clean designs with maximum impact using minimal elements',
  'Geometric': 'Sharp angles, patterns, and mathematical precision',
  'Abstract': 'Non-representational art focusing on form, color, and composition',
  'Watercolor': 'Painterly style with flowing colors and soft edges',
  'Sketch Style': 'Looks like pencil drawings with loose, artistic lines',
  
  // Black & Bold
  'Blackwork': 'Solid black ink designs, often covering large areas',
  'Tribal': 'Bold black patterns inspired by indigenous cultures',
  'Dotwork': 'Created entirely with dots - stippling technique',
  'Ornamental': 'Decorative patterns, lace-like designs, jewelry-inspired',
  'Mandala': 'Sacred geometric circles representing universe and spirituality',
  
  // Realistic & Portrait
  'Realism': 'Lifelike representations of people, animals, or objects',
  'Photorealism': 'Extremely detailed, photo-quality artwork',
  'Portrait': 'Realistic depictions of people, faces, and expressions',
  'Biomechanical': 'Fusion of organic and mechanical elements, cyborg-like',
  
  // Text & Lettering
  'Script/Cursive': 'Flowing, elegant cursive writing - classic for names and quotes',
  'Old English': 'Traditional blackletter style - bold, medieval-inspired lettering',
  'Sans Serif': 'Clean, modern fonts without decorative strokes - simple and readable',
  'Serif/Roman': 'Classic fonts with decorative strokes - timeless and elegant',
  'Calligraphy': 'Artistic, hand-drawn lettering with flourishes and style',
  'Gothic Lettering': 'Dark, ornate letters with dramatic flair and sharp edges',
  'Graffiti Style': 'Street art inspired lettering - bold, urban, and edgy',
  'Hand Lettered': 'Custom, artistic lettering designed specifically for tattoos',
  
  // Cultural & Spiritual
  'Celtic': 'Knots, crosses, and symbols from Celtic culture',
  'Norse/Viking': 'Runes, Norse mythology, Viking symbols and warriors',
  'Polynesian': 'Traditional Pacific Islander patterns with cultural meaning',
  'Aztec/Mayan': 'Ancient Mesoamerican symbols, gods, and geometric patterns',
  'Hindu/Buddhist': 'Sacred symbols, deities, lotus flowers, spiritual themes',
  'Chinese': 'Dragons, calligraphy, traditional symbols, feng shui elements',
  
  // Artistic & Unique
  'Surrealism': 'Dream-like, impossible imagery, Salvador Dalí inspired',
  'Pop Art': 'Bright colors, comic book style, Andy Warhol inspired',
  'Comic Book': 'Bold outlines, Ben Day dots, superhero and cartoon style',
  'Gothic': 'Dark, mysterious themes with medieval and horror elements',
  'Art Nouveau': 'Flowing, organic lines inspired by nature and decorative arts',
  'Chicano': 'Mexican-American culture, lowriders, religious imagery',
  
  // Fun & Playful
  'Cartoon': 'Animated characters, bright colors, playful designs',
  'Anime/Manga': 'Japanese animation style characters and themes',
  'Retro/Vintage': '1950s-80s nostalgia, pin-ups, old school Americana',
  'Pin-Up': 'Classic 1940s-50s glamour models and rockabilly style',
  'Kawaii/Cute': 'Japanese cute culture - adorable characters and pastel colors'
};
