import { createContext, ReactNode } from 'react';

export interface ModalDataProps {
    children: () => React.ReactNode;
    headingText: string;
    btnText: string;
    btnCallBack: () => void;
    onCloseCallBack: () => void;
}

interface modalContextType {
    showModal: boolean;
    modalData: ModalDataProps;
    openModal: (
        children: () => React.ReactNode,
        headingText: string,
        btnText: string,
        btnCallBack?: () => void,
        onCloseCallBack?: () => void
    ) => void;
    closeModal: () => void;
}

const modalDataObject: ModalDataProps = {
    children: () => { },
    headingText: '',
    btnText: '',
    btnCallBack: () => { },
    onCloseCallBack: () => { }
}

const modalContext = createContext<modalContextType>({
    showModal: false,
    modalData: modalDataObject,
    openModal: () => { },
    closeModal: () => { },
});

export default modalContext;
