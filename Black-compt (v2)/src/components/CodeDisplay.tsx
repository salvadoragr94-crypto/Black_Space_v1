import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface CodeFile {
  name: string;
  code: string;
  language: string;
}

interface CodeDisplayProps {
  files: CodeFile[];
}

export function CodeDisplay({ files }: CodeDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (files.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-white/10 glass-effect-light text-center p-16 min-h-[500px] flex items-center justify-center">
        <div className="space-y-3">
          <Code2 className="h-16 w-16 text-gray-600 mx-auto opacity-50" />
          <p className="text-gray-500">
            El código generado aparecerá aquí
          </p>
          <p className="text-gray-600 text-sm">
            Carga una imagen y presiona Generar para comenzar
          </p>
        </div>
      </div>
    );
  }

  if (files.length === 1) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-2xl border border-white/10 overflow-hidden glass-effect shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white">{files[0].name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(files[0].code, 0)}
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {copiedIndex === 0 ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-xs">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  <span className="text-xs">Copiar</span>
                </>
              )}
            </Button>
          </div>
          <ScrollArea className="h-[600px]">
            <pre className="p-6 text-sm">
              <code className="text-gray-100 font-mono">{files[0].code}</code>
            </pre>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="0" className="w-full">
        <TabsList className="w-full justify-start glass-effect-light border border-white/10 p-1">
          {files.map((file, index) => (
            <TabsTrigger 
              key={index} 
              value={index.toString()}
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all duration-200"
            >
              {file.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {files.map((file, index) => (
          <TabsContent key={index} value={index.toString()}>
            <div className="relative rounded-2xl border border-white/10 overflow-hidden glass-effect shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(file.code, index)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-400" />
                      <span className="text-xs">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      <span className="text-xs">Copiar</span>
                    </>
                  )}
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <pre className="p-6 text-sm">
                  <code className="text-gray-100 font-mono">{file.code}</code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
