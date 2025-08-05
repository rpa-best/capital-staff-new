import scss from "./StatementsPage.module.scss";
import Input from "../../../../comps/Input/Input";
import BlueButton from "../../../../comps/BlueButton/BlueButton";
import React, {useEffect, useState} from "react";
import axios from "axios";
import useAuthData from "../../../../../hooks/useAuthData";
import FileIcon from "../../../../../assets/fileIcon.png";
import {Column, Table} from "../../../../comps/Table/Table";
import {useUser} from "../../../../../store/UserState";

interface Document {
    id: number;
    file: string;
    date: string;
}

const getDocuments = async (inn: string, token: string) => {
    const response = await axios.get<Document[]>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${inn}/docs/`, {
        headers: {
            Authorization: token
        },
    });

    return response.data;
};

const uploadDocument = async (inn: string, file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<Document>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${inn}/docs/`, formData, {
        headers: {
            Authorization: token
        }
    });

    return response.data;
}

export const StatementsPage = () => {
    const {getToken, authUser} = useAuthData();
    const [file, setFile] = useState<File>()
    const [documents, setDocuments] = useState<Document[]>([]);
    const { selectedCompany } = useUser()

    useEffect(() => {
        if (!selectedCompany) return;
        
        getDocuments(selectedCompany.inn!, getToken!).then((documents) => {
                const reversedDocs = [...documents];
                reversedDocs.reverse()
            
                setDocuments(reversedDocs)
            }
        );
    }, [selectedCompany])

    const handleUploadDocument = async () => {
        if (!selectedCompany) return
        
        if (file) {
            const uploadedDoc = await uploadDocument(selectedCompany.inn!, file, getToken!)
            setDocuments([uploadedDoc, ...documents])
            
            setFile(undefined)
        }
    }
    
    const columns: Column<Document>[] = [
        {
            header: "Документ", 
            key: 'file',
            className: scss.fileColumn,
            render: (value, row) => (
                <a className={scss.fileCellValue} href={`${value}`}>
                    <img width={40} height={40} src={FileIcon} alt="icon"/>
                    {decodeURI(value.toString().split("/").at(-1)!)}
                </a>
            )
        },
        {
            header: "Дата",
            key: 'date',
            className: scss.dateColumn,
        }
    ]

    return (
        <>
            <div className={scss.header}>
                <h2>Зарплатные ведомости</h2>
            </div>

            <a className={scss.exampleDocLink} href='/assets/Табель%20образец.xlsx'>
                <img width={60} height={60} src={FileIcon} alt="doc_example"/>
                Скачать образец ведомости для заполнения
            </a>

            <div className={scss.uploadFile}>
                <Input
                    type="file"
                    id="docFile"
                    name="docFile"
                    onChange={(e) => setFile(e.target.files?.[0])}
                />

                <div>
                    <BlueButton onClick={handleUploadDocument} text="Загрузить"/>
                </div>
            </div>

            <Table data={documents} columns={columns}></Table>
        </>
    )
}