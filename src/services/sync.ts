import { Preferences } from '@capacitor/preferences';

import dataSource from '@/database/dataSource';

import { Freight } from '@/models/freight';
import { useFreightsStore } from '@/store/freights';
import { SyncableEntity } from '@/models/syncableEntity';

export type SyncStatus = 'success' | 'error' | 'ignored';

export type LastSyncData = {
    syncedAt: string;
    statuses: SyncStatus[];
};

export const NAME_TO_CLASS: Record<string, typeof SyncableEntity> = {
    [Freight.name]: Freight,
};

const lastSyncDataKey = (entity: string) => `${entity}_last_sync`;

const saveSyncData = (entity: string, statuses: SyncStatus[]) => {
    const syncedAt = new Date().toISOString();

    return Preferences.set({
        key: lastSyncDataKey(entity),
        value: JSON.stringify({
            syncedAt,
            statuses,
        }),
    });
};

export const readLastSyncData = async (entity: string) => {
    try {
        const dataString = (
            await Preferences.get({ key: lastSyncDataKey(entity) })
        ).value;

        if (!dataString) return null;

        return JSON.parse(dataString) as LastSyncData;
    } catch (error) {
        console.error(error);

        return null;
    }
};

export const isStatusSuccess = (statuses: SyncStatus[]) =>
    !isStatusIgnored(statuses) &&
    statuses
        .filter((status) => status !== 'ignored')
        .every((status) => status === 'success');

export const isStatusError = (statuses: SyncStatus[]) =>
    !isStatusSuccess(statuses) && !isStatusIgnored(statuses);

export const isStatusIgnored = (statuses: SyncStatus[]) =>
    statuses.every((status) => status === 'ignored');

export const getSyncableEntities = () => {
    return dataSource.entityMetadatas
        .filter((entityMetadata) =>
            entityMetadata.inheritanceTree.includes(SyncableEntity)
        )
        .map((entityMetadata) => entityMetadata.inheritanceTree[0]);
};

export const syncAllFreights = async () => {
    const { syncFreights } = useFreightsStore();

    const statuses = await syncFreights();

    await saveSyncData(Freight.name, statuses);

    return [Freight.name, statuses] as [string, SyncStatus[]];
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
