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
                :setAttribute="changeField"
                @on-submit="handleFormSubmit"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

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

import { presentToast } from '@/utils/toast';
import { useFreightsStore } from '@/store/freights';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import FreightsForm from '@/components/Freights/FreightsForm.vue';

const loading = ref(false);

const router = useRouter();

const store = useFreightsStore();

const { createFreight, setNewFreightAttrs } = store;

const { newFreight } = storeToRefs(store);

const handleFormSubmit = async () => {
    try {
        await createFreight();

        await presentToast('Frete criada com sucesso!', 'success');

        await router.push({ name: 'FreightsIndex', query: { reset: 'true' } });
    } catch (error) {
        console.error(error);

        await presentToast('Falha ao criar frete', 'danger');
    }
};

const changeField = (field: string, value: unknown) => {
    setNewFreightAttrs({ [field]: value });
};

onMounted(() => {
    setNewFreightAttrs({
        originCountry: 'Brasil',
        destinationCountry: 'Brasil',
        startDate: new Date().toISOString(),
    });
});
</script>
