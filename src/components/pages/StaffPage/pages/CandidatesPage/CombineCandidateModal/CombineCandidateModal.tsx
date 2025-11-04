import React, { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import { RowClickedEvent } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Vortex } from "react-loader-spinner";
import Modal from "../../../../../views/Modal/Modal";
import scss from "./CombineCandidateModal.module.scss";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthData from "../../../../../../hooks/useAuthData";
import { useUser } from "../../../../../../store/UserState";
import { IWorkerData } from "../../../../../../store/StaffState";

const errorMessage = (message: string) => toast.error(message);
const successMessage = (message: string) => toast.success(message);

interface ICombineCandidateModal {
    active: boolean;
    setActive: (active: boolean) => void;
    candidate: IWorkerData | null;
    onSuccess?: () => void;
}

interface IWorkerTableRow {
    id: number;
    last_name: string | undefined;
    first_name: string | undefined;
    surname: string | undefined;
    originalItem: IWorkerData;
}

const combineCandidate = async (candidateId: number, workerId: number, token: string) => {
    const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/worker/worker/${candidateId}/combine/`,
        { worker: workerId },
        {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

const fetchWorkers = async (token: string, inn: string) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/worker/worker/`,
        {
            headers: {
                Authorization: token
            },
            params: {
                org: inn,
                type: "worker"
            }
        }
    );
    return response.data;
};

const CombineCandidateModal = ({ active, setActive, candidate, onSuccess }: ICombineCandidateModal) => {
    const { getToken } = useAuthData();
    const { selectedCompany } = useUser();
    const [workers, setWorkers] = useState<IWorkerData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<IWorkerData | null>(null);

    useEffect(() => {
        if (active && selectedCompany?.inn && !loading) {
            loadWorkers();
        }
    }, [active]);

    const loadWorkers = async () => {
        if (!selectedCompany?.inn || !getToken) return;

        setLoading(true);
        try {
            const data = await fetchWorkers(getToken, selectedCompany.inn);
            setWorkers(data || []);
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Не удалось загрузить список сотрудников";
            errorMessage(message);
            setWorkers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCombine = async () => {
        if (loading) return;

        if (!candidate || !selectedWorker) {
            errorMessage("Выберите сотрудника для объединения");
            return;
        }

        if (!getToken) {
            errorMessage("Отсутствует токен авторизации");
            return;
        }

        setLoading(true);
        try {
            await combineCandidate(candidate.id, selectedWorker.id, getToken);
            successMessage(`Данные кандидата ${candidate.last_name} ${candidate.first_name} объединены с сотрудником ${selectedWorker.last_name} ${selectedWorker.first_name}`);
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Не удалось объединить данные";
            errorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setSelectedWorker(null);
        setWorkers([]);
        setActive(false);
    };

    const handleRowClick = (event: RowClickedEvent<IWorkerTableRow>) => {
        if (event.data) {
            setSelectedWorker(event.data.originalItem);
        }
    };

    const localeText = {
        noRowsToShow: 'Нет сотрудников',
        page: 'Страница',
        of: 'из',
        to: 'до',
        pageSizeSelectorLabel: 'Количество сотрудников',
        loadingOoo: 'Загрузка...',
        loadingError: 'Ошибка загрузки...',
    };

    const preparedData: IWorkerTableRow[] = workers.map(worker => ({
        id: worker.id,
        last_name: worker.last_name,
        first_name: worker.first_name,
        surname: worker.surname,
        originalItem: worker
    }));

    const colDefs = [
        { headerName: "ID", field: "id" as const, width: 100 },
        { headerName: "Фамилия", field: "last_name" as const, flex: 1 },
        { headerName: "Имя", field: "first_name" as const, flex: 1 },
        { headerName: "Отчество", field: "surname" as const, flex: 1 }
    ];

    const gridOptions = {
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Загрузка данных...</span>',
        overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">Нет сотрудников</span>',
        rowSelection: 'single' as const,
        onRowClicked: handleRowClick
    };

    return (
        <Modal
            active={active}
            loading={false}
            setActive={handleClose}
            header={`Объединить кандидата: ${candidate?.last_name} ${candidate?.first_name}`}
            onClick={handleCombine}
            className={scss.wideModal}
        >
            <div className={scss.modalContainer}>
                <p className={scss.description}>
                    Выберите сотрудника, с которым нужно объединить данные кандидата
                </p>
                <div
                    className={`ag-theme-quartz ${scss.tableContainer}`}
                >
                    {loading ? (
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
                    ) : (
                        <AgGridReact
                            rowData={preparedData}
                            columnDefs={colDefs}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 25, 50]}
                            gridOptions={gridOptions}
                            localeText={localeText}
                        />
                    )}
                </div>
                {selectedWorker && (
                    <div className={scss.selectedWorker}>
                        <strong>Выбран:</strong> {selectedWorker.last_name} {selectedWorker.first_name} {selectedWorker.surname}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CombineCandidateModal;