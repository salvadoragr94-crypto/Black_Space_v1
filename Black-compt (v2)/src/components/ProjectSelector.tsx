import { useState, useEffect } from 'react';
import { Plus, Folder, Trash2, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Project, firebaseService } from '../utils/firebaseConfig';

interface ProjectSelectorProps {
  currentProjectId?: string;
  onProjectSelect: (project: Project) => void;
  onProjectCreate: (name: string, description?: string) => void;
}

export function ProjectSelector({
  currentProjectId,
  onProjectSelect,
  onProjectCreate,
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const loadedProjects = await firebaseService.getProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Error al cargar proyectos');
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error('El nombre del proyecto es requerido');
      return;
    }

    onProjectCreate(newProjectName, newProjectDescription);
    setNewProjectName('');
    setNewProjectDescription('');
    setIsDialogOpen(false);
    toast.success('Proyecto creado');
    loadProjects();
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await firebaseService.deleteProject(projectId);
      await loadProjects();
      toast.success('Proyecto eliminado');
    } catch (error) {
      toast.error('Error al eliminar proyecto');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-gray-400">Proyectos</h4>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs hover:bg-white/10"
            >
              <Plus className="h-3 w-3 mr-1" />
              Nuevo
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Crear nuevo proyecto</DialogTitle>
              <DialogDescription className="text-gray-400">
                Organiza tus componentes en proyectos separados
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name" className="text-gray-300">
                  Nombre del proyecto
                </Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Mi Proyecto"
                  className="glass-effect-light border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-desc" className="text-gray-300">
                  Descripción (opcional)
                </Label>
                <Input
                  id="project-desc"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Descripción del proyecto..."
                  className="glass-effect-light border-white/10"
                />
              </div>
              <Button
                onClick={handleCreateProject}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Crear proyecto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500 text-sm">No hay proyectos</p>
              <p className="text-gray-600 text-xs mt-1">Crea uno para comenzar</p>
            </div>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  group hover:scale-[1.02]
                  ${
                    currentProjectId === project.id
                      ? 'glass-effect border border-purple-500/30 glow-purple'
                      : 'glass-effect-light border border-white/10 hover:border-white/20'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Folder className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-white truncate">
                        {project.name}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] px-2 py-0">
                        <MessageSquare className="h-2.5 w-2.5 mr-1" />
                        {project.messages.length}
                      </Badge>
                      <span className="text-[10px] text-gray-600">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
