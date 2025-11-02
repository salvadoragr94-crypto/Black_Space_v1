import { useState } from 'react';
import { Settings, Plus, Trash2, Save, RefreshCw, Key } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export interface AgentConfig {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  temperature: number;
  maxTokens: number;
  customPrompt?: string;
  apiKey?: string; // API Key específica para este agente
}

interface AgentSettingsProps {
  agents: AgentConfig[];
  onAgentsChange: (agents: AgentConfig[]) => void;
}

const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 1,
    name: 'Análisis Visual',
    description: 'Analiza la estructura y elementos del diseño',
    enabled: true,
    temperature: 0.4,
    maxTokens: 2048,
  },
  {
    id: 2,
    name: 'Estructura de Componentes',
    description: 'Define la jerarquía y organización del componente',
    enabled: true,
    temperature: 0.4,
    maxTokens: 2048,
  },
  {
    id: 3,
    name: 'Estilos y Diseño',
    description: 'Genera los estilos inline siguiendo el diseño',
    enabled: true,
    temperature: 0.4,
    maxTokens: 4096,
  },
  {
    id: 4,
    name: 'Animaciones Motion',
    description: 'Implementa animaciones con Framer Motion',
    enabled: true,
    temperature: 0.4,
    maxTokens: 4096,
  },
  {
    id: 5,
    name: 'Property Controls',
    description: 'Define controles para propiedades personalizables',
    enabled: true,
    temperature: 0.4,
    maxTokens: 4096,
  },
  {
    id: 6,
    name: 'Validación y Optimización',
    description: 'Verifica y optimiza el código generado',
    enabled: true,
    temperature: 0.3,
    maxTokens: 8192,
  },
];

export function AgentSettings({ agents, onAgentsChange }: AgentSettingsProps) {
  const [editingAgent, setEditingAgent] = useState<number | null>(null);

  const handleToggleAgent = (id: number) => {
    const updated = agents.map(agent =>
      agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
    );
    onAgentsChange(updated);
  };

  const handleUpdateAgent = (id: number, updates: Partial<AgentConfig>) => {
    const updated = agents.map(agent =>
      agent.id === id ? { ...agent, ...updates } : agent
    );
    onAgentsChange(updated);
  };

  const handleAddAgent = () => {
    const newAgent: AgentConfig = {
      id: Math.max(...agents.map(a => a.id), 0) + 1,
      name: 'Nuevo Agente',
      description: 'Descripción del agente',
      enabled: true,
      temperature: 0.4,
      maxTokens: 2048,
    };
    onAgentsChange([...agents, newAgent]);
    toast.success('Nuevo agente agregado');
  };

  const handleRemoveAgent = (id: number) => {
    if (agents.length <= 1) {
      toast.error('Debe haber al menos un agente');
      return;
    }
    const updated = agents.filter(agent => agent.id !== id);
    onAgentsChange(updated);
    toast.success('Agente eliminado');
  };

  const handleResetAgents = () => {
    onAgentsChange(DEFAULT_AGENTS);
    toast.success('Configuración restaurada');
  };

  const handleSavePreset = () => {
    try {
      localStorage.setItem('agent-config-preset', JSON.stringify(agents));
      toast.success('Configuración guardada');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Configuración de Agentes
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Personaliza el comportamiento y API de cada agente
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1">
          {agents.filter(a => a.enabled).length} activos
        </Badge>
      </div>

      <Separator className="opacity-50" />

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddAgent}
          className="glass-effect-light border-white/10 hover:border-white/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSavePreset}
          className="glass-effect-light border-white/10 hover:border-white/20"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetAgents}
          className="glass-effect-light border-white/10 hover:border-white/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Restaurar
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        <Accordion type="single" collapsible className="space-y-3">
          {agents.map((agent) => (
            <AccordionItem
              key={agent.id}
              value={`agent-${agent.id}`}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                agent.enabled 
                  ? 'border-purple-500/30 bg-purple-950/10 glow-purple' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={agent.enabled}
                      onCheckedChange={() => handleToggleAgent(agent.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                          #{agent.id}
                        </Badge>
                        <span className="text-sm">{agent.name}</span>
                        {agent.apiKey && (
                          <Key className="h-3 w-3 text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{agent.description}</p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${agent.id}`}>Nombre del agente</Label>
                    <Input
                      id={`name-${agent.id}`}
                      value={agent.name}
                      onChange={(e) => handleUpdateAgent(agent.id, { name: e.target.value })}
                      className="glass-effect-light border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${agent.id}`}>Descripción</Label>
                    <Input
                      id={`desc-${agent.id}`}
                      value={agent.description}
                      onChange={(e) => handleUpdateAgent(agent.id, { description: e.target.value })}
                      className="glass-effect-light border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`api-${agent.id}`} className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-purple-400" />
                      API Key específica (opcional)
                    </Label>
                    <Input
                      id={`api-${agent.id}`}
                      type="password"
                      value={agent.apiKey || ''}
                      onChange={(e) => handleUpdateAgent(agent.id, { apiKey: e.target.value })}
                      placeholder="Usa la API Key global si se deja vacío"
                      className="glass-effect-light border-white/10 font-mono text-xs"
                    />
                    <p className="text-[11px] text-gray-600">
                      Si se especifica, este agente usará su propia API Key en lugar de la global
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`temp-${agent.id}`} className="flex items-center justify-between">
                        <span>Temperature</span>
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                          {agent.temperature}
                        </Badge>
                      </Label>
                      <Input
                        id={`temp-${agent.id}`}
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={agent.temperature}
                        onChange={(e) => handleUpdateAgent(agent.id, { temperature: parseFloat(e.target.value) })}
                        className="glass-effect-light border-white/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tokens-${agent.id}`} className="flex items-center justify-between">
                        <span>Max Tokens</span>
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                          {agent.maxTokens}
                        </Badge>
                      </Label>
                      <Input
                        id={`tokens-${agent.id}`}
                        type="number"
                        min="256"
                        max="8192"
                        step="256"
                        value={agent.maxTokens}
                        onChange={(e) => handleUpdateAgent(agent.id, { maxTokens: parseInt(e.target.value) })}
                        className="glass-effect-light border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`prompt-${agent.id}`}>
                      Prompt personalizado (opcional)
                    </Label>
                    <Textarea
                      id={`prompt-${agent.id}`}
                      placeholder="Deja vacío para usar el prompt por defecto..."
                      value={agent.customPrompt || ''}
                      onChange={(e) => handleUpdateAgent(agent.id, { customPrompt: e.target.value })}
                      className="min-h-[120px] font-mono text-xs glass-effect-light border-white/10 resize-none"
                    />
                  </div>

                  {agents.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAgent(agent.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar este agente
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
        <p className="text-xs text-purple-200 leading-relaxed">
          💡 <strong>Modo aislado:</strong> Cada agente trabaja de forma independiente con la imagen original y su prompt específico. 
          Puedes asignar diferentes API Keys para distribuir la carga entre múltiples cuentas de Gemini.
        </p>
      </div>
    </div>
  );
}
