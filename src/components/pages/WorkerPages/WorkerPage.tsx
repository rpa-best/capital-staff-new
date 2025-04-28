import React, {useEffect} from 'react';
import scss from './WorkerPage.module.scss'
import {Vortex} from "react-loader-spinner";
import {WORKER_DOCUMENTS_PAGE, WORKER_INFO_PAGE, WORKER_REQUISITES_PAGE} from "../../../consts/pageConsts";
import WorkerCard from "../../views/WorkerCard/WorkerCard";
import {useWorker} from "../../../store/WorkerState";
import useAuthData from "../../../hooks/useAuthData";
import PrefixedNavLink from "../../comps/PrefixedNavLink/PrefixedNavLink";

const WorkerPage = () => {
    const {getToken, authUser} = useAuthData()
    const {workerData, loading, getWorkerData} = useWorker((state) => ({
        workerData: state.workerData,
        loading: state.loading,
        getWorkerData: state.getWorkerData
    }))

    useEffect(() => {
        getWorkerData(getToken)
    }, []);

    if (loading) {
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
        <React.Fragment>
            <div className={scss.workerName}>
                <h1>{`${workerData?.first_name} ${workerData?.last_name} ${workerData?.surname}`}</h1>
            </div>

            <div className={scss.links}>
                <PrefixedNavLink className={({isActive}) => isActive ? scss.active : scss.link}
                                 to={WORKER_INFO_PAGE}><b>Работа</b></PrefixedNavLink>
                <PrefixedNavLink className={({isActive}) => isActive ? scss.active : scss.link}
                                 to={WORKER_REQUISITES_PAGE}><b>Реквизиты</b></PrefixedNavLink>
                <PrefixedNavLink className={({isActive}) => isActive ? scss.active : scss.link}
                                 to={WORKER_DOCUMENTS_PAGE}><b>Документы</b></PrefixedNavLink>
            </div>

            <div className={scss.workPlaceTitle}>
                <h2>Текущее место работы</h2>
            </div>

            {workerData?.orgs.map((org) => {
                return (
                    <div>
                        <WorkerCard company={org}/>
                    </div>
                )
            })}
        </React.Fragment>
    );
};

export default WorkerPage;