import React, { ChangeEvent, useEffect, useRef, useState, KeyboardEvent } from "react";
import { ChatMessage, Table } from "../../types/SeatTypesProps";
import { Input } from "../forms/Input";

interface ChatContentProps {
    currentTable: Table | null;
    seatId: string | null;
    onSendMessage: (table: Table, seatId: string | null, message: string) => void;
}

const ChatContent = React.memo(function ChatContent({ currentTable, seatId, onSendMessage }: ChatContentProps) {
    const [localMessage, setLocalMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (currentTable && currentTable.chatRoom && currentTable.chatRoom.chatMessages) {
            // Adapter la structure des messages du serveur
            const adaptedMessages = currentTable.chatRoom.chatMessages.map((msg: ChatMessage) => ({
                // name: msg.seat?.player?.name || 'Anonyme',
                name: `${!msg.seatId ? '(Observateur)' : msg.name}`,
                message: msg.message,
                seatId: msg.seatId,
                createdAt: msg.createdAt
            }));

            setChatMessages(adaptedMessages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTable?.chatRoom.chatMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // Focus automatique sur l'input quand le composant se monte (modal s'ouvre)
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleLocalSubmit = () => {
        if (localMessage.trim() && currentTable) {
            // Passer storedSeatId même s'il est null (pour les observateurs)
            onSendMessage(currentTable, seatId ? seatId : '', localMessage.trim());
            setLocalMessage('');
            // Remettre le focus sur l'input après l'envoi
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <>
            <div
                style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    overflowY: 'auto',
                    maxHeight: '300px'
                }}>
                <ul
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        background: '#ecf0f1',
                        listStyle: 'none',
                        color: '#7f8c8d',
                        padding: '10px',
                        margin: 0
                    }}>
                    {chatMessages.length > 0 ? chatMessages.map((msg, index) => (
                        <li key={index} style={{ margin: '5px 0' }}>
                            <strong style={{ color: '#2c3e50' }}>{msg.name}:</strong>{' '}
                            <span>{msg.message}</span>
                        </li>
                    )) : (
                        <li style={{ margin: '5px 0', fontStyle: 'italic' }}>
                            <span>Aucun message pour le moment...</span>
                        </li>
                    )}
                    <div ref={messagesEndRef} />
                </ul>
            </div>

            <Input
                ref={inputRef}
                type="text"
                autoComplete="off"
                value={localMessage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalMessage(e.target.value)}
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && currentTable) {
                        handleLocalSubmit();
                    }
                }}
                placeholder="Écrivez votre message..."
            />
        </>
    );
});

export default ChatContent;
