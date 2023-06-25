import dataSource from '@/database/dataSource';

import { Freight } from '@/models/freight';
import { useFreightsStore } from '@/store/freights';
import { SyncableEntity } from '@/models/syncableEntity';

export type SyncStatus = 'success' | 'error' | 'ignored';

export const NAME_TO_CLASS: Record<string, typeof SyncableEntity> = {
    [Freight.name]: Freight,
};

export const isStatusSuccess = (statuses: SyncStatus[]) =>
    statuses.every((status) => status === 'success');

export const isStatusError = (statuses: SyncStatus[]) =>
    !isStatusSuccess(statuses) && !isStatusIgnored(statuses);

export const isStatusIgnored = (statuses: SyncStatus[]) =>
    statuses.every((status) => status === 'ignored');

export const getSyncableEntities = () => {
    console.log(dataSource.entityMetadatas[0]);

    return dataSource.entityMetadatas
        .filter((entityMetadata) =>
            entityMetadata.inheritanceTree.includes(SyncableEntity)
        )
        .map((entityMetadata) => entityMetadata.inheritanceTree[0]);
};

export const syncAllFreights = async () => {
    const { syncFreights } = useFreightsStore();

    return [Freight.name, await syncFreights()] as [string, SyncStatus[]];
};

export const syncAll = async () => {
    const promises = [];

    promises.push(syncAllFreights());

    const settledResults = await Promise.allSettled(promises);

    return Object.fromEntries(
        settledResults.map(
            (result) =>
                (result.status === 'fulfilled'
                    ? result.value
                    : result.reason) as SyncStatus[]
        )
    ) as Record<string, SyncStatus[]>;
};

export const NAME_TO_SYNC_FUNCTION: Record<
    string,
    (async: boolean) => Promise<[string, SyncStatus[]]>
> = {
    [Freight.name]: syncAllFreights,
};
