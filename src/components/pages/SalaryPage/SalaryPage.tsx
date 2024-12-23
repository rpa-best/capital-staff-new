import scss from "./SalaryPage.module.scss";
import React from "react";
import {NavLink, Outlet} from "react-router-dom";
import {REPORT_CARD_PAGE, SALARY_STATEMENTS_PAGE} from "../../../consts/pageConsts";

export const SalaryPage = () => {
    return (
        <>
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
        </>
    )
}