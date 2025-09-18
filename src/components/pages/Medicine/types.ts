export interface IService {
    id: string;
    name: string;
}

export interface IProfession {
    id: string;
    name: string;
}

export interface ISubdivision {
    name: string;
}

export interface ISurveyScope {
    name: string;
    status: string;
}

export interface IPart {
    name: string;
    price: number;
}

export interface IMedicalExamination {
    id: string;
    name: string;
    date: string;
}

export interface IMedicalResult {
    code: string;
    date: string;
}

export interface IPaymentSum {
    typeId: number;
    typeName: string;
    price: number;
    payed: number;
    payDate: string;
}

export interface IWorkerInvoiceData {
    id: string;
    fam: string;
    gender: string;
    birthday: string;
    citizenship: string;
    address: string;
    passport: string;
    passportDate: string;
    passportPlace: string;
    phone: string;
    orderDate: string;
    subdivision: ISubdivision;
    profession: IProfession;
    numberLmk: string;
    lmkDate: string;
    med: IMedicalExamination[];
    services: IService[];
    status: string;
    statusName: string;
    result: IMedicalResult;
    surveyScope: ISurveyScope[];
    parts: IPart[];
    paymentSums: IPaymentSum[];
    paymentSum: number;
}

export interface IWorkerInvoice {
    id: number;
    data: IWorkerInvoiceData;
    created_at: string;
    worker: number;
}