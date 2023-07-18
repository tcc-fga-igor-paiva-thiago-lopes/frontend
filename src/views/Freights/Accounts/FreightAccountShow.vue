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
                v-if="!!account"
                readonly
                :freight="freight"
                :formData="account"
                :setAttribute="(field: string, value: unknown) => true"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
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

import { Freight } from '@/models/freight';
import { presentToast } from '@/utils/toast';
import { useAccountsStore } from '@/store/accounts';
import { useFreightsStore } from '@/store/freights';

import { IFormData } from '@/components/Accounts';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import AccountsForm from '@/components/Accounts/AccountsForm.vue';

const loading = ref(false);

const freight = ref<Freight | null>(null);

const account = ref<IFormData | null>(null);

const route = useRoute();
const router = useRouter();

const accountsStore = useAccountsStore();

const freightsStore = useFreightsStore();

const { findFreight } = freightsStore;

const { findAccount } = accountsStore;

const searchFreightAndAccount = async () => {
    const { params } = route;

    loading.value = true;

    try {
        const freightId = parseInt(params.freightId as string, 10);

        const foundFreight = (await findFreight(freightId)) as Freight | null;

        if (!foundFreight) {
            await presentToast('Frete não encontrado', 'danger');

            return router.push({ name: 'FreightsIndex' });
        }

        const foundAccount = await findAccount(
            freightId,
            parseInt(route.params.accountId as string, 10),
            true
        );

        if (!foundAccount?.value) {
            await presentToast('Gasto não encontrado', 'danger');

            return router.push({ name: 'FreightAccountsIndex' });
        }

        freight.value = foundFreight;
        account.value = foundAccount as IFormData | null;
    } finally {
        loading.value = false;
    }
};

onBeforeRouteUpdate(async (to, from) => {
    if (
        to.params.freightId !== from.params.freightId &&
        to.params.accountId !== from.params.accountId
    ) {
        await searchFreightAndAccount();
    }
});

onBeforeMount(async () => {
    await searchFreightAndAccount();
});
</script>
