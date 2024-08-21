import toast from "react-hot-toast";
import {create} from "zustand";
import axios from "axios";
import {ICompanyItem} from "./CompanyState";
const errorMessage = (message: string) => toast.error(message);
const successMessage = (message: string) => toast.success(message);

export interface Type {
    slug?: string
    name?: string
    main?: boolean
}
export interface IDocData {
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
    phone?: string
    email?: string
    docs: IDocData[]
    orgs: ICompanyItem[]
}

interface IUpdateWorkerData {
    first_name: string | null
    last_name: string | null
    surname: string | null
    phone: string | null
    email: string | null
}
interface IWorkerState {
    workerId: number| null,
    workerData: IWorkerData | null
    loading: boolean,
    setWorkerId: (workerId: number, token: string | null) => void
    getWorkerData: (token: string | null) => void
    updateWorkerData: (data: IUpdateWorkerData, token: string | null) => void
}


export const useWorker = create<IWorkerState>()((set, get) => ({
    workerId: null,
    loading: false,
    workerData: null,
    setWorkerId: async (workerId, token) => {
        set({
            workerId: workerId
        })
        await get().getWorkerData(token)
    },
    getWorkerData: async (token) => {
        try {
            set({
                loading: true
            })

            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/worker/worker/${get().workerId}/`, {
                headers: {
                    Authorization: token
                },
            })
            set({
                workerData: {
                    ...response.data
                }
            })
        } catch (error) {
            errorMessage('Что-то пошло не так!')
        } finally {
            set({
                loading: false
            })
        }
    },
    updateWorkerData: async (postData, token) => {
        try {
            set({
                loading: true
            })
            await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/worker/worker/${get().workerId}/`, postData, {
                headers: {
                    Authorization: token
                },
            })
            successMessage("Данные о сотруднике обновлены")
        } catch (error) {
            errorMessage("Что-то пошло не так!")
        } finally {
            set({
                loading: false
            })
        }
    },
}))