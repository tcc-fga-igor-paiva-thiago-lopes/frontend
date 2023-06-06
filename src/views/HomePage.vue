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
            <ion-loading :is-open="loading"></ion-loading>

            <ion-text class="ion-text-center">
                <h6>There's nothing here</h6>
            </ion-text>
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import {
    IonPage,
    IonText,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonLoading,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';

import { onMounted, ref } from 'vue';

import ConnectionStatus from '@/components/ConnectionStatus.vue';

const loading = ref(true);

onMounted(async () => {
    loading.value = false;
});
</script>
