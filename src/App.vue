<template>
    <ion-app>
        <ion-menu
            side="start"
            contentId="main-content"
            :disabled="isMenuDisabled()"
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
                            <ion-avatar slot="start">
                                <img
                                    :src="avatarSvg"
                                    alt="Silhueta da cabeça de uma pessoa"
                                />
                            </ion-avatar>

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

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { onBeforeMount, onBeforeUnmount } from 'vue';

import {
    IonApp,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonTitle,
    IonLabel,
    IonAvatar,
    IonHeader,
    IonContent,
    IonToolbar,
    IonMenuToggle,
    IonRouterOutlet,
} from '@ionic/vue';
import { home, logOut } from 'ionicons/icons';

import { useAppStore } from './store/app';
import AuthService from './services/auth';
import avatarSvg from './assets/avatar.svg';
import ConnectionStatusIcon from '@/components/ConnectionStatusIcon.vue';

const route = useRoute();

const appStore = useAppStore();

const { loadUsername, readNetworkStatus, removeNetworkListeners } = appStore;

const { username } = storeToRefs(appStore);

const isMenuDisabled = () =>
    route.name === 'Welcome' || route.name === 'SignUp';

const menuOptions = [
    {
        route: 'Home',
        icon: home,
        name: 'Home',
    },
];

onBeforeMount(async () => {
    await loadUsername();

    await readNetworkStatus();
});

onBeforeUnmount(async () => {
    await removeNetworkListeners();
});
</script>
