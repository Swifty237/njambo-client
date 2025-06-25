export interface Player {
    socketId: string;
    userId: string;
    name: string;
    chipsAmount: string;
}

export interface CardProps {
    suit: string,
    rank: string
}

export interface ChatMessage {
    name: string;
    message: string;
    seatId: string;
    createdAt: Date;
}

export interface ChatRoom {
    chatMessages: ChatMessage[];
}

export interface SeatData {
    id: string;
    turn: boolean;
    stack: number;
    sittingOut: boolean;
    player: Player;
    bet: number;
    hand: CardProps[];
    playedHand: CardProps[];
    lastAction?: string;
    showingCards?: boolean;
}

export interface Table {
    id: string;
    name: string;
    seats: { [seatId: string]: SeatData };
    bet: number;
    callAmount: number;
    pot: number;
    winMessages: string;
    button: string;
    handOver: boolean;
    isPrivate?: boolean;
    createdAt?: string;
    demandedSuit: string;
    currentRoundCards: CardProps[];
    roundNumber: number;
    link: string;
    chatRoom: ChatRoom;
}

export interface SeatProps {
    currentTable: Table;
    seatNumber: string;
    isPlayerSeated: boolean;
    sitDown: (tableId: string, seatNumber: string, amount: number) => void;
}

export interface TableUpdatedPayload {
    table: Table;
    message: string;
    from: string;
}

export interface TableEventPayload {
    tables: { [key: string]: Table };
    tableId: string;
}
