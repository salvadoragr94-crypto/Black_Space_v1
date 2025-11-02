import { useState } from 'react';
import { Edit2, RefreshCw, Volume2, Check, X, Copy, Image as ImageIcon, FileCode } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ChatMessage as ChatMessageType } from '../utils/firebaseConfig';
import { toast } from 'sonner@2.0.3';

interface ChatMessageProps {
  message: ChatMessageType;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onApprove?: (messageId: string) => void;
  onReject?: (messageId: string) => void;
}

export function ChatMessage({ 
  message, 
  onEdit, 
  onRegenerate,
  onApprove,
  onReject,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSave = () => {
    if (editedContent.trim()) {
      onEdit?.(message.id, editedContent);
      setIsEditing(false);
      toast.success('Mensaje actualizado');
    }
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = 'es-ES';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Error al reproducir audio');
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      toast.error('Tu navegador no soporta síntesis de voz');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('Mensaje copiado');
    } catch (err) {
      toast.error('Error al copiar');
    }
  };

  // Check if this is a summary awaiting approval
  const isAwaitingApproval = message.content.includes('RESUMEN DE COMPONENTE') || 
                             message.content.includes('¿Deseas proceder con la generación?');

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
            : isAwaitingApproval
            ? 'glass-effect border-2 border-orange-500/50 glow-purple text-gray-100'
            : 'glass-effect border border-white/10 text-gray-100'
        }`}
      >
        {/* Header with badges and actions */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            {message.role === 'assistant' && (
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                {isAwaitingApproval ? 'Orquestador - Resumen' : 'Asistente'}
              </Badge>
            )}
            {message.role === 'system' && (
              <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30">
                Sistema
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {message.role === 'user' && onEdit && !isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
            
            {message.role === 'assistant' && onRegenerate && !isAwaitingApproval && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20"
                onClick={() => onRegenerate(message.id)}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}

            {message.role === 'assistant' && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 hover:bg-white/20 ${isSpeaking ? 'text-green-400' : ''}`}
                onClick={handleSpeak}
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/20"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] bg-white/10 border-white/20 text-white"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-3 w-3 mr-1" />
                Guardar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="border-white/20 hover:bg-white/10"
              >
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/10 text-xs"
                  >
                    {attachment.type === 'image' && <ImageIcon className="h-3 w-3" />}
                    {attachment.type === 'css' && <FileCode className="h-3 w-3" />}
                    <span className="truncate">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Approval buttons for orchestrator summaries */}
            {isAwaitingApproval && onApprove && onReject && (
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => onApprove(message.id)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Aceptar y Generar
                </Button>
                <Button
                  onClick={() => onReject(message.id)}
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar
                </Button>
              </div>
            )}
          </>
        )}

        {/* Timestamp */}
        <span className="text-xs opacity-60 mt-2 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
