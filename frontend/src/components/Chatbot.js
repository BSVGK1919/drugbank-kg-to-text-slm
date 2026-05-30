import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Dna } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m DrugKG AI Assistant. I can help you understand drug interactions, mechanisms, and convert knowledge graph triples into natural language. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        history: messages.slice(-6) // Send last 6 messages for context
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again or use the Generate feature for knowledge graph transformations.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg hover:bg-violet-500 transition-all group"
        style={{ zIndex: 99999 }}
        data-testid="chatbot-toggle"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-10 right-0 bg-neutral-800 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask DrugKG AI
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl flex flex-col overflow-hidden"
          style={{ zIndex: 99999 }}
          data-testid="chatbot-window"
        >
          {/* Header */}
          <div className="bg-violet-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Dna className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">DrugKG AI Assistant</h3>
              <p className="text-xs text-violet-200">Pharmaceutical Knowledge Expert</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-neutral-800 text-neutral-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 rounded-lg px-4 py-3">
                  <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about drugs, interactions..."
                className="flex-1 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-violet-500 placeholder:text-neutral-500"
                rows={1}
                data-testid="chatbot-input"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-violet-600 hover:bg-violet-500 p-2.5 rounded-lg"
                data-testid="chatbot-send"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Powered by AI • Knowledge Graph Expert
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
