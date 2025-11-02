import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { ChatMessage as ChatMessageType } from '../utils/firebaseConfig';
import { ChatMessage } from './ChatMessage';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (content: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onApproveGeneration?: (messageId: string) => void;
  onRejectGeneration?: (messageId: string) => void;
  isGenerating: boolean;
}

export function ChatInterface({ 
  messages, 
  onSendMessage,
  onEditMessage,
  onRegenerateMessage,
  onApproveGeneration,
  onRejectGeneration,
  isGenerating,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    onSendMessage(input);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Send className="h-10 w-10 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white mb-2">Comienza una conversación</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    Describe el componente que quieres crear. El orquestador te ayudará 
                    a definir todos los detalles antes de generar el código.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage
                    message={message}
                    onEdit={onEditMessage}
                    onRegenerate={onRegenerateMessage}
                    onApprove={onApproveGeneration}
                    onReject={onRejectGeneration}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="glass-effect border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                  <span className="text-gray-300 text-sm">
                    Orquestador pensando...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-white/10 glass-effect p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Input Row */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={handleKeyPress}
                placeholder="Describe el componente que quieres crear..."
                disabled={isGenerating}
                className="min-h-[60px] max-h-[200px] resize-none glass-effect-light border-white/10"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={isGenerating || !input.trim()}
              className="h-[60px] px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Presiona Enter para enviar • Shift + Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}
