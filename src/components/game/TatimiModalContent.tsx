import React, { useState, useContext } from "react";

import gameContext from "../../context/game/gameContext";
import { Form } from "../forms/Form";
import { FormGroup } from "../forms/FormGroup";
import { Label } from "../forms/Label";
import { Select } from "../forms/Select";
import Button from "../buttons/Button";
import modalContext from "../../context/modal/modalContext";
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom";



const TatimiModalContent = React.memo(function TatimiModalContent() {
    const { closeModal } = useContext(modalContext);
    const [bet, setBet] = useState<string>('25');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const history = useHistory();
    const { setTatamiDataList, joinTable } = useContext(gameContext);

    // Fonction pour générer un ID unique pour le tatami
    const generateTatamiId = () => {
        return Math.random().toString(36).slice(2, 6).toUpperCase();
    };

    // Fonction pour créer un lien tatami
    const createTatamiData = (bet: string, isPrivate: boolean) => {
        const id = uuidv4();
        const tatamiNameId = generateTatamiId();
        const tatamiName = `tatami-${tatamiNameId}`;

        // Create an object with the required info
        const tatamiInfo = {
            id: id,
            name: tatamiName,
            bet: bet,
            isPrivate: isPrivate
        };

        // Encode the object as base64 string to use as unique link
        const tatamiLink = btoa(JSON.stringify(tatamiInfo));

        return {
            id: id,
            name: tatamiName,
            bet: bet,
            isPrivate: isPrivate,
            createdAt: new Date().toLocaleString(),
            link: tatamiLink
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
                    }}>

                    <FormGroup>
                        <Label>{'Tarif / coup'}</Label>
                        <Select
                            id="select-bet"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBet(e.target.value)}
                        >
                            <option value="25">25 F CFA</option>
                            <option value="50">50 F CFA</option>
                            <option value="100">100 F CFA</option>
                            <option value="200">200 F CFA</option>
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

                    <Button $small $primary type="submit" $fullWidth onClick={() => {
                        setIsPrivate(isPrivate);

                        // Créer le nouveau lien tatami
                        const newTatamiData = createTatamiData(bet, isPrivate);

                        // Ajouter le nouveau tatami à la liste
                        setTatamiDataList(prevList => [...prevList, newTatamiData]);

                        // Toujours mettre à jour le localStorage lors de la création d'un nouveau tatami
                        localStorage.setItem('storedLink', newTatamiData.link);
                        closeModal();
                        history.push(`/play`);
                        joinTable(newTatamiData);
                    }}>
                        {'Créer'}
                    </Button>
                </Form>
            </div>
        </>
    );
});

export default TatimiModalContent;