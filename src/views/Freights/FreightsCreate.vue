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
            <ion-loading :is-open="loading"></ion-loading>

            <FreightsForm
                :formData="newFreight"
                @on-submit="createFreight"
                @on-field-change="handleFieldChange"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

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

import { IFormData, useFreightsStore } from '@/store/freights';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import FreightsForm from '@/components/Freights/FreightsForm.vue';

const loading = ref(false);

const store = useFreightsStore();

const { setNewFreightAttr } = store;

const { newFreight } = storeToRefs(store);

const createFreight = (data: IFormData) => {
    console.log('freight data: ', data);
};

const handleFieldChange = (field: string, value: unknown) => {
    setNewFreightAttr(field, value);
};

onMounted(() => {
    setNewFreightAttr('startDatetime', new Date().toISOString());
});
</script>
