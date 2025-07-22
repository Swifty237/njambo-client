import { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import { Table, isOnTablesProps } from '../types/SeatTypesProps';
import gameContext from '../context/game/gameContext';

const useTable = () => {
    const SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const [isOnTables, setIsOnTables] = useState<isOnTablesProps[]>([]);

    const { currentTable, seatId } = useContext(gameContext);
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

    const leaveTable = async (tableId?: string) => {
        try {
            const storedLink = localStorage.getItem('storedLink');

            if (storedLink && seatId) {
                const decodedData = JSON.parse(atob(storedLink));
                const payload = {
                    tableId: tableId || decodedData.id,
                    seatId: seatId
                };
                await Axios.post(`${SERVER_URI}/api/play/leave`, payload);
            }
        } catch (error) {
            // Continue even if error to clean local state
        }

        // Retirer la table spécifique du tableau
        if (tableId) {
            setIsOnTables(prev => prev.filter(table => table.tableId !== tableId));

            // Mettre à jour le localStorage
            const updatedTables = isOnTables.filter(table => table.tableId !== tableId);
            if (updatedTables.length > 0) {
                localStorage.setItem('isOnTables', JSON.stringify(updatedTables));
            } else {
                localStorage.removeItem('isOnTables');
            }
        } else {
            // Si aucun tableId spécifié, nettoyer tout
            setIsOnTables([]);
            localStorage.removeItem('isOnTables');
        }

        setTableError(null);
        localStorage.removeItem('storedLink');
    };

    // useEffect(() => {
    //     const storedLink = localStorage.getItem('storedLink');
    //     if (storedLink) {
    //         try {
    //             JSON.parse(atob(storedLink));
    //             setIsOnTable(true);
    //         } catch (error) {
    //             localStorage.removeItem('storedLink');
    //             setIsOnTable(false);
    //         }
    //     }
    // }, []);

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
                // Ajouter la table au tableau
                const newTableEntry: isOnTablesProps = {
                    tableId: table.id,
                    isOnTable: true
                };

                setIsOnTables(prev => {
                    const updated = prev.filter(t => t.tableId !== table.id);
                    return [...updated, newTableEntry];
                });

                // Mettre à jour le localStorage
                const updatedTables = isOnTables.filter(t => t.tableId !== table.id);
                updatedTables.push(newTableEntry);
                localStorage.setItem('isOnTables', JSON.stringify(updatedTables));
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

    // Fonction helper pour vérifier si on est sur une table spécifique
    const isOnTable = (tableId: string): boolean => {
        const tableEntry = isOnTables.find(table => table.tableId === tableId);
        return tableEntry ? tableEntry.isOnTable : false;
    };

    // Initialiser depuis le localStorage au chargement
    useEffect(() => {
        const storedTables = localStorage.getItem('isOnTables');
        if (storedTables) {
            try {
                const parsedTables: isOnTablesProps[] = JSON.parse(storedTables);
                setIsOnTables(parsedTables);
            } catch (error) {
                localStorage.removeItem('isOnTables');
            }
        }
    }, []);

    return {
        isOnTables,
        currentTable,
        tableError,
        isLoading,
        setIsOnTables,
        createTable,
        joinTableByLink,
        leaveTable,
        clearTableError,
        isOnTable
    };
};

export default useTable;
