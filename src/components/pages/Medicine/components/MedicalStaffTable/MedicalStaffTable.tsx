import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Vortex} from "react-loader-spinner";
import React, { useState } from "react";
import {useWorker} from "../../../../../store/WorkerState";
import useAuthData from "../../../../../hooks/useAuthData";
import {usePrefixedNavigate} from "../../../../../hooks/usePrefixedNavigate";
import {IWorkerInvoice} from "../../types";
import MedicalDirectionModal from "../../../MedicalDirections/components/MedicalDirectionModal/MedicalDirectionModal";
import {IMedicalDirection} from "../../../MedicalDirections/types";
import BlueButton from "../../../../comps/BlueButton/BlueButton";
import styles from "./MedicalStaffTable.module.scss";

interface IMedicalStaffTable {
    tableData: IWorkerInvoice[];
    loading?: boolean;
}

const MedicalStaffTable = ({tableData, loading}: IMedicalStaffTable) => {
    const {getToken} = useAuthData()
    const navigate = usePrefixedNavigate()
    const [selectedDirection, setSelectedDirection] = useState<IMedicalDirection | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const {setWorkerId} = useWorker((state) => ({
        setWorkerId: state.setWorkerId
    }))
    
    const handleRowClick = (workerId: number) => {
        setWorkerId(workerId, getToken)
        navigate(`/medical-directions/${workerId}`)
    }

    const handleOpenModal = (item: IWorkerInvoice, event: React.MouseEvent) => {
        event.stopPropagation()
        const direction: IMedicalDirection = {
            id: item.id,
            data: item.data,
            created_at: item.created_at,
            worker: item.worker
        }
        setSelectedDirection(direction)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedDirection(null)
    }
    
    const localeText = {
        noRowsToShow: 'Нет информации о сотрудниках',
        page: 'Страница',
        of: 'из',
        to: 'до',
        pageSizeSelectorLabel: 'Количество сотрудников',
        loadingOoo: 'Загрузка...',
        loadingError: 'Ошибка загрузки...',
    }
    
    const allPartsNames = new Set<string>()
    const allMedNames = new Set<string>()
    const allSurveyScopeNames = new Set<string>()

    tableData.forEach(item => {
        item.data.parts?.forEach(part => allPartsNames.add(part.name))
        item.data.med?.forEach(med => allMedNames.add(med.name))
        item.data.surveyScope?.forEach(scope => allSurveyScopeNames.add(scope.name))
    })

    const preparedData: any[] = []

    tableData.forEach(item => {
        const tempData: any = {
            id: item.id,
            worker: item.worker,
            fam: item.data.fam,
            subdivision: item.data.subdivision.name || '-',
            profession: item.data.profession.name || '-',
            status: item.data.statusName,
            orderDate: item.data.orderDate,
            paymentSum: item.data.paymentSum,
            services: item.data.services.map(service => service.name).join(', '),
            created_at: item.created_at,
            originalItem: item
        }
        
        allPartsNames.forEach(partName => {
            const part = item.data.parts?.find(p => p.name === partName)
            tempData[`part_${partName}`] = part && part.price !== null && part.price !== undefined ? String(part.price) : '-'
        })
        
        allMedNames.forEach(medName => {
            const med = item.data.med?.find(m => m.name === medName)
            tempData[`med_${medName}`] = med && med.date ? String(med.date) : '-'
        })
        
        allSurveyScopeNames.forEach(scopeName => {
            const scope = item.data.surveyScope?.find(s => s.name === scopeName)
            tempData[`scope_${scopeName}`] = scope && scope.status != null ? String(scope.status) : '-'
        })

        preparedData.push(tempData)
    })

    const colDefs = [
        {headerName: "ID", field: "id"},
        {headerName: "ФИО", field: "fam"},
        {headerName: "Подразделение", field: "subdivision"},
        {headerName: "Должность", field: "profession"},
        {headerName: "Дата медосмотра", field: "orderDate"},
        {headerName: "Статус", field: "status"},
        {headerName: "Стоимость (МО)", field: "paymentSum"},
        ...Array.from(allPartsNames).map(partName => ({
            headerName: partName,
            field: `part_${partName}`
        })),
        ...Array.from(allMedNames).map(medName => ({
            headerName: medName,
            field: `med_${medName}`
        })),
        ...Array.from(allSurveyScopeNames).map(scopeName => ({
            headerName: scopeName,
            field: `scope_${scopeName}`
        })),
        {headerName: "ЛМК", field: "numberLmk"},
        {
            headerName: "",
            field: "actions",
            pinned: "right" as const,
            width: 120,
            cellRenderer: (params: any) => {
                return React.createElement(BlueButton, {
                    text: 'Подробнее',
                    className: styles.tableButton,
                    onClick: (e: React.MouseEvent) => {
                        e.stopPropagation()
                        handleOpenModal(params.data.originalItem, e)
                    }
                })
            }
        }
    ]

    return (
        <React.Fragment>
            <React.StrictMode>
                <div
                    className="ag-theme-quartz"
                    style={{height: 600, fontSize: 16, fontFamily: "Arial, sans-serif"}}
                >
                    {loading ? <Vortex
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="vortex-loading"
                        wrapperStyle={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                        wrapperClass="vortex-wrapper"
                        colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                    /> : <AgGridReact
                        rowData={preparedData}
                        columnDefs={colDefs}
                        pagination={true}
                        paginationPageSize={10}
                        paginationPageSizeSelector={[10, 25, 50]}
                        onRowClicked={(event) => {
                            const target = event.event?.target as HTMLElement
                            if (target?.tagName === 'BUTTON' || target?.closest('button')) {
                                return
                            }
                            event.data && handleRowClick(event.data.worker)
                        }}
                        localeText={localeText}
                    />
                    }
                </div>
            </React.StrictMode>
            <MedicalDirectionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                direction={selectedDirection}
            />
        </React.Fragment>
    )
}

export default MedicalStaffTable