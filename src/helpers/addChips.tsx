import Axios from "axios";

const addChips = async (userId: string, chipsAmountToAdd: number) => {
    const SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const url = `${SERVER_URI}/api/free`;

    try {
        const response = await Axios.post(url, {
            userId,
            chipsAmountToAdd
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export default addChips;
