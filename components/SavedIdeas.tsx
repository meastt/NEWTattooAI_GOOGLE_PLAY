import React, { useState, useEffect } from 'react';
import { getSavedIdeas } from '../services/tattooService';
import type { View, Idea } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ExportIcon } from './icons/ExportIcon';
import ContentReportModal from './ContentReportModal';
import { submitContentReport } from '../services/reportingService';

interface SavedIdeasProps {
  onNavigate: (view: View) => void;
}

import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

// ... existing imports

const SavedIdeas: React.FC<SavedIdeasProps> = ({ onNavigate }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // For lightbox
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingContentId, setReportingContentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const savedIdeas = await getSavedIdeas();
        setIdeas(savedIdeas);
      } catch (err) {
        setError('Failed to fetch your saved ideas.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const handleExportClick = async (idea: Idea) => {
    const imageSrc = idea.imageDataUrl || idea.image_data_url;
    if (!imageSrc) return;

    try {
      // If it's a base64 string, we need to write it to a file first to share it properly on some platforms,
      // or use the base64 directly if supported. Capacitor Share supports sharing files via URI.
      // Since we already have the file saved locally (idea.imagePath), we can try to get the full URI.

      // However, for simplicity and cross-platform compatibility with base64 data:
      // We will write to a temporary file in the cache directory and share that.

      const fileName = `share_${Date.now()}.png`;

      // Strip the data URL prefix to get just the base64 data
      const base64Data = imageSrc.includes(',') ? imageSrc.split(',')[1] : imageSrc;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'My Tattoo Design',
        text: 'Check out this tattoo design I created with InkPreview!',
        url: savedFile.uri,
        dialogTitle: 'Share your design',
      });

    } catch (error) {
      console.error('Failed to share:', error);
      // Fallback: try web share or download
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], 'tattoo-design.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
        } else {
          throw new Error('Web share not supported');
        }
      } catch (e) {
        // Final fallback: download
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = 'tattoo-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleReportClick = (ideaId: string) => {
    setReportingContentId(ideaId);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reason: string, additionalInfo: string) => {
    await submitContentReport(reason, additionalInfo, 'saved', reportingContentId || undefined);
    setReportingContentId(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10 relative">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="absolute left-0 top-0 p-2 text-steel-400 hover:text-white transition-colors z-10"
          aria-label="Back to Home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
          <span className="text-xs font-heading uppercase tracking-wider text-electric-400">Collection</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase mb-3">
          <span className="text-white neon-text-cyan">SAVED IDEAS</span>
        </h1>
        <p className="text-lg text-steel-400 max-w-xl mx-auto leading-relaxed">
          Your personal archive of generated tattoo designs.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="relative">
            <div className="w-14 h-14 border-2 border-void-600 rounded-full animate-spin border-t-electric-500"></div>
            <div className="absolute inset-0 w-14 h-14 border-2 border-transparent rounded-full animate-ping border-t-magenta-500/30"></div>
          </div>
          <p className="mt-4 text-steel-400 font-medium text-sm">Loading collection...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-6 rounded-xl bg-red-500/10 border border-red-500/30 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && ideas.length === 0 && (
        <div className="text-center p-10 bg-void-900/80 backdrop-blur-sm rounded-2xl border border-void-700 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-void-800 border border-void-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-steel-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-heading text-lg uppercase tracking-wider text-white mb-2">Empty Collection</p>
          <p className="text-steel-400 text-sm mb-6">Start creating designs to build your archive.</p>
          <button
            onClick={() => onNavigate('create')}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-electric-500 to-magenta-500 rounded-xl font-heading uppercase tracking-wider text-sm text-white hover:shadow-neon-dual transition-all duration-300 hover:scale-105 group"
          >
            <span>Start Creating</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}

      {!isLoading && !error && ideas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ideas.map((idea, index) => (
            <SavedIdeaCard
              key={idea.id}
              idea={idea}
              index={index}
              onExport={handleExportClick}
              onImageClick={(img) => setSelectedImage(img)}
              onReport={() => handleReportClick(idea.id.toString())}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Find the idea associated with this image to share it
                const idea = ideas.find(i => (i.imageDataUrl || i.image_data_url) === selectedImage);
                if (idea) {
                  console.log('Sharing from lightbox:', idea.id);
                  handleExportClick(idea);
                } else {
                  console.error('Could not find idea for image in lightbox');
                }
              }}
              className="text-electric-400 hover:text-electric-300 transition-colors p-2 rounded-full hover:bg-white/10"
              title="Share"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              className="text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <img
            src={selectedImage}
            alt="Full screen view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}

      {/* Content Report Modal */}
      <ContentReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportingContentId(null);
        }}
        onSubmit={handleReportSubmit}
        contentType="saved"
      />
    </div>
  );
};

const SavedIdeaCard: React.FC<{
  idea: Idea;
  index: number;
  onExport: (idea: Idea) => void;
  onImageClick: (imageSrc: string) => void;
  onReport: () => void;
}> = ({ idea, index, onExport, onImageClick, onReport }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  // Handle both property names for backward compatibility
  const imageSrc = idea.imageDataUrl || idea.image_data_url;

  return (
    <div
      className="group relative bg-void-900 rounded-xl overflow-hidden border border-void-700 hover:border-electric-500/50 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => imageSrc && onImageClick(imageSrc)}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-void-950 relative cursor-pointer">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Tattoo design"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-steel-500">
            <span className="text-xs">Image not found</span>
          </div>
        )}

        {/* Prompt Overlay (Hidden by default) */}
        {showPrompt && (
          <div className="absolute inset-0 bg-void-950/90 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center animate-fade-in z-20 cursor-default" onClick={(e) => e.stopPropagation()}>
            <p className="text-white text-xs leading-relaxed overflow-y-auto max-h-full scrollbar-hide">
              {idea.prompt}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPrompt(false);
              }}
              className="mt-3 text-electric-400 text-xs font-bold uppercase tracking-wider hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Overlay actions - Always visible on mobile, gradient background for readability */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void-950 via-void-950/80 to-transparent p-3 flex items-end justify-between gap-2 z-10 pointer-events-none h-24">
        <div className="flex gap-2 w-full pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExport(idea);
            }}
            className="flex-1 bg-electric-500/20 border border-electric-500/30 hover:border-electric-500/50 text-electric-400 hover:text-electric-300 font-heading uppercase tracking-wider text-[10px] py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1"
          >
            <ExportIcon />
            <span>Share</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPrompt(!showPrompt);
            }}
            className="w-8 h-8 bg-void-800/80 border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300"
            title="View Prompt"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onReport();
            }}
            className="w-8 h-8 bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center transition-all duration-300"
            title="Report content"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-electric-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default SavedIdeas;