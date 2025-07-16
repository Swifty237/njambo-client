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
    isChatModalOpen: boolean,
    unreadMessages: number,
    lastReadTime: number,
    setLastReadTime: (value: React.SetStateAction<number>) => void,
    setUnreadMessages: (value: React.SetStateAction<number>) => void,
    setIsChatModalOpen: (value: React.SetStateAction<boolean>) => void,
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
    isChatModalOpen: false,
    unreadMessages: 0,
    lastReadTime: Date.now(),
    setLastReadTime: () => { },
    setUnreadMessages: () => { },
    setIsChatModalOpen: () => { },
    openModal: () => { },
    closeModal: () => { },
});

export default modalContext;
