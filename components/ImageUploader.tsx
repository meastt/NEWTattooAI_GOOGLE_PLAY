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
      <div className="w-full h-64 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
        {preview && <img src={preview} alt="Preview" className="h-full w-full object-contain" />}
        {isCameraOpen && <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover"></video>}
        {!preview && !isCameraOpen && <span className="text-slate-500">Image Preview</span>}
      </div>
       <canvas ref={canvasRef} style={{ display: 'none' }} />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {isCameraOpen ? (
         <button onClick={takePicture} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <CameraIcon />
            <span>Take Picture</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full">
            <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <input type="file" accept="image/png, image/jpeg, image/webp" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={triggerFileSelect} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <UploadIcon />
                <span>Upload</span>
            </button>
            <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <CameraIcon />
                <span>Camera</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;