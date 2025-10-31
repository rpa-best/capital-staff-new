import React, { useEffect, useState } from "react";
import BlueButton from "../../../../comps/BlueButton/BlueButton";
import scss from "./CandidatesPage.module.scss";
import CandidatesTable from "./CandidatesTable/CandidatesTable";
import { IWorkerData, useStaff } from "../../../../../store/StaffState";
import toast from "react-hot-toast";
import useAuthData from "../../../../../hooks/useAuthData";
import {useUser} from "../../../../../store/UserState";
import CreateCandidateModal from "./CreateCandidateModal/CreateCandidateModal";
import ConfirmModal from "../../../../views/Modal/ConfirmModal";
import axios from "axios";

const errorMessage = (message: string) => toast.error(message);
const successMessage = (message: string) => toast.success(message);

const makeEmployeeRequest = async (workerId: number, token: string) => {
    const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/worker/worker/${workerId}/`,
        { type: "worker" },
        {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            },
            params: {
                type: "candidate",
            }
        }
    );
    return response.data;
};

const CandidatesPage = () => {
    const { getToken } = useAuthData();
    const [tableData, setTableData] = useState<IWorkerData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [candidateToPromote, setCandidateToPromote] = useState<IWorkerData | null>(null);
    const { selectedCompany } = useUser()
    const { loading, getNewDataForTable } = useStaff((state) => ({
        loading: state.loading,
        getNewDataForTable: state.useGetNewDataForTable
    }));

    const refreshTableData = () => {
        if (!selectedCompany) return;

        getNewDataForTable(getToken, undefined, selectedCompany.inn!, undefined, "candidate").then((data) => {
            setTableData(data || [])
        }).catch(() => {
            errorMessage('Не удалось обновить кандидатов')
            setTableData([])
        })
    };

    const handleMakeEmployee = (candidate: IWorkerData) => {
        setCandidateToPromote(candidate);
        setIsConfirmModalOpen(true);
    };

    const confirmMakeEmployee = async () => {
        if (!candidateToPromote) return;

        try {
            await makeEmployeeRequest(candidateToPromote.id, getToken!);
            successMessage(`${candidateToPromote.last_name} ${candidateToPromote.first_name} теперь сотрудник`);
            refreshTableData();
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Не удалось изменить статус";
            errorMessage(message);
        } finally {
            setCandidateToPromote(null);
        }
    };

    useEffect(() => {
        refreshTableData();
    }, [selectedCompany]);

    return (
        <>
            <div className={scss.headContainer}>
                <h1>Кандидаты компании</h1>
            </div>
            <div className={scss.attributes}>
                <div className={scss.buttons}>
                    <div className={scss.downloadButton}>
                        <BlueButton
                            onClick={() => setIsModalOpen(true)}
                            text="Добавить кандидата"
                        />
                    </div>
                </div>
            </div>

            <div className={scss.table}>
                <CandidatesTable
                    tableData={tableData}
                    loading={loading}
                    onMakeEmployee={handleMakeEmployee}
                />
            </div>

            <CreateCandidateModal
                active={isModalOpen}
                setActive={setIsModalOpen}
                onSuccess={refreshTableData}
            />

            <ConfirmModal
                active={isConfirmModalOpen}
                setActive={setIsConfirmModalOpen}
                header="Подтверждение действия"
                message={candidateToPromote
                    ? `Вы уверены, что хотите сделать ${candidateToPromote.last_name} ${candidateToPromote.first_name} сотрудником?`
                    : "Вы уверены, что хотите продолжить?"
                }
                onConfirm={confirmMakeEmployee}
                confirmText="Да, сделать сотрудником"
                cancelText="Отмена"
            />
        </>
    );
};

export default CandidatesPage;
