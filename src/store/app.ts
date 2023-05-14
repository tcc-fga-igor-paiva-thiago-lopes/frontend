import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';
import { ConnectionStatus, Network } from '@capacitor/network';

interface IApplicationState {
    _username: string;
    _connectionStatus: ConnectionStatus;
}

export const useAppStore = defineStore('application', {
    state: (): IApplicationState => ({
        _username: '',
        _connectionStatus: {
            connected: false,
            connectionType: 'none',
        },
    }),
    getters: {
        username: (state: IApplicationState) => state._username,
        connectionStatus: (state: IApplicationState) => state._connectionStatus,
    },
    actions: {
        async loadUsername() {
            this._username = (await Preferences.get({ key: 'username' }))
                .value as string;
        },
        async setUsername(username: string) {
            this._username = username;

            await Preferences.set({ key: 'username', value: username });
        },
        async readNetworkStatus() {
            this._connectionStatus = await Network.getStatus();

            Network.addListener('networkStatusChange', (status) => {
                this._connectionStatus = status;
            });

            return this._connectionStatus;
        },
        async removeNetworkListeners() {
            await Network.removeAllListeners();
        },
    },
});
