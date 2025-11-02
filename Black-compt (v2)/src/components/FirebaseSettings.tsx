import { useState, useEffect } from 'react';
import { Database, Save, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { firebaseService, FirebaseConfig } from '../utils/firebaseConfig';

interface FirebaseSettingsProps {
  onConfigChange?: (enabled: boolean) => void;
}

export function FirebaseSettings({ onConfigChange }: FirebaseSettingsProps) {
  const [config, setConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const savedConfig = firebaseService.getConfig();
    if (savedConfig) {
      setConfig(savedConfig);
      setIsEnabled(true);
    }
  }, []);

  const handleSave = () => {
    if (!config.apiKey || !config.projectId) {
      toast.error('API Key y Project ID son requeridos');
      return;
    }

    try {
      firebaseService.setConfig(config);
      setIsEnabled(true);
      toast.success('Configuración de Firebase guardada');
      onConfigChange?.(true);
    } catch (error) {
      toast.error('Error al guardar la configuración');
    }
  };

  const handleClear = () => {
    firebaseService.clearConfig();
    setConfig({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    });
    setIsEnabled(false);
    toast.success('Configuración eliminada');
    onConfigChange?.(false);
  };

  const handleChange = (field: keyof FirebaseConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-orange-400" />
            Configuración de Firebase
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Conecta con Firebase para sincronizar proyectos y mantener contexto
          </p>
        </div>
        <Badge 
          variant="outline" 
          className={`px-3 py-1 ${
            isEnabled 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
          }`}
        >
          {isEnabled ? (
            <>
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Conectado
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3 mr-1" />
              Desconectado
            </>
          )}
        </Badge>
      </div>

      <Separator className="opacity-30" />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-gray-300">
            API Key *
          </Label>
          <Input
            id="apiKey"
            type="password"
            value={config.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            placeholder="AIzaSy..."
            className="glass-effect-light border-white/10 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectId" className="text-gray-300">
            Project ID *
          </Label>
          <Input
            id="projectId"
            value={config.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
            placeholder="my-project-id"
            className="glass-effect-light border-white/10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authDomain" className="text-gray-300">
            Auth Domain
          </Label>
          <Input
            id="authDomain"
            value={config.authDomain}
            onChange={(e) => handleChange('authDomain', e.target.value)}
            placeholder="my-project.firebaseapp.com"
            className="glass-effect-light border-white/10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storageBucket" className="text-gray-300">
            Storage Bucket
          </Label>
          <Input
            id="storageBucket"
            value={config.storageBucket}
            onChange={(e) => handleChange('storageBucket', e.target.value)}
            placeholder="my-project.appspot.com"
            className="glass-effect-light border-white/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="messagingSenderId" className="text-gray-300">
              Messaging Sender ID
            </Label>
            <Input
              id="messagingSenderId"
              value={config.messagingSenderId}
              onChange={(e) => handleChange('messagingSenderId', e.target.value)}
              placeholder="123456789"
              className="glass-effect-light border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appId" className="text-gray-300">
              App ID
            </Label>
            <Input
              id="appId"
              value={config.appId}
              onChange={(e) => handleChange('appId', e.target.value)}
              placeholder="1:123:web:abc"
              className="glass-effect-light border-white/10 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar configuración
        </Button>
        {isEnabled && (
          <Button
            onClick={handleClear}
            variant="outline"
            className="glass-effect-light border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Desconectar
          </Button>
        )}
      </div>

      <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
        <p className="text-xs text-orange-200 leading-relaxed">
          💡 <strong>Persistencia de proyectos:</strong> Con Firebase conectado, todos tus proyectos, 
          mensajes y recursos se sincronizan en la nube. Sin Firebase, se guardan localmente en tu navegador.
        </p>
      </div>

      <div className="p-4 glass-effect-light rounded-xl border border-white/10">
        <h4 className="text-xs text-gray-400 mb-2">¿Dónde obtengo estas credenciales?</h4>
        <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside leading-relaxed">
          <li>Ve a <span className="text-orange-400">console.firebase.google.com</span></li>
          <li>Selecciona tu proyecto o crea uno nuevo</li>
          <li>Ve a Project Settings {'>'} General</li>
          <li>En "Your apps", crea una Web App si no tienes una</li>
          <li>Copia las credenciales del SDK config</li>
        </ol>
      </div>
    </div>
  );
}
