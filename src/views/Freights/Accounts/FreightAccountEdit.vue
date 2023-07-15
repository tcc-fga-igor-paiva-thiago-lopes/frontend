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
                v-if="!!accountFound"
                edit
                :freight="freight"
                :formData="editAccount"
                :setAttribute="changeField"
                @on-submit="handleFormSubmit"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import AccountsForm from '@/components/Accounts/AccountsForm.vue';

const loading = ref(false);

const freight = ref<Freight | null>(null);

const accountFound = ref(false);

const route = useRoute();
const router = useRouter();

const accountsStore = useAccountsStore();

const freightsStore = useFreightsStore();

const { findFreight } = freightsStore;

const { updateAccount, setEditAccountAttrs, findEditAccount } = accountsStore;

const { editAccount } = storeToRefs(accountsStore);

const accountId = computed(() =>
    parseInt(route.params.accountId as string, 10)
);

const handleFormSubmit = async () => {
    try {
        await updateAccount(accountId.value);

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
    setEditAccountAttrs({ [field]: value });
};

onBeforeMount(async () => {
    const { params } = route;

    freight.value = (await findFreight(
        parseInt(params.freightId as string, 10)
    )) as Freight | null;

    if (!freight.value) return router.push({ name: 'FreightsIndex' });

    accountFound.value = await findEditAccount(accountId.value);

    if (!accountFound.value) {
        presentToast('Gasto não encontrado', 'danger');

        return router.push({ name: 'FreightAccountsIndex' });
    }
});
</script>
