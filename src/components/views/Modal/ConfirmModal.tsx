import React from "react";
import scss from "./Modal.module.scss";
import WhiteButton from "../../comps/WhiteButton/WhiteButton";
import BlueButton from "../../comps/BlueButton/BlueButton";

interface IConfirmModal {
    active: boolean;
    setActive: (active: boolean) => void;
    header: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal = ({
    active,
    setActive,
    header,
    message,
    onConfirm,
    confirmText = "Подтвердить",
    cancelText = "Отмена"
}: IConfirmModal) => {
    const handleConfirm = () => {
        onConfirm();
        setActive(false);
    };

    return (
        <div className={active ? scss.modalActive : scss.modal} onClick={() => setActive(false)}>
            <div className={active ? scss.modalContentActive : scss.modalContent}
                 onClick={(event) => event.stopPropagation()}>
                <div className={scss.modalHeader}><b>{header}</b></div>
                <div className={scss.modalBody}>
                    <p style={{ marginBottom: "20px", fontSize: "16px" }}>{message}</p>
                    <div className={scss.modalButtons}>
                        <div>
                            <WhiteButton text={cancelText} isActive={false} onClick={() => setActive(false)}/>
                        </div>
                        <div>
                            <BlueButton text={confirmText} onClick={handleConfirm}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
