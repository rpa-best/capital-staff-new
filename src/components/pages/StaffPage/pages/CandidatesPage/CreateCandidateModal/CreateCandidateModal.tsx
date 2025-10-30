import React, {useState} from "react";
import InputMask from "react-input-mask";
import Modal from "../../../../../views/Modal/Modal";
import Input from "../../../../../comps/Input/Input";
import scss from "./CreateCandidateModal.module.scss";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthData from "../../../../../../hooks/useAuthData";
import {useUser} from "../../../../../../store/UserState";

const errorMessage = (message: string) => toast.error(message);
const successMessage = (message: string) => toast.success(message);

const createCandidate = async (data: ICandidateData, token: string | null) => {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/api/worker/worker/`, data, {
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        }
    });
};

interface ICreateCandidateModal {
    active: boolean;
    setActive: (active: boolean) => void;
    onSuccess?: () => void;
}

export interface ICandidateData {
    first_name: string;
    last_name: string;
    surname: string;
    phone: string;
    email: string;
    birthday: string;
    birth_place: string;
    passport: string;
    passport_date: string;
    inn: string
    type: "candidate";
}

const CreateCandidateModal = ({active, setActive, onSuccess}: ICreateCandidateModal) => {
    const {getToken} = useAuthData();
    const { selectedCompany } = useUser()
    
    const [formData, setFormData] = useState<ICandidateData>({
        first_name: "",
        last_name: "",
        surname: "",
        phone: "",
        email: "",
        birthday: "",
        birth_place: "",
        passport: "",
        passport_date: "",
        type: "candidate",
        inn: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name || !formData.surname || !formData.phone ||
            !formData.email || !formData.birthday || !formData.birth_place ||
            !formData.passport || !formData.passport_date) {
            errorMessage("Заполните все обязательные поля!");
            return;
        }

        const dataToSend: ICandidateData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            surname: formData.surname,
            phone: formData.phone,
            email: formData.email,
            birthday: formData.birthday,
            birth_place: formData.birth_place,
            passport: formData.passport,
            passport_date: formData.passport_date,
            inn: selectedCompany?.inn || "",
            type: "candidate"
        };

        setLoading(true);
        try {
            const response = await createCandidate(dataToSend, getToken);

            successMessage("Кандидат успешно создан!");
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Не удалось создать кандидата!";
            errorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            first_name: "",
            last_name: "",
            surname: "",
            phone: "",
            email: "",
            birthday: "",
            birth_place: "",
            passport: "",
            passport_date: "",
            inn: "",
            type: "candidate"
        });
        setActive(false);
    };

    return (
        <Modal
            active={active}
            loading={loading}
            setActive={handleClose}
            header="Создать кандидата"
            onClick={handleSubmit}
        >
            <div className={scss.formContainer}>
                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Личные данные</div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label htmlFor="last_name">Фамилия *</label>
                            <Input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                placeholder="Введите фамилию"
                            />
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="first_name">Имя *</label>
                            <Input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                placeholder="Введите имя"
                            />
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="surname">Отчество *</label>
                            <Input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formData.surname}
                                onChange={(e) => setFormData({...formData, surname: e.target.value})}
                                placeholder="Введите отчество"
                            />
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="birthday">Дата рождения *</label>
                            <Input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                            />
                        </div>

                        <div className={`${scss.formGroup} ${scss.fullWidth}`}>
                            <label htmlFor="birth_place">Место рождения *</label>
                            <Input
                                type="text"
                                id="birth_place"
                                name="birth_place"
                                value={formData.birth_place}
                                onChange={(e) => setFormData({...formData, birth_place: e.target.value})}
                                placeholder="Введите место рождения"
                            />
                        </div>
                    </div>
                </div>
                
                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Контактные данные</div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label htmlFor="phone">Телефон *</label>
                            <InputMask
                                mask="+999999999999999"
                                maskChar=""
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                            <label htmlFor="email">Email *</label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Введите email"
                            />
                        </div>
                    </div>
                </div>
                
                <div className={scss.section}>
                    <div className={scss.sectionTitle}>Паспортные данные</div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label htmlFor="passport">Серия и номер *</label>
                            <InputMask
                                mask="9999 999999"
                                maskChar=""
                                value={formData.passport}
                                onChange={(e) => setFormData({...formData, passport: e.target.value})}
                            >
                                {(inputProps: any) => (
                                    <Input
                                        {...inputProps}
                                        type="text"
                                        id="passport"
                                        name="passport"
                                        placeholder="0000 000000"
                                    />
                                )}
                            </InputMask>
                        </div>

                        <div className={scss.formGroup}>
                            <label htmlFor="passport_date">Дата выдачи *</label>
                            <Input
                                type="date"
                                id="passport_date"
                                name="passport_date"
                                value={formData.passport_date}
                                onChange={(e) => setFormData({...formData, passport_date: e.target.value})}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateCandidateModal;
