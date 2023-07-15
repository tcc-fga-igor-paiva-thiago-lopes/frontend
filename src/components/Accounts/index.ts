export * from '.';

export interface IFormData extends Record<string, any> {
    id: number;
    name: string;
    value: string;
    description: string;
    accountDate: string;
    freightId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}
