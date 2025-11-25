import React, { useEffect, useState } from "react";
import scss from "./Medicine.module.scss";
import MedicalStaffTable from "./components/MedicalStaffTable/MedicalStaffTable";
import BlueButton from "../../comps/BlueButton/BlueButton";
import toast from "react-hot-toast";
import useAuthData from "../../../hooks/useAuthData";
import axios from "axios";
import { IWorkerInvoice } from "./types";
import {useUser} from "../../../store/UserState";
import { usePrefixedNavigate } from "../../../hooks/usePrefixedNavigate";
import { CREATE_MEDICAL_DIRECTION_PAGE } from "../../../consts/pageConsts";

const errorMessage = (message: string) => toast.error(message);

const Medicine = () => {
    const { getToken, authUser } = useAuthData();
    const navigate = usePrefixedNavigate();
    const [workerInvoices, setWorkerInvoices] = useState<IWorkerInvoice[]>([]);
    const [loading, setLoading] = useState(false);
    const { selectedCompany } = useUser()

    const fetchWorkerInvoices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/worker-invoice/`, {
                headers: {
                    Authorization: getToken
                },
                params: {
                    org: selectedCompany?.inn,
                    type: "candidate"
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
    }, [getToken, selectedCompany]);

    return (
        <>
            <div className={scss.headContainer}>
                <h1>Медицина</h1>

                {authUser?.is_superuser || true && (
                    <div>
                        <BlueButton
                            text="Создать направление"
                            onClick={() => navigate(CREATE_MEDICAL_DIRECTION_PAGE)}
                        />
                    </div>
                )}

            </div>

            <div className={scss.table}>
                <MedicalStaffTable tableData={workerInvoices} loading={loading} />
            </div>
        </>
    );
};

export default Medicine;