import React, { useState, useEffect } from 'react';
import ModalContext from './modalContext';
import Modal, { initialModalData } from '../../components/modals/Modal';

interface ModalProviderProps {
  children: React.ReactNode;
}

interface ModalProps {
  children: () => React.ReactNode;
  headingText: string;
  btnText: string;
  btnCallBack: () => void;
  onCloseCallBack: () => void;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalProps>(initialModalData);

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

  const closeModal = () => setShowModal(false);

  return (
    <ModalContext.Provider
      value={{ showModal, modalData, openModal, closeModal }}
    >
      {children}
      {showModal && (
        <Modal
          headingText={modalData.headingText}
          btnText={modalData.btnText}
          onClose={modalData.onCloseCallBack}
          onBtnClicked={modalData.btnCallBack}
        >
          {modalData.children()}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
