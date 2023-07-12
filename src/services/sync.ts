import { Preferences } from '@capacitor/preferences';

import { Freight } from '@/models/freight';
import { Category } from '@/models/category';
import { SyncableEntity } from '@/models/syncableEntity';

export type SyncStatus = 'success' | 'error' | 'ignored';

export type SyncableModel = typeof SyncableEntity;

export type LastSyncData = {
    syncedAt: string;
    statuses: SyncStatus[];
};

export const NAME_TO_CLASS: Record<string, typeof SyncableEntity> = {
    [Freight.name]: Freight,
};

export const SYNCABLE_ENTITIES = [Freight, Category];

export const lastSyncDataKey = (entity: string) => `${entity}_last_sync`;

export const saveSyncData = (entity: string, statuses: SyncStatus[]) => {
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
