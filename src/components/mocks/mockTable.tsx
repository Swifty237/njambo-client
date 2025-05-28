
interface CardProps {
    suit: string,
    rank: string
}

interface Player {
    name: string;
}

interface SeatData {
    id: string;
    turn: boolean;
    stack: number;
    sittingOut: boolean;
    player: Player;
    bet: number;
    hand: CardProps[];
    lastAction?: string;
}

interface Table {
    id: string;
    name: string;
    seats: { [seatId: string]: SeatData | null };
    limit: number;
    minBet: number;
    callAmount: number;
    pot: number;
    minRaise: number;
    board: CardProps[];
    winMessages: string;
    button: string;
    handOver: boolean;
}

const mockTable: Table = {
    id: "1",
    name: "Mock Table",
    pot: 150,
    limit: 500,
    minBet: 50,
    minRaise: 100,
    callAmount: 50,
    board: [],
    winMessages: "",
    button: "1",
    handOver: false,
    seats: {
        "1": {
            id: "1",  // ajouté ici
            player: { name: "Bot1" },
            sittingOut: false,
            stack: 950,
            bet: 50,
            hand: [],
            turn: false,
        },
        "2": {
            id: "2",
            player: { name: "Bot2" },
            sittingOut: false,
            stack: 1000,
            bet: 0,
            hand: [],
            turn: false,
        },
        "3": {
            id: "3",
            player: { name: "Bot3" },
            sittingOut: false,
            stack: 1000,
            bet: 0,
            hand: [],
            turn: false,
        },
        "4": null,
    },
};

export default mockTable;