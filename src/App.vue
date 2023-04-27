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
} from '@ionic/vue';

import { home } from 'ionicons/icons';
import { useRoute } from 'vue-router';

const route = useRoute();

const isMenuDisabled = () => route.name === 'Home' || route.name === 'SignUp';

const menuOptions = [
    {
        route: 'Home',
        icon: home,
        name: 'Home',
    },
];
</script>
