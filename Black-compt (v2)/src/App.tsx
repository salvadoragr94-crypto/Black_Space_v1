import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Download, Zap, Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { ResourcePanel } from './components/ResourcePanel';
import { CodeDisplay } from './components/CodeDisplay';
import { AgentProgress, Agent } from './components/AgentProgress';
import { FileManager } from './components/FileManager';
import { AgentSettings, AgentConfig } from './components/AgentSettings';
import { FirebaseSettings } from './components/FirebaseSettings';
import { LogoSettings } from './components/LogoSettings';
import { ApiKeyManager } from './components/ApiKeyManager';
import { ApiStatus } from './components/ApiStatus';
import { Button } from './components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './components/ui/sheet';
import { Separator } from './components/ui/separator';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { toast, Toaster } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { callGeminiWithRetry, extractJsonFromResponse, ApiError } from './utils/apiHandler';
import { LocalFileProcessor } from './utils/localFileProcessor';
import { firebaseService, ChatMessage as ChatMessageType, Project } from './utils/firebaseConfig';

interface CodeFile {
  name: string;
  code: string;
  language: string;
}

interface UploadedFile {
  id: string;
  name: string;
  content: string;
  size: number;
  type: string;
}

interface PendingGeneration {
  messageId: string;
  summary: string;
  instructions: string;
}

