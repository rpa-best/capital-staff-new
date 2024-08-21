import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useNavigate} from "react-router-dom";
import {Vortex} from "react-loader-spinner";
import React from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import {IAuthUser} from "../../pages/Login/Login";
import {IWorkerData} from "../../../store/StaffState";
import {WORKER_INFO_PAGE} from "../../../consts/pageConsts";
import {useWorker} from "../../../store/WorkerState";
import useAuthData from "../../../hooks/useAuthData";

function changeDate(dateStr: string) {
    if (!dateStr) {
        return '-'
    }
    let [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}

interface IStaffTable {
    tableData: IWorkerData[],
    loading?: boolean
}

const StaffTable = ({tableData, loading}: IStaffTable) => {
    const {getToken} = useAuthData()
    const navigate = useNavigate()
    const {setWorkerId} = useWorker((state) => ({
        setWorkerId: state.setWorkerId
    }))
    const handleRowClick = (workerId: number) => {
        setWorkerId(workerId, getToken)
        navigate(WORKER_INFO_PAGE)
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

    const authUser = useAuthUser<IAuthUser>()
    const preparedData: any[] = []
    tableData.forEach(item => {
        if (item.id !== authUser?.id) {
            const tempData = {
                id: item.id,
                last_name: item.last_name,
                surname: item.surname,
                first_name: item.first_name,
                check_do: '-',
                polis_dms_do: '-',
                projivanie_do: '-',
                jitelstvo_o: '-',
                potent_do: '-',
                polis_oms_do: '-',
            }
            item.docs?.forEach(doc => {
                switch (doc.type.slug) {
                    case 'check_do':
                        tempData.check_do = changeDate(doc.expired_date as string)
                        break
                    case 'polis_dms_do':
                        tempData.polis_dms_do = changeDate(doc.expired_date as string)
                        break
                    case 'projivanie_do':
                        tempData.projivanie_do = changeDate(doc.expired_date as string)
                        break
                    case 'jitelstvo_o':
                        tempData.jitelstvo_o = changeDate(doc.expired_date as string)
                        break
                    case 'potent_do':
                        tempData.potent_do = changeDate(doc.expired_date as string)
                        break
                    case 'polis_oms_do':
                        tempData.polis_oms_do = changeDate(doc.expired_date as string)
                        break
                    default:
                        break
                }
            })
            preparedData.push(tempData)
        }
    })

    const colDefs = [
        {headerName: "Фамилия", field: "last_name"},
        {headerName: "Имя", field: "first_name"},
        {headerName: "Отчество", field: "surname"},
        {headerName: "Чек до", field: "check_do"},
        {headerName: "Патент до", field: "potent_do"},
        {headerName: "Полис ОМС до", field: "polis_oms_do"},
        {headerName: "Полис ДМС до", field: "polis_dms_do"},
        {headerName: "Разрешение на временное проживание до", field: "projivanie_do"},
        {headerName: "Вид на жительство до", field: "jitelstvo_o"},
    ]

    const gridOptions = {
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Загрузка данных...</span>',
        overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">Нет информации о сотрудниках</span>'
    };

    console.log(preparedData)

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
                        onRowClicked={(event) => handleRowClick(event.data.id)}
                        gridOptions={gridOptions}
                        localeText={localeText}
                    />
                    }
                </div>
            </React.StrictMode>
        </React.Fragment>
    )
}

export default StaffTable