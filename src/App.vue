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
                                @click="logout"
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

<script setup lang="ts">
import {
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonMenuToggle,
    IonContent,
    IonList,
    IonToolbar,
    IonItem,
    IonTitle,
    IonLabel,
    IonIcon,
    IonAvatar,
} from '@ionic/vue';
import { home, logOut } from 'ionicons/icons';

import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from './store/app';
import AuthService from './services/auth';

import avatarSvg from './assets/avatar.svg';

const route = useRoute();

const router = useRouter();

const appStore = useAppStore();

const { loadUsername } = appStore;

const { username } = storeToRefs(appStore);

const isMenuDisabled = () => route.name === 'Home' || route.name === 'SignUp';

const menuOptions = [
    {
        route: 'Home',
        icon: home,
        name: 'Home',
    },
];

onBeforeMount(async () => {
    await loadUsername();
});

const logout = async () => {
    await AuthService.deleteToken();

    router.push({ name: 'Welcome' });
};
</script>
