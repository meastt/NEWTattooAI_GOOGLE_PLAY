import React, { useState, useCallback } from 'react';
import type { View, TattooStyle, TattooColor, TattooSize } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS, TATTOO_SIZES, TATTOO_SIZE_DESCRIPTIONS, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { generateSizedPrompt } from '../utils/tattooSizing';
import { editImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooTryOnProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

const TattooTryOn: React.FC<TattooTryOnProps> = ({ onNavigate, onUpgradeClick }) => {
  const [userImage, setUserImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [bodyPart, setBodyPart] = useState('');
  const [color, setColor] = useState<TattooColor>(TATTOO_COLORS[0]);
  const [size, setSize] = useState<TattooSize>(TATTOO_SIZES[1]); // Default to 'Small'
  const [prompt, setPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleImageReady = useCallback((base64: string, mimeType: string) => {
    setUserImage({ base64, mimeType });
    setResultImage(null);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userImage || !subject || !bodyPart) {
      setError("Please upload an image and fill out all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const generatedPrompt = generateSizedPrompt(subject, style, bodyPart, color, size);
    setPrompt(generatedPrompt);

    try {
      const result = await editImage(userImage.base64, userImage.mimeType, generatedPrompt);
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      } else {
        setError("The AI could not generate an image. Please try a different prompt or image.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (prompt: string, imageDataUrl: string) => {
    await saveIdea({ prompt, imageDataUrl });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in" style={{
      overflowX: 'hidden',
      maxWidth: '100%',
      minHeight: '100vh',
      paddingBottom: '2rem'
    }}>
      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-electric-400">Try-On Mode</span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
          <span className="text-white neon-text-cyan">TATTOO TRY-ON</span>
        </h2>
        <p className="text-lg text-steel-400 max-w-xl mx-auto leading-relaxed">
          Preview your design on your own skin before committing to ink.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700 shadow-xl">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-void-700">
            <span className="font-display text-2xl text-electric-500/50">01</span>
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide">Your Photo</h3>
          </div>
          <ImageUploader onImageReady={handleImageReady} />
        </div>

        <form onSubmit={handleSubmit} className="bg-void-900/80 backdrop-blur-sm p-6 rounded-2xl border border-void-700 shadow-xl">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-void-700">
            <span className="font-display text-2xl text-magenta-500/50">02</span>
            <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide">Your Design</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="subject" className="block text-xs font-heading uppercase tracking-wider text-steel-400 mb-2">Tattoo Subject *</label>
              <textarea
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., A majestic lion with a crown"
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:ring-1 focus:ring-electric-500 focus:border-electric-500 transition-all duration-300 hover:border-electric-500/50 resize-none text-sm"
                rows={3}
                required
                onFocus={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
              />
            </div>
            <div>
              <label htmlFor="bodyPart" className="block text-xs font-heading uppercase tracking-wider text-steel-400 mb-2">Body Part *</label>
              <input
                type="text"
                id="bodyPart"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                placeholder="e.g., Left forearm"
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:ring-1 focus:ring-electric-500 focus:border-electric-500 transition-all duration-300 hover:border-electric-500/50 text-sm"
                required
                onFocus={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
              />
            </div>
            <div>
              <label htmlFor="size" className="block text-xs font-heading uppercase tracking-wider text-steel-400 mb-2">Size *</label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value as TattooSize)}
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white focus:ring-1 focus:ring-electric-500 focus:border-electric-500 transition-all duration-300 hover:border-electric-500/50 text-sm"
                required
                onFocus={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
              >
                {TATTOO_SIZES.map(s => (
                  <option key={s} value={s}>
                    {s} - {TATTOO_SIZE_DESCRIPTIONS[s]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-steel-500">
                Choose the size relative to your body part.
              </p>
            </div>
            <div>
              <label htmlFor="style" className="block text-xs font-heading uppercase tracking-wider text-steel-400 mb-2">Style</label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as TattooStyle)}
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white focus:ring-1 focus:ring-electric-500 focus:border-electric-500 transition-all duration-300 hover:border-electric-500/50 text-sm"
                onFocus={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
              >
                <optgroup label="Traditional & Classic">
                  <option value="American Traditional">American Traditional</option>
                  <option value="Japanese Irezumi">Japanese Irezumi</option>
                  <option value="Neo-Traditional">Neo-Traditional</option>
                  <option value="Traditional Sailor">Traditional Sailor</option>
                </optgroup>

                <optgroup label="Modern & Contemporary">
                  <option value="Fine Line">Fine Line</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Geometric">Geometric</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Sketch Style">Sketch Style</option>
                </optgroup>

                <optgroup label="Black & Bold">
                  <option value="Blackwork">Blackwork</option>
                  <option value="Tribal">Tribal</option>
                  <option value="Dotwork">Dotwork</option>
                  <option value="Ornamental">Ornamental</option>
                  <option value="Mandala">Mandala</option>
                </optgroup>

                <optgroup label="Realistic & Portrait">
                  <option value="Realism">Realism</option>
                  <option value="Photorealism">Photorealism</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Biomechanical">Biomechanical</option>
                </optgroup>

                <optgroup label="Text & Lettering">
                  <option value="Script/Cursive">Script/Cursive</option>
                  <option value="Old English">Old English</option>
                  <option value="Sans Serif">Sans Serif</option>
                  <option value="Serif/Roman">Serif/Roman</option>
                  <option value="Calligraphy">Calligraphy</option>
                  <option value="Gothic Lettering">Gothic Lettering</option>
                  <option value="Graffiti Style">Graffiti Style</option>
                  <option value="Hand Lettered">Hand Lettered</option>
                </optgroup>

                <optgroup label="Cultural & Spiritual">
                  <option value="Celtic">Celtic</option>
                  <option value="Norse/Viking">Norse/Viking</option>
                  <option value="Polynesian">Polynesian</option>
                  <option value="Aztec/Mayan">Aztec/Mayan</option>
                  <option value="Hindu/Buddhist">Hindu/Buddhist</option>
                  <option value="Chinese">Chinese</option>
                </optgroup>

                <optgroup label="Artistic & Unique">
                  <option value="Surrealism">Surrealism</option>
                  <option value="Pop Art">Pop Art</option>
                  <option value="Comic Book">Comic Book</option>
                  <option value="Gothic">Gothic</option>
                  <option value="Art Nouveau">Art Nouveau</option>
                  <option value="Chicano">Chicano</option>
                </optgroup>

                <optgroup label="Fun & Playful">
                  <option value="Cartoon">Cartoon</option>
                  <option value="Anime/Manga">Anime/Manga</option>
                  <option value="Retro/Vintage">Retro/Vintage</option>
                  <option value="Pin-Up">Pin-Up</option>
                  <option value="Kawaii/Cute">Kawaii/Cute</option>
                </optgroup>
              </select>
              <p className="mt-2 text-xs text-steel-500">
                {TATTOO_STYLE_DESCRIPTIONS[style]}
              </p>
            </div>
            <div>
              <label htmlFor="color" className="block text-xs font-heading uppercase tracking-wider text-steel-400 mb-2">Color</label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value as TattooColor)}
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white focus:ring-1 focus:ring-electric-500 focus:border-electric-500 transition-all duration-300 hover:border-electric-500/50 text-sm"
                onFocus={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    const header = document.querySelector('header');
                    const nav = document.querySelector('nav');
                    if (header) header.style.transform = 'translateZ(0)';
                    if (nav) nav.style.transform = 'translateZ(0)';
                  }, 100);
                }}
              >
                {TATTOO_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading || !userImage}
              className="w-full bg-gradient-to-r from-electric-500 to-magenta-500 hover:from-electric-400 hover:to-magenta-400 text-white font-heading uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 disabled:bg-void-700 disabled:text-steel-500 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg hover:shadow-neon-dual disabled:shadow-none relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                  <span className="animate-pulse text-sm">Generating Preview...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Visualize Tattoo</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <ResultDisplay
        isLoading={isLoading}
        error={error}
        resultImage={resultImage}
        prompt={prompt}
        onSave={handleSave}
        onUpgradeClick={onUpgradeClick}
        loadingText="Applying your virtual tattoo... This can take a moment."
        initialText="Your virtual tattoo preview will appear here."
      />

      {(!isLoading && (resultImage || error)) && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-void-800 border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-sm rounded-xl transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Create
          </button>
        </div>
      )}
    </div>
  );
};

export default TattooTryOn;