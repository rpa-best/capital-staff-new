import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import {IAuthUser} from "../components/pages/Login/Login";
import {ICompany} from "../components/views/CompanyCard/CompanyCard";


const errorMessage = (message: string) => toast.error(message);
const successMessage = (message: string) => toast.success(message);

export interface Type {
    slug?: string
    name?: string
    main?: boolean
}
interface IDocData {
    id: number
    type: Type
    status_doc?: string
    create_date?: string
    start_date?: any
    expired_date?: string
    file?: any
}
export interface IWorkerData {
    id: number
    first_name?: string
    last_name?: string
    surname?: string
    docs: IDocData[]
}

interface IStaffState {
    loading: boolean
    useGetFile: (token: string | null) => any
    useAddStaff: (token: string | null, data: any, authUser: IAuthUser | null) => void
    useGetCompanies: (token: string | null, authUser: IAuthUser | null) => Promise<ICompany[] | []>
    useGetNewDataForTable: (token: string | null, documentType?: string, tempCompany?: string, hasDirection?: boolean, workerType?: "worker" | "candidate") => Promise<IWorkerData[]>
}

export const useStaff = create<IStaffState>()((set) => ({
    loading: false,
    useGetFile: async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/worker/upload-instance/`, {
                headers: {
                    Authorization: token as string
                }
            })
            if (response.status === 200) {
                const blob = await response.blob()
                const downloadUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.target="_blank"
                link.download = 'Сотрудники_образец.xlsx'
                document.body.appendChild(link)
                link.click()
                link.remove()
                successMessage('Загрузка файла...')
            } else {
                errorMessage("Что-то пошло не так!")
            }
        } catch (error: any) {
            const message = error?.message || "Что-то пошло не так!";
            errorMessage(message)
        }
    },
    useAddStaff: async (token, data, authUser) => {
        if (!authUser?.company?.inn) {
            errorMessage('Вы не авторизованы')
            return
        } else if (!data) {
            errorMessage('Не выбран файл для загрузки')
            return
        }
        const checkData = new FormData();
        checkData.append('inn', authUser?.company?.inn)
        checkData.append('xlsx', data);

        try {
            const checkResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/worker/upload-check/`, checkData, {
                headers: {
                    Authorization: token as string
                }
            })
            if (checkResponse.status === 201) {
                successMessage('Файл проверен! Ошибок не выявлено');
                const uploadData = {
                    results: checkResponse.data.results,
                    inn: checkResponse.data.org.inn
                }
                successMessage('Начало загрузки файла...');
                try {
                    const uploadResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/worker/upload-perform/`, uploadData, {
                        headers: {
                            Authorization: token
                        }
                    })
                    if (uploadResponse.status === 201) {
                        successMessage('Файл загружен успешно!');
                    } else {
                        errorMessage('Ошибка при загрузке файла!');
                    }
                } catch (error: any) {
                    const message = error?.response?.data?.message || error?.message || 'Ошибка при загрузке файла!';
                    errorMessage(message);
                }
            } else {
                errorMessage('Выявлены ошибки при проверки файла');
                return;
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Ошибка при проверке файла!';
            errorMessage(message);
        }
    },
    useGetNewDataForTable: async (token, documentType, tempCompany, hasDirection, workerType) => {
        set({
            loading: true
        });
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/worker/worker/`;
            const config = {
                headers: {
                    Authorization: token
                },
                params: {} as { org?: string; status_doc?: string; has_direction?: boolean; type?: "worker" | "candidate" }
            };

            if (tempCompany) {
                config.params.org = tempCompany;
            }
            if (documentType) {
                config.params.status_doc = documentType;
            }
            if (hasDirection) {
                config.params.has_direction = hasDirection;
            }
            if (workerType) {
                config.params.type = workerType;
            }

            const response = await axios.get(url, config);

            if (response.status === 200) {
                successMessage("Данные в таблице обновлены");
                return response.data;
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Что-то пошло не так!";
            errorMessage(message);
            return [];
        } finally {
            set({
                loading: false
            });
        }
    },
    useGetCompanies: async (token) => {
        try {
            set({
                loading: true
            })

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/organization/org/`, {
                headers: {
                    Authorization: token
                }
            })
            return response.data as ICompany[]
        } catch (error) {
            errorMessage("Что-то пошло не так!")
            return []
        } finally {
            set({
                loading: false
            })
        }
    }
}))