import useAuthData from "../../../hooks/useAuthData";
import scss from "./DocumentsPage.module.scss";
import Header from "../../views/Header/Header";
import React from "react";


const DocumentsPage = () => {
    const {getToken, authUser} = useAuthData();

    return (
        <div className={scss.documentsContainer}>
            <Header companyName={authUser?.company.name}/>
            
            <div>
                <h1>Документы</h1>
            </div>
        </div>
    );
}

export default DocumentsPage;