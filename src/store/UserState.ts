import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";
import {ICompany} from "../components/views/CompanyCard/CompanyCard";

const errorMessage = (message: string) => toast.error(message)

interface IUserState {
    userId: number | null,
    userTokenRefresh: string | null,
    userTokenAccess: string | null,
    userEmail: string | null,
    authorized: boolean,
    rememberMe: boolean,
    loading: boolean,
    myCompany: null,
    myCompanies: ICompany[],
    selectedCompany: ICompany | null,
    setSelectedCompany: (company?: ICompany) => void,
    loadMyCompanies: (token: string) => Promise<void>,
    login: (email: string, password: string) => Promise<void>,
    unLogin: () => Promise<void>,
    changeStorage: () => Promise<void>,
    checkLogin: () => void
}

export const useUser = create<IUserState>()(devtools(persist((set, get) => ({
    userId: null,
    userEmail: null,
    userTokenAccess: null,
    userTokenRefresh: null,
    rememberMe: false,
    authorized: false,
    loading: false,
    myCompany: null,
    myCompanies: [],
    selectedCompany: null,
    login: async (email, password) => {
        set({loading: true})

        const loginData = {
            email: email,
            password: password
        };

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/oauth/auth/`, loginData)
                .then(async (response) => {
                    set({
                        userEmail: email,
                        userTokenRefresh: response.data.refresh,
                        userTokenAccess: response.data.access,
                        authorized: true,
                        myCompany: null,
                        myCompanies: []
                    })
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        errorMessage("Неверный логин или пароль")
                    } else {
                        errorMessage(`Произошла ошибка: ${error.message}`);
                    }
                    return null
                });
            if (get().userTokenAccess) {
                await axios.get(`${process.env.REACT_APP_BASE_URL}/api/organization/org/`, {
                    headers: {
                        'Authorization': `Bearer ${get().userTokenAccess}`
                    }
                }).then(async (response) => {
                    if (response.data.length > 0) {
                        set({
                            myCompany: response.data[0],
                            myCompanies: response.data
                        })
                    } else {
                        set({
                            myCompany: null
                        })
                    }
                })
            }
            if (get().userTokenAccess) {
                await axios.get(`${process.env.REACT_APP_BASE_URL}/api/oauth/me/`, {
                    headers: {
                        'Authorization': `Bearer ${get().userTokenAccess}`
                    }
                }).then(async (response) => {
                    set({
                        userId: response.data.id
                    })
                })
            }
        } finally {
            set({
                loading: false
            })
        }
    },
    unLogin: async () => {
        set({
            userEmail: null,
            userTokenRefresh: null,
            userTokenAccess: null,
            myCompany: null,
            myCompanies: [],
            authorized: false,
            rememberMe: false,
        })
    },
    checkLogin: () => {
        const loginData = {
            token: get().userTokenAccess
        }
        try {
            if (get().userTokenAccess) {
                axios.post(`${process.env.REACT_APP_BASE_URL}/api/oauth/token-verify/`, loginData)
                    .then((response) => {
                        if (response.status === 200 && get().rememberMe) {
                            set({
                                authorized: true,
                            })
                        } else {
                            const postData = {
                                refresh: get().userTokenRefresh
                            }
                            axios.post(`${process.env.REACT_APP_BASE_URL}/api/oauth/refresh-token/`, postData)
                                .then((response) => {
                                    if (response.status === 200 && get().rememberMe) {
                                        set({
                                            userTokenRefresh: response.data.refresh,
                                            userTokenAccess: response.data.access,
                                            authorized: true
                                        })
                                    } else {
                                        set({
                                            authorized: false,
                                        })
                                    }
                                })
                        }
                    })
                    .catch((error) => {
                        set({
                            userEmail: null,
                            userTokenRefresh: null,
                            userTokenAccess: null,
                            myCompany: null,
                            myCompanies: [],
                            authorized: false,
                        })
                    })
            }
        } finally {}
    },
    changeStorage: async () => {
        set({rememberMe: !get().rememberMe})
    },
    setSelectedCompany: (company?: ICompany) => {
        set({selectedCompany: company})
    },
    loadMyCompanies: async (token: string) => {
        try {
            set({
                loading: true
            })

            const response = await axios.get<ICompany[]>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/`, {
                headers: {
                    Authorization: token
                }
            })
            
            set({
                myCompanies: response.data
            })
        } catch (error) {
            errorMessage("Что-то пошло не так!")
        } finally {
            set({
                loading: false
            })
        }
    }
}), {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage)
})))

