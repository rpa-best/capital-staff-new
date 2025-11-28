import React from "react";
import Modal from "../../../../views/Modal/Modal";
import {
    ISurveyType,
    IPayType,
    IMedClient,
    IMedCenter,
    ISubdivision,
    IProfession,
    IService,
    IHazard,
    IPart,
    IMedicalDirectionFormData
} from "./types";
import { IWorkerData } from "../../../../../store/StaffState";
import scss from "./CreateMedicalDirection.module.scss";

interface ConfirmModalProps {
    active: boolean;
    loading: boolean;
    setActive: (active: boolean) => void;
    onConfirm: () => void;
    formData: IMedicalDirectionFormData;
    workerId: string;
    candidates: IWorkerData[];
    surveyTypes: ISurveyType[];
    payTypes: IPayType[];
    medClients: IMedClient[];
    medCenters: IMedCenter[];
    subdivisions: ISubdivision[];
    professions: IProfession[];
    services: IService[];
    hazards: IHazard[];
    parts: IPart[];
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    active,
    loading,
    setActive,
    onConfirm,
    formData,
    workerId,
    candidates,
    surveyTypes,
    payTypes,
    medClients,
    medCenters,
    subdivisions,
    professions,
    services,
    hazards,
    parts
}) => {
    const candidate = candidates.find(c => String(c.id) === workerId);

    return (
        <Modal
            active={active}
            loading={loading}
            setActive={setActive}
            header="Подтверждение создания направления"
            onClick={onConfirm}
        >
            <div className={scss.confirmContent}>
                <div className={scss.confirmSection}>
                    <h3>Кандидат</h3>
                    <p>
                        {candidate
                            ? `${candidate.last_name} ${candidate.first_name} ${candidate.surname}`
                            : "Не выбран"
                        }
                    </p>
                </div>

                <div className={scss.confirmSection}>
                    <h3>Данные пациента</h3>
                    <p><strong>Пол:</strong> {formData.gender || "-"}</p>
                    {formData.address && <p><strong>Адрес регистрации:</strong> {formData.address}</p>}
                    {formData.citizenship && <p><strong>Гражданство:</strong> {formData.citizenship}</p>}
                    {formData.passportPlace && <p><strong>Место выдачи паспорта:</strong> {formData.passportPlace}</p>}
                    {formData.phone && <p><strong>Телефон:</strong> {formData.phone}</p>}
                    {formData.snils && <p><strong>СНИЛС:</strong> {formData.snils}</p>}
                </div>

                <div className={scss.confirmSection}>
                    <h3>Основная информация</h3>
                    <p><strong>Вид осмотра:</strong> {surveyTypes.find(t => t.id === formData.surveyTypeId)?.name || "-"}</p>
                    <p><strong>Вид оплаты:</strong> {payTypes.find(t => t.id === formData.payType)?.name || "-"}</p>
                </div>

                <div className={scss.confirmSection}>
                    <h3>Договор</h3>
                    <p>{medClients.find(c => Number(c.id) === formData.medClientId)?.name || "-"}</p>
                </div>

                <div className={scss.confirmSection}>
                    <h3>Медцентр</h3>
                    <p>{medCenters.find(c => c.id === formData.medCentrId)?.name || "-"}</p>
                </div>

                {(formData.subdivisionId || formData.subdivision) && (
                    <div className={scss.confirmSection}>
                        <h3>Подразделение</h3>
                        <p>{subdivisions.find(s => Number(s.id) === formData.subdivisionId)?.name || formData.subdivision || "-"}</p>
                    </div>
                )}

                {(formData.professionId || formData.profession) && (
                    <div className={scss.confirmSection}>
                        <h3>Профессия</h3>
                        <p>{professions.find(p => Number(p.id) === formData.professionId)?.name || formData.profession || "-"}</p>
                    </div>
                )}

                {formData.services.length > 0 && (
                    <div className={scss.confirmSection}>
                        <h3>Оказанные услуги</h3>
                        <ul>
                            {formData.services.map(id => {
                                const service = services.find(s => String(s.id) === id);
                                return service ? <li key={id}>{service.name}</li> : null;
                            })}
                        </ul>
                    </div>
                )}

                {formData.hazards.length > 0 && (
                    <div className={scss.confirmSection}>
                        <h3>Пункты приказа 29н</h3>
                        <ul>
                            {formData.hazards.map(id => {
                                const hazard = hazards.find(h => String(h.id) === id);
                                return hazard ? <li key={id}>{hazard.point} {hazard.name}</li> : null;
                            })}
                        </ul>
                    </div>
                )}

                {formData.parts.length > 0 && (
                    <div className={scss.confirmSection}>
                        <h3>Дополнительные услуги</h3>
                        <ul>
                            {formData.parts.map(id => {
                                const part = parts.find(p => String(p.id) === id);
                                return part ? <li key={id}>{part.name}</li> : null;
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ConfirmModal;
