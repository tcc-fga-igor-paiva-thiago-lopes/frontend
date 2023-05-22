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

        <ion-content :fullscreen="true" class="ion-padding-horizontal">
            <ion-loading v-if="loading"></ion-loading>

            <FreightsForm @on-submit="addFreight" />
        </ion-content>
    </ion-page>
</template>

<style>
.dividerline {
    margin: 0 8px;
    width: 32px;
    height: 2px;
    background-color: #000;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

import {
    IonPage,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonLoading,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';

import { IFormData } from '@/components/Freights';
import FreightsForm from '@/components/Freights/FreightsForm.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';

const loading = ref(false);

const addFreight = (data: IFormData) => {
    console.log('freight data: ', data);
};
</script>
