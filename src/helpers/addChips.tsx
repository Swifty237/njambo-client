import Axios from "axios";

const addChips = async (userId: string, chipsAmountToAdd: number) => {
    const SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const url = `${SERVER_URI}/api/free`;
    console.log('Tentative d\'ajout de jetons:', {
        url,
        userId,
        chipsAmountToAdd,
        SERVER_URI
    });

    try {
        const response = await Axios.post(url, {
            userId,
            chipsAmountToAdd
        });
        console.log('Réponse du serveur:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Erreur lors de l\'ajout de jetons:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });
        throw error;
    }
};

export default addChips;
