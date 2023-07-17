export * from '.';

export interface IFormData extends Record<string, any> {
    id: number;
    name: string;
    color: string;
    createdAt: string;
    updatedAt: string;
}
