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
                v-if="!!freightFound"
                edit
                :formData="editFreight"
                :setAttribute="changeField"
                @on-submit="handleFormSubmit"
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
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
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

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import FreightsForm from '@/components/Freights/FreightsForm.vue';

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const store = useFreightsStore();

const { findEditFreight, setEditFreightAttrs, updateFreight } = store;

const { editFreight } = storeToRefs(store);

const freightFound = ref(false);

const freightId = computed(() =>
    parseInt(route.params.freightId as string, 10)
);

onMounted(async () => {
    freightFound.value = await findEditFreight(freightId.value);

    if (!freightFound.value) {
        presentToast('Frete não encontrado', 'danger');

        await router.push({ name: 'FreightsIndex' });
    }
});

const changeField = (field: string, value: unknown) => {
    setEditFreightAttrs({ [field]: value });
};

const handleFormSubmit = async () => {
    try {
        await updateFreight(freightId.value);

        await presentToast('Frete editado com sucesso!', 'success');

        await router.push({ name: 'FreightsIndex', query: { reset: 'true' } });
    } catch (error) {
        console.error(error);

        await presentToast('Falha ao editar frete', 'danger');
    }
};
</script>
