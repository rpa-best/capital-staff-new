import React from "react";
import scss from "./ExitButton.module.scss"
import {NavLink, useNavigate} from "react-router-dom";
import {LOGIN_PAGE} from "../../../consts/pageConsts";
import useSignOut from "react-auth-kit/hooks/useSignOut";

interface IExitButton {
    text: string
}
const ExitButton = ({text}: IExitButton) => {
    const navigate = useNavigate();
    const signOut = useSignOut()
    const handleExit = async () => {
        signOut()
        navigate(LOGIN_PAGE)
    }
    return(
        <React.Fragment>
            <NavLink to={LOGIN_PAGE}>
                <button className={scss.button} onClick={async () => await handleExit()}>{text}</button>
            </NavLink>
        </React.Fragment>
    )
}

export default ExitButton