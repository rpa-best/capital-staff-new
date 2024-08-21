import React, {useState} from "react";
import style from "./PasswordInput.module.scss"
import {ReactComponent as CloseEyeIcon} from "../../../assets/icons/CloseEye.svg";
import {ReactComponent as OpenEyeIcon} from "../../../assets/icons/OpenEye.svg";

interface IInput {
    id: string,
    label?: string,
    name: string,
    value: any,
    placeholder?: string,
    onChange: (event: any) => void
}

const PasswordInput = (props: IInput) => {
    const [showPassword, changePasswordVisibility] = useState(false)
    const changeIcon = (visibility: boolean) => {
        changePasswordVisibility(visibility)
    }

    return (
        <React.Fragment>
            <div className={style.input_wrapper}>
                <label className={style.label} htmlFor={props.id}><b>{props.label}</b></label>
                <input className={style.input} type={showPassword ? 'text' : 'password'} id={props.id} name={props.name}
                       placeholder={props.placeholder} onChange={(event) => props.onChange(event)} value={props.value}/>
                {showPassword ?
                    <OpenEyeIcon className={style.icon} onClick={(event) => {
                        event.stopPropagation();
                        changeIcon(false)
                    }
                    }/>
                    :
                    <CloseEyeIcon className={style.icon} onClick={(event) => {
                        event.stopPropagation();
                        changeIcon(true)
                    }
                    }/>
                }
            </div>
        </React.Fragment>
    )
}

export default PasswordInput