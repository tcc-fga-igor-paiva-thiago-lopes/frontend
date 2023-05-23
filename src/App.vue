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
                                @click="AuthService.logout"
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
    IonContent,
    IonToolbar,
    IonMenuToggle,
    IonRouterOutlet,
} from '@ionic/vue';
import { home, navigate, logOut, personCircleSharp } from 'ionicons/icons';

import { useAppStore } from './store/app';
import AuthService from './services/auth';
import { presentToast } from './utils/toast';
import { offlinePermittedRoutes } from '@/router';
import ConnectionStatus from '@/components/ConnectionStatus.vue';

interface IMenuOption {
    icon: string;
    name: string;
    route: string;
    offlinePermitted?: boolean;
}

const route = useRoute();

const appStore = useAppStore();

const { loadUsername, addNetworkChangeListener, removeNetworkListeners } =
    appStore;

const { username, connectionStatus } = storeToRefs(appStore);

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

onBeforeMount(async () => {
    await loadUsername();

    await addNetworkChangeListener();
});

onBeforeUnmount(async () => {
    await removeNetworkListeners();
});
</script>
