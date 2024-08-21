import React from 'react';
import scss from './Header.module.scss'
import {NavLink} from "react-router-dom";
import RubleCoin from "../../../assets/coin.png"
import Line from "../../../assets/line.svg"
import {DOCUMENTS_PAGE, REQUISITES_PAGE, SALARY_PAGE, STAFF_PAGE} from "../../../consts/pageConsts";
import ExitButton from "../../comps/ExitButton/ExitButton";


interface IHeader {
    companyName?: string
}
const Header = ({companyName}: IHeader) => {
    return (
        <React.Fragment>
            <div className={scss.headerContainer}>
                <img className={scss.coinImage} src={RubleCoin} alt="Ruble-coin"/>
                <b className={scss.b}>Капитал Кадры</b>
                <img src={Line} alt="Line" className={scss.line}/>
                <div className={scss.nameGroup}>
                    <div className={scss.comText}>
                        Личный кабинет
                    </div>
                    <div className={scss.person}>
                        Клиент
                    </div>
                </div>
                <div className={scss.company}>
                    {companyName || 'Неизвестная компания'}
                </div>
                <div className={scss.button}>
                    <ExitButton text={"Выйти"}></ExitButton>
                </div>
            </div>
            <div className={scss.links}>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={STAFF_PAGE}><b>Сотрудники</b></NavLink>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={REQUISITES_PAGE}><b>Реквизиты</b></NavLink>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={DOCUMENTS_PAGE}><b>Документы</b></NavLink>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={SALARY_PAGE}><b>Зарплата</b></NavLink>
            </div>
        </React.Fragment>
    )
}

export default Header