import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Vortex} from "react-loader-spinner";
import React from "react";
import {IWorkerData} from "../../../../../../store/StaffState";
import BlueButton from "../../../../../comps/BlueButton/BlueButton";
import styles from "./CandidatesTable.module.scss";

interface ICandidatesTable {
    tableData: IWorkerData[];
    loading?: boolean;
    onMakeEmployee: (candidate: IWorkerData) => void;
}

const CandidatesTable = ({tableData, loading, onMakeEmployee}: ICandidatesTable) => {
    const handleMakeEmployee = (candidate: IWorkerData, event: React.MouseEvent) => {
        event.stopPropagation();
        onMakeEmployee(candidate);
    };

    const localeText = {
        noRowsToShow: 'Нет информации о кандидатах',
        page: 'Страница',
        of: 'из',
        to: 'до',
        pageSizeSelectorLabel: 'Количество кандидатов',
        loadingOoo: 'Загрузка...',
        loadingError: 'Ошибка загрузки...',
    };

    const preparedData: any[] = [];

    tableData?.forEach(item => {
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
            originalItem: item
        };

        item.docs?.forEach((doc: any) => {
            switch (doc.type.slug) {
                case 'check_do':
                    tempData.check_do = doc.expired_date ?? '-';
                    break;
                case 'polis_dms_do':
                    tempData.polis_dms_do = doc.expired_date ?? '-';
                    break;
                case 'projivanie_do':
                    tempData.projivanie_do = doc.expired_date ?? '-';
                    break;
                case 'jitelstvo_o':
                    tempData.jitelstvo_o = doc.expired_date ?? '-';
                    break;
                case 'potent_do':
                    tempData.potent_do = doc.expired_date ?? '-';
                    break;
                case 'polis_oms_do':
                    tempData.polis_oms_do = doc.expired_date ?? '-';
                    break;
                default:
                    break;
            }
        });

        preparedData.push(tempData);
    });

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
        {
            headerName: "",
            field: "actions",
            pinned: "right" as const,
            width: 200,
            cellRenderer: (params: any) => {
                return React.createElement(BlueButton, {
                    text: 'Сделать сотрудником',
                    className: styles.tableButton,
                    onClick: (e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleMakeEmployee(params.data.originalItem, e);
                    }
                });
            }
        }
    ];

    const gridOptions = {
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Загрузка данных...</span>',
        overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">Нет информации о кандидатах</span>'
    };

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
                        gridOptions={gridOptions}
                        localeText={localeText}
                    />
                    }
                </div>
            </React.StrictMode>
        </React.Fragment>
    );
};

export default CandidatesTable;