export default function App() {
  // Core state
  const [apiKey, setApiKey] = useState('');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingGeneration, setPendingGeneration] = useState<PendingGeneration | null>(null);
  
  // Resources state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [cssContent, setCSSContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Generated code state
  const [generatedCode, setGeneratedCode] = useState<CodeFile[]>([]);
  
  // UI state
  const [showResourcePanel, setShowResourcePanel] = useState(true);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Agent system state
  const [useAgentSystem, setUseAgentSystem] = useState(true);
  const [agentConfigs, setAgentConfigs] = useState<AgentConfig[]>([
    { id: 1, name: 'Análisis Visual', description: 'Analiza la estructura y elementos del diseño', enabled: true, temperature: 0.4, maxTokens: 2048 },
    { id: 2, name: 'Estructura de Componentes', description: 'Define la jerarquía y organización del componente', enabled: true, temperature: 0.4, maxTokens: 2048 },
    { id: 3, name: 'Estilos y Diseño', description: 'Genera los estilos inline siguiendo el diseño', enabled: true, temperature: 0.4, maxTokens: 4096 },
    { id: 4, name: 'Animaciones Motion', description: 'Implementa animaciones con Framer Motion', enabled: true, temperature: 0.4, maxTokens: 4096 },
    { id: 5, name: 'Property Controls', description: 'Define controles para propiedades personalizables', enabled: true, temperature: 0.4, maxTokens: 4096 },
    { id: 6, name: 'Validación y Optimización', description: 'Verifica y optimiza el código generado', enabled: true, temperature: 0.3, maxTokens: 8192 },
  ]);
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'Análisis Visual', description: 'Analiza la estructura y elementos del diseño', status: 'pending' },
    { id: 2, name: 'Estructura de Componentes', description: 'Define la jerarquía y organización del componente', status: 'pending' },
    { id: 3, name: 'Estilos y Diseño', description: 'Genera los estilos inline siguiendo el diseño', status: 'pending' },
    { id: 4, name: 'Animaciones Motion', description: 'Implementa animaciones con Framer Motion', status: 'pending' },
    { id: 5, name: 'Property Controls', description: 'Define controles para propiedades personalizables', status: 'pending' },
    { id: 6, name: 'Validación y Optimización', description: 'Verifica y optimiza el código generado', status: 'pending' },
  ]);

  // Load saved agent configs
  useEffect(() => {
    const saved = localStorage.getItem('agent-config-preset');
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        setAgentConfigs(configs);
      } catch (e) {
        console.error('Error loading agent configs:', e);
      }
    }
  }, []);

  // Sync agents with configs
  useEffect(() => {
    const enabledConfigs = agentConfigs.filter(c => c.enabled);
    setAgents(enabledConfigs.map(config => ({
      id: config.id,
      name: config.name,
      description: config.description,
      status: 'pending' as const,
    })));
  }, [agentConfigs]);

  // Project management
  const handleProjectCreate = async (name: string, description?: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      messages: [],
      resources: { images: [], css: [], code: [] },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await firebaseService.saveProject(newProject);
    setCurrentProject(newProject);
    setMessages([]);
    setGeneratedCode([]);
    setPendingGeneration(null);
    toast.success(`Proyecto "${name}" creado`);
  };

  const handleProjectSelect = async (project: Project) => {
    setCurrentProject(project);
    setMessages(project.messages);
    
    if (project.resources.images.length > 0) {
      const lastImage = project.resources.images[project.resources.images.length - 1];
      setImagePreview(lastImage.url);
    }
    if (project.resources.css.length > 0) {
      const lastCSS = project.resources.css[project.resources.css.length - 1];
      setCSSContent(lastCSS.content);
    }
    
    toast.success(`Proyecto "${project.name}" cargado`);
  };

  const updateAgentStatus = (id: number, status: Agent['status'], result?: string) => {
    setAgents(prev => prev.map(agent => agent.id === id ? { ...agent, status, result } : agent));
  };

  const callOrchestratorAPI = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('No hay API Key disponible');
    }

    // Build conversation history for context
    const conversationHistory = messages
      .slice(-5) // Last 5 messages for context
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
      .join('\n');

    const resourcesInfo = `
RECURSOS DISPONIBLES:
- Imagen: ${imagePreview ? 'Sí' : 'No'}
- CSS: ${cssContent ? 'Sí' : 'No'}
- Archivos contexto: ${uploadedFiles.length}
`;

    const orchestratorPrompt = `Eres un orquestador experto para generación de componentes Framer. Tu rol es:

1. **Conversar** con el usuario para entender completamente qué componente quiere crear
2. **Recopilar** ideas, conceptos y detalles del componente
3. **Clarificar** cualquier ambigüedad haciendo preguntas
4. **NO generar código** - solo conversación y análisis

HISTORIAL DE CONVERSACIÓN:
${conversationHistory}

${resourcesInfo}

NUEVO MENSAJE DEL USUARIO:
${userMessage}

INSTRUCCIONES:
- Si el usuario aún está describiendo el componente, haz preguntas para clarificar detalles
- Si ya tienes suficiente información, presenta un resumen detallado con el formato:

RESUMEN DE COMPONENTE:
[Descripción clara y técnica del componente]

Elementos principales:
- [elemento 1]
- [elemento 2]
...

Funcionalidad:
- [funcionalidad 1]
- [funcionalidad 2]
...

Estilos y diseño:
- [detalle de estilo 1]
- [detalle de estilo 2]
...

¿Deseas proceder con la generación?

Responde de forma natural y profesional.`;

    return callGeminiWithRetry(
      {
        apiKey,
        prompt: orchestratorPrompt,
        temperature: 0.7,
        maxTokens: 2048,
      },
      {
        maxRetries: 3,
        retryDelay: 2000,
        onRetry: (attempt, error) => {
          toast.warning(`Reintentando (${attempt}/3)...`, { duration: 2000 });
        },
      }
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (currentProject) {
      const updatedProject = { ...currentProject, messages: updatedMessages, updatedAt: Date.now() };
      setCurrentProject(updatedProject);
      await firebaseService.saveProject(updatedProject);
    }

    setIsGenerating(true);
    
    try {
      const orchestratorResponse = await callOrchestratorAPI(content);
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: orchestratorResponse,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Check if orchestrator is asking for approval
      if (orchestratorResponse.includes('RESUMEN DE COMPONENTE') || 
          orchestratorResponse.includes('¿Deseas proceder con la generación?')) {
        setPendingGeneration({
          messageId: assistantMessage.id,
          summary: orchestratorResponse,
          instructions: orchestratorResponse,
        });
      }

      if (currentProject) {
        const finalProject = { ...currentProject, messages: finalMessages, updatedAt: Date.now() };
        await firebaseService.saveProject(finalProject);
      }

    } catch (error) {
      console.error('Error processing message:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el mensaje');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    const updatedMessages = messages.map(m => 
      m.id === messageId ? { ...m, content: newContent } : m
    );
    setMessages(updatedMessages);

    if (currentProject) {
      const updatedProject = { ...currentProject, messages: updatedMessages, updatedAt: Date.now() };
      await firebaseService.saveProject(updatedProject);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== 'user') return;

    // Remove the message to regenerate and all following messages
    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);

    setIsGenerating(true);
    try {
      const orchestratorResponse = await callOrchestratorAPI(previousUserMessage.content);
      
      const assistantMessage: ChatMessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        content: orchestratorResponse,
        timestamp: Date.now(),
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);

      if (orchestratorResponse.includes('RESUMEN DE COMPONENTE')) {
        setPendingGeneration({
          messageId: assistantMessage.id,
          summary: orchestratorResponse,
          instructions: orchestratorResponse,
        });
      }

      if (currentProject) {
        const updatedProject = { ...currentProject, messages: finalMessages, updatedAt: Date.now() };
        await firebaseService.saveProject(updatedProject);
      }

    } catch (error) {
      toast.error('Error al regenerar mensaje');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveGeneration = async () => {
    if (!pendingGeneration) {
      toast.error('No hay resumen pendiente de aprobación');
      return;
    }

    toast.success('Generación aprobada. Usa el botón "Generar Componente" en el panel de recursos.');
  };

  const handleRejectGeneration = () => {
    setPendingGeneration(null);
    toast.info('Resumen rechazado. Continúa la conversación para ajustar los detalles.');
  };

  const handleGenerate = async () => {
    if (!pendingGeneration) {
      toast.error('Primero debes conversar con el orquestador y aprobar un resumen');
      return;
    }

    if (!apiKey && !agentConfigs.some(a => a.enabled && a.apiKey)) {
      toast.error('Configura una API Key en ajustes');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await generateWithAgents(pendingGeneration.instructions);
      toast.success('¡Componente generado exitosamente!');
      setPendingGeneration(null);
    } catch (error) {
      console.error('Error generating code:', error);
      toast.error(error instanceof Error ? error.message : 'Error al generar código');
      setAgents(prev => prev.map(agent => agent.status === 'running' ? { ...agent, status: 'error' } : agent));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithAgents = async (instructions: string): Promise<string> => {
    const processedFiles = LocalFileProcessor.processFiles(uploadedFiles);
    const filesContext = LocalFileProcessor.createContext(processedFiles);
    
    const cssContext = cssContent ? `\n\nCSS DE REFERENCIA:\n${cssContent}\n` : '';
    const base64Image = imagePreview ? imagePreview.split(',')[1] : '';
    
    const contextInfo = `
INSTRUCCIONES DEL ORQUESTADOR:
${instructions}

RECURSOS:
${cssContext}
${filesContext}
`;

    const enabledAgents = agentConfigs.filter(c => c.enabled);
    if (enabledAgents.length === 0) {
      throw new Error('No hay agentes habilitados');
    }

    const agentResults: { [key: number]: string } = {};

    const callAgentAPI = async (prompt: string, agentConfig: AgentConfig): Promise<string> => {
      const apiKeyToUse = agentConfig.apiKey || apiKey;
      if (!apiKeyToUse) throw new Error('No hay API Key disponible');

      return callGeminiWithRetry(
        {
          apiKey: apiKeyToUse,
          prompt,
          base64Image,
          imageType: imageFile?.type || 'image/png',
          temperature: agentConfig.temperature,
          maxTokens: agentConfig.maxTokens,
        },
        { maxRetries: 3, retryDelay: 2000, onRetry: (attempt) => toast.warning(`Reintentando (${attempt}/3)...`, { duration: 2000 }) }
      );
    };

    // Run agents 1-5 independently
    for (const agent of enabledAgents.filter(a => a.id >= 1 && a.id <= 5)) {
      updateAgentStatus(agent.id, 'running');
      
      const prompts: { [key: number]: string } = {
        1: `${contextInfo}\n\nAnaliza y describe elementos visuales, colores, espaciado. Responde en JSON.`,
        2: `${contextInfo}\n\nCrea estructura JSX básica del componente.`,
        3: `${contextInfo}\n\nGenera estilos inline basados en recursos.`,
        4: `${contextInfo}\n\nSugiere animaciones con Framer Motion.`,
        5: `${contextInfo}\n\nDefine Property Controls personalizables.`,
      };

      const prompt = agent.customPrompt || prompts[agent.id];
      agentResults[agent.id] = await callAgentAPI(prompt, agent);
      updateAgentStatus(agent.id, 'completed');
    }

    // Agent 6: Combines all results
    const agent6 = enabledAgents.find(a => a.id === 6);
    if (agent6) {
      updateAgentStatus(6, 'running');
      
      const allResults = Object.entries(agentResults)
        .map(([id, result]) => {
          const agentName = enabledAgents.find(a => a.id === parseInt(id))?.name;
          return `\n=== ${agentName} ===\n${result}`;
        })
        .join('\n');

      const validationPrompt = `${contextInfo}

RESULTADOS DE AGENTES:
${allResults}

Genera código React completo para Framer.

REGLAS:
- Estilos inline (NO Tailwind)
- Importar motion de "framer-motion"
- Incluir addPropertyControls
- TypeScript completo

Responde en JSON:
{
  "files": [{"name": "Component.tsx", "code": "...", "language": "typescript"}]
}`;

      agentResults[6] = await callAgentAPI(validationPrompt, agent6);
      updateAgentStatus(6, 'completed');

      const parsed = extractJsonFromResponse(agentResults[6]);
      if (parsed?.files) {
        setGeneratedCode(parsed.files);
        
        if (currentProject) {
          const updatedProject = {
            ...currentProject,
            resources: {
              ...currentProject.resources,
              code: [
                ...currentProject.resources.code,
                ...parsed.files.map((f: CodeFile) => ({
                  id: Date.now().toString(),
                  name: f.name,
                  content: f.code,
                })),
              ],
            },
          };
          await firebaseService.saveProject(updatedProject);
        }

        return `Componente "${parsed.files[0]?.name || 'Component'}" generado.`;
      }
    }

    return 'Procesamiento completado.';
  };

  const downloadCode = () => {
    if (generatedCode.length === 0) return;

    generatedCode.forEach((file) => {
      const blob = new Blob([file.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });

    toast.success('Archivos descargados');
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <Sidebar 
        apiKey={apiKey} 
        onApiKeyChange={setApiKey}
        onFilesClick={() => {}} // Removed - now in settings
        onSettingsClick={() => setIsSettingsOpen(true)}
        onProjectSelect={handleProjectSelect}
        onProjectCreate={handleProjectCreate}
        currentProjectId={currentProject?.id}
      />

      <div className="min-h-screen bg-black pl-20">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="h-screen flex flex-col relative z-10">
          {/* Header */}
          <div className="border-b border-white/10 glass-effect px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="gradient-text">Framer AI Studio</h1>
                {currentProject && (
                  <div className="flex items-center gap-2 text-sm">
                    <Separator orientation="vertical" className="h-6 opacity-30" />
                    <span className="text-gray-400">Proyecto:</span>
                    <span className="text-white">{currentProject.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-effect-light border border-white/10">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <Label htmlFor="agent-mode" className="text-sm text-white cursor-pointer">
                    Multi-Agente
                  </Label>
                  <Switch id="agent-mode" checked={useAgentSystem} onCheckedChange={setUseAgentSystem} />
                </div>
                <ApiStatus apiKey={apiKey} isGenerating={isGenerating} />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Resources */}
            <AnimatePresence>
              {showResourcePanel && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 350, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-r border-white/10"
                >
                  <ResourcePanel
                    onImageUpload={(file, preview) => {
                      setImageFile(file);
                      setImagePreview(preview);
                    }}
                    onCSSUpload={(content) => setCSSContent(content)}
                    currentImage={imagePreview}
                    currentCSS={cssContent}
                    onClearImage={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    onClearCSS={() => setCSSContent('')}
                    onClose={() => setShowResourcePanel(false)}
                    onGenerate={handleGenerate}
                    canGenerate={!!pendingGeneration}
                    isGenerating={isGenerating}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Left Panel Button */}
            {!showResourcePanel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowResourcePanel(true)}
                className="absolute left-20 top-1/2 -translate-y-1/2 z-10 rounded-r-xl rounded-l-none glass-effect border border-white/10 h-16 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {/* Center - Chat */}
            <div className="flex-1 flex flex-col">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onRegenerateMessage={handleRegenerateMessage}
                onApproveGeneration={handleApproveGeneration}
                onRejectGeneration={handleRejectGeneration}
                isGenerating={isGenerating}
              />
            </div>

            {/* Toggle Right Panel Button */}
            {!showCodePanel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCodePanel(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-l-xl rounded-r-none glass-effect border border-white/10 h-16 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Right Panel - Code & Agents */}
            <AnimatePresence>
              {showCodePanel && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 500, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-l border-white/10 flex flex-col glass-effect"
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white">Código & Progreso</h3>
                    <div className="flex items-center gap-2">
                      {generatedCode.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={downloadCode} className="h-8 hover:bg-white/10">
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Descargar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setShowCodePanel(false)} className="h-8 w-8 hover:bg-white/10">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden flex flex-col">
                    {isGenerating && useAgentSystem && (
                      <div className="p-4">
                        <AgentProgress agents={agents} />
                      </div>
                    )}
                    
                    <div className="flex-1 overflow-hidden p-4">
                      <CodeDisplay files={generatedCode} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent side="right" className="w-[550px] sm:w-[650px] overflow-y-auto glass-effect border-white/10">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-white">
              <SettingsIcon className="h-5 w-5 text-orange-400" />
              Configuración Avanzada
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              APIs, agentes, archivos y personalización
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="api" className="mt-6">
            <TabsList className="w-full glass-effect-light border border-white/10 grid grid-cols-5">
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="files">Archivos</TabsTrigger>
              <TabsTrigger value="agents">Agentes</TabsTrigger>
              <TabsTrigger value="firebase">Firebase</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="mt-4">
              <ApiKeyManager value={apiKey} onChange={setApiKey} />
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white mb-2">Archivos de Contexto</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Documentación y ejemplos para los agentes
                  </p>
                </div>
                <FileManager files={uploadedFiles} onFilesChange={setUploadedFiles} />
              </div>
            </TabsContent>

            <TabsContent value="agents" className="mt-4">
              <AgentSettings agents={agentConfigs} onAgentsChange={setAgentConfigs} />
            </TabsContent>

            <TabsContent value="firebase" className="mt-4">
              <FirebaseSettings />
            </TabsContent>

            <TabsContent value="logo" className="mt-4">
              <LogoSettings onLogoChange={(url) => {
                // Trigger sidebar re-render
                window.dispatchEvent(new Event('storage'));
              }} />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
