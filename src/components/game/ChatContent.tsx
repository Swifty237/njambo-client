import React, { ChangeEvent, useEffect, useRef, useState, KeyboardEvent, useContext } from "react";
import { ChatMessage, Table } from "../../types/SeatTypesProps";
import { Input } from "../forms/Input";
import gameContext from "../../context/game/gameContext";

interface ChatContentProps {
    currentTable: Table | null;
    seatId: string | null;
    onSendMessage: (table: Table, seatId: string | null, message: string) => void;
}

const ChatContent = React.memo(function ChatContent({ currentTable, seatId, onSendMessage }: ChatContentProps) {
    const [localMessage, setLocalMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Récupérer la valeur de l'input et envoyer le message
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;

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

            console.log("[useEffect] - chatMessages", adaptedMessages);

            setChatMessages(adaptedMessages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTable?.chatRoom.chatMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleLocalSubmit = () => {
        if (input && input.value.trim() && currentTable) {
            // Passer storedSeatId même s'il est null (pour les observateurs)
            console.log("[handleLocalSubmit] - seatId", seatId);
            onSendMessage(currentTable, seatId ? seatId : '', input.value.trim());
            input.value = '';
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
                type="text"
                autoComplete="off"
                value={localMessage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocalMessage(e.target.value)}
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && currentTable) {
                        handleLocalSubmit();
                        setLocalMessage('');
                    }
                }}
                placeholder="Écrivez votre message..."
            />
        </>
    );
});

export default ChatContent;