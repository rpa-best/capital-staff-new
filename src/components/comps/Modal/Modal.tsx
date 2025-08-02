import React from 'react';
import scss from './Modal.module.scss';

interface IModal {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
    maxWidth?: string;
}

const Modal = ({ isOpen, onClose, title, children, width = "auto", maxWidth = "90vw" }: IModal) => {
    if (!isOpen) return null;

    return (
        <div className={scss.modalOverlay} onClick={onClose}>
            <div 
                className={scss.modalContent} 
                onClick={(e) => e.stopPropagation()}
                style={{ width, maxWidth }}
            >
                {title && (
                    <div className={scss.header}>
                        <h2>{title}</h2>
                        <button className={scss.closeButton} onClick={onClose}>×</button>
                    </div>
                )}
                <div className={scss.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;