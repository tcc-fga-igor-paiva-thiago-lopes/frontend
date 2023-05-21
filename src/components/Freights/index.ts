export * from './';

export interface IFormData extends Record<string, unknown> {
    finished: boolean;
    name: string;
    description: string;
    cargoType: string;
    cargoWeight: string;
    contractor: string;
    agreedPayment: string;
    startDatetime: string;
    dueDatetime: string;
    finishedDatetime: string;
    distance: string;
    originCountry: string;
    originCity: string;
    originState: string;
    destinationCountry: string;
    destinationCity: string;
    destinationState: string;
}
