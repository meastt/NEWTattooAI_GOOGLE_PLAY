import React, { useState } from 'react';
import type { View, TattooStyle, TattooColor } from '../types';
import { TATTOO_STYLES, TATTOO_COLORS, TATTOO_STYLE_DESCRIPTIONS } from '../constants';
import { generateImage } from '../services/geminiService';
import { saveIdea } from '../services/tattooService';
import LoadingSpinner from './LoadingSpinner';
import ResultDisplay from './ResultDisplay';

interface TattooGeneratorProps {
  onNavigate: (view: View) => void;
  onUpgradeClick?: () => void;
}

const TattooGenerator: React.FC<TattooGeneratorProps> = ({ onNavigate, onUpgradeClick }) => {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [color, setColor] = useState<TattooColor>(TATTOO_COLORS[1]);
  const [details, setDetails] = useState('');
  const [prompt, setPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      setError("Please provide a subject for the tattoo.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    const generatedPrompt = `A tattoo design of a ${subject}. The style should be ${style}, ${color}. Additional details: ${details}. The design should be on a clean, white background.`;
    setPrompt(generatedPrompt);

    try {
      const imageUrl = await generateImage(generatedPrompt);
      setResultImage(imageUrl);
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
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-electric-400">AI Generator</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
          <span className="text-white neon-text-cyan">IDEA</span>
          <span className="text-electric-400"> GENERATOR</span>
        </h1>
        <p className="text-lg text-steel-400 max-w-xl mx-auto leading-relaxed">
          Describe your vision and let AI craft unique tattoo designs.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-void-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-void-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Subject */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-electric-500/50 text-lg">01</span>
              <label htmlFor="subject" className="font-heading text-sm uppercase tracking-wider text-steel-300">
                Main Subject *
              </label>
            </div>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., A celestial wolf howling at a geometric moon"
              className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:outline-none focus:border-electric-500/50 transition-all duration-300"
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

          {/* Style and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-electric-500/50 text-lg">02</span>
                <label htmlFor="style" className="font-heading text-sm uppercase tracking-wider text-steel-300">
                  Style
                </label>
              </div>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value as TattooStyle)}
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white focus:outline-none focus:border-electric-500/50 transition-all duration-300"
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
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-magenta-500/50 text-lg">03</span>
                <label htmlFor="color" className="font-heading text-sm uppercase tracking-wider text-steel-300">
                  Color
                </label>
              </div>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value as TattooColor)}
                className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white focus:outline-none focus:border-magenta-500/50 transition-all duration-300"
              >
                {TATTOO_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-electric-500/50 text-lg">04</span>
              <label htmlFor="details" className="font-heading text-sm uppercase tracking-wider text-steel-300">
                Additional Details
              </label>
            </div>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g., with swirling galaxy patterns in its fur, surrounded by constellations"
              className="w-full bg-void-800 border border-void-600 rounded-xl p-4 text-white placeholder-steel-500 focus:outline-none focus:border-electric-500/50 transition-all duration-300 resize-none"
              rows={4}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-electric-500 to-magenta-500 hover:shadow-neon-dual text-white font-heading uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                <span>Generating Design...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Design</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>

      <ResultDisplay
        isLoading={isLoading}
        error={error}
        resultImage={resultImage}
        prompt={prompt}
        onSave={handleSave}
        onUpgradeClick={onUpgradeClick}
        loadingText="Generating your unique tattoo design... This may take a few moments."
        initialText="Your generated tattoo design will appear here."
      />

      {(!isLoading && (resultImage || error)) && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-2 bg-void-800 border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-sm py-3 px-6 rounded-xl transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Create Hub</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TattooGenerator;