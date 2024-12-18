import scss from "./ReportCardPage.module.scss";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import useAuthData from "../../../../../hooks/useAuthData";
import axios from "axios";
import DropDown from "../../../../comps/DropDown/DropDown";
import {IWorkerData, useStaff} from "../../../../../store/StaffState";
import {EditCellData, Table} from "./components/ReportCardTable/ReportCardTable.types";
import {ReportCardTable} from "./components/ReportCardTable/ReportCardTable";
import toast from "react-hot-toast";
import {getDashedDateString, months} from "../../../../../utils/date";
import {Vortex} from "react-loader-spinner";
import BlueButton from "../../../../comps/BlueButton/BlueButton";
import {utils as xlsxUtils, writeFile as xlsxWriteFile} from 'xlsx'
import {useUser} from "../../../../../store/UserState";

export interface ReportCardItem {
    id: number;
    date: string;
    value: number;
    editable: boolean;
    worker: number
}

interface ReportCardItemSum {
    worker: number;
    sum: number;
}

interface TableResponse {
    data: ReportCardItem[]
    sum: ReportCardItemSum[]
}

type UpdateTableCell = Pick<ReportCardItem, 'date' | 'value' | 'worker'>

const getReportCardItems = async (inn: string, token: string, dateGte: string, dateLte: string) => {
    const response = await axios.get<TableResponse>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${inn}/table`, {
        params: {
            date_gte: dateGte,
            date_lte: dateLte
        },
        headers: {
            Authorization: token
        },
    });

    return response.data;
}

const createTableCell = async (inn: string, token: string, body: UpdateTableCell) => {
    const response = await axios.post<ReportCardItem>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${inn}/table/`, body, {
        headers: {
            Authorization: token
        },
    });

    return response.data;
}

const updateTableCell = async (inn: string, token: string, id: number, body: UpdateTableCell) => {
    const response = await axios.patch<ReportCardItem>(`${process.env.REACT_APP_BASE_URL}/api/organization/org/${inn}/table/${id}/`, body, {
        headers: {
            Authorization: token
        },
    });

    return response.data;
}

const getMonthRange = (year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return {startDate, endDate};
}

