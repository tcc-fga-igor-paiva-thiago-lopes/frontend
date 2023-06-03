import 'pinia';
import { AppBaseEntity } from '@/models/appBaseEntity';

export interface IInMemberOperationParams {
    id: any;
    errorMsg: string;
    successMsg: string;
    model: typeof AppBaseEntity;
}

export interface IInMemberWithAttrsParams extends IInMemberOperationParams {
    attributes: Record<string, any>;
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        loadAllPaginated: (
            model: typeof AppBaseEntity,
            pageSize: number,
            pageNum: number
        ) => Promise<any[], number>;
        createRecordByAttrs: (
            params: Omit<IInMemberWithAttrsParams, 'id'>
        ) => Promise<any>;
        removeRecord: (params: IInMemberOperationParams) => Promise<void>;
        updateRecord: (params: IInMemberWithAttrsParams) => Promise<void>;
    }

    export interface PiniaCustomStateProperties {
        _items: Ref<any[]>;
    }
}
