import { Code2 } from 'lucide-react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface FramerCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function FramerCodeInput({ value, onChange }: FramerCodeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="framer-code" className="flex items-center gap-2">
        <Code2 className="h-4 w-4" />
        Código del Plugin de Framer
      </Label>
      
      <Textarea
        id="framer-code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pega aquí el código del plugin de Framer..."
        className="min-h-[200px] max-h-[400px] font-mono text-sm resize-none overflow-auto"
        style={{ whiteSpace: 'pre', overflowWrap: 'normal' }}
      />
      {value && (
        <p className="text-xs text-green-400">
          ✓ Código cargado ({value.length} caracteres)
        </p>
      )}
    </div>
  );
}
