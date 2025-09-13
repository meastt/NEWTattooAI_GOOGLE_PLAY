import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getGalleryIdeas } from '../services/tattooService';
import type { Idea } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ImageDiagnostic from './ImageDiagnostic';

const Home: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duplicatedIdeas, setDuplicatedIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const galleryIdeas = await getGalleryIdeas();
        console.log('Gallery ideas fetched:', galleryIdeas);
        console.log('Number of ideas:', galleryIdeas.length);
        galleryIdeas.forEach((idea, index) => {
          console.log(`Idea ${index}:`, { id: idea.id, image_url: idea.image_url, prompt: idea.prompt });
        });
        
        if (galleryIdeas.length === 0) {
            setError('Could not load inspiration gallery. The database may be offline or empty.');
        } else {
            setIdeas(galleryIdeas);
            // Create multiple copies for continuous scrolling
            const multipliedIdeas = [];
            for (let i = 0; i < 3; i++) {
              multipliedIdeas.push(...galleryIdeas.map((idea, index) => ({ 
                ...idea, 
                id: `${idea.id}_${i}_${index}` 
              })));
            }
            setDuplicatedIdeas(multipliedIdeas);
        }
      } catch (err) {
        console.error('Error in fetchIdeas:', err);
        setError('Failed to fetch gallery ideas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdeas();
    
    // Diagnostic: Test if we can load Supabase images
    const testImageUrl = 'https://zflkdyuswpegqabkwlgw.supabase.co/storage/v1/object/public/gallery-images/Generated%20Image%20September%2005,%202025%20-%204_33PM.jpeg';
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    testImg.onload = () => {
      console.log('✅ Test image loaded successfully from Supabase storage');
      console.log('Test image dimensions:', testImg.width + 'x' + testImg.height);
    };
    testImg.onerror = (e) => {
      console.error('❌ Test image failed to load from Supabase storage');
      console.error('Error:', e);
      
      // Try without crossOrigin
      const testImg2 = new Image();
      testImg2.onload = () => {
        console.log('✅ Test image loaded WITHOUT crossOrigin attribute');
      };
      testImg2.onerror = () => {
        console.error('❌ Test image failed even without crossOrigin');
        
        // Check if it's a network issue
        fetch(testImageUrl, { method: 'HEAD' })
          .then(response => {
            console.log('Fetch test response:', response.status, response.statusText);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          })
          .catch(err => {
            console.error('Fetch test failed:', err);
          });
      };
      testImg2.src = testImageUrl;
    };
    testImg.src = testImageUrl;
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Temporary diagnostic component */}
      <ImageDiagnostic />
      {/* Hero Section */}
      <div className="text-center mb-6 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-ink-500/10 to-neon-500/10 rounded-full blur-3xl" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-600 via-ink-500 to-neon-500">
            Inspiration
          </span>
          <br />
          <span className="text-slate-900 dark:text-white">Gallery</span>
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-3">
          Discover unique designs crafted by AI to spark your next tattoo idea.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">AI Generated</span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">Unique Designs</span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">Multiple Styles</span>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-32">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-ink-200 dark:border-ink-800 rounded-full animate-spin border-t-ink-500 dark:border-t-ink-400"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-neon-500/30"></div>
          </div>
          <p className="mt-3 text-slate-600 dark:text-slate-400 font-medium">Loading inspiration...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="gallery-showcase">
          <div className="gallery-track">
            {/* First set of images */}
            {ideas.map((idea, index) => (
              <div key={`first-${idea.id}`} className="gallery-card">
                <div className="card-inner">
                  <img 
                    src={idea.image_url} 
                    alt={idea.prompt || "Tattoo inspiration"} 
                    className="card-image"
                    loading="lazy"
                    onLoad={(e) => {
                      console.log(`✅ Image loaded successfully: ${idea.image_url}`);
                      console.log('Image dimensions:', (e.target as HTMLImageElement).naturalWidth + 'x' + (e.target as HTMLImageElement).naturalHeight);
                    }}
                    onError={(e) => {
                      console.error(`❌ Image failed to load: ${idea.image_url}`);
                      console.log('Error event:', e);
                      
                      const img = e.target as HTMLImageElement;
                      console.log('Current src:', img.src);
                      console.log('Complete:', img.complete);
                      console.log('Natural width:', img.naturalWidth);
                      
                      // Attempt fallback resolution from Supabase Storage
                      (async () => {
                        try {
                          const parseStorageUrl = (urlStr: string) => {
                            try {
                              const u = new URL(urlStr);
                              const marker = '/storage/v1/object/public/';
                              const idx = u.pathname.indexOf(marker);
                              if (idx !== -1) {
                                const remainder = u.pathname.slice(idx + marker.length);
                                const parts = remainder.split('/');
                                const bucket = parts.shift() as string;
                                const objectPath = decodeURIComponent(parts.join('/'));
                                return { bucket, objectPath };
                              }
                            } catch (_) {}
                            return null;
                          };
                          const parsed = idea.image_url ? parseStorageUrl(idea.image_url) : null;
                          if (!parsed) {
                            throw new Error('Could not parse storage URL for fallback');
                          }
                          // Try signed URL first
                          const { data: signed, error: signErr } = await supabase.storage
                            .from(parsed.bucket)
                            .createSignedUrl(parsed.objectPath, 60 * 60);
                          if (!signErr && signed?.signedUrl) {
                            console.log('Using signed URL fallback for image:', parsed.objectPath);
                            img.src = signed.signedUrl;
                            return;
                          }
                          // Fallback to direct download -> blob URL
                          const { data: blob, error: dlErr } = await supabase.storage
                            .from(parsed.bucket)
                            .download(parsed.objectPath);
                          if (dlErr || !blob) {
                            throw dlErr || new Error('Download returned no data');
                          }
                          const objectUrl = URL.createObjectURL(blob);
                          console.log('Using blob URL fallback for image:', parsed.objectPath);
                          img.src = objectUrl;
                        } catch (fallbackErr) {
                          console.warn('Gallery fallback failed:', fallbackErr);
                          // Use SVG placeholder as final fallback
                          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="%239ca3af"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                          img.alt = idea.prompt || 'Image loading failed';
                        }
                      })();
                    }}
                  />
                  <div className="card-overlay" />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {ideas.map((idea, index) => (
              <div key={`second-${idea.id}`} className="gallery-card">
                <div className="card-inner">
                  <img 
                    src={idea.image_url} 
                    alt={idea.prompt || "Tattoo inspiration"} 
                    className="card-image"
                    loading="lazy"
                    onLoad={(e) => {
                      console.log(`✅ Image loaded successfully (duplicate): ${idea.image_url}`);
                      console.log('Image dimensions:', (e.target as HTMLImageElement).naturalWidth + 'x' + (e.target as HTMLImageElement).naturalHeight);
                    }}
                    onError={(e) => {
                      console.error(`❌ Image failed to load (duplicate): ${idea.image_url}`);
                      console.log('Error event:', e);
                      
                      const img = e.target as HTMLImageElement;
                      console.log('Current src:', img.src);
                      console.log('Complete:', img.complete);
                      console.log('Natural width:', img.naturalWidth);
                      
                      (async () => {
                        try {
                          const parseStorageUrl = (urlStr: string) => {
                            try {
                              const u = new URL(urlStr);
                              const marker = '/storage/v1/object/public/';
                              const idx = u.pathname.indexOf(marker);
                              if (idx !== -1) {
                                const remainder = u.pathname.slice(idx + marker.length);
                                const parts = remainder.split('/');
                                const bucket = parts.shift() as string;
                                const objectPath = decodeURIComponent(parts.join('/'));
                                return { bucket, objectPath };
                              }
                            } catch (_) {}
                            return null;
                          };
                          const parsed = idea.image_url ? parseStorageUrl(idea.image_url) : null;
                          if (!parsed) {
                            throw new Error('Could not parse storage URL for fallback');
                          }
                          const { data: signed, error: signErr } = await supabase.storage
                            .from(parsed.bucket)
                            .createSignedUrl(parsed.objectPath, 60 * 60);
                          if (!signErr && signed?.signedUrl) {
                            console.log('Using signed URL fallback for image (duplicate):', parsed.objectPath);
                            img.src = signed.signedUrl;
                            return;
                          }
                          const { data: blob, error: dlErr } = await supabase.storage
                            .from(parsed.bucket)
                            .download(parsed.objectPath);
                          if (dlErr || !blob) {
                            throw dlErr || new Error('Download returned no data');
                          }
                          const objectUrl = URL.createObjectURL(blob);
                          console.log('Using blob URL fallback for image (duplicate):', parsed.objectPath);
                          img.src = objectUrl;
                        } catch (fallbackErr) {
                          console.warn('Gallery fallback (duplicate) failed:', fallbackErr);
                          // Use SVG placeholder as final fallback
                          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="%239ca3af"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                          img.alt = idea.prompt || 'Image loading failed';
                        }
                      })();
                    }}
                  />
                  <div className="card-overlay" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style>{`
        .gallery-showcase {
          height: 320px;
          overflow: hidden;
          position: relative;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gallery-track {
          display: flex;
          gap: 20px;
          padding: 20px;
          animation: slideLeft 60s linear infinite;
          will-change: transform;
        }

        .gallery-card {
          flex-shrink: 0;
          width: 280px;
          height: 280px;
          position: relative;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .dark .card-inner {
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.1) 0%,
            rgba(236, 72, 153, 0.1) 50%,
            rgba(59, 130, 246, 0.1) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-card:hover .card-inner {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .dark .gallery-card:hover .card-inner {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        }

        .gallery-card:hover .card-overlay {
          opacity: 1;
        }

        .gallery-card:hover .card-image {
          transform: scale(1.05);
        }

        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover */
        .gallery-showcase:hover .gallery-track {
          animation-play-state: paused;
        }

        /* iPad specific optimizations */
        @media (min-width: 768px) and (max-width: 1024px) {
          .gallery-showcase {
            height: 400px;
          }
          
          .gallery-card {
            width: 320px;
            height: 320px;
          }
          
          .gallery-track {
            gap: 24px;
            padding: 24px;
            animation-duration: 80s;
          }
        }

        /* Large iPad Pro (1366px wide) */
        @media (min-width: 1024px) and (max-width: 1366px) {
          .gallery-showcase {
            height: 450px;
          }
          
          .gallery-card {
            width: 360px;
            height: 360px;
          }
          
          .gallery-track {
            gap: 28px;
            padding: 28px;
            animation-duration: 90s;
          }
        }

        /* Mobile phone adjustments */
        @media (max-width: 640px) {
          .gallery-showcase {
            height: 260px;
          }
          
          .gallery-card {
            width: 220px;
            height: 220px;
          }
          
          .gallery-track {
            gap: 16px;
            padding: 16px;
            animation-duration: 45s;
          }
        }

        @media (max-width: 480px) {
          .gallery-showcase {
            height: 220px;
          }
          
          .gallery-card {
            width: 200px;
            height: 200px;
          }
          
          .gallery-track {
            gap: 12px;
            animation-duration: 40s;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;