import React, { useState, useRef, useEffect } from 'react';
import { Language, LessonResponse, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { chatWithAssistant } from '../services/geminiService';

interface ChatWidgetProps {
  currentLang: Language;
  lessonContext: LessonResponse;
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ currentLang, lessonContext, messages, onMessagesChange }) => {
  const t = TRANSLATIONS[currentLang];
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    onMessagesChange(newMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
       const responseText = await chatWithAssistant(newMessages, input, lessonContext, currentLang);
       onMessagesChange([...newMessages, { role: 'model', content: responseText || "Error." }]);
    } catch (error) {
       console.error(error);
       onMessagesChange([...newMessages, { role: 'model', content: "I apologize, but I encountered an error responding to that. Please try again." }]);
    } finally {
       setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] print:h-auto bg-white chat-widget-root">
      <div className="flex-grow overflow-y-auto print:overflow-visible p-6 space-y-6 bg-slate-50/50 chat-messages-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 shadow-sm flex-shrink-0 text-xs">
                    AI
                </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-navy-900 text-white rounded-br-sm' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-fade-in-up">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-2 shadow-sm flex-shrink-0 text-xs">
                    AI
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 print:hidden no-print">
        <div className="flex gap-2 items-end bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-gold-500/50 focus-within:border-gold-500 transition-all shadow-sm">
            <textarea
            ref={textareaRef}
            rows={1}
            className="flex-grow bg-transparent border-none outline-none text-sm resize-none p-2 max-h-[120px]"
            placeholder={t.typeQuestion}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gold-500 text-white p-2 rounded-lg hover:bg-gold-600 disabled:opacity-50 transition-colors shadow-sm flex-shrink-0 mb-0.5"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
            AI can make mistakes. Please verify important legal information.
        </p>
      </div>
    </div>
  );
};