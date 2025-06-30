import { useContext } from 'react';
import gameContext from '../context/game/gameContext';

export const usePlayerSeated = (): boolean => {
    const { isPlayerSeated: contextPlayerSeated } = useContext(gameContext);

    // Vérifier d'abord dans localStorage
    const storedPlayerSeated = localStorage.getItem('isPlayerSeated');

    // Si la valeur existe dans localStorage, l'utiliser (convertir "true"/"false" en boolean)
    if (storedPlayerSeated !== null) {
        return storedPlayerSeated === "true";
    }

    // Sinon, utiliser la valeur du contexte
    return contextPlayerSeated;
};

export default usePlayerSeated;
