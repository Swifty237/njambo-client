import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { Table } from '../types/SeatTypesProps';
import gameContext from '../context/game/gameContext';

const useTable = () => {
    const SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const [isOnTable, setIsOnTable] = useState(false);
    const { currentTable, joinTable } = useContext(gameContext);
    const [tableError, setTableError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getErrorMessage = (error: any): string => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    return 'Requête invalide. Veuillez réessayer.';
                case 401:
                    return 'Non autorisé à rejoindre cette table.';
                case 404:
                    return 'Table non trouvée.';
                case 500:
                    return 'Erreur du serveur. Veuillez réessayer plus tard.';
                default:
                    return 'Une erreur est survenue lors de la connexion à la table.';
            }
        } else if (error.request) {
            return 'Problème de connexion. Vérifiez votre connexion internet.';
        } else {
            return 'Une erreur inattendue est survenue.';
        }
    };

    const leaveTable = async () => {
        console.log('🚪 [useTable] Déconnexion de la table...');

        try {
            const storedLink = localStorage.getItem('storedLink');
            const storedSeatId = localStorage.getItem('seatId');

            if (storedLink && storedSeatId) {
                // Décoder le lien pour obtenir l'ID de la table
                const decodedData = JSON.parse(atob(storedLink));
                console.log('👋 [useTable] Déconnexion - Table:', decodedData.id, 'Siège:', storedSeatId);

                // Envoyer une requête POST pour déconnecter le joueur avec l'ID de la table et du siège
                const payload = {
                    tableId: decodedData.id,
                    seatId: storedSeatId
                };

                await Axios.post(`${SERVER_URI}/api/play/leave`, payload);
                console.log('✅ [useTable] Joueur déconnecté du serveur');
            }
        } catch (error) {
            console.error('❌ [useTable] Erreur lors de la déconnexion:', error);
            // Continuer même en cas d'erreur pour nettoyer le state local
        }

        // Nettoyer le state local
        setIsOnTable(false);
        setTableError(null);
        localStorage.removeItem('storedLink');
        localStorage.removeItem('seatId');
        console.log('🧹 [useTable] État local nettoyé');
    };

    // Vérifier la validité du lien au démarrage
    useEffect(() => {
        const storedLink = localStorage.getItem('storedLink');
        if (storedLink) {
            try {
                // Vérifier si le lien peut être décodé
                JSON.parse(atob(storedLink));
                setIsOnTable(true);
            } catch (error) {
                // Lien invalide, nettoyer
                localStorage.removeItem('storedLink');
                setIsOnTable(false);
            }
        }
    }, []);

    const createTable = async (table: Table): Promise<boolean> => {
        console.log('🚀 [useTable] Création de table avec:', table);
        setIsLoading(true);
        setTableError(null);

        try {
            const payload = {
                tableId: table.id,
                name: table.name,
                bet: table.bet,
                isPrivate: table.isPrivate,
                createdAt: table.createdAt,
                link: table.link
            };
            console.log('📤 [useTable] Envoi POST /api/play avec:', payload);

            const res = await Axios.post(`${SERVER_URI}/api/play`, payload);
            console.log('📥 [useTable] Réponse serveur:', res.data);

            const tableInfo = res.data;

            if (tableInfo) {
                console.log('✅ [useTable] Connexion réussie, mise à jour des états...');
                setIsOnTable(true);
                localStorage.setItem('storedLink', table.link);
                console.log('💾 [useTable] Lien sauvé dans localStorage');
                setIsLoading(false);
                return true;
            }
            console.log('❌ [useTable] Pas de données de table dans la réponse');
            setIsLoading(false);
            return false;
        } catch (error) {
            console.error('❌ [useTable] Erreur lors de la création:', error);
            const errorMessage = getErrorMessage(error);
            setTableError(errorMessage);
            setIsLoading(false);
            return false;
        }
    };

    const joinTableByLink = async (link: string): Promise<boolean> => {
        console.log('🔗 [useTable] Validation du lien:', link);
        setIsLoading(true);
        setTableError(null);

        try {
            // Valider et décoder le lien
            const decodedData = JSON.parse(atob(link));

            // Validation basique des données
            if (!decodedData.id || !decodedData.name) {
                throw new Error('Lien de table invalide');
            }

            // Sauvegarder le lien et mettre à jour l'état
            localStorage.setItem('storedLink', link);
            setIsOnTable(true);
            setIsLoading(false);

            console.log('✅ [useTable] Lien validé et sauvé');
            return true;
        } catch (error) {
            console.error('❌ [useTable] Erreur lors de la validation du lien:', error);
            const errorMessage = getErrorMessage(error);
            setTableError(errorMessage);
            setIsLoading(false);
            return false;
        }
    };

    const clearTableError = () => {
        setTableError(null);
    };

    return {
        isOnTable,
        currentTable,
        tableError,
        isLoading,
        createTable,
        joinTableByLink,
        leaveTable,
        clearTableError
    };
};

export default useTable;
