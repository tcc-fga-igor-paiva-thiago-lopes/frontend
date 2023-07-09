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
                readonly
                v-if="!!freight"
                :formData="freight"
                :setAttribute="(field: string, value: unknown) => true"
            />

            <ion-text
                v-else
                color="danger"
                class="ion-margin-top ion-text-center"
            >
                <h5>Frete não encontrado</h5>
            </ion-text>
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

import { presentToast } from '@/utils/toast';
import { useFreightsStore } from '@/store/freights';

import { IFormData } from '@/components/Freights';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import FreightsForm from '@/components/Freights/FreightsForm.vue';

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const store = useFreightsStore();

const { findFreight } = store;

const freight = ref<IFormData | null>(null);

onMounted(async () => {
    const foundFreight = await findFreight(
        parseInt(route.params.freightId as string, 10),
        true
    );

    if (!foundFreight) {
        presentToast('Frete não encontrado', 'danger');

        await router.push({ name: 'FreightsIndex' });
    }

    freight.value = foundFreight as IFormData | null;
});
</script>
