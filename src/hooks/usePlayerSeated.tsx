import { useContext, useEffect, useState } from 'react';
import gameContext from '../context/game/gameContext';

export const usePlayerSeated = (): boolean => {
    const { isPlayerSeated: contextPlayerSeated, currentTable, seatId } = useContext(gameContext);
    const [playerSeated, setPlayerSeated] = useState(false);

    useEffect(() => {
        console.log('🔍 [usePlayerSeated] Hook exécuté avec:', {
            contextPlayerSeated,
            currentTable: !!currentTable,
            seatId,
            currentTableSeats: currentTable?.seats ? Object.keys(currentTable.seats) : 'undefined'
        });

        // Vérifier d'abord dans localStorage
        const storedPlayerSeated = localStorage.getItem('isPlayerSeated');
        const storedSeatId = localStorage.getItem('seatId');

        console.log('🔍 [usePlayerSeated] localStorage actuel:', {
            storedPlayerSeated,
            storedSeatId
        });

        // Logique de priorité pour déterminer l'état
        let isSeated = false;

        // 1. Si on a un seatId dans le contexte et que le siège existe dans currentTable
        if (seatId && currentTable?.seats?.[seatId]) {
            console.log('✅ [usePlayerSeated] Cas 1: seatId contexte + siège existe');
            isSeated = true;
        }
        // 2. Sinon, vérifier localStorage SEULEMENT si currentTable est disponible
        else if (storedPlayerSeated === "true" && storedSeatId) {
            if (currentTable && currentTable.seats) {
                // currentTable est disponible, on peut vérifier
                if (currentTable.seats[storedSeatId]) {
                    console.log('✅ [usePlayerSeated] Cas 2a: localStorage valide + siège existe');
                    isSeated = true;
                } else {
                    console.log('❌ [usePlayerSeated] Cas 2b: localStorage invalide, nettoyage');
                    // Nettoyer localStorage si le siège n'existe plus
                    localStorage.removeItem('isPlayerSeated');
                    localStorage.removeItem('seatId');
                    isSeated = false;
                }
            } else {
                // currentTable pas encore disponible, faire confiance au localStorage
                console.log('⏳ [usePlayerSeated] Cas 2c: currentTable indisponible, confiance localStorage');
                isSeated = true;
            }
        }
        // 3. Fallback sur le contexte
        else {
            console.log('🔄 [usePlayerSeated] Cas 3: fallback contexte');
            isSeated = contextPlayerSeated;
        }

        console.log('🎯 [usePlayerSeated] Résultat final:', { isSeated });
        setPlayerSeated(isSeated);

        // Synchroniser localStorage avec l'état déterminé SEULEMENT si on a des données fiables
        if (isSeated && seatId && currentTable) {
            console.log('💾 [usePlayerSeated] Sauvegarde localStorage');
            localStorage.setItem('isPlayerSeated', 'true');
            localStorage.setItem('seatId', seatId);
        } else if (!isSeated && currentTable) {
            // Ne nettoyer que si currentTable est disponible (données fiables)
            console.log('🧹 [usePlayerSeated] Nettoyage localStorage (currentTable disponible)');
            localStorage.removeItem('isPlayerSeated');
            localStorage.removeItem('seatId');
        }

    }, [contextPlayerSeated, currentTable, seatId]);

    return playerSeated;
};

export default usePlayerSeated;
