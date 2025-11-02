import { motion } from 'motion/react';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
}

interface AgentProgressProps {
  agents: Agent[];
}

export function AgentProgress({ agents }: AgentProgressProps) {
  return (
    <Card className="glass-effect border-white/10 shadow-2xl">
      <CardContent className="pt-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-white flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
              Progreso de Agentes
            </h3>
            <div className="text-xs text-gray-500">
              {agents.filter(a => a.status === 'completed').length} / {agents.length}
            </div>
          </div>
          
          <div className="space-y-3">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300
                  ${agent.status === 'running' ? 'bg-blue-500/10 border-blue-500/30 glow-blue' : ''}
                  ${agent.status === 'completed' ? 'bg-green-500/10 border-green-500/30' : ''}
                  ${agent.status === 'error' ? 'bg-red-500/10 border-red-500/30' : ''}
                  ${agent.status === 'pending' ? 'bg-white/5 border-white/10' : ''}
                `}
              >
                <div className="flex-shrink-0 mt-1">
                  {agent.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </motion.div>
                  )}
                  {agent.status === 'running' && (
                    <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                  )}
                  {agent.status === 'pending' && (
                    <Circle className="h-6 w-6 text-gray-600" />
                  )}
                  {agent.status === 'error' && (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-gray-400">
                      #{agent.id}
                    </span>
                    <span className="text-white">{agent.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">{agent.description}</p>
                  
                  {agent.status === 'running' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                        />
                      </div>
                      <p className="text-xs text-blue-300 mt-2">Procesando...</p>
                    </motion.div>
                  )}
                  
                  {agent.status === 'completed' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-green-300 mt-2"
                    >
                      ✓ Completado
                    </motion.p>
                  )}
                  
                  {agent.status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-300 mt-2"
                    >
                      ✗ Error en procesamiento
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
