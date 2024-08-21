import React from 'react';
import scss from './WorkerCard.module.scss'
import {ICompany} from "../CompanyCard/CompanyCard";
import {ICompanyItem} from "../../../store/CompanyState";

interface IWorkerCard {
    company: ICompanyItem
}
const WorkerCard = ({company}: IWorkerCard) => {
    return (
        <React.Fragment>
            <div key={company.id} className={scss.cardContainer}>
                <div className={scss.properties}>
                    <b className={scss.compName}>{company.org.name}</b>
                    <p className={scss.row}><b>ИНН </b>{company.org.inn}</p>
                    <p className={scss.row}><b>ОГРН </b>{company.org.ogrn}</p>
                    <p className={scss.row}><b>КПП </b>{company.org.kpp}</p>
                    <p className={scss.row}><b>БИК </b>{company.org.bik}</p>
                    <p className={scss.row}><b>к/c </b>{company.org.k_s}</p>
                    <p className={scss.row}><b>р/с </b>{company.org.r_s}</p>
                    <p className={scss.row}><b>Юридический адрес: </b>{company.org.address}</p>
                    <p className={scss.row}><b>Генеральный директор: </b>{company.org.gen_name}</p>
                    <p className={scss.row}><b className={scss.genDir}>Контактное лицо</b></p>
                    <p>{company.org.phone_name || "."}</p>
                </div>
            </div>
        </React.Fragment>
    )
};

export default WorkerCard;