import React from "react";
import style from "./BlueButton.module.scss"

interface IBlueButton {
    text: string,
    onClick: any,
    disabled?: boolean,
    className?: string
}
const BlueButton = (props: IBlueButton) => {
    return (
        <React.Fragment>
            <button
                className={`${style.button} ${props.className || ''}`}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.text}
            </button>
        </React.Fragment>
    )
}

export default BlueButton