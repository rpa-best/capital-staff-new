import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import scss from "./CreateMedicalDirection.module.scss";
import Input from "../../../../comps/Input/Input";
import BlueButton from "../../../../comps/BlueButton/BlueButton";
import WhiteButton from "../../../../comps/WhiteButton/WhiteButton";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthData from "../../../../../hooks/useAuthData";
import { usePrefixedNavigate } from "../../../../../hooks/usePrefixedNavigate";
import { MEDICINE_PAGE } from "../../../../../consts/pageConsts";
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
import { useUser } from "../../../../../store/UserState";
import CheckboxGroupWithSearch from "../../components/CheckboxGroupWithSearch/CheckboxGroupWithSearch";
import { IWorkerData, useStaff } from "../../../../../store/StaffState";
import CustomAutocomplete from "../../../../comps/AutoComplete/AutoComplete";
import ConfirmModal from "./ConfirmModal";

const errorMessage = (message: string) => toast.error(message);
const successMessage = (message: string) => toast.success(message);

const CreateMedicalDirection = () => {
    const { getToken } = useAuthData();
    const navigate = usePrefixedNavigate();
    const { selectedCompany } = useUser();
    const { getNewDataForTable } = useStaff((state) => ({
        getNewDataForTable: state.useGetNewDataForTable
    }));

    const [formData, setFormData] = useState<IMedicalDirectionFormData>({
        gender: "",
        surveyTypeId: undefined,
        address: undefined,
        citizenship: undefined,
        passportPlace: undefined,
        phone: undefined,
        snils: undefined,
        payType: "",
        medClientId: undefined,
        medCentrId: undefined,
        subdivisionId: undefined,
        subdivision: undefined,
        professionId: undefined,
        profession: undefined,
        services: [],
        hazards: [],
        parts: []
    });

    const [workerId, setWorkerId] = useState<string>("");
    const [candidates, setCandidates] = useState<IWorkerData[]>([]);

    const [surveyTypes, setSurveyTypes] = useState<ISurveyType[]>([]);
    const [payTypes, setPayTypes] = useState<IPayType[]>([]);
    const [medClients, setMedClients] = useState<IMedClient[]>([]);
    const [medCenters, setMedCenters] = useState<IMedCenter[]>([]);
    const [subdivisions, setSubdivisions] = useState<ISubdivision[]>([]);
    const [professions, setProfessions] = useState<IProfession[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [hazards, setHazards] = useState<IHazard[]>([]);
    const [parts, setParts] = useState<IPart[]>([]);

    const [isCustomSubdivision, setIsCustomSubdivision] = useState(false);
    const [isCustomProfession, setIsCustomProfession] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        fetchSurveyTypes();
        fetchPayTypes();
        fetchMedClients();
        fetchMedCenters();
        fetchServices();
        fetchHazards();
        fetchParts();
        fetchCandidates();
    }, [selectedCompany]);

    useEffect(() => {
        if (formData.medClientId) {
            fetchSubdivisions(formData.medClientId);
            fetchProfessions(formData.medClientId);
        } else {
            setSubdivisions([]);
            setProfessions([]);
        }
    }, [formData.medClientId]);

    useEffect(() => {
        if (formData.professionId) {
            const selectedProfession = professions.find(p => Number(p.id) === formData.professionId);
            if (selectedProfession && selectedProfession.hazards.length > 0) {
                setFormData(prev => ({ ...prev, hazards: selectedProfession.hazards }));
            }
        }
    }, [formData.professionId, professions]);

    const fetchCandidates = () => {
        if (!selectedCompany?.inn) return;

        getNewDataForTable(getToken, undefined, selectedCompany.inn, undefined, "candidate")
            .then((data) => {
                setCandidates(data || []);
            })
            .catch(() => {
                errorMessage('Не удалось загрузить список кандидатов');
                setCandidates([]);
            });
    };

    const fetchSurveyTypes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/dictionary/survey/`, {
                headers: { Authorization: getToken }
            });
            setSurveyTypes(response.data.surveyTypes || []);
        } catch (error) {
            errorMessage('Не удалось загрузить виды осмотра');
            console.error('Error fetching survey types:', error);
        }
    };

    const fetchPayTypes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/dictionary/pay-types/`, {
                headers: { Authorization: getToken }
            });
            setPayTypes(response.data.payTypes || []);
        } catch (error) {
            errorMessage('Не удалось загрузить виды оплаты');
            console.error('Error fetching pay types:', error);
        }
    };

    const fetchMedClients = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/medclients/`, {
                headers: { Authorization: getToken }
            });
            setMedClients(response.data.medClient || []);
        } catch (error) {
            errorMessage('Не удалось загрузить договоры');
            console.error('Error fetching med clients:', error);
        }
    };

    const fetchMedCenters = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/dictionary/medCenters/`, {
                headers: { Authorization: getToken }
            });
            setMedCenters(response.data.medCenters || []);
        } catch (error) {
            errorMessage('Не удалось загрузить медцентры');
            console.error('Error fetching med centers:', error);
        }
    };

    const fetchSubdivisions = async (medClientId: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/medclients/${medClientId}/subdivisions/`, {
                headers: { Authorization: getToken }
            });
            setSubdivisions(response.data.subdivisions || []);
        } catch (error) {
            errorMessage('Не удалось загрузить подразделения');
            console.error('Error fetching subdivisions:', error);
        }
    };

    const fetchProfessions = async (medClientId: number) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/medclients/${medClientId}/professions/`, {
                headers: { Authorization: getToken }
            });
            setProfessions(response.data.professions || []);
        } catch (error) {
            errorMessage('Не удалось загрузить профессии');
            console.error('Error fetching professions:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/dictionary/services/`, {
                headers: { Authorization: getToken }
            });
            setServices(response.data.services || []);
        } catch (error) {
            errorMessage('Не удалось загрузить услуги');
            console.error('Error fetching services:', error);
        }
    };

    const fetchHazards = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/dictionary/hazards/`, {
                headers: { Authorization: getToken }
            });
            setHazards(response.data.hazards || []);
        } catch (error) {
            errorMessage('Не удалось загрузить вредные факторы');
            console.error('Error fetching hazards:', error);
        }
    };

    const fetchParts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/mprofid/dictionary/parts/`, {
                headers: { Authorization: getToken }
            });
            setParts(response.data.parts || []);
        } catch (error) {
            errorMessage('Не удалось загрузить доп. услуги');
            console.error('Error fetching parts:', error);
        }
    };

    const handleShowConfirmModal = () => {
        if (!workerId || !formData.gender || !formData.payType ||
            !formData.medClientId || !formData.medCentrId || formData.services.length === 0) {
            errorMessage("Заполните все обязательные поля!");
            return;
        }
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        setShowConfirmModal(false);

        if (!workerId) {
            errorMessage("Кандидат не выбран!");
            return;
        }

        const dataToSend: any = {
            gender: formData.gender,
            surveyTypeId: formData.surveyTypeId,
            payType: formData.payType,
            medClientId: formData.medClientId,
            medCentrId: formData.medCentrId,
            services: formData.services,
        };

        if (formData.address?.trim()) dataToSend.address = formData.address.trim();
        if (formData.citizenship?.trim()) dataToSend.citizenship = formData.citizenship.trim();
        if (formData.passportPlace?.trim()) dataToSend.passportPlace = formData.passportPlace.trim();
        if (formData.phone?.trim()) dataToSend.phone = formData.phone.trim();
        if (formData.snils?.trim()) dataToSend.snils = formData.snils.trim();
        if (formData.subdivisionId) dataToSend.subdivisionId = formData.subdivisionId;
        if (formData.subdivision?.trim()) dataToSend.subdivision = formData.subdivision.trim();
        if (formData.professionId) dataToSend.professionId = formData.professionId;
        if (formData.profession?.trim()) dataToSend.profession = formData.profession.trim();
        if (formData.hazards.length > 0) dataToSend.hazards = formData.hazards;
        if (formData.parts.length > 0) dataToSend.parts = formData.parts;

        setLoading(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/mprofid/worker/${workerId}/invoice/`,
                dataToSend,
                {
                    headers: {
                        Authorization: getToken,
                        'Content-Type': 'application/json'
                    }
                }
            );

            successMessage("Направление успешно создано!");
            navigate(MEDICINE_PAGE);
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Не удалось создать направление!";
            errorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(MEDICINE_PAGE);
    };

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => {
            const services = prev.services.includes(serviceId)
                ? prev.services.filter(id => id !== serviceId)
                : [...prev.services, serviceId];
            return { ...prev, services };
        });
    };

    const handleHazardToggle = (hazardId: string) => {
        setFormData(prev => {
            const hazards = prev.hazards.includes(hazardId)
                ? prev.hazards.filter(id => id !== hazardId)
                : [...prev.hazards, hazardId];
            return { ...prev, hazards };
        });
    };

    const handlePartToggle = (partId: string) => {
        setFormData(prev => {
            const parts = prev.parts.includes(partId)
                ? prev.parts.filter(id => id !== partId)
                : [...prev.parts, partId];
            return { ...prev, parts };
        });
    };

    return (
        <div className={scss.container}>
            <div className={scss.header}>
                <h1>Создание медицинского направления</h1>
            </div>

            <div className={scss.formContainer}>
                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Кандидат (Сотрудник) *</div>
                    <div className={scss.formRow}>
                        <div className={`${scss.formGroup} ${scss.fullWidth}`}>
                            <label htmlFor="workerId">Выберите кандидата</label>
                            <select
                                id="workerId"
                                value={workerId}
                                onChange={(e) => setWorkerId(e.target.value)}
                                className={scss.select}
                            >
                                <option value="">Выберите кандидата</option>
                                {candidates.map(candidate => (
                                    <option key={candidate.id} value={String(candidate.id)}>
                                        {candidate.last_name} {candidate.first_name} {candidate.surname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Данные пациента</div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label htmlFor="gender">Пол *</label>
                            <select
                                id="gender"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "мужской" | "женский" | "" })}
                                className={scss.select}
                            >
                                <option value="">Выберите пол</option>
                                <option value="мужской">Мужской</option>
                                <option value="женский">Женский</option>
                            </select>
                        </div>

                        <div className={`${scss.formGroup} ${scss.fullWidth}`}>
                            <label htmlFor="address">Адрес регистрации</label>
                            <Input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address || ""}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Введите адрес регистрации"
                            />
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="citizenship">Гражданство</label>
                            <Input
                                type="text"
                                id="citizenship"
                                name="citizenship"
                                value={formData.citizenship || ""}
                                onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                                placeholder="Введите гражданство"
                            />
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="passportPlace">Место выдачи паспорта</label>
                            <Input
                                type="text"
                                id="passportPlace"
                                name="passportPlace"
                                value={formData.passportPlace || ""}
                                onChange={(e) => setFormData({ ...formData, passportPlace: e.target.value })}
                                placeholder="Введите место выдачи паспорта"
                            />
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="phone">Телефон</label>
                            <InputMask
                                mask="+99999999999"
                                maskChar=""
                                value={formData.phone || ""}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            >
                                {(inputProps: any) => (
                                    <Input
                                        {...inputProps}
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="+7"
                                    />
                                )}
                            </InputMask>
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="snils">СНИЛС</label>
                            <InputMask
                                mask="999-999-999 99"
                                maskChar=""
                                value={formData.snils || ""}
                                onChange={(e) => setFormData({ ...formData, snils: e.target.value })}
                            >
                                {(inputProps: any) => (
                                    <Input
                                        {...inputProps}
                                        type="text"
                                        id="snils"
                                        name="snils"
                                        placeholder="000-000-000 00"
                                    />
                                )}
                            </InputMask>
                        </div>
                    </div>
                </div>

                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Основная информация</div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label htmlFor="surveyTypeId">Вид осмотра</label>
                            <select
                                id="surveyTypeId"
                                value={formData.surveyTypeId || ""}
                                onChange={(e) => setFormData({ ...formData, surveyTypeId: e.target.value })}
                                className={scss.select}
                            >
                                <option value="">Выберите вид осмотра</option>
                                {surveyTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="payType">Вид оплаты *</label>
                            <select
                                id="payType"
                                value={formData.payType}
                                onChange={(e) => setFormData({ ...formData, payType: Number(e.target.value) || "" })}
                                className={scss.select}
                            >
                                <option value="">Выберите вид оплаты</option>
                                {payTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Договор и организация</div>
                    <div className={scss.formRow}>
                        <div className={`${scss.formGroup} ${scss.fullWidth}`}>
                            <label htmlFor="medClientId">Договор *</label>
                            <select
                                id="medClientId"
                                value={formData.medClientId || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    medClientId: Number(e.target.value) || undefined,
                                    subdivisionId: undefined,
                                    professionId: undefined
                                })}
                                className={scss.select}
                            >
                                <option value="">Выберите договор</option>
                                {medClients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} - Договор №{client.contractNumber} от {client.contractDate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`${scss.formGroup} ${scss.fullWidth}`}>
                            <label htmlFor="medCentrId">Медцентр *</label>
                            <select
                                id="medCentrId"
                                value={formData.medCentrId || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    medCentrId: Number(e.target.value) || undefined
                                })}
                                className={scss.select}
                            >
                                <option value="">Выберите медцентр</option>
                                {medCenters.map(center => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {formData.medClientId && (
                    <div className={scss.section}>
                        <div className={scss.sectionTitle}>Подразделение</div>
                        <div className={scss.twoColumnRow}>
                            <div className={scss.formGroup}>
                                <CustomAutocomplete
                                    label="Подразделение из справочника"
                                    options={subdivisions}
                                    placeholder="Выберите подразделение"
                                    value={subdivisions.find(s => Number(s.id) === formData.subdivisionId) || null}
                                    onChange={(value: ISubdivision | null) => {
                                        setFormData({ ...formData, subdivisionId: value?.id ? Number(value.id) : undefined });
                                    }}
                                    getOptionLabel={(option: ISubdivision) => option.name}
                                    onInputChange={() => {}}
                                    disabled={isCustomSubdivision || subdivisions.length === 0}
                                />
                                <div className={scss.checkboxContainer}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isCustomSubdivision}
                                            onChange={(e) => {
                                                setIsCustomSubdivision(e.target.checked);
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, subdivisionId: undefined });
                                                } else {
                                                    setFormData({ ...formData, subdivision: undefined });
                                                }
                                            }}
                                        />
                                        <span>Нет в списке</span>
                                    </label>
                                </div>
                            </div>

                            {isCustomSubdivision && (
                                <div className={scss.formGroup}>
                                    <label htmlFor="subdivision">Введите подразделение</label>
                                    <Input
                                        type="text"
                                        id="subdivision"
                                        name="subdivision"
                                        value={formData.subdivision || ""}
                                        onChange={(e) => setFormData({ ...formData, subdivision: e.target.value })}
                                        placeholder="Введите подразделение"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {formData.medClientId && (
                    <div className={scss.section}>
                        <div className={scss.sectionTitle}>Профессия</div>
                        <div className={scss.twoColumnRow}>
                            <div className={scss.formGroup}>
                                <CustomAutocomplete
                                    label="Профессия из справочника"
                                    options={professions}
                                    placeholder="Выберите профессию"
                                    value={professions.find(p => Number(p.id) === formData.professionId) || null}
                                    onChange={(value: IProfession | null) => {
                                        setFormData({ ...formData, professionId: value?.id ? Number(value.id) : undefined });
                                    }}
                                    getOptionLabel={(option: IProfession) => option.name}
                                    onInputChange={() => {}}
                                    disabled={isCustomProfession || professions.length === 0}
                                />
                                <div className={scss.checkboxContainer}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isCustomProfession}
                                            onChange={(e) => {
                                                setIsCustomProfession(e.target.checked);
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, professionId: undefined });
                                                } else {
                                                    setFormData({ ...formData, profession: undefined });
                                                }
                                            }}
                                        />
                                        <span>Нет в списке</span>
                                    </label>
                                </div>
                            </div>
                
                            {isCustomProfession && (
                                <div className={scss.formGroup}>
                                    <label htmlFor="profession">Введите профессию</label>
                                    <Input
                                        type="text"
                                        id="profession"
                                        name="profession"
                                        value={formData.profession || ""}
                                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                        placeholder="Введите профессию"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <CheckboxGroupWithSearch
                    title="Оказанные услуги"
                    items={services.map(service => ({ id: service.id, label: service.name }))}
                    selectedIds={formData.services}
                    onToggle={handleServiceToggle}
                    required
                />

                <CheckboxGroupWithSearch
                    title="Пункты приказа 29н"
                    items={hazards.map(hazard => ({ id: hazard.id, label: `${hazard.point} ${hazard.name}` }))}
                    selectedIds={formData.hazards}
                    onToggle={handleHazardToggle}
                />

                <CheckboxGroupWithSearch
                    title="Дополнительные услуги"
                    items={parts.map(part => ({ id: part.id, label: part.name }))}
                    selectedIds={formData.parts}
                    onToggle={handlePartToggle}
                />

                <div className={scss.buttonGroup}>
                    <WhiteButton
                        text="Отмена"
                        onClick={handleCancel}
                    />
                    <BlueButton
                        text={loading ? "Создание..." : "Создать направление"}
                        onClick={handleShowConfirmModal}
                        
                        disabled={loading}
                    />
                </div>
            </div>

            <ConfirmModal
                active={showConfirmModal}
                loading={loading}
                setActive={setShowConfirmModal}
                onConfirm={handleSubmit}
                formData={formData}
                workerId={workerId}
                candidates={candidates}
                surveyTypes={surveyTypes}
                payTypes={payTypes}
                medClients={medClients}
                medCenters={medCenters}
                subdivisions={subdivisions}
                professions={professions}
                services={services}
                hazards={hazards}
                parts={parts}
            />
        </div>
    );
};

export default CreateMedicalDirection;
