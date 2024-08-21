import React, {useState} from "react";
import scss from "./RegistrationPage.module.scss"
import WhiteButton from "../../comps/WhiteButton/WhiteButton";
import Input from "../../comps/Input/Input";
import BlueButton from "../../comps/BlueButton/BlueButton";
import {INewTin, useRegistration} from "../../../store/RegistrationState";
import toast from "react-hot-toast";

const errorMessage = (message: string) => toast.error(message);
interface IRegPage {
    isActive: boolean
    onClick: any
}
const TinRegistrationPage = ({isActive, onClick}: IRegPage) => {
    const [tin, setTin] = useState('')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [agree, setAgree] = useState(false)
    const {createNewTin} = useRegistration((state) =>({
        createNewTin: state.createNewTin
    }))
    const newTin = () => {
        const data: INewTin = {
            email: email,
            phone: tel,
            inn: tin
        }
        if (agree) {
            createNewTin(data)
        } else {
            errorMessage('Необходимо согласиться с условиями!')
        }
    }
    return (
        <React.Fragment>
            <div className={scss.buttons}>
                <WhiteButton text={"Для юридических лиц"} onClick={onClick} isActive={!isActive}/>
                <WhiteButton text={"Для физических лиц"} onClick={onClick} isActive={isActive}/>
            </div>
            <Input id={"tin"} name={"tin"} label={"ИНН организации или ИП *"} type={"text"} placeholder={"0000000000"} value={tin} onChange={(event) => setTin(event.target.value)}/>
            <Input id={"email"} name={"email"} label={"Электронная почта *"} type={"email"} placeholder={"user@mail.ru"} value={email} onChange={(event) => setEmail(event.target.value)}/>
            <Input id={"tel"} name={"tel"} label={"Телефон *"} type={"tel"} placeholder={"+70000000000"} value={tel} onChange={(event) => setTel(event.target.value)}/>
            <div className={scss.checkBox}>
                <input type="checkbox" id="vehicle" name="vehicle" checked={agree} onClick={() => setAgree(!agree)}></input>
                <label className={scss.text} htmlFor="vehicle"><p>Согласен с Правилами использования и обработки персональных данных</p></label>
            </div>
            <div className={scss.button}>
                <BlueButton text={"Зарегистрироваться"} onClick={newTin}/>
            </div>
        </React.Fragment>
    )
}

export default TinRegistrationPage