import { create } from 'zustand';
import { io } from 'socket.io-client';
import useMessageStore from './messageStore';

const SOCKET_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:5000' 
  : window.location.origin;

const useSocketStore = create((set, get) => {
  // Create socket instance
  let socket = null;

  return {
    socket: null,
    connected: false,
    
    // Initialize socket connection
    initializeSocket: (userId) => {
      if (!socket) {
        socket = io(SOCKET_URL);
        
        socket.on('connect', () => {
          console.log('Socket connected');
          set({ socket, connected: true });
          
          // Join user-specific room
          if (userId) {
            socket.emit('joinUserRoom', userId);
          }
        });
        
        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          set({ connected: false });
        });
        
        // Handle incoming messages
        socket.on('newMessage', (message) => {
          const messageStore = useMessageStore.getState();
          
          // If we're in the same conversation, add to messages
          if (messageStore.currentConversation === message.conversationId) {
            messageStore.addMessageToState(message);
          }
          
          // Update conversation list
          messageStore.fetchConversations();
        });
        
        // Handle message delivery confirmation
        socket.on('messageDelivered', ({ messageId }) => {
          const messageStore = useMessageStore.getState();
          messageStore.updateMessageStatus(messageId, 'delivered');
        });
        
        // Handle message read confirmation
        socket.on('messageRead', ({ messageId }) => {
          const messageStore = useMessageStore.getState();
          messageStore.updateMessageStatus(messageId, 'read');
        });
      }
      
      set({ socket, connected: socket.connected });
    },
    
    // Disconnect socket
    disconnectSocket: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        set({ socket: null, connected: false });
      }
    },
    
    // Send a message through socket
    sendMessage: (message) => {
      if (socket && get().connected) {
        socket.emit('sendMessage', message);
      }
    },
    
    // Mark a message as read
    markMessageAsRead: (messageId, userId) => {
      if (socket && get().connected) {
        socket.emit('messageRead', { messageId, userId });
      }
    }
  };
});

export default useSocketStore;