import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./components/Header/Header";
import scss from "./AuthorizedLayout.module.scss"
import useAuthData from "../../../hooks/useAuthData";
import cn from "classnames";

export const AuthorizedLayout = () => {
    const {authUser} = useAuthData();
    
    return (
        <div>
            <Header></Header>
            <main className={cn("container", scss.main)}>
                <Outlet></Outlet>
            </main>
        </div>
    )
}