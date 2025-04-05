import StudentSidebar from '@/components/student_dashboard/StudentSidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, CheckCheck } from 'lucide-react'
import { Bs1CircleFill } from "react-icons/bs";
import React, { useEffect, useState, useRef } from 'react'
import useMessageStore from '@/store/messageStore';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/include/LoadingSpinner';
import { format } from 'date-fns';

const MessageStatus = ({ status }) => {
    switch (status) {
        case 'sent':
            return <Check className="size-4 text-gray-500" />;
        case 'delivered':
            return <CheckCheck className="size-4 text-gray-500" />;
        case 'read':
            return <CheckCheck className="size-4 text-blue-500" />;
        case 'unread':
            return <Bs1CircleFill className="size-4 text-primaryBgColor fill-primaryBgColor" />;
        default:
            return null;
    }
};

const ChatInterface = ({ conversation }) => {
    const { messages, sendMessage, markAsRead, fetchMessages } = useMessageStore();
    const { user } = useAuthStore();
    const [newMessage, setNewMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (conversation) {
            fetchMessages(conversation._id);
        }
    }, [conversation, fetchMessages]);

    // Mark messages as read when viewed
    useEffect(() => {
        const markUnreadMessages = async () => {
            if (conversation && user) {
                const unreadMessages = messages.filter(
                    msg => msg.recipient === user._id && msg.status !== 'read'
                );
                
                for (const message of unreadMessages) {
                    await markAsRead(message._id);
                }
            }
        };
        
        markUnreadMessages();
    }, [messages, conversation, user, markAsRead]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim() && !sendingMessage) {
            try {
                setSendingMessage(true);
                
                // Get the other user's ID (not the current user)
                const recipientId = conversation.participants.find(
                    p => p._id !== user._id
                )._id;
                
                await sendMessage(recipientId, newMessage);
                setNewMessage("");
            } catch (error) {
                console.error("Failed to send message:", error);
            } finally {
                setSendingMessage(false);
            }
        }
    };

    const formatTime = (timestamp) => {
        return format(new Date(timestamp), 'HH:mm');
    };

    // Determine the other participant (not the current user)
    const otherParticipant = conversation?.participants.find(
        p => p._id !== user?._id
    );

    return (
        <div className="w-full h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 rounded-lg flex items-center space-x-3 bg-[#181818]">
                <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white text-lg font-bold">
                    {otherParticipant?.username?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className='items-center space-y-0'>
                    <h2 className="font-semibold text-white">{otherParticipant?.username || "User"}</h2>
                    <p className="text-gray-400">
                        {otherParticipant?.role === 'landlord' ? 'Landlord' : 'Student'}
                    </p>
                </div>
            </div>

            {/* Chat Messages Area */}
            <ScrollArea className="h-[calc(100vh-178px)]">
                <div className="flex-1 p-4 overflow-y-auto space-y-4"
                    style={{
                        backgroundImage: 'url(/chat-background.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    {messages.map((message) => {
                        const isCurrentUser = message.sender === user?._id;
                        
                        return (
                            <div key={message._id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${isCurrentUser ?
                                    'bg-[#181818] text-white' :
                                    'bg-white text-[#181818]'} p-3 rounded-lg shadow`}>

                                    <p className="text-base">{message.content}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className={`text-xs ${isCurrentUser ?
                                            'text-gray-400' :
                                            'text-gray-500'} text-right mt-1`}>
                                            {formatTime(message.createdAt)}
                                        </p>
                                        {isCurrentUser && <MessageStatus status={message.status} />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} /> {/* Scroll anchor */}
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-[#181818] rounded-lg">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-primaryBgColor"
                        disabled={sendingMessage}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sendingMessage}
                        className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                        {sendingMessage ? '...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const StdInbox = () => {
    const { fetchConversations, conversations, clearMessages } = useMessageStore();
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Inbox';
        
        const loadConversations = async () => {
            if (isAuthenticated && user) {
                try {
                    await fetchConversations();
                } catch (error) {
                    console.error("Failed to fetch conversations:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        if (!authLoading) {
            loadConversations();
        }
    }, [isAuthenticated, user, fetchConversations, authLoading]);

    const handleChatSelect = (conversation) => {
        setSelectedConversation(conversation);
    };

    const truncateText = (text, maxLength = 16) => {
        return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // Get the unread count for a specific conversation
    const getUnreadCount = (conversation) => {
        return conversation.unreadCount?.[user?._id] || 0;
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex h-screen bg-white">
            <div><StudentSidebar /></div>

            <div className="flex-1 p-4" style={{ marginLeft: '210px' }}>
                <div className="flex justify-between w-full h-fulFl gap-4">
                    {/* Chatting Section */}
                    <div className="w-3/4 bg-white rounded-lg shadow-md" 
                         style={{ 
                             backgroundImage: 'url(/chat-background.jpg)', 
                             backgroundSize: 'cover', 
                             backgroundPosition: 'center' 
                         }}>
                        {selectedConversation ? (
                            <ChatInterface conversation={selectedConversation} />
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <h1 className='bg-white text-primaryBgColor rounded-lg p-2'
                                    style={{ userSelect: 'none' }}>
                                    Select a chat to start messaging
                                </h1>
                            </div>
                        )}
                    </div>

                    {/* All Message Section */}
                    <div className="w-1/4 bg-white rounded-lg shadow-md p-4 px-2 overflow-hidden">
                        <h1 className="font-semibold text-xl text-primaryBgColor">All Messages</h1>

                        <ScrollArea className="h-[calc(100vh-100px)]">
                            <div className='mt-5'>
                                {conversations.length > 0 ? (
                                    conversations.map(conversation => {
                                        // Get the other participant (not the current user)
                                        const otherParticipant = conversation.participants.find(
                                            p => p._id !== user._id
                                        );
                                        
                                        // Format the last message time
                                        const lastMessageTime = conversation.lastMessage?.createdAt 
                                            ? format(new Date(conversation.lastMessage.createdAt), 'HH:mm')
                                            : '';
                                        
                                        // Determine if this conversation has unread messages
                                        const unreadCount = getUnreadCount(conversation);
                                        const hasUnread = unreadCount > 0;
                                        
                                        return (
                                            <div 
                                                key={conversation._id}
                                                className={`flex items-center space-x-3 mb-4 hover:bg-gray-100 rounded-md w-full p-1 py-2 px-2 cursor-pointer ${
                                                    selectedConversation?._id === conversation._id ? 'bg-gray-100' : ''
                                                }`}
                                                onClick={() => handleChatSelect(conversation)}
                                            >
                                                <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                                    {otherParticipant?.username?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                <div className="min-w-0">
                                                    <h1 className="font-semibold truncate text-primaryBgColor">
                                                        {otherParticipant?.username || "User"}
                                                    </h1>
                                                    <div className='flex items-center space-y-0 space-x-1'>
                                                        <MessageStatus status={hasUnread ? "unread" : "read"} />
                                                        <p className="text-gray-600">
                                                            {truncateText(conversation.lastMessage?.content || "No messages yet")}
                                                        </p>
                                                    </div>
                                                </div>
                                                {lastMessageTime && (
                                                    <span className="text-xs text-gray-500 ml-auto flex-shrink-0">
                                                        {lastMessageTime}
                                                    </span>
                                                )}
                                                {hasUnread && (
                                                    <span className="flex-shrink-0 w-5 h-5 bg-primaryBgColor rounded-full text-white text-xs flex items-center justify-center">
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No conversations yet
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StdInbox;