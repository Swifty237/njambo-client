import { useEffect, useRef } from 'react';

interface UsePageReloadOptions {
    shouldReload?: boolean;
    onReloadComplete?: () => void;
}

const usePageReload = (options: UsePageReloadOptions = {}) => {
    const { shouldReload = false, onReloadComplete } = options;
    const hasReloadedRef = useRef(false);

    useEffect(() => {
        // Vérifier si on doit recharger et si on n'a pas déjà rechargé
        if (shouldReload && !hasReloadedRef.current) {
            hasReloadedRef.current = true;

            // Marquer qu'on a rechargé pour éviter les boucles infinies
            sessionStorage.setItem('hasReloaded', 'true');

            // Callback optionnel avant rechargement
            if (onReloadComplete) {
                onReloadComplete();
            }

            // Recharger la page
            window.location.reload();
        }
    }, [shouldReload, onReloadComplete]);

    // Fonction pour vérifier si on vient de recharger
    const hasJustReloaded = () => {
        const reloaded = sessionStorage.getItem('hasReloaded') === 'true';
        if (reloaded) {
            // Nettoyer le flag après vérification
            sessionStorage.removeItem('hasReloaded');
        }
        return reloaded;
    };

    // Fonction pour déclencher un rechargement
    const triggerReload = () => {
        if (!hasReloadedRef.current) {
            hasReloadedRef.current = true;
            sessionStorage.setItem('hasReloaded', 'true');
            window.location.reload();
        }
    };

    return {
        hasJustReloaded,
        triggerReload
    };
};

export default usePageReload;
