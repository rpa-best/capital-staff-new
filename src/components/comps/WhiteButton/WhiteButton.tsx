import React from "react";
import scss from "./WhiteButton.module.scss"

interface IWhiteButton {
    text: string,
    onClick: any
    isActive?: boolean
}

const WhiteButton = ({onClick, text, isActive}: IWhiteButton) => {
    return (
        <React.Fragment>
            <button className={`${scss.button} ${isActive ? scss.active : ''}`} onClick={onClick}>{text}</button>
        </React.Fragment>
    )
}

export default WhiteButton