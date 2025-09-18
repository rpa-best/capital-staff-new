import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Vortex} from "react-loader-spinner";
import React from "react";
import {IMedicalDirection} from "../../types";

interface IMedicalDirectionsTable {
    tableData: IMedicalDirection[];
    loading?: boolean;
    onRowClick: (direction: IMedicalDirection) => void;
}

const MedicalDirectionsTable = ({tableData, loading, onRowClick}: IMedicalDirectionsTable) => {
    const localeText = {
        noRowsToShow: 'Нет направлений',
        page: 'Страница',
        of: 'из',
        to: 'до',
        pageSizeSelectorLabel: 'Количество записей',
        loadingOoo: 'Загрузка...',
        loadingError: 'Ошибка загрузки...',
    }

    const preparedData = tableData.map(item => ({
        id: item.id,
        fam: item.data.fam,
        subdivision: item.data.subdivision.name || '-',
        profession: item.data.profession.name || '-',
        orderDate: item.data.orderDate,
        status: item.data.statusName,
        paymentSum: item.data.paymentSum,
        numberLmk: item.data.numberLmk || '-',
        original: item
    }));

    const colDefs: any[] = [
        {headerName: "ID", field: "id", width: 100},
        {headerName: "ФИО", field: "fam", width: 200},
        {headerName: "Подразделение", field: "subdivision", width: 150},
        {headerName: "Должность", field: "profession", width: 150},
        {headerName: "Дата медосмотра", field: "orderDate", width: 120},
        {headerName: "Статус", field: "status", width: 200},
        {headerName: "Стоимость (МО)", field: "paymentSum", width: 100},
        {headerName: "ЛМК", field: "numberLmk", width: 100},
    ];

    const gridOptions = {
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Загрузка данных...</span>',
        overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">Нет направлений</span>'
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
                        onRowClicked={(event) => event.data && onRowClick(event.data.original)}
                        gridOptions={gridOptions}
                        localeText={localeText}
                    />
                    }
                </div>
            </React.StrictMode>
        </React.Fragment>
    )
}

export default MedicalDirectionsTable