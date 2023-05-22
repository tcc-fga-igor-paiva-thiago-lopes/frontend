import { setActivePinia } from 'pinia';
import { Network } from '@capacitor/network';
import { createTestingPinia } from '@pinia/testing';
import { Preferences } from '@capacitor/preferences';

import { initialState, useAppStore } from '@/store/app';

describe('applicationStore', () => {
    beforeEach(() => {
        setActivePinia(
            createTestingPinia({
                stubActions: false,
                initialState: {
                    application: initialState(),
                },
            })
        );
    });

    it('should load username from Preferences', async () => {
        const appStore = useAppStore();
        const { loadUsername } = appStore;

        appStore._username = 'John';

        jest.spyOn(Preferences, 'get').mockResolvedValueOnce({
            value: 'John Doe',
        });

        await loadUsername();

        expect(appStore.username).toEqual('John Doe');
    });

    it('should save username in store and Preferences', async () => {
        const appStore = useAppStore();
        const { setUsername } = appStore;

        jest.spyOn(Preferences, 'set').mockResolvedValueOnce();

        await setUsername('John Doe');

        expect(appStore.username).toEqual('John Doe');
        expect(Preferences.set).toHaveBeenCalledWith({
            key: 'username',
            value: 'John Doe',
        });
    });

    it('should read connection status from Network plugin', async () => {
        const appStore = useAppStore();
        const { readNetworkStatus } = appStore;

        jest.spyOn(Network, 'getStatus').mockResolvedValueOnce({
            connected: true,
            connectionType: 'wifi',
        });

        const status = await readNetworkStatus();

        expect(status).toEqual({
            connected: true,
            connectionType: 'wifi',
        });
    });

    it('should read connection status and add network event listener', async () => {
        const appStore = useAppStore();
        const { addNetworkChangeListener } = appStore;

        jest.spyOn(Network, 'getStatus').mockResolvedValueOnce({
            connected: true,
            connectionType: 'cellular',
        });

        jest.spyOn(Network, 'addListener').mockResolvedValueOnce({
            remove: () => Promise.resolve(),
        });

        await addNetworkChangeListener();

        expect(appStore.connectionStatus).toEqual({
            connected: true,
            connectionType: 'cellular',
        });
        expect(Network.addListener).toHaveBeenCalled();
    });

    it('should remove all Network plugin event listeners', async () => {
        const appStore = useAppStore();
        const { removeNetworkListeners } = appStore;

        jest.spyOn(Network, 'removeAllListeners').mockResolvedValueOnce();

        await removeNetworkListeners();

        expect(appStore.connectionStatus).toEqual({
            connected: false,
            connectionType: 'none',
        });
        expect(Network.removeAllListeners).toHaveBeenCalled();
    });
});
