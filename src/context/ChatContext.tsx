import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL, getHeaders } from '../api/config';
import { useAuth } from './AuthContext';

interface Message {
    id?: string;
    content: string;
    senderId: string;
    receiverId?: string;
    createdAt?: string;
}

interface ChatContextType {
    socket: Socket | null;
    messages: Message[];
    sendMessage: (receiverId: string, content: string) => Promise<void>;
    joinRoom: (room: string) => void;
    currentRoom: string | null;
    loadConversation: (otherUserId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);

    useEffect(() => {
        // Connect to same host but port 4000 (or API_URL base)
        const socketHost = API_URL.replace('/api', '');

        const newSocket = io(socketHost);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("Connected to socket");
            if (user) {
                newSocket.emit('join_room', user.id); // Join personal notification room
            }
        });

        newSocket.on('receive_message', (data: Message) => {
            // Append only if it belongs to current conversation or notify
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const joinRoom = (room: string) => {
        if (socket) {
            socket.emit('join_room', room);
            // setCurrentRoom(room); // Should be handled by loadConversation for UI state
        }
    };

    const loadConversation = async (otherUserId: string) => {
        try {
            const res = await fetch(`${API_URL}/messages/${otherUserId}`, {
                headers: getHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                setCurrentRoom(otherUserId);
            }
        } catch (e) { console.error(e); }
    };

    const sendMessage = async (receiverId: string, content: string) => {
        if (!user) return;

        try {
            const res = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ receiverId, content })
            });

            if (res.ok) {
                const savedMsg = await res.json();
                setMessages(prev => [...prev, savedMsg]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ChatContext.Provider value={{ socket, messages, sendMessage, joinRoom, currentRoom, loadConversation }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};
