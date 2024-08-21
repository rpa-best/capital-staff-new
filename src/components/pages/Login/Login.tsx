import React, {useState} from "react";
import scss from "./Login.module.scss"
import RubleCoin from "../../../assets/coin.png";
import Line from "../../../assets/line.svg";
import {NavLink, useNavigate} from "react-router-dom";
import {CHANGE_PASSWORD, LOGIN_PAGE, REGISTRATION_PAGE, STAFF_PAGE} from "../../../consts/pageConsts";
import Input from "../../comps/Input/Input";
import BlueButton from "../../comps/BlueButton/BlueButton";
import toast from "react-hot-toast";
import {Vortex} from "react-loader-spinner";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import axios from "axios";
import PasswordInput from "../../comps/PasswordInput/PasswordInput";

const success = (message: string) => toast.success(message);
const error = (message: string) => toast.error(message)

interface IMyCompany {
    inn: string
    name: string
    bik: string
    address: string
    phone: string
    ogrn: string
    kpp: string
    email: string
    phone_name: string
    gen_name: string
    r_s: string
    k_s: string
    has_skud: boolean
}
export interface IAuthUser{
    id: number,
    firsName: string | null,
    lastName: string | null,
    surname: string | null,
    phone: string | null,
    email: string,
    company: IMyCompany
}
const Login = () => {
    const signIn = useSignIn()
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            setLoading(true)
            const loginData = {
                email: emailValue,
                password: passwordValue
            }
            const tokens = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/oauth/auth/`, loginData)
            if (tokens.status === 200) {
                const userData = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/oauth/me/`, {
                    headers: {
                        Authorization: `Bearer ${tokens.data.access}`
                    }
                })
                const companyData = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/organization/org/`, {
                    headers: {
                        Authorization: `Bearer ${tokens.data.access}`
                    }
                })
                if (signIn({
                    auth: {
                        token: tokens.data.access,
                        type: 'Bearer'
                    },
                    refresh: rememberMe ? tokens.data.refresh : tokens.data.access,
                    userState: {
                        id: userData.data.id,
                        firstName: userData.data.first_name,
                        lastName: userData.data.last_name,
                        surname: userData.data.surname,
                        phone: userData.data.phone,
                        email: userData.data.email,
                        company: companyData.data[0]
                    }
                })) {
                    success(`Добро пожаловать, ${userData.data.email}!`)
                    navigate(STAFF_PAGE)
                } else {
                    setLoading(false)
                    error("Что-то пошло не так!")
                }
            } else {
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            error("Неправильный логин или пароль!")
        } finally {
            setLoading(false)
        }
        setLoading(false)
    }


    if (loading) {
        return <Vortex
            visible={true}
            height="80"
            width="80"
            ariaLabel="vortex-loading"
            wrapperStyle={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
        />
    }

    return (
        <React.Fragment>
            <div className={scss.loginContainer}>
                <div className={scss.header}>
                    <img className={scss.coinImage} src={RubleCoin} alt="Ruble-coin"/>
                    <b className={scss.company}>Капитал Кадры</b>
                    <img src={Line} alt="Line"/>
                    <div className={scss.lk}>
                        Личный кабинет
                    </div>
                </div>
                <div className={scss.body}>
                    <div className={scss.links}>
                        <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={LOGIN_PAGE}><b>Вход</b></NavLink>
                        <NavLink className={({isActive}) => isActive ? scss.active : scss.link} to={REGISTRATION_PAGE}><b>Регистрация</b></NavLink>
                    </div>
                    <div className={scss.form}>
                        <Input id={"email"} name={"email"} label={"Ваш email:"} type={"email"} placeholder={"user@mail.ru"} onChange={(event) => setEmailValue(event.target.value)} value={emailValue}/>
                        <PasswordInput id={"password"} name={"password"} label={"Ваш пароль:"}  placeholder={"******"} onChange={(event) => setPasswordValue(event.target.value)} value={passwordValue}/>
                        <div className={scss.checkBox}>
                            <input type="checkbox" id="vehicle" name="vehicle" checked={rememberMe} onClick={() => setRememberMe(!rememberMe)}></input>
                            <label className={scss.text} htmlFor="vehicle"> Запомнить меня</label>
                            <NavLink className={scss.baseLink} to={CHANGE_PASSWORD}>Забыли пароль</NavLink>
                        </div>
                        <div className={scss.button}>
                            <div className={scss.size}>
                                <BlueButton onClick={async () => await handleClick()} text={"Войти"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login