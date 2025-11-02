import { useState, useCallback } from 'react';
import { FileUp, X, FileText, Files } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  size: number;
  type: string;
}

interface FileManagerProps {
  onFilesChange: (files: UploadedFile[]) => void;
  files: UploadedFile[];
}

export function FileManager({ onFilesChange, files }: FileManagerProps) {
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

  const processFiles = (fileList: FileList) => {
    // Sin límite de archivos - procesar todos
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            content: e.target.result as string,
            size: file.size,
            type: file.type,
          };
          onFilesChange([...files, newFile]);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      processFiles(fileList);
    }
  }, [files, onFilesChange]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      processFiles(fileList);
    }
  }, [files, onFilesChange]);

  const handleRemoveFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const handleClearAll = () => {
    onFilesChange([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 glass-effect-light
          ${isDragging 
            ? 'border-blue-500/50 bg-blue-500/10 glow-blue scale-[1.02]' 
            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept=".txt,.md,.json,.tsx,.ts,.jsx,.js,.css,.html,.xml,.yml,.yaml"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Files className="mx-auto h-12 w-12 text-blue-400 mb-3 transition-transform duration-300 hover:scale-110" />
        <p className="text-white mb-1">
          Arrastra archivos aquí o haz clic
        </p>
        <p className="text-gray-500 text-xs">
          Sin límites - Carga tantos archivos como necesites
        </p>
        <p className="text-gray-600 text-[11px] mt-2">
          Documentos, código fuente, guías, ejemplos, etc.
        </p>
      </div>

      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 bg-blue-500/10 border-blue-500/30">
                {files.length} archivo{files.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 bg-green-500/10 border-green-500/30">
                {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))} total
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-xs h-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              Limpiar todo
            </Button>
          </div>

          <ScrollArea className="h-[300px] rounded-xl border border-white/10 glass-effect-light p-3">
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/10"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-300"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
        <h4 className="text-xs text-green-300 mb-2 flex items-center gap-2">
          <FileUp className="h-3.5 w-3.5" />
          Procesamiento local inteligente
        </h4>
        <p className="text-[11px] text-green-200/80 leading-relaxed">
          Los archivos se procesan localmente para crear contexto sin saturar la API. 
          Puedes cargar documentación completa, múltiples ejemplos, guías de estilo y más.
        </p>
      </div>
    </div>
  );
}
