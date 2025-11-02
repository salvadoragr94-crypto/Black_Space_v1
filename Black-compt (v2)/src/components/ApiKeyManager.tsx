import { useState, useEffect } from 'react';
import { Eye, EyeOff, Key, Plus, Trash2, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface SavedApiKey {
  id: string;
  name: string;
  key: string;
}

interface ApiKeyManagerProps {
  value: string;
  onChange: (value: string) => void;
}

const STORAGE_KEY = 'gemini-api-keys';
const ACTIVE_KEY_ID = 'active-api-key-id';

export function ApiKeyManager({ value, onChange }: ApiKeyManagerProps) {
  const [savedKeys, setSavedKeys] = useState<SavedApiKey[]>([]);
  const [activeKeyId, setActiveKeyId] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  // Load saved keys from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const keys = JSON.parse(stored) as SavedApiKey[];
        setSavedKeys(keys);
        
        // Load active key
        const activeId = localStorage.getItem(ACTIVE_KEY_ID);
        if (activeId) {
          const activeKey = keys.find(k => k.id === activeId);
          if (activeKey) {
            setActiveKeyId(activeId);
            onChange(activeKey.key);
          }
        }
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  }, []);

  // Save keys to localStorage whenever they change
  const saveKeysToStorage = (keys: SavedApiKey[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
      setSavedKeys(keys);
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast.error('Error al guardar las API keys');
    }
  };

  const handleAddKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Por favor ingresa un nombre para la API key');
      return;
    }
    if (!newKeyValue.trim()) {
      toast.error('Por favor ingresa la API key');
      return;
    }

    const newKey: SavedApiKey = {
      id: Date.now().toString(),
      name: newKeyName.trim(),
      key: newKeyValue.trim(),
    };

    const updatedKeys = [...savedKeys, newKey];
    saveKeysToStorage(updatedKeys);

    // Set as active key
    setActiveKeyId(newKey.id);
    localStorage.setItem(ACTIVE_KEY_ID, newKey.id);
    onChange(newKey.key);

    // Reset form
    setNewKeyName('');
    setNewKeyValue('');
    setIsAddDialogOpen(false);

    toast.success(`API key "${newKey.name}" guardada y activada`);
  };

  const handleSelectKey = (keyId: string) => {
    const selectedKey = savedKeys.find(k => k.id === keyId);
    if (selectedKey) {
      setActiveKeyId(keyId);
      localStorage.setItem(ACTIVE_KEY_ID, keyId);
      onChange(selectedKey.key);
      toast.success(`API key "${selectedKey.name}" activada`);
    }
  };

  const handleDeleteKey = (keyId: string) => {
    const keyToRemove = savedKeys.find(k => k.id === keyId);
    const updatedKeys = savedKeys.filter(k => k.id !== keyId);
    saveKeysToStorage(updatedKeys);

    // If deleted key was active, clear it
    if (activeKeyId === keyId) {
      setActiveKeyId('');
      localStorage.removeItem(ACTIVE_KEY_ID);
      onChange('');
    }

    setKeyToDelete(null);
    toast.success(`API key "${keyToRemove?.name}" eliminada`);
  };

  const activeKey = savedKeys.find(k => k.id === activeKeyId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          API Keys de Gemini
        </Label>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nueva API Key</DialogTitle>
              <DialogDescription>
                Guarda una nueva API key de Gemini con un nombre descriptivo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Nombre</Label>
                <Input
                  id="key-name"
                  placeholder="Ej: Proyecto Personal, Trabajo, etc."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-value">API Key</Label>
                <Input
                  id="key-value"
                  type="password"
                  placeholder="AIza..."
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddKey}>
                <Check className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {savedKeys.length > 0 ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={activeKeyId} onValueChange={handleSelectKey}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una API key" />
              </SelectTrigger>
              <SelectContent>
                {savedKeys.map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeKeyId && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setKeyToDelete(activeKeyId)}
                title="Eliminar API key seleccionada"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>

          {activeKey && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={activeKey.key}
                  readOnly
                  className="pr-10 bg-gray-50"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <Key className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">
            No hay API keys guardadas
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar primera API key
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Obtén tu API key en{' '}
        <a
          href="https://makersuite.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Google AI Studio
        </a>
      </p>

      <AlertDialog open={keyToDelete !== null} onOpenChange={(open) => !open && setKeyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar API key?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La API key "{savedKeys.find(k => k.id === keyToDelete)?.name}" será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => keyToDelete && handleDeleteKey(keyToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
