import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface ApiStatusProps {
  apiKey: string;
  isGenerating: boolean;
}

export function ApiStatus({ apiKey, isGenerating }: ApiStatusProps) {
  if (isGenerating) {
    return (
      <Badge variant="outline" className="border-blue-500/30 bg-blue-950/30">
        <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
        <span className="text-blue-300">Procesando...</span>
      </Badge>
    );
  }

  if (apiKey) {
    return (
      <Badge variant="outline" className="border-green-500/30 bg-green-950/30">
        <CheckCircle2 className="h-3 w-3 text-green-400" />
        <span className="text-green-300">API Conectada</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-orange-500/30 bg-orange-950/30">
      <AlertCircle className="h-3 w-3 text-orange-400" />
      <span className="text-orange-300">Sin API Key</span>
    </Badge>
  );
}
