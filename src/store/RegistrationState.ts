import { create } from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import axios, {AxiosError} from "axios";
import toast from "react-hot-toast";

const errorMessage = (message: string) => toast.error(message)
const successMessage = (message: string) => toast.success(message)

interface IRegistrationState {
    loading: boolean,
    createNewTin: (data: INewTin) => Promise<boolean>
}

export interface INewTin {
    inn: string,
    email: string,
    phone: string
}
export const useRegistration = create<IRegistrationState>()(devtools(persist((set) => ({
    loading: false,
    createNewTin: async (data) => {
        set({loading: true})
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/oauth/create-legal/`, data);

            successMessage('Вы успешно зарегистрировались!')
            return true
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    for (const [key, value] of Object.entries(error.response.data)) {
                        errorMessage(`${key}: ${value}`);
                    }
                } else {
                    errorMessage("Произошла ошибка соединения. Попробуйте снова.");
                }
            } else {
                errorMessage("Неизвестная ошибка.");
            }
            return false;
        } finally {
            set({loading: false})
        }
    }

}), {
    name: 'registration-storage',
    storage: createJSONStorage(() => localStorage)
})))