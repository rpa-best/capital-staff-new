import { useState } from 'react';
import scss from './MedicalDirectionModal.module.scss';
import {IMedicalDirection} from "../../types";
import Modal from "../../../../comps/Modal/Modal";
import useAuthData from '../../../../../hooks/useAuthData';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { downloadBlob } from '../../../../../utils/download';
import BlueButton from '../../../../comps/BlueButton/BlueButton';

const downloadDirectionPdf = async (workerId: string, orderId: number, token: string) => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/mprofid/worker/${workerId}/invoice/${orderId}/direction/`;
    const response = await axios.get(url, {
        headers: {
            Authorization: token,
            'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    downloadBlob(blob, `Направление №${orderId}.pdf`);
};

interface IMedicalDirectionModal {
    isOpen: boolean;
    onClose: () => void;
    direction: IMedicalDirection | null;
}

const MedicalDirectionModal = ({isOpen, onClose, direction}: IMedicalDirectionModal) => {
    const { getToken } = useAuthData();
    const { workerId } = useParams<{ workerId: string }>();
    const [isDownloading, setIsDownloading] = useState(false);

    if (!direction) return null;

    const {data} = direction;

    const handleDownloadPdf = async () => {
        if (!workerId || !direction.id) {
            toast.error('Не удалось определить параметры для скачивания');
            return;
        }

        setIsDownloading(true);
        try {
            await downloadDirectionPdf(workerId, direction.id, getToken!);
            toast.success('Направление скачано');
        } catch (error) {
            toast.error('Не удалось скачать направление');
            console.error('Download error:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title={`Направление #${direction.id}`}
            width="800px"
            maxWidth="90vw"
        >
            <div className={scss.content}>
                <div className={scss.actions}>
                    <BlueButton 
                        text={'Скачать направление'}
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                    />
                </div>

                <div className={scss.section}>
                    <h3>Основная информация</h3>
                    <div className={scss.infoGrid}>
                        <div className={scss.infoItem}>
                            <label>ФИО:</label>
                            <span>{data.fam}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Пол:</label>
                            <span>{data.gender}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Дата рождения:</label>
                            <span>{data.birthday}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Гражданство:</label>
                            <span>{data.citizenship}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Телефон:</label>
                            <span>{data.phone}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Адрес:</label>
                            <span>{data.address || 'Не указан'}</span>
                        </div>
                    </div>
                </div>

                <div className={scss.section}>
                    <h3>Документы</h3>
                    <div className={scss.infoGrid}>
                        <div className={scss.infoItem}>
                            <label>Паспорт:</label>
                            <span>{data.passport}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Дата выдачи:</label>
                            <span>{data.passportDate}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Кем выдан:</label>
                            <span>{data.passportPlace}</span>
                        </div>
                    </div>
                </div>

                <div className={scss.section}>
                    <h3>Статус заказа</h3>
                    <div className={scss.statusInfo}>
                        <div className={scss.status}>
                            <span className={scss.statusBadge}>{data.statusName}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Дата заказа:</label>
                            <span>{data.orderDate}</span>
                        </div>
                        <div className={scss.infoItem}>
                            <label>Создано:</label>
                            <span>{direction.created_at}</span>
                        </div>
                    </div>
                </div>

                <div className={scss.section}>
                    <h3>Услуги</h3>
                    <div className={scss.servicesList}>
                        {data.services.map((service, index) => (
                            <div key={index} className={scss.serviceItem}>
                                {service.name}
                            </div>
                        ))}
                    </div>
                </div>

                {data.surveyScope.length > 0 && (
                    <div className={scss.section}>
                        <h3>Обследования</h3>
                        <div className={scss.surveyList}>
                            {data.surveyScope.map((survey, index) => (
                                <div key={index} className={scss.surveyItem}>
                                    <span>{survey.name}</span>
                                    <span className={scss.surveyStatus}>{survey.status || 'Не выполнено'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.parts.length > 0 && (
                    <div className={scss.section}>
                        <h3>Процедуры</h3>
                        <div className={scss.partsList}>
                            {data.parts.map((part, index) => (
                                <div key={index} className={scss.partItem}>
                                    <span>{part.name}</span>
                                    <span className={scss.partPrice}>
                                        {part.price} руб.
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={scss.section}>
                    <h3>Стоимость</h3>
                    <div className={scss.totalSum}>
                        Общая сумма: <strong>{data.paymentSum} руб.</strong>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default MedicalDirectionModal;