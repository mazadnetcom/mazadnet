import { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Conversation, Message } from '../types';

const initialConversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['currentUser', '1'],
    messages: [
      { id: 'm1', senderId: '1', text: 'أهلاً بك! كيف يمكنني المساعدة؟', timestamp: '10:30 صباحًا' },
      { id: 'm2', senderId: 'currentUser', text: 'أهلاً، كنت أستفسر عن إعلان السيارة.', timestamp: '10:31 صباحًا' },
    ],
  },
  {
    id: 'conv2',
    participantIds: ['currentUser', '2'],
    messages: [
      { id: 'm3', senderId: '2', text: 'مرحباً، شكراً لاهتمامك. هل لديك أي أسئلة؟', timestamp: 'أمس' },
    ],
  },
];

interface MessagesContextType {
  conversations: Conversation[];
  getConversationByUserId: (userId: string) => Conversation | undefined;
  sendMessage: (conversationId: string, text: string) => void;
  startConversation: (userId: string) => Conversation;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const getConversationByUserId = useCallback((userId: string) => {
    return conversations.find(c => c.participantIds.includes(userId));
  }, [conversations]);

  const startConversation = useCallback((userId: string) => {
    const existing = conversations.find(c => c.participantIds.includes(userId));
    if (existing) return existing;

    const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds: ['currentUser', userId],
        messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    return newConversation;
  }, [conversations]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'currentUser',
      text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    );
  }, []);

  const value = useMemo(() => ({
    conversations, getConversationByUserId, sendMessage, startConversation
  }), [conversations, getConversationByUserId, sendMessage, startConversation]);

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
