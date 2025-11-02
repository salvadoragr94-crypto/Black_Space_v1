import { useState, useEffect } from 'react';
import { Key, Settings, FolderOpen, Sparkles, Database, Folder } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { ApiKeyManager } from './ApiKeyManager';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FirebaseSettings } from './FirebaseSettings';
import { ProjectSelector } from './ProjectSelector';
import { Project } from '../utils/firebaseConfig';

interface SidebarProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onFilesClick?: () => void;
  onSettingsClick?: () => void;
  onProjectSelect?: (project: Project) => void;
  onProjectCreate?: (name: string, description?: string) => void;
  currentProjectId?: string;
}

export function Sidebar({ 
  apiKey, 
  onApiKeyChange, 
  onFilesClick, 
  onSettingsClick,
  onProjectSelect,
  onProjectCreate,
  currentProjectId,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customLogo, setCustomLogo] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('custom-logo');
    if (saved) {
      setCustomLogo(saved);
    }
  }, []);

  return (
    <div className="fixed left-0 top-0 h-full z-50">
      <div className="h-full w-20 glass-effect border-r border-white/10 shadow-2xl flex flex-col items-center py-6 gap-3">
        <TooltipProvider delayDuration={300}>
          {/* Logo/Brand */}
          <div className="mb-2 relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg glow-purple transition-all duration-300 group-hover:scale-110 overflow-hidden">
              {customLogo ? (
                <img src={customLogo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Sparkles className="h-6 w-6 text-white" />
              )}
            </div>
          </div>

          <Separator className="w-12 opacity-20" />

          {/* Projects & API Keys Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
              <SheetTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-2xl hover:bg-white/10 hover:text-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    <Folder className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </Button>
                </TooltipTrigger>
              </SheetTrigger>
              <TooltipContent side="right" className="glass-effect-light border-white/20">
                <p>Proyectos y API Keys</p>
              </TooltipContent>
            </Tooltip>

            <SheetContent side="left" className="w-[400px] sm:w-[440px] glass-effect border-white/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <Folder className="h-5 w-5 text-purple-400" />
                  Gestión
                </SheetTitle>
                <SheetDescription className="text-gray-400">
                  Proyectos y configuración de APIs
                </SheetDescription>
              </SheetHeader>
              
              <Tabs defaultValue="projects" className="mt-6">
                <TabsList className="w-full glass-effect-light border border-white/10">
                  <TabsTrigger value="projects" className="flex-1">
                    <Folder className="h-4 w-4 mr-2" />
                    Proyectos
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex-1">
                    <Key className="h-4 w-4 mr-2" />
                    API Keys
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="mt-4">
                  {onProjectSelect && onProjectCreate && (
                    <ProjectSelector
                      currentProjectId={currentProjectId}
                      onProjectSelect={onProjectSelect}
                      onProjectCreate={onProjectCreate}
                    />
                  )}
                </TabsContent>

                <TabsContent value="api" className="mt-4">
                  <ApiKeyManager value={apiKey} onChange={onApiKeyChange} />
                  
                  <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <h4 className="text-sm text-blue-300 mb-2">
                      💡 Consejo
                    </h4>
                    <p className="text-xs text-blue-200/80 leading-relaxed">
                      Organiza tus API keys con nombres descriptivos. También puedes asignar 
                      API keys específicas a cada agente desde la configuración avanzada.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>

          {/* Files Manager Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onFilesClick}
                className="w-14 h-14 rounded-2xl hover:bg-white/10 hover:text-green-400 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <FolderOpen className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-effect-light border-white/20">
              <p>Archivos y Documentos</p>
            </TooltipContent>
          </Tooltip>

          {/* Spacer to push settings to bottom */}
          <div className="flex-1" />

          <Separator className="w-12 opacity-20" />

          {/* Settings Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="w-14 h-14 rounded-2xl hover:bg-white/10 hover:text-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Settings className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-effect-light border-white/20">
              <p>Configuración</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
