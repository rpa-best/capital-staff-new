import React from "react";
import style from "./Input.module.scss"

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string,
    label?: string,
    type: string,
    name: string,
    value?: any,
    placeholder?: string,
}


const Input = (props: IInput) => {
    return (
        <React.Fragment>
            <div>
                <label className={style.label} htmlFor={props.id}><b>{props.label}</b></label>
                <input className={style.input}
                       type={props.type}
                       id={props.id}
                       name={props.name}
                       placeholder={props.placeholder}
                       onChange={(event) => props.onChange?.(event)}
                       value={props.value}
                />
            </div>
        </React.Fragment>
    )
}

export default Input