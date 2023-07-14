export * from '.';

export interface IFormData extends Record<string, any> {
    name: string;
    value: string;
    description: string;
    accountDate: string;
    freightId: string;
    categoryId: string;
}
