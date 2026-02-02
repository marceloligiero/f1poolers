
import React, { useState } from 'react';
import { MOCK_CHAT } from '../constants';
import { ChatMessage, User } from '../types';
import { fetchPunditGossip } from '../services/geminiService';

interface ChatWidgetProps {
    raceName: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ raceName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAskPundit = async () => {
    setIsGenerating(true);
    const gossip = await fetchPunditGossip(raceName);
    const punditMessage: ChatMessage = {
        id: new Date().toISOString(),
        user: { 
            username: 'AI Pundit', 
            avatarUrl: 'https://picsum.photos/seed/aipundit/40/40',
            isPundit: true
        },
        message: gossip,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, punditMessage]);
    setIsGenerating(false);
  };
    
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl flex flex-col h-[500px]">
      <h2 className="text-xl font-bold p-4 text-red-500 border-b border-gray-700">
        Paddock Gossip
      </h2>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.user.isPundit ? 'flex-row-reverse' : ''}`}>
             <img src={msg.user.avatarUrl} alt={msg.user.username} className="w-8 h-8 rounded-full" />
            <div className={`p-3 rounded-lg max-w-xs ${msg.user.isPundit ? 'bg-indigo-600' : 'bg-gray-700'}`}>
              <p className="text-sm font-semibold">{msg.user.username}</p>
              <p className="text-sm text-gray-200">{msg.message}</p>
              <p className="text-xs text-gray-400 text-right mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {isGenerating && (
             <div className="flex items-start gap-3 flex-row-reverse">
                <img src="https://picsum.photos/seed/aipundit/40/40" alt="AI Pundit" className="w-8 h-8 rounded-full" />
                <div className="p-3 rounded-lg max-w-xs bg-indigo-600">
                    <p className="text-sm text-gray-200 italic">Pundit is thinking...</p>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="flex-grow bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
        />
        <button onClick={handleAskPundit} disabled={isGenerating} title="Ask AI Pundit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:bg-gray-600">
            <i className="fas fa-robot"></i>
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
