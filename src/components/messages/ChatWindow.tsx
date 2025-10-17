import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useMessages } from '../../contexts/MessagesContext';
import { useUsers } from '../../contexts/UsersContext';
import { cn } from '../../lib/utils';

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow = ({ conversationId }: ChatWindowProps) => {
  const { conversations, sendMessage } = useMessages();
  const { getUserById } = useUsers();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) return null;

  const otherUserId = conversation.participantIds.find(id => id !== 'currentUser');
  const otherUser = otherUserId ? getUserById(otherUserId) : null;

  if (!otherUser) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(conversationId, newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-border-primary flex items-center gap-3">
        <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-bold">{otherUser.name}</h2>
          <p className="text-sm text-text-secondary">{otherUser.username}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(msg => {
          const isMe = msg.senderId === 'currentUser';
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-xs md:max-w-md p-3 rounded-2xl", isMe ? "bg-twitter-blue text-white rounded-br-lg" : "bg-bg-secondary rounded-bl-lg")}>
                <p className="break-words">{msg.text}</p>
                <p className={cn("text-xs mt-1", isMe ? "text-blue-200" : "text-text-secondary")}>{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-border-primary">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-bg-secondary rounded-full px-4 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="ابدأ رسالة جديدة"
            className="flex-1 bg-transparent outline-none"
          />
          <button type="submit" className="p-2 rounded-full bg-twitter-blue text-white disabled:opacity-50" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
