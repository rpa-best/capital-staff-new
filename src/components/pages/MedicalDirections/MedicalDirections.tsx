import React, { useEffect, useState } from "react";
import scss from "./MedicalDirections.module.scss";
import { useParams } from "react-router-dom";
import useAuthData from "../../../hooks/useAuthData";
import { useWorker } from "../../../store/WorkerState";
import toast from "react-hot-toast";
import axios from "axios";
import { IMedicalDirection } from "./types";
import MedicalDirectionsTable from "./components/MedicalDirectionsTable/MedicalDirectionsTable";
import MedicalDirectionModal from "./components/MedicalDirectionModal/MedicalDirectionModal";

const errorMessage = (message: string) => toast.error(message);

const MedicalDirections = () => {
    const { getToken } = useAuthData();
    const { workerId } = useParams<{ workerId: string }>();
    const { workerData } = useWorker();
    const [directions, setDirections] = useState<IMedicalDirection[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDirection, setSelectedDirection] = useState<IMedicalDirection | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDirections = async () => {
        if (!workerId || isNaN(Number(workerId))) {
            errorMessage('Некорректный ID сотрудника');
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/worker/${workerId}/invoice/`, {

                headers: {
                    Authorization: getToken
                }
            });
            setDirections(response.data);
        } catch (error) {
            errorMessage('Не удалось загрузить направления');
            console.error('Error fetching directions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirections();
    }, [workerId, getToken]);

    const handleRowClick = (direction: IMedicalDirection) => {
        setSelectedDirection(direction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDirection(null);
    };

    if (!workerId || isNaN(Number(workerId))) {
        return (
            <div className={scss.headContainer}>
                <h1>Ошибка</h1>
                <p>Некорректный ID сотрудника</p>
            </div>
        );
    }

    return (
        <>
            <div className={scss.headContainer}>
                <h1>Медицинские направления</h1>
                {workerData && (
                    <div className={scss.workerInfo}>
                        <span>{workerData.last_name} {workerData.first_name} {workerData.surname}</span>
                    </div>
                )}
            </div>
            
            <div className={scss.content}>
                <MedicalDirectionsTable 
                    tableData={directions} 
                    loading={loading} 
                    onRowClick={handleRowClick}
                />
            </div>

            <MedicalDirectionModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                direction={selectedDirection}
            />
        </>
    );
};

export default MedicalDirections;