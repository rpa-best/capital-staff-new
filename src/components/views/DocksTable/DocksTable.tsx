import React from 'react';
import scss from './DocksTable.module.scss'
import File from '../../../assets/fileIcon.png'
import {IDocData} from "../../../store/WorkerState";

export interface IDocksTable {
    documents: IDocData[] | undefined
}
const DocumentsTable = ({documents}: IDocksTable) => {
    return (
        <div className={scss.tableContainer}>
            <div className={scss.tableRow}>
                <div className={scss.tableRow1}>Документ</div>
                <div className={scss.tableRow2}>Загружен</div>
                <div className={scss.tableRow3}>Истекает</div>
            </div>
            {documents?.map((document) => {
                return (
                    <div key={document.id} className={scss.tableRow}>
                        <div className={scss.tableRow1}>
                            {document.file ?
                                <React.Fragment>
                                    <a className={scss.link} href={document.file} download={document.type.name}><img className={scss.rowImage} src={File} alt="Файл"/></a>
                                    <div className={scss.rowText}><a className={scss.link} href={document.file} download={document.type.name} target="_blank">{document.type.name}</a></div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <img className={scss.rowImage} src={File} alt="Файл"/>
                                    <div className={scss.rowText}>{document.type.name}</div>
                                </React.Fragment>
                            }
                        </div>
                        <div className={scss.tableRow2}>
                            <div className={scss.rowText}>{document.start_date || '-'}</div>
                        </div>
                        <div className={scss.tableRow3}>
                            <div className={scss.rowText}>{document.expired_date || '-'}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default DocumentsTable;