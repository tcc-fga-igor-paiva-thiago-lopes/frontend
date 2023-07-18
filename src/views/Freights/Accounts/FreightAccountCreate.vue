<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Gastos Frete</ion-title>

                <ConnectionStatus slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding-horizontal">
            <ion-loading :is-open="loading"></ion-loading>

            <AccountsForm
                :freight="freight"
                :formData="newAccount"
                :setAttribute="changeField"
                @on-submit="handleFormSubmit"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

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

import { formatISO } from '@/utils/date';
import { Freight } from '@/models/freight';
import { presentToast } from '@/utils/toast';
import { useAccountsStore } from '@/store/accounts';
import { useFreightsStore } from '@/store/freights';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import AccountsForm from '@/components/Accounts/AccountsForm.vue';

const loading = ref(false);

const freight = ref<Freight | null>(null);

const route = useRoute();
const router = useRouter();

const accountsStore = useAccountsStore();

const freightsStore = useFreightsStore();

const { findFreight } = freightsStore;

const { createAccount, setNewAccountAttrs } = accountsStore;

const { newAccount } = storeToRefs(accountsStore);

const handleFormSubmit = async () => {
    try {
        await createAccount();

        await presentToast('Gasto criada com sucesso!', 'success');

        await router.push({
            name: 'FreightAccountsIndex',
            query: { reset: 'true' },
        });
    } catch (error) {
        console.error(error);

        await presentToast('Falha ao criar gasto', 'danger');
    }
};

const changeField = (field: string, value: unknown) => {
    setNewAccountAttrs({ [field]: value });
};

const searchFreight = async () => {
    const { params } = route;

    const foundFreight = (await findFreight(
        parseInt(params.freightId as string, 10)
    )) as Freight | null;

    if (!foundFreight) {
        await presentToast('Frete não encontrado', 'danger');

        return router.push({ name: 'FreightsIndex' });
    }

    freight.value = foundFreight;
};

onBeforeRouteUpdate(async (to, from) => {
    if (to.params.freightId !== from.params.freightId) {
        await searchFreight();
    }
});

onBeforeMount(async () => {
    await searchFreight();

    setNewAccountAttrs({
        freightId: freight?.value?.id,
        accountDate: formatISO(new Date()),
    });
});
</script>
