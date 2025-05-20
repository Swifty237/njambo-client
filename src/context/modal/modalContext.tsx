import { createContext } from 'react';

interface ModalProps {
    children: () => React.ReactNode;
    headingText: string;
    btnText: string;
    btnCallBack: () => void;
    onCloseCallBack: () => void;
}

interface modalContextType {
    showModal: boolean;
    modalData: ModalProps;
    openModal: (
        children: () => React.ReactNode,
        headingText: string,
        btnText: string,
        btnCallBack?: () => void,
        onCloseCallBack?: () => void
    ) => void;
    closeModal: () => void;
}

const modalDataObject: ModalProps = {
    children: () => null,
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
