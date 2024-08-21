import React, {useState} from "react";
import scss from "./RegistrationPage.module.scss"
import RubleCoin from "../../../assets/coin.png";
import Line from "../../../assets/line.svg";
import {NavLink} from "react-router-dom";
import {LOGIN_PAGE, REGISTRATION_PAGE} from "../../../consts/pageConsts";
import {useRegistration} from "../../../store/RegistrationState";
import TinRegistrationPage from "./TinRegistrationPage";
import IndRegistrationPage from "./IndRegistrationPage";
import {Vortex} from "react-loader-spinner";
const RegistrationPage = () => {
    const [regPage, setRegPage] = useState(true)
    const {loading} = useRegistration((state) => ({
        loading: state.loading,
    }))

    if (loading) {
        return <Vortex
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
        />
    }

    return (
        <React.Fragment>
            <div className={scss.registrationContainer}>
                <div className={scss.header}>
                    <img className={scss.coinImage} src={RubleCoin} alt="Ruble-coin"/>
                    <b className={scss.company}>Капитал Кадры</b>
                    <img src={Line} alt="Line"/>
                    <div className={scss.lk}>
                        Личный кабинет
                    </div>
                </div>
                <div className={scss.body}>
                    <div className={scss.links}>
                        <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={LOGIN_PAGE}><b>Вход</b></NavLink>
                        <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={REGISTRATION_PAGE}><b>Регистрация</b></NavLink>
                    </div>
                    <div className={scss.form}>
                        {regPage ?
                            <TinRegistrationPage isActive={!regPage} onClick={() => setRegPage(false)}/>
                            :
                            <IndRegistrationPage isActive={regPage} onClick={() => setRegPage(true)}/>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default RegistrationPage