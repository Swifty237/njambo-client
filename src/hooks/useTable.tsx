import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { Table } from '../types/SeatTypesProps';
import gameContext from '../context/game/gameContext';

const useTable = () => {
    const SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const [isOnTable, setIsOnTable] = useState(() => {
        const storedIsOnTable = localStorage.getItem('isOnTable');
        return storedIsOnTable === 'true';
    });

    const updateIsOnTable = (value: boolean) => {
        setIsOnTable(value);
        localStorage.setItem('isOnTable', value.toString());
    };

    const { currentTable } = useContext(gameContext);
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
        try {
            const storedLink = localStorage.getItem('storedLink');
            const storedSeatId = localStorage.getItem('seatId');

            if (storedLink && storedSeatId) {
                const decodedData = JSON.parse(atob(storedLink));
                const payload = {
                    tableId: decodedData.id,
                    seatId: storedSeatId
                };
                await Axios.post(`${SERVER_URI}/api/play/leave`, payload);
            }
        } catch (error) {
            // Continue even if error to clean local state
        }

        updateIsOnTable(false);
        setTableError(null);
        localStorage.removeItem('storedLink');
        localStorage.removeItem('seatId');
    };

    useEffect(() => {
        const storedLink = localStorage.getItem('storedLink');
        if (storedLink) {
            try {
                JSON.parse(atob(storedLink));
                updateIsOnTable(true);
            } catch (error) {
                localStorage.removeItem('storedLink');
                updateIsOnTable(false);
            }
        }
    }, []);

    const createTable = async (table: Table): Promise<boolean> => {
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

            const res = await Axios.post(`${SERVER_URI}/api/play`, payload);
            const tableInfo = res.data;

            if (tableInfo) {
                updateIsOnTable(true);
                localStorage.setItem('storedLink', table.link);
                setIsLoading(false);
                return true;
            }

            setIsLoading(false);
            return false;
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setTableError(errorMessage);
            setIsLoading(false);
            return false;
        }
    };

    const joinTableByLink = async (): Promise<boolean> => {
        setIsLoading(true);
        setTableError(null);

        try {
            updateIsOnTable(true);
            setIsLoading(false);
            return true;
        } catch (error) {
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
