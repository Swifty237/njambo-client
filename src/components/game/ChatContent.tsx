import React, { ChangeEvent, useEffect, useRef, useState, KeyboardEvent, useContext } from "react";
import { ChatMessage, Table } from "../../types/SeatTypesProps";
import { Input } from "../forms/Input";
import gameContext from "../../context/game/gameContext";

interface ChatContentProps {
    currentTable: Table | null;
    onSendMessage: (table: Table, seatId: string, message: string) => void;
}

const ChatContent = React.memo(function ChatContent({ currentTable, onSendMessage }: ChatContentProps) {
    const [localMessage, setLocalMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const storedSeatId = localStorage.getItem("seatId");
    const { sitDown } = useContext(gameContext);
    // Récupérer la valeur de l'input et envoyer le message
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log("currentTable mis à jour:", currentTable);
        console.log("Structure complète de chatRoom:", currentTable?.chatRoom);

        if (currentTable && currentTable.chatRoom && currentTable.chatRoom.chatMessages) {
            console.log("Messages trouvés dans currentTable:", currentTable.chatRoom.chatMessages);

            // Adapter la structure des messages du serveur
            const adaptedMessages = currentTable.chatRoom.chatMessages.map((msg: any) => ({
                name: msg.seat?.player?.name || 'Anonyme',
                message: msg.message,
                seatId: msg.seat?.id || '',
                createdAt: msg.createdAt
            }));

            console.log("Messages adaptés:", adaptedMessages);
            setChatMessages(adaptedMessages);
        }
        // else {
        //     console.log("Pas de messages dans currentTable ou structure manquante", {
        //         hasCurrentTable: !!currentTable,
        //         hasChatRoom: currentTable?.chatRoom ? 'oui' : 'non',
        //         hasChatMessages: currentTable?.chatRoom?.chatMessages ? 'oui' : 'non',
        //         chatRoomStructure: currentTable?.chatRoom
        //     });
        // }
    }, [currentTable]);

    useEffect(() => {
        scrollToBottom();
        console.log("État final des messages:", chatMessages);
    }, [chatMessages]);

    const handleLocalSubmit = () => {
        if (input && input.value.trim() && currentTable && storedSeatId) {
            onSendMessage(currentTable, storedSeatId, input.value.trim());
            input.value = '';
            // sitDown(currentTable.id, storedSeatId, currentTable.seats[storedSeatId].stack)
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
                    if (e.key === 'Enter' && currentTable && storedSeatId) {
                        handleLocalSubmit();
                        setLocalMessage('');
                        // sitDown(currentTable.id, storedSeatId, currentTable.seats[storedSeatId].stack)
                    }
                }}
                placeholder="Écrivez votre message..."
            />
        </>
    );
});

export default ChatContent;