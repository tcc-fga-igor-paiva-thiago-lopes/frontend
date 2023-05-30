import { Ref } from 'vue';

export * from './';

export interface IFormData extends Record<string, unknown> {
    finished: boolean;
    name: string;
    description: string;
    cargo: string;
    cargoWeight: string;
    contractor: string;
    agreedPayment: string;
    startDate: string;
    dueDate: string;
    finishedDate: string;
    distance: string;
    originCountry: string;
    originCity: string;
    originState: string;
    destinationCountry: string;
    destinationCity: string;
    destinationState: string;
}

export interface IGeneralDataFields extends Record<string, any> {
    cargo: {
        value: string;
        ref: Ref<any>;
    };
    finished: {
        value: boolean;
        ref: Ref<any>;
    };
    description: {
        value: string;
        ref: Ref<any>;
    };
    cargoWeight: {
        value: string;
        ref: Ref<any>;
    };
    contractor: {
        value: string;
        ref: Ref<any>;
    };
    agreedPayment: {
        value: string;
        ref: Ref<any>;
    };
    startDate: {
        value: string;
        ref: Ref<any>;
    };
    dueDate: {
        value: string;
        ref: Ref<any>;
    };
    finishedDate: {
        value: string;
        ref: Ref<any>;
    };
}

export interface ILocationInfoFields extends Record<string, any> {
    distance: {
        value: string;
        ref: Ref<any>;
    };
    originCity: {
        value: string;
        ref: Ref<any>;
    };
    originState: {
        value: string;
        ref: Ref<any>;
    };
    originCountry: {
        value: string;
        ref: Ref<any>;
    };
    destinationCity: {
        value: string;
        ref: Ref<any>;
    };
    destinationState: {
        value: string;
        ref: Ref<any>;
    };
    destinationCountry: {
        value: string;
        ref: Ref<any>;
    };
}
