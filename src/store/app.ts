import { defineStore } from 'pinia';
import { Preferences } from '@capacitor/preferences';

interface IApplicationState {
    _username: string;
}

export const useAppStore = defineStore('application', {
    state: (): IApplicationState => ({
        _username: '',
    }),
    getters: {
        username: (state: IApplicationState) => state._username,
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
    },
});
