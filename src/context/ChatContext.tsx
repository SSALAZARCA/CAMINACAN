import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../api/config';
import { useAuth } from './AuthContext';

interface Message {
    id?: string;
    content: string;
    senderId: string;
    createdAt?: string;
}

interface ChatContextType {
    socket: Socket | null;
    messages: Message[];
    sendMessage: (room: string, content: string) => void;
    joinRoom: (room: string) => void;
    currentRoom: string | null;
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
        // Example: http://localhost:4000/api -> http://localhost:4000

        const newSocket = io(socketHost);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("Connected to socket");
            if (user) {
                newSocket.emit('join_room', user.id); // Join personal notification room
            }
        });

        newSocket.on('receive_message', (data: Message) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const joinRoom = (room: string) => {
        if (socket) {
            socket.emit('join_room', room);
            setCurrentRoom(room);
            setMessages([]); // Clear (or ideally fetch history)
        }
    };

    const sendMessage = (room: string, content: string) => {
        if (socket && user) {
            const msgData = {
                room,
                content,
                senderId: user.id,
                createdAt: new Date().toISOString()
            };
            socket.emit('send_message', msgData);
            setMessages((prev) => [...prev, msgData]);
        }
    };

    return (
        <ChatContext.Provider value={{ socket, messages, sendMessage, joinRoom, currentRoom }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};
