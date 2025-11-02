import { useState } from 'react';
import { Image, FileCode, Upload, X, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';

interface ResourcePanelProps {
  onImageUpload: (file: File, preview: string) => void;
  onCSSUpload: (content: string, name: string) => void;
  currentImage?: string;
  currentCSS?: string;
  onClearImage?: () => void;
  onClearCSS?: () => void;
  onClose?: () => void;
  onGenerate?: () => void;
  canGenerate?: boolean;
  isGenerating?: boolean;
}

export function ResourcePanel({
  onImageUpload,
  onCSSUpload,
  currentImage,
  currentCSS,
  onClearImage,
  onClearCSS,
  onClose,
  onGenerate,
  canGenerate = true,
  isGenerating = false,
}: ResourcePanelProps) {
  const [cssInput, setCSSInput] = useState(currentCSS || '');
  const [dragActive, setDragActive] = useState(false);

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCSSPaste = () => {
    if (cssInput.trim()) {
      onCSSUpload(cssInput, 'styles.css');
    }
  };

  const handleCSSFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.css')) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setCSSInput(content);
        onCSSUpload(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-full flex flex-col glass-effect border-r border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white">Recursos</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="w-full glass-effect-light border border-white/10">
              <TabsTrigger value="image" className="flex-1">
                <Image className="h-4 w-4 mr-2" />
                Imagen
              </TabsTrigger>
              <TabsTrigger value="css" className="flex-1">
                <FileCode className="h-4 w-4 mr-2" />
                CSS
              </TabsTrigger>
            </TabsList>

            {/* Image Tab */}
            <TabsContent value="image" className="space-y-4 mt-4">
              {currentImage ? (
                <div className="space-y-3">
                  <div className="relative group rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={currentImage}
                      alt="Uploaded design"
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={onClearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="w-full justify-center bg-green-500/10 border-green-500/30">
                    Imagen cargada
                  </Badge>
                </div>
              ) : (
                <div
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  className={`
                    relative rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300 glass-effect-light border-2 border-dashed
                    ${dragActive 
                      ? 'border-purple-500/50 bg-purple-500/10 scale-[1.02]' 
                      : 'border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-white text-sm mb-1">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-gray-500 text-xs">
                    o haz clic para seleccionar
                  </p>
                </div>
              )}

              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-xs text-purple-200 leading-relaxed">
                  💡 La imagen de diseño ayudará a los agentes a entender la estructura visual del componente
                </p>
              </div>
            </TabsContent>

            {/* CSS Tab */}
            <TabsContent value="css" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-gray-300">Pegar CSS</Label>
                  <Textarea
                    value={cssInput}
                    onChange={(e) => setCSSInput(e.target.value)}
                    placeholder="Pega tu código CSS aquí..."
                    className="h-[200px] font-mono text-xs glass-effect-light border-white/10 resize-none"
                  />
                  <Button
                    onClick={handleCSSPaste}
                    disabled={!cssInput.trim()}
                    className="w-full glass-effect-light border-white/20 hover:bg-white/10"
                    variant="outline"
                  >
                    Aplicar CSS
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-black px-2 text-gray-500">o</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Subir archivo CSS</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".css"
                      onChange={handleCSSFile}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button
                      variant="outline"
                      className="w-full glass-effect-light border-white/20 hover:bg-white/10"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Seleccionar archivo .css
                    </Button>
                  </div>
                </div>

              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Generate Button - Fixed at bottom */}
      {onGenerate && (
        <div className="p-4 border-t border-white/10 glass-effect">
          <Button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generar Componente
              </>
            )}
          </Button>
          {!canGenerate && (
            <p className="text-xs text-center text-gray-500 mt-2">
              Conversa con el orquestador y acepta el resumen para habilitar
            </p>
          )}
        </div>
      )}
    </div>
  );
}
