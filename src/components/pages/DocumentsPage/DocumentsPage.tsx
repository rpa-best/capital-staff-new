import useAuthData from "../../../hooks/useAuthData";
import scss from "./DocumentsPage.module.scss";
import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {ICompany} from "../../views/CompanyCard/CompanyCard";
import DropDown from "../../comps/DropDown/DropDown";
import {months, parseDate} from "../../../utils/date";
import {Column, Table} from "../../comps/Table/Table";
import FileIcon from "../../../assets/fileIcon.png";
import {Vortex} from "react-loader-spinner";
import {useUser} from "../../../store/UserState";

interface DocumentType {
    id: number;
    name: string;
}

interface Document {
    id: number;
    type: DocumentType;
    org: ICompany
    date: string;
    file: string
}

interface GroupedDocuments {
    title: string
    documents: Document[]
}

const getDocumentTypes = async (token: string) => {
    const response = await axios.get<DocumentType[]>(`${process.env.REACT_APP_BASE_URL}/api/organization/doc-type/`, {
        headers: {
            Authorization: token
        },
    });

    return response.data;
}

const getDocuments = async (inn: string, token: string) => {
    const response = await axios.get<Document[]>(`${process.env.REACT_APP_BASE_URL}/api/organization/doc/${inn}`, {
        headers: {
            Authorization: token
        },
    });

    return response.data;
};

const DocumentsPage = () => {
    const {getToken, authUser} = useAuthData();
    const {selectedCompany} = useUser()

    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
    const [documents, setDocuments] = useState<Document[]>([])
    const [isDocumentsLoading, setIsDocumentsLoading] = useState<boolean>(true)

    const [selectedYear, setSelectedYear] = useState<number>()
    const [selectedMonth, setSelectedMonth] = useState<number>()
    const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<number>()
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>()

    useEffect(() => {
        if (!selectedCompany) return;
        setIsDocumentsLoading(true)

        getDocumentTypes(getToken!).then(setDocumentTypes);
        getDocuments(selectedCompany.inn!, getToken!).then((value) => {
            setIsDocumentsLoading(false)
            setDocuments(value)
        })
    }, [getToken, selectedCompany])

    const documentTypeOptions = useMemo(() => {
        return documentTypes.map(type => ({value: type.id, label: type.name}));
    }, [documentTypes])

    const organizationOptions = useMemo(() => {
        const uniqueOrganizationIds = [...new Set(documents.map(document => document.org.inn!))]

        return uniqueOrganizationIds.map(organizationId => ({
                label: documents.find(document => document.org.inn === organizationId!)!.org.name || organizationId,
                value: organizationId
            }
        ))
    }, [documents])

    const yearOptions = useMemo(() => {
        const dates = documents.map(document => parseDate(document.date))
        const uniqueYears = [...new Set(dates.map(date => date.getFullYear()))]

        return uniqueYears.map(year => ({value: year, label: year.toString()}))
    }, [documents])

    const monthOptions = useMemo(() => {
        const options = months.map((month, index) => ({value: index, label: month.toString()}))

        options.sort((a, b) => b.value - a.value)

        return options
    }, [])

    const filteredDocuments = useMemo(() => {
        return documents.filter(document => {
            const documentDate = new Date(document.date)

            return (selectedYear == null || selectedYear === documentDate.getFullYear()) &&
                (selectedMonth == null || selectedMonth === documentDate.getMonth()) &&
                (selectedDocumentTypeId == null || selectedDocumentTypeId === document.type.id) &&
                (selectedOrganizationId == null || selectedOrganizationId === document.org.inn)
        })
    }, [selectedDocumentTypeId, selectedOrganizationId, selectedYear, selectedMonth, documents])

    const groupedDocuments = useMemo<GroupedDocuments[]>(() => {
        const groups = new Map<string, Document[]>()

        for (let document of filteredDocuments) {
            const documentDate = parseDate(document.date)
            const key = `${documentDate.getFullYear()}-${documentDate.getMonth()}`

            if (!groups.has(key)) {
                groups.set(key, [])
            }

            groups.get(key)!.push(document)
        }

        return [...groups.entries()].map(([key, value]) => {
            const [year, month] = key.split('-')

            return {
                title: `${months[+month]} ${year}`,
                documents: value
            }
        })
    }, [filteredDocuments])

    const columns: Column<Document>[] = [
        {
            header: "Документ",
            key: 'type',
            className: scss.centeredColumn,
            render: (value, row) => (
                <div className={scss.fileTypeCellValue}>
                    <img width={32} height={32} src={FileIcon} alt="icon"/>
                    {value.name}
                </div>
            )
        },
        {
            header: "Файл",
            key: 'file',
            className: scss.fileColumn,
            render: (value, row) => (
                <a href={value}>
                    {decodeURI(value.toString().split("/").at(-1)!)}
                </a>
            )
        },
        {
            header: "Дата загрузки",
            key: 'date',
            className: scss.centeredColumn,
        },
        {
            header: "Организация",
            key: 'org',
            className: scss.centeredColumn,
            render: (value, row) => (value.name || "")
        }
    ]

    return (
        <>
            <div className={scss.header}>
                <h1>Документы</h1>

                <div className={scss.headerFilters}>
                    <DropDown
                        name="document-type"
                        id="document-type"
                        placeholder="Тип документа"
                        values={documentTypeOptions}
                        onChange={(event) => {
                            setSelectedDocumentTypeId(+event.target.value < 0 ? undefined : +event.target.value)
                        }}
                    />
                    <DropDown
                        name="month"
                        id="month"
                        placeholder="Месяц"
                        values={monthOptions}
                        value={selectedMonth}
                        onChange={(event) => {
                            setSelectedMonth(+event.target.value < 0 ? undefined : +event.target.value)
                        }}
                    />
                    <DropDown
                        name="year"
                        id="year"
                        placeholder="Год"
                        values={yearOptions}
                        value={selectedYear}
                        onChange={(event) => {
                            setSelectedYear(+event.target.value < 0 ? undefined : +event.target.value)
                        }}
                    />
                </div>
            </div>

            {isDocumentsLoading
                ? <div className={scss.loader}><Vortex/></div>
                : groupedDocuments.map(group => (
                    <div className={scss.documentsGroup}>
                        <h4 className={scss.documentsGroupTitle}>{group.title}</h4>
                        <Table data={group.documents} columns={columns}></Table>
                    </div>
                ))}
        </>
    );
}

export default DocumentsPage;
