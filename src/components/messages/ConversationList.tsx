import { useUsers } from '../../contexts/UsersContext';
import { Conversation } from '../../types';
import { cn } from '../../lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList = ({ conversations, selectedConversationId, onSelectConversation }: ConversationListProps) => {
  const { getUserById } = useUsers();

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conv => {
        const otherUserId = conv.participantIds.find(id => id !== 'currentUser');
        const user = otherUserId ? getUserById(otherUserId) : null;
        const lastMessage = conv.messages[conv.messages.length - 1];

        if (!user) return null;

        return (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={cn(
              "w-full text-right flex gap-3 p-4 border-b border-border-primary hover:bg-bg-secondary transition-colors",
              conv.id === selectedConversationId && "bg-bg-secondary"
            )}
          >
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between">
                <p className="font-bold truncate">{user.name}</p>
                {lastMessage && <p className="text-sm text-text-secondary flex-shrink-0">{lastMessage.timestamp}</p>}
              </div>
              <p className="text-sm text-text-secondary truncate">{lastMessage ? `${lastMessage.senderId === 'currentUser' ? 'أنت: ' : ''}${lastMessage.text}` : 'ابدأ المحادثة'}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
