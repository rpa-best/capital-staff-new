import React from "react";
import scss from "./Table.module.scss";
import cn from "classnames";

export interface Column<T extends Record<string, any>> {
    header: string;
    key: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T extends Record<string, any>> {
    data: T[];
    columns: Column<T>[];
    rowKey?: (item: T, index: number) => string | number;
}

export const Table = <T extends Record<string, any>, >({data, columns, rowKey}: TableProps<T>) => {
    return (
        <table className={scss.table}>
            <thead>
            <tr className={scss.tableHead}>
                {columns.map((column, index) => (
                    <th
                        key={index}
                        className={cn(scss.tableHeaderCell, column.className)}
                    >
                        {column.header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>

            {data.map((row, rowIndex) => (
                <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex}>
                    {columns.map((column, colIndex) => (
                        <td
                            key={colIndex}
                            className={cn(scss.tableBodyCell, column.className)}
                        >
                            {column.render
                                ? column.render(row[column.key], row)
                                : row[column.key] as string}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};