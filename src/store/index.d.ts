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
        loadAllPaginated: <T>(
            model: { new (): T } & typeof AppBaseEntity,
            pageSize: number,
            pageNum: number
        ) => Promise<any[], number>;
        createRecordByAttrs: <T>(
            params: Omit<IInMemberWithAttrsParams<T>, 'id'>
        ) => Promise<any>;
        removeRecord: <T>(params: IInMemberOperationParams<T>) => Promise<void>;
        updateRecord: <T>(params: IInMemberWithAttrsParams<T>) => Promise<void>;
        createRecordWithNewItem: <T>(
            params: Omit<IInMemberOperationParams<T>, 'id'>
        ) => Promise<[T, Record<string, any>]>;
    }

    export interface PiniaCustomStateProperties {
        _items: Ref<any[]>;
        _newItem: Record<string, any>;
    }
}
