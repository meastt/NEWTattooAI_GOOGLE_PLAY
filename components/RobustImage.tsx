import React, { useState, useEffect } from 'react';

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

      // Clean the URL
      let cleanedUrl = originalUrl;
      cleanedUrl = cleanedUrl.replace(/[\r\n]/g, '').trim();
      cleanedUrl = cleanedUrl.replace(/\s+/g, '%20');
      cleanedUrl = cleanedUrl.replace(/%20+/g, '%20');
      
      // Test if the cleaned URL works
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
        // Continue to next strategy
      }

      // Try variations of the filename
      const variations = [
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
          // Continue to next variation
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