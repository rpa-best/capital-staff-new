import React from 'react';
import style from "./App.module.scss"
import {Navigate, Route, Routes} from "react-router-dom";
import {
    DOCUMENTS_PAGE,
    LOGIN_PAGE, MEDICINE_PAGE,
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
import {useRoutePrefix} from "./hooks/useRoutePrefix";
import MedicinePage from "./components/pages/Medicine";
import MedicalDirectionsPage from "./components/pages/MedicalDirections";


function App() {
    const {prefix} = useRoutePrefix()

    const applyPrefix = (path: string) => (prefix ? `/${prefix}${path}` : path);

    return (
        <React.Fragment>
            <div className={style.body}>
                <Routes>
                    <Route path={applyPrefix(LOGIN_PAGE)} element={<Login/>}></Route>
                    <Route path={applyPrefix(REGISTRATION_PAGE)} element={<RegistrationPage/>}></Route>

                    <Route
                        path={`/${prefix}`}
                        element={
                            <RequireAuth fallbackPath={applyPrefix(LOGIN_PAGE)}>
                                <AuthorizedLayout/>
                            </RequireAuth>
                        }
                        children={
                            <>
                                <Route
                                    index
                                    element={<Navigate to={applyPrefix(STAFF_PAGE)} replace/>}
                                />
                            </>
                        }
                    ></Route>

                    <Route
                        path={"/"}
                        element={
                            <RequireAuth fallbackPath={applyPrefix(LOGIN_PAGE)}>
                                <AuthorizedLayout/>
                            </RequireAuth>
                        }
                        children={
                            <>
                                <Route
                                    index
                                    element={<Navigate to={applyPrefix(STAFF_PAGE)} replace/>}
                                />

                                <Route path={applyPrefix(REQUISITES_PAGE)} element={<RequisitesPage/>}/>
                                <Route index path={applyPrefix(STAFF_PAGE)} element={<StaffPage/>}/>
                                <Route path={applyPrefix(WORKER_INFO_PAGE)} element={<WorkerPage/>}/>
                                <Route path={applyPrefix(WORKER_DOCUMENTS_PAGE)} element={<WorkerDocumentsPage/>}/>
                                <Route path={applyPrefix(DOCUMENTS_PAGE)} element={<DocumentsPage/>}/>
                                <Route path={applyPrefix(MEDICINE_PAGE)} element={<MedicinePage/>}/>
                                <Route path={applyPrefix("/medical-directions/:workerId")} element={<MedicalDirectionsPage/>}/>
                                <Route path={applyPrefix(WORKER_REQUISITES_PAGE)} element={<WorkerRequisitesPage/>}/>
                                <Route
                                    path={applyPrefix(SALARY_PAGE)}
                                    element={<SalaryPage/>}
                                    children={
                                        <>
                                            <Route index
                                                   element={<Navigate to={applyPrefix(SALARY_STATEMENTS_PAGE)}/>}/>
                                            <Route path={applyPrefix(SALARY_STATEMENTS_PAGE)}
                                                   element={<StatementsPage/>}/>
                                            <Route index path={applyPrefix(REPORT_CARD_PAGE)}
                                                   element={<ReportCardPage/>}/>
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
