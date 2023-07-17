import { defineStore } from 'pinia';
import { Capacitor } from '@capacitor/core';
import { IonicSafeString } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { ConnectionStatus, Network } from '@capacitor/network';

import {
    SyncStatus,
    saveSyncData,
    SyncableModel,
    SYNCABLE_ENTITIES,
} from '@/services/sync';
import AuthService from '@/services/auth';
import { Freight } from '@/models/freight';
import { Account } from '@/models/account';
import { Category } from '@/models/category';
import dataSource from '@/database/dataSource';
import { SyncableEntity } from '@/models/syncableEntity';
import { runDatabaseOperation } from './helpers/databaseConnector';

type Platform = 'android' | 'ios' | 'web';

interface IApplicationState {
    _username: string;
    _platform: Platform;
    _loading: {
        open: boolean;
        message?: string | IonicSafeString;
    };
    _connectionStatus: ConnectionStatus;
}

const USERNAME_KEY = 'username';

export const initialState = (): IApplicationState => ({
    _username: '',
    _platform: Capacitor.getPlatform() as Platform,
    _loading: {
        open: false,
    },
    _connectionStatus: {
        // Setting to true to avoid redirection when acessing offline not permitted page
        connected: true,
        connectionType: 'none',
    },
});

export const useAppStore = defineStore('application', {
    state: (): IApplicationState => initialState(),
    getters: {
        loading: (state: IApplicationState) => state._loading,
        username: (state: IApplicationState) => state._username,
        platform: (state: IApplicationState) => state._platform,
        connectionStatus: (state: IApplicationState) => state._connectionStatus,
    },
    actions: {
        openLoading(message?: string) {
            this._loading = { open: true, message };
        },
        closeLoading() {
            this._loading = { open: false, message: undefined };
        },
        async loadUsername() {
            this._username = (await Preferences.get({ key: USERNAME_KEY }))
                .value as string;
        },
        async setUsername(username: string) {
            this._username = username;

            await Preferences.set({ key: USERNAME_KEY, value: username });
        },
        async readNetworkStatus() {
            const status = await Network.getStatus();

            this._connectionStatus = status;

            return status;
        },
        async addNetworkChangeListener() {
            return Network.addListener(
                'networkStatusChange',
                async (status) => {
                    this._connectionStatus = status;
                    const isLogged = await AuthService.hasToken();

                    if (status.connected && isLogged) this.syncAll();
                }
            );
        },
        async removeNetworkListeners() {
            await Network.removeAllListeners();

            this._connectionStatus = {
                connected: false,
                connectionType: 'none',
            };
        },
        async syncEntity(entity: SyncableModel) {
            const statuses = await this.syncRecords(entity);

            await saveSyncData(entity.name, statuses);

            return [entity.name, statuses] as [string, SyncStatus[]];
        },
        async syncAll() {
            const isLogged = await AuthService.hasToken();

            if (!isLogged) return;

            const promises = SYNCABLE_ENTITIES.filter(
                (entity) => entity !== Account
            ).map((entity) => this.syncEntity(entity));

            const settledResults = await Promise.allSettled(promises);

            if (
                settledResults.every((result) => result.status === 'fulfilled')
            ) {
                settledResults.push(
                    (await Promise.allSettled([this.syncEntity(Account)]))[0]
                );
            }

            return Object.fromEntries(
                settledResults.map(
                    (result) =>
                        (result.status === 'fulfilled'
                            ? result.value
                            : result.reason) as SyncStatus[]
                )
            ) as Record<string, SyncStatus[]>;
        },
        async clearDatabase() {
            return runDatabaseOperation(() => {
                return dataSource.transaction(async () => {
                    await Account.createQueryBuilder().delete().execute();

                    await Promise.all(
                        [Freight, Category].map((entity) =>
                            (entity as typeof SyncableEntity)
                                .createQueryBuilder()
                                .delete()
                                .execute()
                        )
                    );
                });
            });
        },
    },
});
