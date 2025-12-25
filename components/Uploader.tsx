
import React, { useCallback } from 'react';
import { Upload, Camera, FileImage, X } from 'lucide-react';

interface UploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onUpload, isLoading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [onUpload]);

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center cursor-pointer
        ${isLoading ? 'bg-slate-50 border-blue-200' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'}`}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      
      <div className={`p-4 rounded-full transition-transform duration-300 group-hover:scale-110 
        ${isLoading ? 'bg-blue-100 animate-pulse' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
        <Upload className="w-8 h-8 text-blue-600" />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-800">Choose Image</h3>
        <p className="text-slate-500 mt-1">Select a clear photo of your Sindhi notes</p>
      </div>

      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <FileImage className="w-4 h-4" />
          <span>Image Scan</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Camera className="w-4 h-4" />
          <span>High Accuracy</span>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="space-y-1">
              <p className="font-bold text-blue-600">Analyzing image...</p>
              <p className="text-sm text-slate-500">Extracting text and creating paper layout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
