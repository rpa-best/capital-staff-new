import React, {useState} from "react";
import scss from "./RegistrationPage.module.scss"
import Line from "../../../assets/line.svg";
import {LOGIN_PAGE, REGISTRATION_PAGE} from "../../../consts/pageConsts";
import {useRegistration} from "../../../store/RegistrationState";
import TinRegistrationPage from "./TinRegistrationPage";
import IndRegistrationPage from "./IndRegistrationPage";
import {Vortex} from "react-loader-spinner";
import PrefixedNavLink from "../../comps/PrefixedNavLink/PrefixedNavLink";
import AppLogo from "../../comps/AppLogo/AppLogo";

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
                    <AppLogo></AppLogo>
                    <img src={Line} alt="Line"/>
                    <div className={scss.lk}>
                        Личный кабинет
                    </div>
                </div>
                <div className={scss.body}>
                    <div className={scss.links}>
                        <PrefixedNavLink className={({isActive}) => isActive ? scss.active : scss.link} to={LOGIN_PAGE}><b>Вход</b></PrefixedNavLink>
                        <PrefixedNavLink className={({isActive}) => isActive ? scss.active : scss.link}
                                         to={REGISTRATION_PAGE}><b>Регистрация</b></PrefixedNavLink>
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