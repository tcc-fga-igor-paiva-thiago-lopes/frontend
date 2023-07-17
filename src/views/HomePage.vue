<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Página inicial</ion-title>

                <ConnectionStatus slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="options-container">
                <ion-button
                    v-for="option in menuOptions"
                    :key="option.route"
                    shape="round"
                    class="options-button"
                    :disabled="!option.available"
                    :onclick="() => $router.push({ name: option.route })"
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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

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
import { sync, navigate, statsChart, pricetags } from 'ionicons/icons';

import { useAppStore } from '../store/app';

import ConnectionStatus from '@/components/ConnectionStatus.vue';

interface IMenuOption {
    icon: string;
    name: string;
    route: string;
    offlinePermitted?: boolean;
}

const appStore = useAppStore();

const { connectionStatus } = storeToRefs(appStore);

const allMenuOptions: IMenuOption[] = [
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

const menuOptions = computed(() =>
    allMenuOptions.map((option) => ({
        ...option,
        available:
            connectionStatus.value.connected ||
            (!connectionStatus.value.connected && !!option.offlinePermitted),
    }))
);
</script>
