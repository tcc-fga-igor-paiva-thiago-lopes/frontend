import { defineStore } from 'pinia';
import { IonicSafeString } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { ConnectionStatus, Network } from '@capacitor/network';

interface IApplicationState {
    _username: string;
    _loading: {
        open: boolean;
        message?: string | IonicSafeString;
    };
    _connectionStatus: ConnectionStatus;
}

export const initialState = (): IApplicationState => ({
    _username: '',
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
        connectionStatus: (state: IApplicationState) => state._connectionStatus,
    },
    actions: {
        async openLoading(message?: string) {
            this._loading = { open: true, message };
        },
        async closeLoading() {
            this._loading = { open: false };
        },
        async loadUsername() {
            this._username = (await Preferences.get({ key: 'username' }))
                .value as string;
        },
        async setUsername(username: string) {
            this._username = username;

            await Preferences.set({ key: 'username', value: username });
        },
        async readNetworkStatus() {
            return Network.getStatus();
        },
        async addNetworkChangeListener() {
            this._connectionStatus = await this.readNetworkStatus();

            return Network.addListener('networkStatusChange', (status) => {
                this._connectionStatus = status;
            });
        },
        async removeNetworkListeners() {
            await Network.removeAllListeners();

            this._connectionStatus = {
                connected: false,
                connectionType: 'none',
            };
        },
    },
});
