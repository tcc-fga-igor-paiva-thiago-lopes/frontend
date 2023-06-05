import { Ref } from 'vue';

export * from './';

export interface IFormData extends Record<string, unknown> {
    name: string;
    color: string;
}

export interface IDataFields extends Record<string, any> {
    name: {
        value: string;
        ref: Ref<any>;
    };
    color: {
        value: string;
        ref: Ref<any>;
    };
}
