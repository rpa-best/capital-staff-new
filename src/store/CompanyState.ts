import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import {ICompany} from "../components/views/CompanyCard/CompanyCard";
import {IAuthUser} from "../components/pages/Login/Login";
const errorMessage = (message: string) => toast.error(message)
const successMessage = (message: string) => toast.success(message)

export interface ICompanyItem {
    id: number,
    org: ICompany
    status: string,
    role: string
}

export interface ICompanyWithStatus {
    id: number,
    org: ICompany,
    status: string,
    role: string
}
interface ICompanyState {
    loading: boolean
    tempCompanies: ICompanyItem[],
    getCompanies: (value: string, token: string | null) => Promise<boolean>
    getMyCompanies: (authUser: IAuthUser | null, token: string | null) => Promise<ICompanyWithStatus[] | null>
    addCompany: (company: ICompany, token: string | null) => Promise<void>
    updateCompany: (company: ICompany, token: string | null) => Promise<void>
}
export const useCompanies = create<ICompanyState>((set) => ({
    loading: false,
    tempCompanies: [],
    getCompanies: async (value, token) => {
        if (!value) {
            return false;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/organization/info/${value}`, {
                headers: {
                    Authorization: token
                }
            });
            set({
                tempCompanies: response.data
            })
            return true
        } catch (error) {
            return false;
        }
    },
    getMyCompanies: async (authUser, token) => {
        set({
            loading: true
        })
        try {
            const response= await axios.get(`${process.env.REACT_APP_BASE_URL}/api/worker/worker/${authUser?.id}/org/`, {
                headers: {
                    Authorization: token
                }
            })

            if (response.status === 200) {
                successMessage('Компании обновлены успешно!')
                return response.data
            } else {
                errorMessage('Что-то пошло не так!')
                return null
            }
        } finally {
            set({
                loading: false
            })
        }
    },
    addCompany: async (company, token) => {
        if (company.inn) {
            set({
                loading: true
            })
            try {
                await axios.post(`${process.env.REACT_APP_BASE_URL}/api/organization/org/`, company, {
                    headers: {
                        Authorization: token
                    }
                }).then((response) => {
                    if (response.status === 201) {
                        successMessage(`Компания с ИНН: ${company.inn} успешно добавлена`)
                    }
                }).catch((error) => {
                    errorMessage(error.message);
                })
            } catch (error) {
                errorMessage(error as string)
            } finally {
                set({
                    loading: false
                })
            }
        } else {
            errorMessage('Заполните обязательные поля!')
        }
    },
    updateCompany: async (company, token) => {
        try {
            set({
                loading: true
            })
            if (!company.inn) {
                errorMessage("У компании не может быть такого ИНН!")
                return
            }
            console.log(company)
            const response =  await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${company?.inn || ''}/`, company, {
                headers: {
                    Authorization: token
                }
            })
            if (response.status === 200) {
                successMessage("Данные успешно обновлены!")
            } else {
                errorMessage(response.data)
            }
        } catch (error) {

        } finally {
            set({
                loading: false
            })
        }

    }
}))