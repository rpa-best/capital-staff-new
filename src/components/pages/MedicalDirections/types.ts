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

export interface IMedicalDirectionData {
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
    med: any[];
    services: IService[];
    status: string;
    statusName: string;
    result: any;
    surveyScope: ISurveyScope[];
    parts: IPart[];
    paymentSums: any[];
    paymentSum: number;
}

export interface IMedicalDirection {
    id: number;
    data: IMedicalDirectionData;
    created_at: string;
    worker: number;
}