import React from "react";
import scss from "./Modal.module.scss"
import {Vortex} from "react-loader-spinner";
import WhiteButton from "../../comps/WhiteButton/WhiteButton";

interface IModal {
    active: boolean,
    loading: boolean,
    setActive: any,
    header: string,
    children: any,
    onClick: any
}
const Modal = ({active, loading, setActive, header, children, onClick}: IModal) => {
    return (
        <React.StrictMode>
            <div className={active ? scss.modalActive : scss.modal} onClick={() => setActive(false)}>
                <div className={active ? scss.modalContentActive : scss.modalContent}
                     onClick={(event) => event.stopPropagation()}>
                    <div className={scss.modalHeader}><b>{header}</b></div>
                    <div className={scss.modalBody}>
                        {children}
                        {loading ? <Vortex
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{
                                position: 'absolute',
                                top: '40%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            wrapperClass="vortex-wrapper"
                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                        /> : null}
                        <div className={scss.modalButtons}>
                            <div>
                                <WhiteButton text={"Закрыть окно"} isActive={false} onClick={() => setActive(false)}/>
                            </div>
                            <div>
                                <WhiteButton text={"Отправить"} isActive={false} onClick={onClick}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.StrictMode>
    )
}

export default Modal;