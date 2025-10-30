import React from "react";
import scss from "./StaffPage.module.scss";
import {Outlet} from "react-router-dom";
import {STAFF_EMPLOYEES_PAGE, STAFF_CANDIDATES_PAGE} from "../../../consts/pageConsts";
import PrefixedNavLink from "../../comps/PrefixedNavLink/PrefixedNavLink";

const StaffPage = () => {
    return (
        <>
            <div className={scss.navbar}>
                <PrefixedNavLink
                    className={({isActive}) => isActive ? scss.active : scss.link}
                    to={STAFF_EMPLOYEES_PAGE}>
                    Сотрудники
                </PrefixedNavLink>
                <PrefixedNavLink
                    className={({isActive}) => isActive ? scss.active : scss.link}
                    to={STAFF_CANDIDATES_PAGE}>
                    Кандидаты
                </PrefixedNavLink>
            </div>

            <Outlet></Outlet>
        </>
    );
};

export default StaffPage;
