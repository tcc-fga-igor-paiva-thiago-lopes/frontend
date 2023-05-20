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

                    <ConnectionStatusIcon slot="primary" />
                </ion-toolbar>
            </ion-header>

            <ion-content>
                <ion-list>
                    <ion-menu-toggle>
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
                            v-for="option in availableMenuOptions"
                            :key="option.route"
                            @click="() => $router.push({ name: option.route })"
                        >
                            <ion-icon
                                :icon="option.icon"
                                slot="start"
                            ></ion-icon>
                            <ion-label>{{ option.name }}</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </ion-list>
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
import { useRoute } from 'vue-router';
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
import { home, logOut, personCircleSharp } from 'ionicons/icons';

import { useAppStore } from './store/app';
import AuthService from './services/auth';
import ConnectionStatusIcon from '@/components/ConnectionStatusIcon.vue';

const route = useRoute();

const appStore = useAppStore();

const { loadUsername, addNetworkChangeListener, removeNetworkListeners } =
    appStore;

const { username, connectionStatus } = storeToRefs(appStore);

const disabledMenuRoutes = ['Welcome', 'SignUp', 'SignIn'];

const menuOptions = [
    {
        route: 'Home',
        icon: home,
        name: 'Home',
        offlinePermitted: true,
    },
];

const isMenuDisabled = computed(() =>
    disabledMenuRoutes.includes(route.name as string)
);

const availableMenuOptions = computed(() => {
    if (connectionStatus.value.connected) return menuOptions;

    return menuOptions.filter((item) => item.offlinePermitted);
});

onBeforeMount(async () => {
    await loadUsername();

    await addNetworkChangeListener();
});

onBeforeUnmount(async () => {
    await removeNetworkListeners();
});
</script>
