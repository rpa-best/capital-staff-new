import React, {useState} from 'react';
import scss from './WorkerPage.module.scss'
import {Vortex} from "react-loader-spinner";
import {NavLink} from "react-router-dom";
import {WORKER_DOCUMENTS_PAGE, WORKER_INFO_PAGE, WORKER_REQUISITES_PAGE} from "../../../consts/pageConsts";
import Input from "../../comps/Input/Input";
import BlueButton from "../../comps/BlueButton/BlueButton";
import {useWorker} from "../../../store/WorkerState";
import useAuthData from "../../../hooks/useAuthData";
const WorkerRequisitesPage = () => {
    const {getToken, authUser} = useAuthData()
    const {workerData, isLoading, updateWorkerData} = useWorker((state) => ({
        workerData: state.workerData,
        isLoading: state.loading,
        updateWorkerData: state.updateWorkerData
    }))
    const [surname, setSurname] = useState(workerData?.surname || null)
    const [name, setName] = useState(workerData?.first_name || null)
    const [lastName, setLastName] = useState(workerData?.last_name || null)
    const [phone, setPhone] = useState(workerData?.phone || null)
    const [email, settEmail] = useState(workerData?.email || null)
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
                <h2>Ваши данные</h2>
            </div>
            
            <div className={scss.requisites}>
                <div className={scss.row}>
                    <p className={scss.rowText}>Фамилия:</p>
                    <Input type={"text"} id={"surname"} name={"surname"} placeholder={"Фамилия"} onChange={(event) => setSurname(event.target.value)} value={surname}/>
                </div>
                <div className={scss.row}>
                    <p className={scss.rowText}>Имя:</p>
                    <Input type={"text"} id={"name"} name={"name"} placeholder={"Имя"} onChange={(event) => setName(event.target.value)} value={name}/>
                </div>
                <div className={scss.row}>
                    <p className={scss.rowText}>Отчество:</p>
                    <Input type={"text"} id={"thirdName"} name={"thirdName"} placeholder={"Отчество"} onChange={(event) => setLastName(event.target.value)} value={lastName}/>
                </div>
                <div className={scss.row}>
                    <p className={scss.rowText}>Телефон:</p>
                    <Input type={"phone"} id={"phone"} name={"phone"} placeholder={"Телефон"} onChange={(event) => setPhone(event.target.value)} value={phone}/>
                </div>
                <div className={scss.row}>
                    <p className={scss.rowText}>E-Mail:</p>
                    <Input type={"email"} id={"email"} name={"email"} placeholder={"user@mail.ru"} onChange={(event) => settEmail(event.target.value)} value={email}/>
                </div>
            </div>
            <div className={scss.button}>
                <BlueButton text={"Обновить данные"} onClick={() => updateWorkerData({first_name: name, surname: surname, last_name: lastName, phone: phone, email: email}, getToken)}/>
            </div>
        </>
    );
};

export default WorkerRequisitesPage;
