import React from 'react';
import scss from './WorkerPage.module.scss'
import {Vortex} from "react-loader-spinner";
import {WORKER_DOCUMENTS_PAGE, WORKER_INFO_PAGE, WORKER_REQUISITES_PAGE} from "../../../consts/pageConsts";
import {NavLink} from "react-router-dom";
import {useWorker} from "../../../store/WorkerState";
import DocumentsTable from "../../views/DocksTable/DocksTable";
import useAuthData from "../../../hooks/useAuthData";

const WorkerDocumentsPage = () => {
    const {authUser} = useAuthData()
    const {workerData, isLoading, docs} = useWorker((state) => ({
        docs: state.workerData?.docs,
        isLoading: state.loading,
        workerData: state.workerData
    }))
    if (isLoading) {
        return (
            <Vortex
                visible={true}
                height="80"
                width="80"
                ariaLabel="vortex-loading"
                wrapperStyle={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                wrapperClass="vortex-wrapper"
                colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
            />
        )
    }
    return (
        <>
            <div className={scss.workerName}>
                <h1>{`${workerData?.first_name} ${workerData?.last_name} ${workerData?.surname}`}</h1>
            </div>
        
            <div className={scss.links}>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={WORKER_INFO_PAGE}><b>Работа</b></NavLink>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={WORKER_REQUISITES_PAGE}><b>Реквизиты</b></NavLink>
                <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={WORKER_DOCUMENTS_PAGE}><b>Документы</b></NavLink>
            </div>
        
            <div className={scss.workPlaceTitle}>
                <h2>Ваши документы</h2>
            </div>
        
            <div>
                <DocumentsTable documents={docs} />
            </div>
        </>
    );
};

export default WorkerDocumentsPage;