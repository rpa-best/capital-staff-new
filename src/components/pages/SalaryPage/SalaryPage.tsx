import scss from "./SalaryPage.module.scss";
import React from "react";
import {Outlet} from "react-router-dom";
import {REPORT_CARD_PAGE, SALARY_STATEMENTS_PAGE} from "../../../consts/pageConsts";
import PrefixedNavLink from "../../comps/PrefixedNavLink/PrefixedNavLink";

export const SalaryPage = () => {
    return (
        <>
            <div className={scss.navbar}>
                <PrefixedNavLink
                    className={({isActive}) => isActive ? scss.active : scss.link}
                    to={SALARY_STATEMENTS_PAGE}>
                    Ведомости
                </PrefixedNavLink>
                <PrefixedNavLink
                    className={({isActive}) => isActive ? scss.active : scss.link}
                    to={REPORT_CARD_PAGE}>
                    Табель
                </PrefixedNavLink>
            </div>

            <Outlet></Outlet>
        </>
    )
}