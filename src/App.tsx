import React from 'react';
import style from "./App.module.scss"
import {Route, Routes, useLocation} from "react-router-dom";
import {
    CHANGE_PASSWORD,
    DOCUMENTS_PAGE,
    LOGIN_PAGE,
    MAIN_PAGE, NEW_PASSWORD,
    REGISTRATION_PAGE,
    REQUISITES_PAGE,
    STAFF_PAGE, WORKER_DOCUMENTS_PAGE, WORKER_INFO_PAGE, WORKER_REQUISITES_PAGE
} from "./consts/pageConsts";
import Login from "./components/pages/Login/Login";
import RegistrationPage from "./components/pages/RegistrationPage/RegistrationPage";
import RequisitesPage from "./components/pages/RequisitesPage/RequisitesPage";
import StaffPage from "./components/pages/StaffPage/StaffPage";
import {Toaster} from "react-hot-toast";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
import WorkerPage from "./components/pages/WorkerPages/WorkerPage";
import WorkerDocumentsPage from "./components/pages/WorkerPages/WorkerDocumentsPage";
import WorkerRequisitesPage from "./components/pages/WorkerPages/WorkerRequisitesPage";

function App() {
    return (
        <React.Fragment>
            <div className={style.body}>
                <Routes>
                    <Route path={LOGIN_PAGE} element={<Login/>}></Route>
                    <Route path={MAIN_PAGE} element={<Login/>}></Route>
                    <Route path={REGISTRATION_PAGE} element={<RegistrationPage/>}></Route>
                    <Route path={REQUISITES_PAGE} element={
                        <RequireAuth fallbackPath={LOGIN_PAGE}>
                            <RequisitesPage/>
                        </RequireAuth>
                    }></Route>
                    <Route path={STAFF_PAGE} element={
                        <RequireAuth fallbackPath={LOGIN_PAGE}>
                            <StaffPage />
                        </RequireAuth>
                    }></Route>
                    <Route path={DOCUMENTS_PAGE} element={
                        <RequireAuth fallbackPath={LOGIN_PAGE}>
                            <DocumentsPage/>
                        </RequireAuth>
                    }></Route>
                    }></Route>
                    <Route path={WORKER_INFO_PAGE} element={
                        <RequireAuth fallbackPath={LOGIN_PAGE}>
                            <WorkerPage />
                        </RequireAuth>
                    }></Route>
                    <Route path={WORKER_DOCUMENTS_PAGE} element={
                        <RequireAuth fallbackPath={LOGIN_PAGE}>
                            <WorkerDocumentsPage />
                        </RequireAuth>
                    }></Route>
                    <Route path={WORKER_REQUISITES_PAGE} element={
                        <RequireAuth fallbackPath={LOGIN_PAGE}>
                            <WorkerRequisitesPage />
                        </RequireAuth>
                    }></Route>
                </Routes>
            </div>
            <Toaster/>
        </React.Fragment>
    );
}

export default App;
