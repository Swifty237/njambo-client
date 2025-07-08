// Helper pour synchroniser les données utilisateur avec localStorage
const syncUserData = (data: {
    userId?: string,
    userName?: string,
    chipsAmount?: number
}) => {
    if (data.userId) {
        localStorage.setItem('userId', data.userId);
    }
    if (data.userName) {
        localStorage.setItem('userName', data.userName);
    }
    if (data.chipsAmount !== undefined) {
        localStorage.setItem('chipsAmount', data.chipsAmount.toString());
    }
};

export default syncUserData;
