import { useAppStore } from '@/store/app';
import { Capacitor } from '@capacitor/core';
import { offlinePermittedRoutes } from '@/router';

export const isRouteNotPermittedOffline = async (
    routeName: string,
    readStatus = true,
    connected?: boolean
) => {
    const { readNetworkStatus } = useAppStore();

    let isConnected = connected;
    const platform = Capacitor.getPlatform();

    if (readStatus) {
        const connectionStatus = await readNetworkStatus();

        isConnected = connectionStatus.connected;
    }

    return (
        !isConnected &&
        platform !== 'web' &&
        !offlinePermittedRoutes.includes(routeName)
    );
};
