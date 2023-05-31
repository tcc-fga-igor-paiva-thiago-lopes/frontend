import { HttpOptions, HttpResponse } from '@capacitor/core';
import { useAppStore } from '../app';

export const callOperation = (
    operation: (options: HttpOptions) => Promise<HttpResponse>,
    options: HttpOptions
) => {
    const appStore = useAppStore();

    if (appStore.connectionStatus.connected) {
        try {
            return operation(options);

            // TODO: sync record (set synced column to true)
        } catch (e) {
            return null;
        }
    }

    return null;
};
