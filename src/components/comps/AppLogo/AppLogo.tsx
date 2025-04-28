import RubleCoin from "../../../assets/coin.png";
import Logo from "../../../assets/logo.jpg";
import React from "react";
import {useRoutePrefix} from "../../../hooks/useRoutePrefix";
import scss from "./AppLogo.module.scss"

const AppLogo = () => {
    const {prefix} = useRoutePrefix();

    return (
        <div className={scss.container}>
            {!prefix ?
                <>
                    <img className={scss.coinImage} src={RubleCoin} alt="Ruble-coin"/>
                    <b className={scss.b}>Капитал Кадры</b>
                </> : null}

            {prefix === "staff-consult" ?
                <img className={scss.staffConsultLogo} src={Logo} alt="Logo"/> :
                null}
        </div>
    )
}

export default AppLogo