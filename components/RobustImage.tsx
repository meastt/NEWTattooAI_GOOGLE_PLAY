import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface RobustImageProps {
  originalUrl: string;
  alt: string;
  className?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const RobustImage: React.FC<RobustImageProps> = ({ 
  originalUrl, 
  alt, 
  className = '', 
  onLoad, 
  onError 
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!originalUrl) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      // Strategy 1: Try the cleaned URL directly
      let cleanedUrl = originalUrl;
      cleanedUrl = cleanedUrl.replace(/[\r\n]/g, '').trim();
      cleanedUrl = cleanedUrl.replace(/a_t%20attoo/g, 'a_tattoo');
      cleanedUrl = cleanedUrl.replace(/\s+/g, '%20');
      cleanedUrl = cleanedUrl.replace(/%20+/g, '%20');
      
      // Test if the cleaned URL works (silently)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(cleanedUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setCurrentSrc(cleanedUrl);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Continue to next strategy (errors expected and handled silently)
      }

      // Strategy 2: Try to create a signed URL
      try {
        const url = new URL(cleanedUrl);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const decodedFileName = decodeURIComponent(fileName);
        
        const { data: signedData, error: signedError } = await supabase.storage
          .from('gallery-images')
          .createSignedUrl(decodedFileName, 60 * 60);
          
        if (!signedError && signedData?.signedUrl) {
          setCurrentSrc(signedData.signedUrl);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        // Continue to next strategy
      }

      // Strategy 3: Try variations of the filename
      const variations = [
        cleanedUrl.replace(/a_t%20attoo/g, 'a_tattoo'),
        cleanedUrl.replace(/a_tattoo/g, 'a_t%20attoo'),
        cleanedUrl.replace(/%20/g, ''),
        cleanedUrl.replace(/%20/g, '_'),
        cleanedUrl.replace(/\s+/g, ''),
      ];

      for (const variation of variations) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(variation, { 
            method: 'HEAD',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            setCurrentSrc(variation);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          // Continue to next variation (errors expected and handled silently)
        }
      }

      // All strategies failed
      setHasError(true);
      setIsLoading(false);
    };

    loadImage();
  }, [originalUrl]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(false);
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(e);
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (hasError || !currentSrc) {
    return (
      <div className={`bg-gray-100 ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          <div className="text-center">
            <div>Image unavailable</div>
            <div className="text-xs mt-1 opacity-70">{alt}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default RobustImage;