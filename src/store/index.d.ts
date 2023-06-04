import 'pinia';
import { AppBaseEntity } from '@/models/appBaseEntity';

export type ModelClass<T> = { new (): T } & typeof AppBaseEntity;

export interface IMemberActionParams<T> {
    id: any;
    model: ModelClass<T>;
}

export interface IMemberActionWithMsgParams<T> extends IMemberActionParams<T> {
    errorMsg: string;
    successMsg: string;
}

export interface IMemberActionWithAttrsParams<T>
    extends IMemberActionWithMsgParams<T> {
    attributes: Record<string, any>;
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        loadAllPaginated: <T extends AppBaseEntity>(
            model: ModelClass<T>,
            pageSize: number,
            pageNum: number
        ) => Promise<any[], number>;
        createRecordByAttrs: <T extends AppBaseEntity>(
            params: Omit<IMemberActionWithAttrsParams<T>, 'id'>
        ) => Promise<any>;
        removeRecord: <T extends AppBaseEntity>(
            params: IMemberActionWithMsgParams<T>
        ) => Promise<void>;
        updateRecord: <T extends AppBaseEntity>(
            params: IMemberActionWithAttrsParams<T>
        ) => Promise<void>;
        createRecordWithNewItem: <T extends AppBaseEntity>(
            params: Omit<IMemberActionWithMsgParams<T>, 'id'>
        ) => Promise<[T, Record<string, any>]>;

        findRecord: <T extends AppBaseEntity>(
            model: ModelClass<T>,
            id: any,
            asFormData = false
        ) => Promise<Record<string, any> | T | null>;
        findEditRecord: <T extends AppBaseEntity>(
            params: IMemberActionParams<T>
        ) => Promise<boolean>;
        updateRecordWithEditItem: <T extends AppBaseEntity>(
            params: IMemberActionWithMsgParams<T>
        ) => Promise<[T, Record<string, any>]>;
    }

    export interface PiniaCustomStateProperties {
        _items: Ref<any[]>;
        _newItem: Record<string, any>;
        _editItem: Record<string, any>;
    }
}
