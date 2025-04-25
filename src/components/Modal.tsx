import React from 'react';
import '../modal.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonText: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, buttonText }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>{buttonText}</button>
      </div>
    </div>
  );
};

export default Modal; 