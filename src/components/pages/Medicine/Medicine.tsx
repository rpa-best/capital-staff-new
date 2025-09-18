import React, { useEffect, useState } from "react";
import scss from "./Medicine.module.scss";
import MedicalStaffTable from "./components/MedicalStaffTable/MedicalStaffTable";
import toast from "react-hot-toast";
import useAuthData from "../../../hooks/useAuthData";
import axios from "axios";
import { IWorkerInvoice } from "./types";

const errorMessage = (message: string) => toast.error(message);

const Medicine = () => {
    const { getToken } = useAuthData();
    const [workerInvoices, setWorkerInvoices] = useState<IWorkerInvoice[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWorkerInvoices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/worker-invoice/`, {
                headers: {
                    Authorization: getToken
                }
            });
            setWorkerInvoices(response.data);
        } catch (error) {
            errorMessage('Не удалось загрузить счета сотрудников');
            console.error('Error fetching worker invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkerInvoices();
    }, [getToken]);

    return (
        <>
            <div className={scss.headContainer}>
                <h1>Медицина</h1>
            </div>
            
            <div className={scss.table}>
                <MedicalStaffTable tableData={workerInvoices} loading={loading} />
            </div>
        </>
    );
};

export default Medicine;