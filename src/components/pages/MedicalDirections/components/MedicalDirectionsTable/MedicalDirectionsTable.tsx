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
        status: item.data.statusName,
        orderDate: item.data.orderDate,
        services: item.data.services.map(s => s.name).join(', '),
        created_at: item.created_at,
        paymentSum: item.data.paymentSum,
        original: item
    }));

    const colDefs: any[] = [
        {headerName: "ID", field: "id", width: 100},
        {headerName: "ФИО", field: "fam", width: 200},
        {headerName: "Статус", field: "status", width: 200},
        {headerName: "Дата заказа", field: "orderDate", width: 120},
        {headerName: "Услуги", field: "services", width: 300},
        {headerName: "Дата создания", field: "created_at", width: 150},
        {headerName: "Сумма", field: "paymentSum", width: 100},
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