import React from "react";
import scss from "./ExitButton.module.scss"
import {LOGIN_PAGE} from "../../../consts/pageConsts";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import PrefixedNavLink from "../PrefixedNavLink/PrefixedNavLink";
import {usePrefixedNavigate} from "../../../hooks/usePrefixedNavigate";

interface IExitButton {
    text: string
}

const ExitButton = ({text}: IExitButton) => {
    const navigate = usePrefixedNavigate();
    const signOut = useSignOut()
    const handleExit = async () => {
        signOut()
        navigate(LOGIN_PAGE)
    }
    return (
        <React.Fragment>
            <PrefixedNavLink to={LOGIN_PAGE}>
                <button className={scss.button} onClick={async () => await handleExit()}>{text}</button>
            </PrefixedNavLink>
        </React.Fragment>
    )
}

export default ExitButton