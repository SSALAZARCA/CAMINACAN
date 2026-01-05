import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { User, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import type { Conversation } from '../context/ChatContext';

const MessagesPage = () => {
    const { user } = useAuth();
    const { socket, conversations, messages, sendMessage, loadConversation, fetchConversations } = useChat();
    const location = useLocation();

    const [activeChat, setActiveChat] = useState<Conversation | null>(null); // The other user
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchConversations();
    }, [user]);

    // Handle deep link to chat
    useEffect(() => {
        const targetId = location.state?.createChatWith;
        if (targetId) {
            if (activeChat?.userId === targetId) return;

            const existing = conversations.find(c => c.userId === targetId);
            if (existing) {
                setActiveChat(existing);
                loadConversation(existing.userId);
            } else {
                // Init temporary chat UI
                const tempChat: Conversation = {
                    userId: targetId,
                    name: 'Chat',
                    lastMessage: '',
                    timestamp: new Date().toISOString(),
                    unread: false
                };
                setActiveChat(tempChat);
                loadConversation(targetId);
            }
        }
    }, [location.state, conversations]);


    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        await sendMessage(activeChat.userId, newMessage);
        setNewMessage('');
    };


    return (
        <div className="bg-gray-50 min-h-screen py-4 md:py-8">
            <div className="max-w-6xl mx-auto px-4 h-[85vh] md:h-[80vh] flex md:gap-6 bg-transparent">

                {/* Conversations List */}
                <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-col`}>
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MessageCircle className="text-primary" /> Mensajes
                        </h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {conversations.length === 0 ? (
                            <p className="p-6 text-center text-gray-400">No tienes conversaciones</p>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.userId}
                                    onClick={() => {
                                        setActiveChat(conv);
                                        loadConversation(conv.userId);
                                    }}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${activeChat?.userId === conv.userId ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                            {conv.avatar ? (
                                                <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className={`font-bold truncate ${conv.unread ? 'text-black' : 'text-gray-700'}`}>{conv.name}</h4>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {new Date(conv.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${conv.unread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                        {conv.unread && (
                                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} w-full md:flex-1 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-col`}>
                    {activeChat ? (
                        <>
                            <div className="p-3 md:p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2 md:gap-3">
                                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-full mr-1">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {activeChat.avatar ? (
                                        <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-400" size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                                    <span className="text-xs text-green-500 font-medium">En línea</span>
                                </div>
                            </div>

                            <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
                                {messages.map(msg => {
                                    const isMe = msg.senderId === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-2xl text-sm ${isMe
                                                ? 'bg-primary text-gray-900 rounded-br-none shadow-sm'
                                                : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-yellow-700/60' : 'text-gray-400'}`}>
                                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-3 md:p-4 bg-white border-t border-gray-100">
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Escribe un mensaje..."
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-primary text-gray-900 p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-8">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-600 mb-2">Tus Mensajes</h3>
                            <p>Selecciona una conversación para empezar a chatear.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;
