import scss from "./StatementsPage.module.scss";
import Input from "../../../../comps/Input/Input";
import BlueButton from "../../../../comps/BlueButton/BlueButton";
import {FileTable} from "../../../DocumentsPage/documents/FileTable/FileTable";
import React, {useEffect, useState} from "react";
import axios from "axios";
import useAuthData from "../../../../../hooks/useAuthData";
import FileIcon from "../../../../../assets/fileIcon.png";

interface Document {
    id: number;
    file: string;
    date: string;
}

const getDocuments = async (inn: string, token: string) => {
    const response = await axios.get<Document[]>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${inn}/docs`, {
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

    useEffect(() => {
        getDocuments(authUser!.company.inn, getToken!).then(setDocuments);
    }, [])

    const handleUploadDocument = async () => {
        if (file) {
            await uploadDocument(authUser!.company.inn, file, getToken!)
        }
    }

    return (
        <>
            <div className={scss.header}>
                <h2>Зарплатные ведомости</h2>
            </div>

            <a className={scss.exampleDocLink} href='#'>
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

            <FileTable files={documents.map(doc => ({url: doc.file, date: doc.date}))}/>
        </>
    )
}