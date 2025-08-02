import React, { useEffect, useState } from "react";
import scss from "./Medicine.module.scss";
import MedicalStaffTable from "./components/MedicalStaffTable/MedicalStaffTable";
import { IWorkerData, useStaff } from "../../../store/StaffState";
import toast from "react-hot-toast";
import useAuthData from "../../../hooks/useAuthData";
import { useUser } from "../../../store/UserState";

const errorMessage = (message: string) => toast.error(message);

const Medicine = () => {
    const { getToken } = useAuthData();
    const [tableData, setTableData] = useState<IWorkerData[]>([]);
    const { selectedCompany } = useUser();
    const { loading, getNewDataForTable } = useStaff((state) => ({
        loading: state.loading,
        getNewDataForTable: state.useGetNewDataForTable
    }));

    useEffect(() => {
        if (!selectedCompany) return;
        
        getNewDataForTable(getToken, undefined, selectedCompany.inn!).then((data) => {
            setTableData(data);
        }).catch(() => {
            errorMessage('Не удалось обновить данные сотрудников');
        });
    }, [selectedCompany, getToken, getNewDataForTable]);

    return (
        <>
            <div className={scss.headContainer}>
                <h1>Медицина</h1>
            </div>
            
            <div className={scss.table}>
                <MedicalStaffTable tableData={tableData} loading={loading} />
            </div>
        </>
    );
};

export default Medicine;