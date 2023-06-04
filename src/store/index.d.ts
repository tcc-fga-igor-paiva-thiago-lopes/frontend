import 'pinia';
import { AppBaseEntity } from '@/models/appBaseEntity';

export interface IInMemberOperationParams<T> {
    id: any;
    errorMsg: string;
    successMsg: string;
    model: { new (): T } & typeof AppBaseEntity;
}

export interface IInMemberWithAttrsParams<T>
    extends IInMemberOperationParams<T> {
    attributes: Record<string, any>;
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        loadAllPaginated: <T extends AppBaseEntity>(
            model: { new (): T } & typeof AppBaseEntity,
            pageSize: number,
            pageNum: number
        ) => Promise<any[], number>;
        createRecordByAttrs: <T extends AppBaseEntity>(
            params: Omit<IInMemberWithAttrsParams<T>, 'id'>
        ) => Promise<any>;
        removeRecord: <T extends AppBaseEntity>(
            params: IInMemberOperationParams<T>
        ) => Promise<void>;
        updateRecord: <T extends AppBaseEntity>(
            params: IInMemberWithAttrsParams<T>
        ) => Promise<void>;
        createRecordWithNewItem: <T extends AppBaseEntity>(
            params: Omit<IInMemberOperationParams<T>, 'id'>
        ) => Promise<[T, Record<string, any>]>;

        findRecord: <T extends AppBaseEntity>(
            model: { new (): T } & typeof AppBaseEntity,
            id: any,
            asFormData = false
        ) => Promise<Record<string, any> | T | null>;
        findEditRecord: <T extends AppBaseEntity>(
            model: { new (): T } & typeof AppBaseEntity,
            id: any
        ) => Promise<boolean>;
        updateRecordWithEditItem: <T extends AppBaseEntity>(
            params: IInMemberOperationParams<T>
        ) => Promise<[T, Record<string, any>]>;
    }

    export interface PiniaCustomStateProperties {
        _items: Ref<any[]>;
        _newItem: Record<string, any>;
        _editItem: Record<string, any>;
    }
}
