import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  onImageReady: (base64: string, mimeType: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    stopCamera();
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) {
          setError("File is too large. Please select an image under 4MB.");
          return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageReady(base64String.split(',')[1], file.type);
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    if (isCameraOpen) {
        stopCamera();
        return;
    }
    
    // On iOS, use native camera via file input instead of getUserMedia
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      triggerCameraInput();
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setError(null);
        setPreview(null);
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        onImageReady(dataUrl.split(',')[1], 'image/jpeg');
        stopCamera();
      }
    }
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();
  
  const triggerCameraInput = () => cameraInputRef.current?.click();

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full h-56 bg-void-800 rounded-xl border border-void-600 border-dashed flex items-center justify-center overflow-hidden relative group">
        {preview && <img src={preview} alt="Preview" className="h-full w-full object-contain" />}
        {isCameraOpen && <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover"></video>}
        {!preview && !isCameraOpen && (
          <div className="flex flex-col items-center text-steel-500">
            <div className="w-12 h-12 rounded-lg bg-void-700 flex items-center justify-center mb-2">
              <UploadIcon />
            </div>
            <span className="text-xs font-heading uppercase tracking-wider">Image Preview</span>
          </div>
        )}
        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-electric-500/30 rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-electric-500/30 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-electric-500/30 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-electric-500/30 rounded-br" />
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {error && (
        <div className="w-full px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {isCameraOpen ? (
        <button onClick={takePicture} className="w-full bg-magenta-500 hover:bg-magenta-400 text-white font-heading uppercase tracking-wider text-sm py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-neon-magenta">
          <CameraIcon />
          <span>Capture</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 w-full">
          <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/png, image/jpeg, image/webp" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={triggerFileSelect} className="bg-void-700 hover:bg-void-600 border border-void-600 hover:border-electric-500/50 text-steel-300 hover:text-white font-heading uppercase tracking-wider text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
            <UploadIcon />
            <span>Upload</span>
          </button>
          <button onClick={startCamera} className="bg-electric-500/20 hover:bg-electric-500/30 border border-electric-500/30 hover:border-electric-500/50 text-electric-400 hover:text-electric-300 font-heading uppercase tracking-wider text-xs py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
            <CameraIcon />
            <span>Camera</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;