import scss from "./ReportCardTable.module.scss";
import {ReportCardItem} from "../../ReportCardPage";
import React, {FC, FocusEvent, KeyboardEvent, useEffect, useMemo, useState} from "react";
import cn from "classnames";
import {Day, EditCellData, ReportCardWorker, Table, TableDay, TableHeader, TableRow} from "./ReportCardTable.types";
import {getDashedDateString, parseDate} from "../../../../../../../utils/date";

interface ReportCardTableProps {
    year: number;
    month: number;
    workers: ReportCardWorker[]
    reportCardItems: ReportCardItem[]
    loading?: boolean
    onUpdateTable?: (table: Table) => void
    onEditCell: (data: EditCellData) => Promise<void>
}

const getMonthDays = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Date[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }

    return days;
}

const days: Day[] = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"]

const isWeekend = (date: string) => {
    return [0, 6].includes(new Date(date).getDay());
}

export const ReportCardTable: FC<ReportCardTableProps> = ({
                                                              year,
                                                              month,
                                                              workers,
                                                              reportCardItems,
                                                              loading,
                                                              onUpdateTable,
                                                              onEditCell
                                                          }) => {
    const tableData = useMemo<Table>(() => {
        const tableMap = new Map<number, Map<string, ReportCardItem>>()

        for (let cell of reportCardItems) {
            if (!tableMap.has(cell.worker)) tableMap.set(cell.worker, new Map());
            tableMap.get(cell.worker)!.set(getDashedDateString(parseDate(cell.date)), cell);
        }

        const monthDays = getMonthDays(month, year);

        const headers = monthDays.map<TableHeader>(day => ({
            dayName: days[day.getDay()],
            day: day.getDate()
        }));
        
        type MonthHalf = 'first' | 'second';
        
        const getMonthHalf = (monthDay: number): MonthHalf => {
            return monthDay <= 15 ? 'first' : 'second'
        }
        
        const getMonthHalfItems = (half: MonthHalf) => {
            return reportCardItems.filter(item => {
                const day = new Date(item.date).getDate();
                return getMonthHalf(day) === half;
            });
        };
        
        const isLockedRange = (items: ReportCardItem[]) => items.some(x => !x.editable);
        const firstMonthHalfIsLocked = isLockedRange(getMonthHalfItems('first'));
        const secondMonthHalfIsLocked = isLockedRange(getMonthHalfItems('second'));
        
        const now = new Date();
        const dayIsLocked = (date: string) => {
            const dayDate = new Date(date);
            if (dayDate > now) return true;
            
            const monthHalf = getMonthHalf(dayDate.getDate());

            return (monthHalf === 'first' && firstMonthHalfIsLocked) ||
                (monthHalf === 'second' && secondMonthHalfIsLocked);
        }

        const rows = workers.map<TableRow>(worker => {
            const values = monthDays.map(day => {
                const date = getDashedDateString(day)

                let reportCardItem = tableMap.has(worker.id)
                    ? tableMap.get(worker.id)?.get(date)
                    : undefined;

                const tableCell: TableDay = {
                    id: reportCardItem?.id,
                    date,
                    editable: !dayIsLocked(date),
                    value: reportCardItem?.value
                };

                return tableCell
            })

            return {
                worker,
                values,
                total: values.reduce((a, b) => a + (b.value ?? 0), 0)
            }
        });

        return {
            headers,
            rows
        }
    }, [year, month, workers, reportCardItems])


    useEffect(() => {
        onUpdateTable?.(tableData);
    }, [onUpdateTable, tableData]);

    const [editCell, setEditCell] = useState<{ workerId: number, day: TableDay }>()
    const [editCellLoading, setEditCellLoading] = useState(false)

    const handleDayCellDoubleClick = (workerId: number, cell: TableDay) => {
        if (!cell.editable) return;

        setEditCell({workerId, day: cell})
    }

    const handleEditCell = async (value: string) => {
        if (!editCell) {
            console.warn("Нет изменяемого значения");
            return;
        }
        
        const MIN_VALUE = 0
        const MAX_VALUE = 24;
        if (!value || +value < MIN_VALUE || +value > MAX_VALUE) {
            setEditCell(undefined)
            return;
        }

        const data: EditCellData = {
            id: editCell.day.id,
            workerId: editCell.workerId,
            date: editCell.day.date,
            value: +value,
        }

        setEditCellLoading(true)
        await onEditCell(data)
        setEditCellLoading(false)

        setEditCell(undefined)
    }

    const handleDayCellInputBlur = async (e: FocusEvent<HTMLInputElement>) => {
        await handleEditCell(e.target.value)
    }

    const handleDayCellInputKeydown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        await handleEditCell(e.currentTarget.value)
    }

    return (
        <div className={scss.tableContainer}>
            {loading ? <div className={scss.tableLoader}></div> : null}

            <table className={scss.table}>
                <thead>
                <tr>
                    <th className={cn(scss.tableCell, scss.tableNameCell)}>Имя сотрудника</th>

                    {tableData.headers.map((header, index) => (
                        <th
                            key={index}
                            className={cn(
                                scss.tableCell,
                                scss.tableDayCell,
                                ['сб', 'вс'].includes(header.dayName) ? scss.tableDayCellWeekend : null
                            )}>
                            {header.dayName} {header.day.toString().padStart(2, '0')}
                        </th>
                    ))}

                    <th className={cn(scss.tableCell, scss.tableTotalCell)}>Итого</th>
                </tr>
                </thead>

                <tbody>
                {tableData.rows.map(row => (
                    <tr key={row.worker.id}>
                        <td className={cn(scss.tableCell, scss.tableNameCell)}>
                            {row.worker.name}
                        </td>

                        {row.values.map((day, index) => (
                            <td
                                key={index}
                                tabIndex={0}
                                className={cn(
                                    scss.tableCell,
                                    scss.tableDayCell,
                                    scss.tableDayCellEditable,
                                    isWeekend(day.date) ? scss.tableDayCellWeekend : null
                                )}
                                onDoubleClick={() => handleDayCellDoubleClick(row.worker.id, day)}
                            >
                                {
                                    editCell &&
                                    editCell.workerId === row.worker.id &&
                                    (editCell.day.date === day.date) ? (
                                        <input
                                            className={scss.tableDayCellInput}
                                            type="number"
                                            defaultValue={day.value || ''}
                                            autoFocus
                                            onBlur={handleDayCellInputBlur}
                                            onKeyDown={handleDayCellInputKeydown}
                                            disabled={editCellLoading}
                                        />
                                    ) : day.value ?? '-'
                                }

                            </td>
                        ))}

                        <td className={cn(scss.tableCell, scss.tableTotalCell)}>
                            {row.total}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>)
}