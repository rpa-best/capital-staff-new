import React, {useEffect, useState} from "react";
import scss from "./RequisitesPage.module.scss"
import CompanyCard, {ICompany} from "../../views/CompanyCard/CompanyCard";
import WhiteButton from "../../comps/WhiteButton/WhiteButton";
import Modal from "../../views/Modal/Modal";
import Input from "../../comps/Input/Input";
import CustomAutocomplete from "../../comps/AutoComplete/AutoComplete";
import {Vortex} from "react-loader-spinner";
import Header from "../../views/Header/Header";
import useAuthData from "../../../hooks/useAuthData";
import {ICompanyWithStatus, useCompanies} from "../../../store/CompanyState";

const RequisitesPage = () => {
    const {getToken, authUser} = useAuthData()
    const [addCompanyModal, setAddCompanyModal] = useState(false)
    const [updateCompanyModal, setUpdateCompanyModal] = useState(false)
    const [companies, setCompanies] = useState<ICompanyWithStatus[] | null>([])
    const {getMyCompanies, loading, updateComp, addComp, tempCompanies, getCompanies} = useCompanies((state) => ({
        getMyCompanies: state.getMyCompanies,
        loading: state.loading,
        getCompanies: state.getCompanies,
        tempCompanies: state.tempCompanies,
        addComp: state.addCompany,
        updateComp: state.updateCompany
    }))
    const [updateCompany, setUpdateCompany] = useState<ICompany>({})
    const [addCompany, setAddCompanyField] = useState<ICompany>({})
    const [tempINN, setTempINN] = useState('')
    const setCompanyForUpdate = (company: ICompany) => {
        setUpdateCompany({})
        setUpdateCompany({...company})
    }

    const getOptionLabel = (option: {inn?: string | null, name?: string | null}) => {
        if (option?.inn && option?.name) {
            return `${option?.inn || 'null'} ${option?.name || 'null'}`
        } else {
            return `${option}`
        }
    }

    const handleUpdateCompanyField = (field: string, value: any) => {
        setUpdateCompany({...updateCompany, [field]: value});
    }

    const setCompanyForAdd = (company: ICompany) => {
        setAddCompanyField(company)
    }

    const handleAddCompanyField = (field: string, value: any) => {
        if (field === 'inn' && value === '') {
            setAddCompanyField({})
        }
        setAddCompanyField({...addCompany, [field]: value});
    }

    const handleAddCompany = () => {
        try {
            addComp(addCompany, getToken).then(() => {
                setAddCompanyField({})
                setAddCompanyModal(false)
                getMyCompanies(authUser, getToken).then((data) => {
                    setCompanies(data)
                })
            })
        } catch (error) {

        }
    }

    const handleUpdateCompany = () => {
        try {
            updateComp(updateCompany, getToken).then(() => {
                setUpdateCompany({})
                setUpdateCompanyModal(false)
                getMyCompanies(authUser, getToken).then((data) => {
                    setCompanies(data)
                })
            })
        } catch (error) {

        }
    }

    useEffect(() => {
        getMyCompanies(authUser, getToken).then((data) => {
            setCompanies(data)
        })
    }, []);

    useEffect(() => {
        getCompanies(tempINN, getToken)
    }, [tempINN]);

    if (loading) {
        return (
            <Vortex
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
            />
        )
    }

    return (
        <React.Fragment>
            <div className={scss.requisitesContainer}>
                <Header companyName={authUser?.company.name}/>
                <div className={scss.headContainer}>
                    <div className={scss.topBar}>
                        <h1 className={scss.title}>Реквизиты компаний</h1>
                        <div>
                            <WhiteButton text={"Добавить компанию"} onClick={() => setAddCompanyModal(true)}/>
                        </div>
                    </div>
                </div>
                <div className={scss.cards}>
                    {
                        companies?.map((company) => {
                            return <CompanyCard key={company.id} company={company.org} setCompany={setCompanyForUpdate} changeActive={setUpdateCompanyModal} status={company.status} />
                        })
                    }
                </div>
            </div>
            <Modal active={addCompanyModal} loading={loading} setActive={setAddCompanyModal} header={"Добавить компанию"}
                   onClick={() => handleAddCompany()}>
                <div className={scss.modalDiv}>
                    <CustomAutocomplete label={'ИНН'} placeholder={'0000000000'} onInputChange={setTempINN}
                                        onChange={setCompanyForAdd} value={addCompany?.inn ?? null} options={tempCompanies}
                                        getOptionLabel={getOptionLabel}/>
                </div>
                <div className={scss.modalFields}>
                    <Input id={"name"} name={"name"} label={"Название компании"} type={"text"}
                           placeholder={"Капитал кадры"} onChange={(event) => {
                        handleAddCompanyField('name', event.target.value)
                    }} value={addCompany?.name}/>
                    <Input id={"tin-address"} name={"tin-address"} label={"Юридический адрес"} type={"text"}
                           placeholder={"195299, г Санкт-Петербург, Калининский р-н, Гражданский пр-кт, д 119 литера а, офис 8"}
                           onChange={(event) => {
                               handleAddCompanyField('address', event.target.value)
                           }} value={addCompany?.address}/>
                    <Input id={"ogrn"} name={"ogrn"} label={"ОГРН"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleAddCompanyField('ogrn', event.target.value)
                           }} value={addCompany?.ogrn}/>
                    <Input id={"kpp"} name={"kpp"} label={"КПП"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleAddCompanyField('kpp', event.target.value)
                           }} value={addCompany?.kpp}/>
                    <Input id={"bik"} name={"bik"} label={"БИК"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleAddCompanyField('bik', event.target.value)
                           }} value={addCompany?.bik}/>
                    <Input id={"k_c"} name={"k_c"} label={"к/с"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleAddCompanyField('k_s', event.target.value)
                           }} value={addCompany?.k_s}/>
                    <Input id={"r_c"} name={"r_c"} label={"р/с"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleAddCompanyField('r_s', event.target.value)
                           }} value={addCompany?.r_s}/>
                    <Input id={"dir-name"} name={"dir-name"} label={"Генеральный директор"} type={"text"}
                           placeholder={"Фамилия Имя Отчество"} onChange={(event) => {
                        handleAddCompanyField('gen_name', event.target.value)
                    }} value={addCompany?.gen_name}/>
                    <Input id={"contact-name"} name={"contact-name"} label={"Контактное лицо"} type={"text"}
                           placeholder={"Фамилия Имя Отчество"} onChange={(event) => {
                        handleAddCompanyField('phone_name', event.target.value)
                    }} value={addCompany?.phone_name}/>
                </div>
            </Modal>
            <Modal active={updateCompanyModal} loading={loading} setActive={setUpdateCompanyModal}
                   header={"Внесите изменения в соответствующие поля"}
                   onClick={() => handleUpdateCompany()}>
                <div className={scss.modalFields}>
                    <Input id={"input-inn"} name={"inn"} label={"ИНН"} type={"text"}
                           placeholder={"0000000000"} onChange={(event) => {
                        handleUpdateCompanyField('inn', event.target.value)
                    }} value={updateCompany?.inn}/>
                    <Input id={"input-name"} name={"name"} label={"Название компании"} type={"text"}
                           placeholder={"Капитал кадры"} onChange={(event) => {
                        handleUpdateCompanyField('name', event.target.value)
                    }} value={updateCompany?.name}/>
                    <Input id={"input-tin-address"} name={"tin-address"} label={"Юридический адрес"} type={"text"}
                           placeholder={"195299, г Санкт-Петербург, Калининский р-н, Гражданский пр-кт, д 119 литера а, офис 8"}
                           onChange={(event) => {
                               handleUpdateCompanyField('address', event.target.value)
                           }} value={updateCompany?.address}/>
                    <Input id={"input-ogrn"} name={"ogrn"} label={"ОГРН"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleUpdateCompanyField('ogrn', event.target.value)
                           }} value={updateCompany?.ogrn}/>
                    <Input id={"input-kpp"} name={"kpp"} label={"КПП"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleUpdateCompanyField('kpp', event.target.value)
                           }} value={updateCompany?.kpp}/>
                    <Input id={"input-bik"} name={"bik"} label={"БИК"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleUpdateCompanyField('bik', event.target.value)
                           }} value={updateCompany?.bik}/>
                    <Input id={"input-k_c"} name={"k_c"} label={"к/с"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleUpdateCompanyField('k_s', event.target.value)
                           }} value={updateCompany?.k_s}/>
                    <Input id={"input-r_c"} name={"r_c"} label={"р/с"} type={"numbers"} placeholder={"0000000000"}
                           onChange={(event) => {
                               handleUpdateCompanyField('r_s', event.target.value)
                           }} value={updateCompany?.r_s}/>
                    <Input id={"input-dir-name"} name={"dir-name"} label={"Генеральный директор"} type={"text"}
                           placeholder={"Фамилия Имя Отчество"} onChange={(event) => {
                        handleUpdateCompanyField('gen_name', event.target.value)
                    }} value={updateCompany?.gen_name}/>
                    <Input id={"input-contact-name"} name={"contact-name"} label={"Контактное лицо"} type={"text"}
                           placeholder={"Фамилия Имя Отчество"} onChange={(event) => {
                        handleUpdateCompanyField('phone_name', event.target.value)
                    }} value={updateCompany?.phone_name}/>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default RequisitesPage