import { createContext } from 'react';

interface modalContextType {
    openModal: any
    closeModal: any
}

const modalContext = createContext<modalContextType>({
    openModal: () => { },
    closeModal: () => { },
});

export default modalContext;
