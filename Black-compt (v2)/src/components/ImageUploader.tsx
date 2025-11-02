import { useState, useCallback } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  currentImage?: string;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, currentImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageSelect(file, e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onImageSelect(file, e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageSelect]);

  return (
    <div className="w-full">
      {currentImage ? (
        <div className="group relative rounded-2xl border-2 border-white/10 overflow-hidden glass-effect-light shadow-lg">
          <img 
            src={currentImage} 
            alt="Design preview" 
            className="w-full h-auto max-h-[400px] object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
            transition-all duration-300 glass-effect-light
            ${isDragging 
              ? 'border-purple-500/50 bg-purple-500/10 glow-purple scale-[1.02]' 
              : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <Image className="h-10 w-10 text-purple-400" />
            </div>
            <div className="space-y-2">
              <p className="text-white">
                Arrastra una imagen de diseño aquí
              </p>
              <p className="text-gray-500 text-sm">
                o haz clic para seleccionar
              </p>
              <p className="text-gray-600 text-xs mt-3">
                PNG, JPG, SVG • Hasta 10MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
