import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useMessages } from '../contexts/MessagesContext';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';

const MessagesPage = () => {
  const { conversations, startConversation } = useMessages();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const conversation = startConversation(userId);
      setSelectedConversationId(conversation.id);
      // Remove the user ID from the URL to keep it clean
      navigate('/messages', { replace: true });
    } else if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [userId, startConversation, navigate, conversations, selectedConversationId]);

  return (
    <div className="flex flex-grow border-x border-border-primary pb-16 sm:pb-0">
      <div className="w-full sm:w-[400px] border-l border-border-primary flex flex-col h-screen">
        <div className="p-4 border-b border-border-primary flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-bold">الرسائل</h1>
          <button className="p-2 rounded-full hover:bg-bg-secondary">
            <Settings size={20} />
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </div>
      <div className="hidden sm:flex flex-1 flex-col h-screen">
        {selectedConversationId ? (
          <ChatWindow conversationId={selectedConversationId} />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
            <h2 className="text-2xl font-bold">حدد رسالة</h2>
            <p className="text-text-secondary mt-2 max-w-xs">
              اختر من محادثاتك الحالية، أو ابدأ محادثة جديدة، والمزيد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
