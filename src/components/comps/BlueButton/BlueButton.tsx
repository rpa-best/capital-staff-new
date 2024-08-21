import React from "react";
import style from "./BlueButton.module.scss"

interface IBlueButton {
    text: string,
    onClick: any
}
const BlueButton = (props: IBlueButton) => {
    return (
        <React.Fragment>
            <button className={style.button} onClick={props.onClick}>{props.text}</button>
        </React.Fragment>
    )
}

export default BlueButton