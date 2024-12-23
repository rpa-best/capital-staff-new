import React from 'react';
import style from "./App.module.scss"
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {
    CHANGE_PASSWORD,
    DOCUMENTS_PAGE,
    LOGIN_PAGE,
    MAIN_PAGE, NEW_PASSWORD,
    REGISTRATION_PAGE, REPORT_CARD_PAGE,
    REQUISITES_PAGE, SALARY_PAGE, SALARY_STATEMENTS_PAGE,
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
import DocumentsPage from "./components/pages/DocumentsPage/DocumentsPage";
import {SalaryPage} from "./components/pages/SalaryPage/SalaryPage";
import {ReportCardPage} from "./components/pages/SalaryPage/pages/ReportCardPage/ReportCardPage";
import {StatementsPage} from "./components/pages/SalaryPage/pages/StatementsPage/StatementsPage";
import {AuthorizedLayout} from "./components/layouts/AuthorizedLayout/AuthorizedLayout";

function App() {
    return (
        <React.Fragment>
            <div className={style.body}>
                <Routes>
                    <Route path={LOGIN_PAGE} element={<Login/>}></Route>
                    <Route path={REGISTRATION_PAGE} element={<RegistrationPage/>}></Route>
                    <Route
                        path={"/"}
                        element={
                            <RequireAuth fallbackPath={LOGIN_PAGE}>
                                <AuthorizedLayout/>
                            </RequireAuth>
                        }
                        children={
                            <>
                                <Route path={REQUISITES_PAGE} element={<RequisitesPage/>}/>
                                <Route path={STAFF_PAGE} element={<StaffPage/>}/>
                                <Route path={WORKER_INFO_PAGE} element={<WorkerPage/>}/>
                                <Route path={WORKER_DOCUMENTS_PAGE} element={<WorkerDocumentsPage/>}/>
                                <Route path={DOCUMENTS_PAGE} element={<DocumentsPage/>}/>
                                <Route path={WORKER_REQUISITES_PAGE} element={<WorkerRequisitesPage/>}/>
                                <Route
                                    path={SALARY_PAGE}
                                    element={<SalaryPage/>}
                                    children={
                                        <>
                                            <Route index element={<Navigate to={SALARY_STATEMENTS_PAGE}/>}/>
                                            <Route path={SALARY_STATEMENTS_PAGE} element={<StatementsPage/>}/>
                                            <Route index path={REPORT_CARD_PAGE} element={<ReportCardPage/>}/>
                                        </>
                                    }
                                />
                            </>
                        }
                    />
                </Routes>
            </div>
            <Toaster/>
        </React.Fragment>
    );
}

export default App;
