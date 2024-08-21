import React, {useState} from "react";
import scss from "./RegistrationPage.module.scss"
import WhiteButton from "../../comps/WhiteButton/WhiteButton";
import Input from "../../comps/Input/Input";
import BlueButton from "../../comps/BlueButton/BlueButton";

interface IRegPage {
    isActive: boolean
    onClick: any
}
const IndRegistrationPage = ({isActive, onClick}: IRegPage) => {
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [surname, setSurname] = useState('')
    const [name, setName] = useState('')
    const [patronymic, setPatronymic] = useState('')
    const [tin, setTin] = useState('')
    const [snils, setSnils] = useState('')
    const [agree, setAgree] = useState(false)
    return (
        <React.Fragment>
            <div className={scss.buttons}>
                <WhiteButton text={"Для юридических лиц"} onClick={onClick} isActive={isActive}/>
                <WhiteButton text={"Для физических лиц"} onClick={onClick} isActive={!isActive}/>
            </div>
            <Input id={"email"} name={"email"} label={"Электронная почта *"} type={"email"} placeholder={"user@mail.ru"} value={email} onChange={(event) => setEmail(event.target.value)}/>
            <Input id={"tel"} name={"tel"} label={"Телефон"} type={"tel"} placeholder={"+70000000000"} value={tel} onChange={(event) => setTel(event.target.value)}/>
            <div className={scss.properties}>
                <Input id={"secondName"} name={"secondName"} label={"Фамилия *"} type={"text"} placeholder={"Иванов"} value={surname} onChange={(event) => setSurname(event.target.value)}/>
                <Input id={"firstName"} name={"firstName"} label={"Имя *"} type={"text"} placeholder={"Иван"} value={name} onChange={(event) => setName(event.target.value)}/>
                <Input id={"thirdName"} name={"thirdName"} label={"Отчество *"} type={"text"} placeholder={"Иванович"} value={patronymic} onChange={(event) => setPatronymic(event.target.value)}/>
            </div>
            <div className={scss.docks}>
                <Input id={"tin"} name={"tin"} label={"ИНН"} type={"text"} placeholder={"0000000000"} value={tin} onChange={(event) => setTin(event.target.value)}/>
                <Input id={"snils"} name={"snils"} label={"СНИЛС"} type={"text"} placeholder={"0000000000"} value={snils} onChange={(event) => setSnils(event.target.value)}/>
            </div>
            <div className={scss.checkBox}>
                <input type="checkbox" id="vehicle" name="vehicle" checked={agree} onClick={() => setAgree(!agree)}></input>
                <label className={scss.text} htmlFor="vehicle"><p>Согласен с Правилами использования и обработки персональных данных</p></label>
            </div>
            <div className={scss.button}>
                <BlueButton text={"Зарегистрироваться"} onClick={() => console.log("Пока не готово")}/>
            </div>
        </React.Fragment>
    )
}

export default IndRegistrationPage