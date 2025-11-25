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
    const { id, label, type, name, placeholder, onChange, value, ...rest } = props;

    return (
        <React.Fragment>
            <div>
                <label className={style.label} htmlFor={id}><b>{label}</b></label>
                <input className={style.input}
                       type={type}
                       id={id}
                       name={name}
                       placeholder={placeholder}
                       onChange={(event) => onChange?.(event)}
                       value={value}
                       {...rest}
                />
            </div>
        </React.Fragment>
    )
}

export default Input