<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Fretes</ion-title>

                <ConnectionStatus slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="options-container">
                <ion-button
                    v-for="option in options"
                    :key="option.route"
                    shape="round"
                    class="options-button"
                    :onclick="
                        () =>
                            $router.push({
                                name: option.route,
                                query: option.query,
                            })
                    "
                >
                    <ion-icon slot="start" :icon="option.icon"></ion-icon>

                    {{ option.name }}
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<style>
.options-container {
    width: 100%;
    display: flex;
    padding-top: 32px;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
}

.options-button {
    width: 250px;
    margin-top: 32px;
}
</style>

<script setup lang="ts">
import {
    IonPage,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';
import { open, list } from 'ionicons/icons';

import { FreightStatus } from '@/models/freight';

import ConnectionStatus from '@/components/ConnectionStatus.vue';

interface IMenuOption {
    icon: string;
    name: string;
    route: string;
    query?: Record<string, string>;
}

const options: IMenuOption[] = [
    {
        route: 'FreightsIndex',
        icon: open,
        name: 'Fretes em aberto',
        query: {
            status: FreightStatus.FINISHED,
            orderKey: 'startDate',
            orderType: 'DESC',
        },
    },
    {
        route: 'FreightsIndex',
        icon: list,
        name: 'Todos os fretes',
        query: {
            status: 'all',
        },
    },
];
</script>
