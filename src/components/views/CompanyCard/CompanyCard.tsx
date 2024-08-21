import React from "react";
import scss from "./CompanyCard.module.scss"
import BlueButton from "../../comps/BlueButton/BlueButton";

export interface ICompany {
    name?: string
    email?: string
    inn?: string
    ogrn?: string
    kpp?: string
    bik?: string
    k_s?: string
    r_s?: string
    address?: string
    gen_name?: string
    phone_name?: string
    has_skud?: boolean
}

interface ICompanyCard {
    company: ICompany
    setCompany: any
    changeActive: any
    status: string
}
const CompanyCard = ({company, setCompany, changeActive, status}: ICompanyCard) => {
    const handleClick = () => {
        setCompany(company)
        changeActive(true)
    }
    return (
        <React.Fragment>
            <div className={scss.cardContainer}>
                <div className={status === 'done' ? scss.statusCompleted : scss.statusActive}>
                    {status === "done" ? "Согласовано" : "В обработке" || 'unreal'}
                </div>
                <div className={scss.company}>
                    <h2>{company.name || ""}</h2>
                </div>
                <div className={scss.properties}>
                    <p className={scss.row}><b>ИНН </b>{company.inn || ""}</p>
                    <p className={scss.row}><b>ОГРН </b>{company.ogrn || ""}</p>
                    <p className={scss.row}><b>КПП </b>{company.kpp || ""}</p>
                    <p className={scss.row}><b>БИК </b>{company.bik || ""}</p>
                    <p className={scss.row}><b>к/c </b>{company.k_s || ""}</p>
                    <p className={scss.row}><b>р/с </b>{company.r_s  || ""}</p>
                    <p className={scss.row}><b>Юридический адрес: </b>{company.address  || ""}</p>
                    <p className={scss.row}><b>Генеральный директор: </b>{company.gen_name  || ""}</p>
                    <p className={scss.row}><b className={scss.genDir}>Контактное лицо</b></p>
                    <p>{company.phone_name || "."}</p>
                </div>
                <div className={scss.button}>
                    <BlueButton text={"Редактировать"} onClick={() => handleClick()}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CompanyCard