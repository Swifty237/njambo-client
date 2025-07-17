import React, { useState, useContext } from "react";

import { Form } from "../forms/Form";
import { FormGroup } from "../forms/FormGroup";
import { Label } from "../forms/Label";
import { Select } from "../forms/Select";
import Button from "../buttons/Button";
import modalContext from "../../context/modal/modalContext";
import { v4 as uuidv4 } from 'uuid';
import { Table } from "../../types/SeatTypesProps";
// import globalContext from "../../context/global/globalContext";

interface TableModalProps {
    onCreateTable: (table: Table) => void;
}


const TableModalCreator = React.memo(function TableModalCreator({ onCreateTable }: TableModalProps) {
    const { closeModal } = useContext(modalContext);
    // const { setTables } = useContext(globalContext)
    const [bet, setBet] = useState<string>('25');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    // Fonction pour générer un ID unique pour le tatami
    const generateTatamiId = () => {
        return Math.random().toString(36).slice(2, 6).toUpperCase();
    };

    // Fonction pour créer une table complète
    const createNewTable = (bet: string, isPrivate: boolean): Table => {
        const id = uuidv4();
        const tatamiNameId = generateTatamiId();
        const tatamiName = `tatami-${tatamiNameId}`;

        // Create an object with the required info for the link
        const tatamiInfo = {
            id: id,
            name: tatamiName,
            bet: parseInt(bet),
            createdAt: new Date().toISOString(),
            isPrivate: isPrivate
        };

        // Encode the object as base64 string to use as unique link
        const tatamiLink = btoa(JSON.stringify(tatamiInfo));

        // Return a complete Table object with all required properties
        return {
            id: id,
            name: tatamiName,
            bet: parseInt(bet),
            isPrivate: isPrivate,
            createdAt: tatamiInfo.createdAt,
            link: tatamiLink,
            seats: {},
            callAmount: 0,
            pot: 0,
            winMessages: '',
            button: '',
            handOver: false,
            demandedSuit: '',
            currentRoundCards: [],
            roundNumber: 0,
            chatRoom: { chatMessages: [] }
        };
    };

    return (
        <>
            <div style={{
                width: "100%"
            }}>


                <Form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();

                        // Créer le nouveau lien tatami
                        const newTable = createNewTable(bet, isPrivate);

                        // Ajouter la nouvelle table au tableau des tables existantes
                        // setTables(prevTables => [...prevTables, newTable]);

                        // Toujours mettre à jour le localStorage lors de la création d'un nouveau tatami
                        localStorage.setItem('storedLink', newTable.link);
                        closeModal();

                        // Laisser handleJoinTable dans MainPage gérer la redirection
                        onCreateTable(newTable);
                    }}>

                    <FormGroup>
                        <Label>{'Tarif / coup'}</Label>
                        <Select
                            id="select-bet"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBet(e.target.value)}
                        >
                            <option value="25">25 XAF</option>
                            <option value="50">50 XAF</option>
                            <option value="100">100 XAF</option>
                            <option value="200">200 XAF</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label>{'Tatami privé ?'}</Label>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                margin: '5px 0 10px 0',
                            }}>

                            <label className="switch">
                                <input type="checkbox" onChange={() => {
                                    setIsPrivate(!isPrivate);
                                }} />
                                <span className="slider"></span>
                            </label>

                            <span>{isPrivate ? "Oui" : "Non"}</span>
                        </div>
                    </FormGroup>

                    <Button $small $primary type="submit" $fullWidth>
                        {'Créer'}
                    </Button>
                </Form>
            </div>
        </>
    );
});

export default TableModalCreator;