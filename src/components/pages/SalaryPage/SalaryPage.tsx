import scss from "./SalaryPage.module.scss";
import Header from "../../views/Header/Header";
import React from "react";
import useAuthData from "../../../hooks/useAuthData";
import {ReportCardPage} from "./pages/ReportCardPage/ReportCardPage";
import {NavLink, Outlet} from "react-router-dom";
import {DOCUMENTS_PAGE, REPORT_CARD_PAGE, SALARY_PAGE, SALARY_STATEMENTS_PAGE} from "../../../consts/pageConsts";

export const SalaryPage = () => {
    const {getToken, authUser} = useAuthData();

    return (
        <div className={scss.documentsContainer}>
            <Header companyName={authUser?.company.name}/>
            
            <div className={scss.navbar}>
                <NavLink
                    className={({isActive}) => isActive ? scss.active : scss.link}
                    to={SALARY_STATEMENTS_PAGE}>
                    Ведомости
                </NavLink>
                <NavLink
                    className={({isActive}) => isActive ? scss.active : scss.link}
                    to={REPORT_CARD_PAGE}>
                    Табель
                </NavLink>
            </div>

            <Outlet></Outlet>
        </div>
    )
}