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
    pricetags,
    statsChart,
    personCircleSharp,
} from 'ionicons/icons';

import { useAppStore } from './store/app';
import AuthService from './services/auth';
import { presentToast } from './utils/toast';
import { presentConfirmationAlert } from './utils/alert';
import { isRouteNotPermittedOffline } from './utils/offline';

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
    syncAll,
    loadUsername,
    openLoading,
    closeLoading,
    readNetworkStatus,
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
        route: 'FreightsHome',
        icon: navigate,
        name: 'Fretes',
        offlinePermitted: true,
    },
    {
        route: 'CategoriesIndex',
        icon: pricetags,
        name: 'Categorias',
        offlinePermitted: true,
    },
    {
        route: 'AnalysisIndex',
        icon: statsChart,
        name: 'Indicadores',
        offlinePermitted: true,
    },
    {
        route: 'SyncManagement',
        icon: sync,
        name: 'Sincronização',
        offlinePermitted: true,
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
        Você precisará se conectar novamente e todos os dados salvos localmente serão ser apagados.<br /><br />
        Recomendamos que faça uma sincronização total de todos os dados antes de encerrar a sessão.
        Procure por "Sincronização" na página inicial ou no menu lateral
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

    const connected = (await readNetworkStatus()).connected;

    if (connected) syncAll();

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
        await isRouteNotPermittedOffline(
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
