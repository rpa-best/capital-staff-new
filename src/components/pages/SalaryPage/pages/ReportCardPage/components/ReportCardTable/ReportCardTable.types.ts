export type Day = "пн" | "вт" | "ср" | "чт" | "пт" | "сб" | "вс"

export interface TableHeader {
    dayName: Day
    day: number
}

export interface TableDay {
    id?: number;
    date: string;
    value?: number;
    editable: boolean
}

export interface TableRow {
    worker: { name: string; id: number }
    values: TableDay[];
    total: number;
}

export interface Table {
    headers: TableHeader[];
    rows: TableRow[];
}

export interface ReportCardWorker {
    id: number;
    name: string;
}

export interface EditCellData {
    id?: number;
    workerId: number;
    date: string;
    value: number;
}