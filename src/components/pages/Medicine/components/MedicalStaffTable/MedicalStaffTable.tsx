import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Vortex} from "react-loader-spinner";
import React from "react";
import {IWorkerData} from "../../../../../store/StaffState";
import {useWorker} from "../../../../../store/WorkerState";
import useAuthData from "../../../../../hooks/useAuthData";
import {usePrefixedNavigate} from "../../../../../hooks/usePrefixedNavigate";

interface IMedicalStaffTable {
    tableData: IWorkerData[];
    loading?: boolean;
}

const MedicalStaffTable = ({tableData, loading}: IMedicalStaffTable) => {
    const {getToken} = useAuthData()
    const navigate = usePrefixedNavigate()

    const {setWorkerId} = useWorker((state) => ({
        setWorkerId: state.setWorkerId
    }))
    
    const handleRowClick = (workerId: number) => {
        setWorkerId(workerId, getToken)
        navigate(`/medical-directions/${workerId}`)
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

    const preparedData: any[] = []

    tableData.forEach(item => {
        const tempData = {
            id: item.id,
            last_name: item.last_name,
            surname: item.surname,
            first_name: item.first_name,
            polis_dms_do: '-',
            polis_oms_do: '-',
        }

        item.docs?.forEach(doc => {
            switch (doc.type.slug) {
                case 'polis_dms_do':
                    tempData.polis_dms_do = doc.expired_date ?? '-'
                    break
                case 'polis_oms_do':
                    tempData.polis_oms_do = doc.expired_date ?? '-'
                    break
                default:
                    break
            }
        })

        preparedData.push(tempData)
    })

    const colDefs = [
        {headerName: "Фамилия", field: "last_name"},
        {headerName: "Имя", field: "first_name"},
        {headerName: "Отчество", field: "surname"},
        {headerName: "Полис ОМС до", field: "polis_oms_do"},
        {headerName: "Полис ДМС до", field: "polis_dms_do"},
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
                        onRowClicked={(event) => event.data && handleRowClick(event.data.id)}
                        localeText={localeText}
                    />
                    }
                </div>
            </React.StrictMode>
        </React.Fragment>
    )
}

export default MedicalStaffTable