export interface ISurveyType {
    id: string;
    name: string;
}

export interface IPayType {
    id: number;
    name: string;
}

export interface IMedClient {
    id: string;
    name: string;
    altname: string;
    contractNumber: string;
    contractDate: string;
}

export interface ISubdivision {
    id: string;
    name: string;
}

export interface IProfession {
    id: string;
    name: string;
    hazards: string[];
}

export interface IService {
    id: number;
    name: string;
}

export interface IHazard {
    id: number;
    point: string;
    name: string;
}

export interface IPart {
    id: number;
    name: string;
}

export interface IMedicalDirectionFormData {
    gender: "мужской" | "женский" | "";
    surveyTypeId?: string;
    address?: string;
    citizenship?: string;
    passportPlace?: string;
    phone?: string;
    payType: number | "";
    medClientId: number;
    subdivisionId?: number;
    subdivision?: string;
    professionId?: number;
    profession?: string;
    services: string[];
    hazards: string[];
    parts: string[];
}
