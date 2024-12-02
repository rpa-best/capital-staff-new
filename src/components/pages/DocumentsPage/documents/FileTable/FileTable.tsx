import scss from "./FileTable.module.scss"
import cn from "classnames";
import FileIcon from "../../../../../assets/fileIcon.png";

export interface File {
    url: string;
    date: string;
}

interface FileTableProps {
    files: File[];
}

export const FileTable = ({files}: FileTableProps) => {
    return (
        <table>
            <thead>
            <tr className={scss.tableHead}>
                <th className={cn(scss.tableHeaderCell, scss.fileCol)}>Документ</th>
                <th className={cn(scss.tableHeaderCell, scss.dateCol)}>Дата загрузки</th>
            </tr>
            </thead>

            <tbody>
            {files.map((file) => (
                <tr>
                    <td className={scss.tableBodyCell}>
                        <a className={scss.fileCellValue} href={file.url}>
                            <img width={40} height={40} src={FileIcon} />
                            {file.url.split("/").at(-1)}
                        </a>
                    </td>
                    <td className={cn(scss.tableBodyCell, scss.dateCol)}>{file.date}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}