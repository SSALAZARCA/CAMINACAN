import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';

const Notifications: React.FC = () => {
    const { messages, currentRoom } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Mock initial notifications + real socket messages
    const [notificationList, setNotificationList] = useState<any[]>([
        { id: '1', title: 'Bienvenido', message: 'Gracias por unirte a CaminaCan', type: 'info', time: 'Ahora' }
    ]);

    useEffect(() => {
        // When a new message arrives (and we are not in that room), add as notification
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && !currentRoom) {
            setNotificationList(prev => [
                {
                    id: Date.now().toString(),
                    title: 'Nuevo Mensaje',
                    message: lastMsg.content,
                    type: 'info',
                    time: 'Ahora'
                },
                ...prev
            ]);
            setUnreadCount(prev => prev + 1);
        }
    }, [messages, currentRoom]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setUnreadCount(0);
    };

    return (
        <div className="relative">
            <button onClick={toggleOpen} className="p-2 relative hover:bg-gray-100 rounded-full transition-colors">
                <Bell size={24} className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-bold text-gray-900">Notificaciones</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notificationList.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-sm">
                                        No tienes notificaciones nuevas
                                    </div>
                                ) : (
                                    notificationList.map((notif) => (
                                        <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative">
                                            <div className="flex gap-3">
                                                <div className={`w-2 h-full absolute left-0 top-0 bottom-0 ${notif.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm text-gray-900">{notif.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                                    <span className="text-[10px] text-gray-400 mt-2 block">{notif.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notifications;
