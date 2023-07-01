import 'pinia';

import APIAdapter from '@/services/api';
import { SyncStatus } from '@/services/sync';
import { SyncableEntity } from '@/models/syncableEntity';

export type ModelClass<T> = { new (): T } & typeof SyncableEntity;

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
        loadAllPaginated: <T extends SyncableEntity>(
            model: ModelClass<T>,
            pageSize: number,
            pageNum: number
        ) => Promise<[T[], number]>;
        createRecordByAttrs: <T extends SyncableEntity>(
            params: Omit<IMemberActionWithAttrsParams<T>, 'id'>
        ) => Promise<any>;
        removeRecord: <T extends SyncableEntity>(
            params: IMemberActionWithMsgParams<T>
        ) => Promise<void>;
        softRemoveRecord: <T extends SyncableEntity>(
            params: IMemberActionWithMsgParams<T>
        ) => Promise<void>;
        updateRecord: <T extends SyncableEntity>(
            params: IMemberActionWithAttrsParams<T>
        ) => Promise<void>;
        createRecordWithNewItem: <T extends SyncableEntity>(
            params: Omit<IMemberActionWithMsgParams<T>, 'id'>
        ) => Promise<[T, Record<string, any>]>;

        findRecord: <T extends SyncableEntity>(
            model: ModelClass<T>,
            id: any,
            asFormData = false
        ) => Promise<Record<string, any> | T | null>;
        findEditRecord: <T extends SyncableEntity>(
            params: IMemberActionParams<T>
        ) => Promise<boolean>;
        updateRecordWithEditItem: <T extends SyncableEntity>(
            params: IMemberActionWithMsgParams<T>
        ) => Promise<[T, Record<string, any>]>;
        syncRecords: <T extends SyncableEntity>(
            model: ModelClass<T>
        ) => Promise<SyncStatus[]>;
        setFilterData: (value: FilterData) => void;
    }

    export interface PiniaCustomStateProperties {
        _syncing: boolean;
        _items: Ref<any[]>;
        _newItem: Record<string, any>;
        _editItem: Record<string, any>;
        _filterData: FilterData;
    }
}
