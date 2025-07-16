import React, { useState, useEffect } from 'react';
import ModalContext, { ModalDataProps } from './modalContext';
import Modal, { initialModalData } from '../../components/modals/Modal';

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(Date.now());
  const [modalData, setModalData] = useState<ModalDataProps>(initialModalData);

  useEffect(() => {
    const layoutWrapper = document.getElementById('layout-wrapper');

    if (showModal) {
      document.body.style.overflow = 'hidden';

      if (layoutWrapper) {
        layoutWrapper.style.filter = 'blur(4px)';
        layoutWrapper.style.pointerEvents = 'none';
        layoutWrapper.tabIndex = -1;
      }
    } else {
      document.body.style.overflow = 'initial';

      if (layoutWrapper) {
        layoutWrapper.style.filter = 'none';
        layoutWrapper.style.pointerEvents = 'all';
      }
    }
  }, [showModal]);

  const openModal = (
    children: () => React.ReactNode,
    headingText: string,
    btnText: string,
    btnCallBack = closeModal,
    onCloseCallBack = closeModal,
  ) => {
    setModalData({
      children,
      headingText,
      btnText,
      btnCallBack,
      onCloseCallBack,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsChatModalOpen(false);
  }

  return (
    <ModalContext.Provider value={{
      showModal,
      modalData,
      isChatModalOpen,
      unreadMessages,
      lastReadTime,
      setLastReadTime,
      setUnreadMessages,
      setIsChatModalOpen,
      openModal,
      closeModal
    }}>
      {showModal && (
        <Modal
          headingText={modalData.headingText}
          btnText={modalData.btnText}
          btnCallBack={modalData.btnCallBack}
          onCloseCallBack={modalData.onCloseCallBack}
        >
          {modalData.children}
        </Modal>
      )}
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