export const ReportCardPage = () => {
    const {getToken, authUser} = useAuthData();
    const { selectedCompany } = useUser()

    const now = useMemo(() => new Date(), []);

    const years = [2024]
    for (let year = years[0]; year < now.getFullYear(); year++) {
        years.push(year);
    }

    const [selectedYear, setSelectedYear] = useState(2024)
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth())
    
    const yearDropdownItems = useMemo(() => years.map((year) => ({label: year.toString(), value: year})), [years])

    const monthDropdownItems = useMemo(() => {
        const availableYearMonths = now.getFullYear() === selectedYear ? now.getMonth() + 1 : months.length;
        
        return months
            .slice(0, availableYearMonths)
            .map((month, index) => ({label: month, value: index}))
    }, [now, selectedYear])

    const [workers, setWorkers] = useState<IWorkerData[]>([])
    const [reportCardItems, setReportCardItems] = useState<ReportCardItem[]>([]);

    const [isLoadingWorkers, setIsLoadingWorkers] = useState<boolean>(false)
    const [isLoadingReportCardItems, setIsLoadingReportCardItems] = useState(true)

    const {getNewDataForTable} = useStaff((state) => ({
        getNewDataForTable: state.useGetNewDataForTable
    }));

    const loadReportCardItems = useCallback(async () => {
        if (!selectedCompany) return;
        
        const {startDate, endDate} = getMonthRange(selectedYear, selectedMonth)
        
        setIsLoadingReportCardItems(true)
        try {
            setReportCardItems((await getReportCardItems(
                selectedCompany.inn!,
                getToken!,
                getDashedDateString(startDate),
                getDashedDateString(endDate)
            )).data);
            
        } catch (e) {
            toast.error("Ошибка при загрузке табеля")
        }
        setIsLoadingReportCardItems(false)
    }, [selectedCompany, getToken, selectedMonth, selectedYear])
    
    useEffect(() => {
        if (!selectedCompany) return;
        
        setIsLoadingWorkers(true)
        
        getNewDataForTable(getToken!, undefined, selectedCompany.inn!).then((items) => {
            setWorkers(items)
            setIsLoadingWorkers(false)
        })
    }, [selectedCompany, getNewDataForTable, getToken]);

    useEffect(() => {
        if (!selectedCompany) return;
        
        loadReportCardItems().then()
    }, [selectedCompany, loadReportCardItems, selectedYear, selectedMonth]);

    const formattedWorkers = useMemo<{ id: number, name: string }[]>(() => {
        return workers.map(worker => ({
            id: worker.id,
            name: [worker.surname ?? '', worker.first_name ?? '', worker.last_name ?? ''].join(' ')
        }));
    }, [workers])

    const handleEditCell = async (value: EditCellData) => {
        if (!selectedCompany) return;
        
        try {
            const cellData = {
                date: value.date,
                value: value.value,
                worker: value.workerId
            };

            if (!value.id) {
                const createdCell = await createTableCell(selectedCompany.inn!, getToken!, cellData)
                setReportCardItems([...reportCardItems, createdCell])
            } else {
                const updatedCell = await updateTableCell(selectedCompany.inn!, getToken!, value.id, cellData)
                setReportCardItems([...reportCardItems.filter(cell => cell.id !== updatedCell.id), updatedCell])
            }
        } catch (e) {
            toast.error('Не удалось обновить значение в ячейке табеля')
        }
    }

    const [table, setTable] = useState<Table>()

    const handleUpdateTable = useCallback((table: Table) => {
        setTable(table)
    }, [])

    const handleExportTable = () => {
        if (!table) return;

        const dataToExport: Record<string, any>[] = [];

        table.rows.forEach(row => {
            const obj: Record<string, any> = {};

            obj["Имя сотрудника"] = row.worker.name

            row.values.forEach(day => {
                obj[day.date] = day.value
            })

            obj["Итого"] = row.total;

            dataToExport.push(obj);
        })

        const ws = xlsxUtils.json_to_sheet(dataToExport);
        ws["!cols"] = Object.keys(dataToExport[0]).map(key => ({
            wch: Math.max(
                key.length,
                ...dataToExport.map(row => (row[key] ? row[key].toString().length : 0))
            )
        }));

        const wb = xlsxUtils.book_new();

        xlsxUtils.book_append_sheet(wb, ws, "Sheet1");
        xlsxWriteFile(wb, `Табель ${selectedYear} ${months[selectedMonth]}.xlsx`)
    }

    return (
        <>
            <div className={scss.header}>
                <h2>Табель рабочего времени</h2>

                <div className={scss.actions}>
                    <DropDown
                        name="entity"
                        id="entity"
                        placeholder="Год"
                        value={selectedYear}
                        values={yearDropdownItems}
                        required={true}
                        onChange={e => setSelectedYear(+e.currentTarget.value)}
                    />

                    <DropDown
                        name="entity"
                        id="entity"
                        placeholder="Месяц"
                        value={selectedMonth}
                        values={monthDropdownItems}
                        required={true}
                        onChange={e => setSelectedMonth(+e.currentTarget.value)}
                    />

                    <BlueButton text="Скачать XLS" onClick={handleExportTable}></BlueButton>
                </div>
            </div>

            {isLoadingWorkers
                ? <div className={scss.loader}><Vortex/></div>
                : <ReportCardTable
                    year={selectedYear}
                    month={selectedMonth}
                    workers={formattedWorkers}
                    reportCardItems={reportCardItems}
                    loading={isLoadingReportCardItems}
                    onEditCell={handleEditCell}
                    onUpdateTable={handleUpdateTable}
                />}
        </>
    )
}
