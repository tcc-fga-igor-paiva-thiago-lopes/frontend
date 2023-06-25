<template>
    <ion-app>
        <ion-menu
            side="start"
            contentId="main-content"
            :disabled="isMenuDisabled"
        >
            <ion-header>
                <ion-toolbar>
                    <ion-title class="menu-title">Menu</ion-title>

                    <ConnectionStatus slot="primary" type="chip" />
                </ion-toolbar>
            </ion-header>

            <ion-content>
                <ion-loading :is-open="loading.open" :message="loading.message">
                </ion-loading>

                <ion-menu-toggle>
                    <ion-list>
                        <ion-item lines="none" class="ion-margin-bottom">
                            <ion-icon
                                slot="start"
                                class="person-circle-icon"
                                :icon="personCircleSharp"
                            ></ion-icon>

                            <ion-label>{{ username }}</ion-label>

                            <ion-icon
                                slot="end"
                                size="large"
                                :icon="logOut"
                                @click="handleLogout"
                            ></ion-icon>
                        </ion-item>

                        <ion-item
                            v-for="option in menuOptions"
                            button
                            :key="option.route"
                            :disabled="!option.available"
                            @click="() => $router.push({ name: option.route })"
                        >
                            <ion-icon
                                :icon="option.icon"
                                slot="start"
                            ></ion-icon>
                            <ion-label>{{ option.name }}</ion-label>
                        </ion-item>
                    </ion-list>
                </ion-menu-toggle>
            </ion-content>
        </ion-menu>

        <ion-router-outlet />
    </ion-app>
</template>

<style>
.person-circle-icon {
    width: 48px;
    height: 48px;
}

.custom-alert .alert-wrapper {
    --max-width: 90%;
}

button.alert-button.alert-button-confirm {
    background-color: var(--ion-color-danger);
    color: var(--ion-color-danger-contrast);
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';

import {
    IonApp,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonTitle,
    IonLabel,
    IonHeader,
    IonLoading,
    IonContent,
    IonToolbar,
    IonMenuToggle,
    IonRouterOutlet,
    IonicSafeString,
} from '@ionic/vue';
import {
    home,
    sync,
    logOut,
    navigate,
    personCircleSharp,
} from 'ionicons/icons';

import { useAppStore } from './store/app';
import AuthService from './services/auth';
import { presentToast } from './utils/toast';
import { presentConfirmationAlert } from './utils/alert';
import { isRouteOfflinePermitted } from './utils/offline';

import ConnectionStatus from '@/components/ConnectionStatus.vue';

interface IMenuOption {
    icon: string;
    name: string;
    route: string;
    offlinePermitted?: boolean;
}

const route = useRoute();
const router = useRouter();

const appStore = useAppStore();

const {
    loadUsername,
    openLoading,
    closeLoading,
    addNetworkChangeListener,
    removeNetworkListeners,
} = appStore;

const { username, loading, platform, connectionStatus } = storeToRefs(appStore);

const disabledMenuRoutes = ['Welcome', 'SignUp', 'SignIn'];

const allMenuOptions: IMenuOption[] = [
    {
        route: 'Home',
        icon: home,
        name: 'Home',
        offlinePermitted: true,
    },
    {
        route: 'FreightsIndex',
        icon: navigate,
        name: 'Fretes',
    },
    {
        route: 'SyncManagement',
        icon: sync,
        name: 'Sincronização',
    },
];

const isMenuDisabled = computed(() =>
    disabledMenuRoutes.includes(route.name as string)
);

const menuOptions = computed(() =>
    allMenuOptions.map((option) => ({
        ...option,
        available:
            connectionStatus.value.connected ||
            (!connectionStatus.value.connected && !!option.offlinePermitted),
    }))
);

const handleLogout = async () => {
    const message = new IonicSafeString(`
        Tem certeza que deseja encerrar sua sessão?<br /><br />
        Você precisará se conectar novamente e todos os dados salvos poderão ser apagados
    `);

    await presentConfirmationAlert({
        message,
        confirmText: 'Sim',
        cssClass: 'custom-alert',
        title: 'Encerrar sessão',
        confirmClass: 'alert-button-confirm',
        confirmAction: () => AuthService.logout(),
    });
};

onBeforeMount(async () => {
    openLoading();

    try {
        await loadUsername();

        if (platform.value !== 'web') await addNetworkChangeListener();
    } finally {
        closeLoading();
    }
});

onBeforeUnmount(async () => {
    if (platform.value !== 'web') await removeNetworkListeners();
});

appStore.$subscribe(async (_, state) => {
    if (
        await isRouteOfflinePermitted(
            route.name as string,
            false,
            state._connectionStatus.connected
        )
    ) {
        await presentToast(
            'Esta página não é permitida sem conexão com a Internet',
            'danger'
        );

        router.push({ name: 'Home' });
    }
});
</script>
