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
                        <!-- router-link="Home" routerDirection="forward" -->
                        <ion-item @click="() => $router.push({ name: 'Home' })">
                            <ion-icon :icon="home" slot="start"></ion-icon>
                            <ion-label>Home</ion-label>
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
</script>
