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
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <ion-loading :is-open="loading"></ion-loading>

            <AccountsForm
                v-if="!!accountFound"
                edit
                :freight="freight"
                :formData="editAccount"
                :categories="categories"
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
    IonRefresher,
    IonRefresherContent,
    RefresherCustomEvent,
} from '@ionic/vue';

import { Freight } from '@/models/freight';
import { presentToast } from '@/utils/toast';
import { Category } from '@/models/category';
import { useAccountsStore } from '@/store/accounts';
import { useFreightsStore } from '@/store/freights';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import AccountsForm from '@/components/Accounts/AccountsForm.vue';

const loading = ref(false);

const freight = ref<Freight | null>(null);

const categories = ref<Category[]>([]);

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

        await presentToast('Gasto editado com sucesso!', 'success');

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

const handleRefresh = async (event: RefresherCustomEvent) => {
    await searchFreightAndAccount();
    await fetchCategories();

    await event.target.complete();
};

const fetchCategories = async () => {
    categories.value = await Category.find();
};

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

        const foundAccount = await findEditAccount(
            freightId,
            parseInt(route.params.accountId as string, 10)
        );

        if (!foundAccount) {
            await presentToast('Gasto não encontrado', 'danger');

            return router.push({ name: 'FreightAccountsIndex' });
        }

        freight.value = foundFreight;
        accountFound.value = foundAccount;
    } finally {
        loading.value = false;
    }
};

onBeforeRouteUpdate(async (to, from) => {
    if (
        to.params.freightId !== from.params.freightId ||
        to.params.accountId !== from.params.accountId
    ) {
        await searchFreightAndAccount();
    }

    await fetchCategories();
});

onBeforeMount(async () => {
    await searchFreightAndAccount();
    await fetchCategories();
});
</script>
