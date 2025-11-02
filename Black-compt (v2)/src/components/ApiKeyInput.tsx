import { useState } from 'react';
import { Eye, EyeOff, Key } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key" className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        API Key de Gemini
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="api-key"
            type={showKey ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="AIza..."
            className="pr-10"
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
    </div>
  );
}
