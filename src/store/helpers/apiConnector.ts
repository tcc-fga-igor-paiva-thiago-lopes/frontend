import { HttpResponse } from '@capacitor/core';
import { useAppStore } from '../app';

export const callOperation = async (operation: () => Promise<HttpResponse>) => {
    const appStore = useAppStore();

    if (appStore.connectionStatus.connected) {
        try {
            operation()
                .then((response) =>
                    // TODO: sync record (set synced column to true)
                    console.log('Requisição completada com sucesso: ', response)
                )
                .catch((error) => {
                    // TODO: save error to be treated by user later
                    console.log('Requisição falhou: ', error.response?.data);
                });

            return true;
        } catch {
            return false;
        }
    }

    return false;
};
