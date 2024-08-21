import React, { useEffect, useState } from "react";
import BlueButton from "../../comps/BlueButton/BlueButton";
import scss from "./StaffPage.module.scss";
import FileIcon from "../../../assets/fileIcon.png";
import DropDown from "../../comps/DropDown/DropDown";
import StaffTable from "../../comps/StaffTable/StaffTable";
import Input from "../../comps/Input/Input";
import { IWorkerData, useStaff } from "../../../store/StaffState";
import { documentTypes } from "./consts";
import Header from "../../views/Header/Header";
import toast from "react-hot-toast";
import useAuthData from "../../../hooks/useAuthData";

interface IDropDownCompany {
    value: string;
    label: string;
}

const errorMessage = (message: string) => toast.error(message)

const StaffPage = () => {
    const { getToken, authUser } = useAuthData();
    const [fileData, setFileData] = useState<{ fileData: any; file: any }>({ file: null, fileData: null });
    const [companies, setCompanies] = useState<IDropDownCompany[]>([]);
    const [tableData, setTableData] = useState<IWorkerData[]>([]);
    const { getFile, uploadFile, loading, getCompanies, getNewDataForTable } = useStaff((state) => ({
        getFile: state.useGetFile,
        uploadFile: state.useAddStaff,
        loading: state.loading,
        getCompanies: state.useGetCompanies,
        getNewDataForTable: state.useGetNewDataForTable
    }));

    useEffect(() => {
        getCompanies(getToken, authUser).then((data) => {
            const formattedCompanies = data.map((company) => ({
                value: company.inn as string,
                label: company.name as string
            }));
            setCompanies(formattedCompanies);
        }).catch(() => {
            errorMessage('Не удалось обновить компании!')
        })

        getNewDataForTable(getToken).then((data) => {
            setTableData(data)
        }).catch(() => {
            errorMessage('Не удалось обновить сотрудников')
        })
    }, []);

    return (
        <div className={scss.staffContainer}>
            <Header companyName={authUser?.company.name}/>
            <div className={scss.headContainer}>
                <h1>Сотрудники компании</h1>
                <div className={scss.dropDownContainer}>
                    <div className={scss.dropDown}>
                        <DropDown
                            name="entity"
                            id="entity"
                            placeholder="Юр.лицо заказчика"
                            values={companies}
                            onChange={(param) => {}}
                        />
                    </div>
                    <div className={scss.dropDown}>
                        <DropDown
                            name="documents"
                            id="documents"
                            placeholder="Статус документа"
                            values={documentTypes}
                            onChange={(event) => {}}
                        />
                    </div>
                </div>
            </div>
            <div className={scss.attributes}>
                <div className={scss.links}>
                    <a
                        className={scss.link}
                        onClick={async () => {
                            await getFile(getToken);
                        }}
                        href="#"
                    >
                        <img className={scss.image} src={FileIcon} alt="Файл" />
                    </a>
                    <a
                        className={scss.link}
                        onClick={async () => {
                            await getFile(getToken);
                        }}
                        href="#"
                    >
                        Скачать образец для загрузки сотрудников
                    </a>
                </div>
                <div className={scss.buttons}>
                    <Input
                        type="file"
                        id="staffFile"
                        name="staffFile"
                        onChange={(event) =>
                            setFileData({
                                fileData: event.target.files[0],
                                file: event.target.value
                            })
                        }
                        value={fileData?.file}
                    />
                    <div className={scss.downloadButton}>
                        <BlueButton
                            onClick={() =>
                                uploadFile(getToken, fileData.fileData, authUser)
                            }
                            text="Добавить сотрудников"
                        />
                    </div>
                </div>
            </div>
            <div className={scss.table}>
                <StaffTable tableData={tableData} loading={loading} />
            </div>
        </div>
    );
};

export default StaffPage;