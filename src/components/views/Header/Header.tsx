import React, {useEffect, useMemo} from 'react';
import scss from './Header.module.scss'
import {NavLink} from "react-router-dom";
import RubleCoin from "../../../assets/coin.png"
import Line from "../../../assets/line.svg"
import {DOCUMENTS_PAGE, REQUISITES_PAGE, SALARY_PAGE, STAFF_PAGE} from "../../../consts/pageConsts";
import ExitButton from "../../comps/ExitButton/ExitButton";
import useAuthData from "../../../hooks/useAuthData";
import {useUser} from "../../../store/UserState";
import DropDown from "../../comps/DropDown/DropDown";


interface IHeader {
    companyName?: string
}
const Header = ({companyName}: IHeader) => {
    const {getToken} = useAuthData();
    const { myCompanies, loadMyCompanies, selectedCompany, setSelectedCompany } = useUser()
    const companyOptions = useMemo(() => {
        return myCompanies.map(company => ({
            label: company.name!,
            value: company.inn!
        }))
    }, [myCompanies])
    
    useEffect(() => {
        if (!myCompanies.length) {
            loadMyCompanies(getToken!).then(() => {
                setSelectedCompany(myCompanies[0])
            })
        }
    }, [myCompanies, loadMyCompanies, getToken, setSelectedCompany]);
    
    const handleSelectCompany = (inn: string) => {
        setSelectedCompany(myCompanies.find(company => company.inn === inn))
    }
    
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
                    <DropDown
                        name="entity"
                        id="entity"
                        placeholder="Организация"
                        value={selectedCompany?.inn}
                        values={companyOptions}
                        required
                        onChange={(event) => handleSelectCompany(event.target.value)}
                    />
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