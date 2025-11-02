import { useState, useEffect } from 'react';
import { ImageIcon, Upload, Trash2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface LogoSettingsProps {
  onLogoChange?: (logoUrl: string) => void;
}

export function LogoSettings({ onLogoChange }: LogoSettingsProps) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('custom-logo');
    if (saved) {
      setLogoUrl(saved);
      setPreviewUrl(saved);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewUrl) {
      toast.error('No hay logo para guardar');
      return;
    }

    localStorage.setItem('custom-logo', previewUrl);
    setLogoUrl(previewUrl);
    onLogoChange?.(previewUrl);
    toast.success('Logo actualizado');
  };

  const handleRemove = () => {
    localStorage.removeItem('custom-logo');
    setLogoUrl('');
    setPreviewUrl('');
    onLogoChange?.('');
    toast.success('Logo eliminado');
  };

  const handleReset = () => {
    setPreviewUrl(logoUrl);
    toast.info('Cambios descartados');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 text-white">
          <ImageIcon className="h-5 w-5 text-blue-400" />
          Logo de la Aplicación
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Personaliza el logo que aparece en la barra lateral
        </p>
      </div>

      <Separator className="opacity-30" />

      {/* Preview */}
      <div className="space-y-3">
        <Label className="text-gray-300">Vista previa</Label>
        <div className="flex items-center justify-center p-8 rounded-xl glass-effect-light border border-white/10">
          {previewUrl ? (
            <div className="relative group">
              <img 
                src={previewUrl} 
                alt="Logo preview" 
                className="w-16 h-16 object-contain rounded-xl"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Upload */}
      <div className="space-y-3">
        <Label className="text-gray-300">Subir nuevo logo</Label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            variant="outline"
            className="w-full glass-effect-light border-white/20 hover:bg-white/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar imagen
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          Recomendado: 64x64px o mayor, formato PNG con fondo transparente
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={!previewUrl || previewUrl === logoUrl}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          Guardar logo
        </Button>
        {logoUrl && (
          <Button
            onClick={handleRemove}
            variant="outline"
            className="glass-effect-light border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {previewUrl && previewUrl !== logoUrl && (
          <Button
            onClick={handleReset}
            variant="outline"
            className="glass-effect-light border-white/20 hover:bg-white/10"
          >
            Descartar
          </Button>
        )}
      </div>

      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
        <p className="text-xs text-blue-200 leading-relaxed">
          💡 El logo personalizado se guarda en tu navegador. Si cambias de dispositivo, 
          necesitarás volver a subirlo.
        </p>
      </div>
    </div>
  );
}
