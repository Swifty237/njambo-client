import { useContext, useEffect, useState } from 'react';
import gameContext from '../context/game/gameContext';

export const usePlayerSeated = (): boolean => {
    const { isPlayerSeated: contextPlayerSeated, currentTable, seatId } = useContext(gameContext);
    const [playerSeated, setPlayerSeated] = useState(false);

    useEffect(() => {
        // Vérifier d'abord dans localStorage
        const storedPlayerSeated = localStorage.getItem('isPlayerSeated');
        const storedSeatId = localStorage.getItem('seatId');

        // Logique de priorité pour déterminer l'état
        let isSeated = false;

        // 1. Si on a un seatId dans le contexte et que le siège existe dans currentTable
        if (seatId && currentTable?.seats?.[seatId]) {
            isSeated = true;
        }
        // 2. Sinon, vérifier localStorage
        else if (storedPlayerSeated === "true" && storedSeatId) {
            // Vérifier que le siège stocké existe toujours dans la table actuelle
            if (currentTable?.seats?.[storedSeatId]) {
                isSeated = true;
            } else {
                // Nettoyer localStorage si le siège n'existe plus
                localStorage.removeItem('isPlayerSeated');
                localStorage.removeItem('seatId');
                isSeated = false;
            }
        }
        // 3. Fallback sur le contexte
        else {
            isSeated = contextPlayerSeated;
        }

        setPlayerSeated(isSeated);

        // Synchroniser localStorage avec l'état déterminé
        if (isSeated && seatId) {
            localStorage.setItem('isPlayerSeated', 'true');
            localStorage.setItem('seatId', seatId);
        } else if (!isSeated) {
            localStorage.removeItem('isPlayerSeated');
            localStorage.removeItem('seatId');
        }

    }, [contextPlayerSeated, currentTable, seatId]);

    return playerSeated;
};

export default usePlayerSeated;
