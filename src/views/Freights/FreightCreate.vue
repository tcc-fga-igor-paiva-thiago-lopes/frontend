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
import { Ref, onMounted, ref } from 'vue';
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
import APIError from '@/services/api/apiError';
import { useFreightsStore } from '@/store/freights';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import FreightsForm from '@/components/Freights/FreightsForm.vue';
import {
    ValidationErrors,
    assignValidationErrorsFromResponse,
} from '@/utils/errors';

const loading = ref(false);

const router = useRouter();

const store = useFreightsStore();

const { createFreight, setNewFreightAttr } = store;

const { newFreight } = storeToRefs(store);

const handleFormSubmit = async ({
    validationsErrors,
    refs,
}: {
    validationsErrors: Ref<ValidationErrors>[];
    refs: Record<string, Ref<any>>;
}) => {
    try {
        await createFreight();
    } catch (error) {
        console.error(error);

        if (error instanceof APIError) {
            validationsErrors.forEach((validationErrors) => {
                assignValidationErrorsFromResponse(
                    validationErrors.value,
                    (error as APIError).response?.data,
                    refs
                );
            });
        }

        await presentToast('Falha ao criar frete', 'danger');
    }

    await presentToast('Frete criada com sucesso!', 'success');

    await router.replace({ name: 'FreightsIndex' });
};

const changeField = (field: string, value: unknown) => {
    setNewFreightAttr(field, value);
};

onMounted(() => {
    setNewFreightAttr('startDate', new Date().toISOString());
});
</script>
