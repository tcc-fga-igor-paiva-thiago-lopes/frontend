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

        <ion-content :fullscreen="true">
            <ion-loading :is-open="loading"></ion-loading>

            <ManageAccounts
                itemName="Gasto"
                itemsName="Gastos"
                :model="Account"
                :orderData="orderData"
                :filterData="filterData"
                :label="accountLabel"
                :subLabel="accountSubLabel"
                :items="accounts"
                :addItem="createAccount"
                :showItem="showAccount"
                :editItem="editAccount"
                :removeItem="deleteAccount"
                :loadMoreItems="loadMoreItems"
                :paginationService="paginationService"
                :orderExcludeColumns="ORDER_EXCLUDE_COLUMNS"
                :filterExcludeColumns="FILTER_EXCLUDE_COLUMNS"
                @onFilterConfirm="handleFilterConfirmation"
                @onOrderChange="handleOrderData"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import {
    onBeforeUnmount,
    onMounted,
    reactive,
    watch,
    ref,
    computed,
} from 'vue';

import {
    IonPage,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonLoading,
    IonButtons,
    IonMenuButton,
    IonicSafeString,
} from '@ionic/vue';

import { Account } from '@/models/account';
import { Freight } from '@/models/freight';
import { presentToast } from '@/utils/toast';
import { useAccountsStore } from '@/store/accounts';
import { useFreightsStore } from '@/store/freights';
import { FilterData, IOrderData } from '@/models/appBaseEntity';
import PaginationService from '@/utils/pagination/paginationService';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import ManageAccounts from '@/components/Management/MainComponent.vue';
import { brazilFormatter } from '@/utils/currency';
import { formatDateDynamicYear } from '@/utils/date';

const FILTER_EXCLUDE_COLUMNS: string[] = [];

const ORDER_EXCLUDE_COLUMNS = [...FILTER_EXCLUDE_COLUMNS, 'description'];

const loading = ref(false);

const freight = ref<Freight | null>(null);

const accounts = ref<Account[]>([]);

const filterData = ref<FilterData>({});
const orderData = ref<IOrderData>({ field: 'accountDate', order: 'DESC' });

const accountsStore = useAccountsStore();

const freightsStore = useFreightsStore();

const route = useRoute();
const router = useRouter();

const { findFreight } = freightsStore;

const { removeAccount, findFreightAccounts } = accountsStore;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loadPaginated = async (pageSize: number, pageNum: number) => {
    if (!freight.value) return [[], 0] as [Account[], number];

    const paginationRet = await findFreightAccounts(
        freightId.value,
        filterData.value,
        orderData.value
    );

    const [freightAccounts] = paginationRet;

    accounts.value = freightAccounts;

    return paginationRet;
};

const paginationService = reactive(new PaginationService(loadPaginated));

const freightId = computed(() =>
    parseInt(route.params.freightId as string, 10)
);

const createAccount = async () => {
    await router.push({
        name: 'FreightAccountCreate',
        params: { freightId: freightId.value },
    });
};

const showAccount = async (account: Account) => {
    await router.push({
        name: 'FreightAccountShow',
        params: { freightId: freightId.value, accountId: account.id },
    });
};

const editAccount = async (account: Account) => {
    await router.push({
        name: 'FreightAccountEdit',
        params: { freightId: freightId.value, accountId: account.id },
    });
};

const deleteAccount = async (account: Account) => {
    await removeAccount(account.id);

    await paginationService.reset();
};

const loadMoreItems = () => paginationService.getNextPage();

const accountLabel = (account: Account) => {
    return new IonicSafeString(`
        <div style="display:flex; align-items: center">
            <div style="width: 24px; height:24px; margin-right:8px; border-radius: 50%; background:${
                account.category.color
            }"></div>
            ${account.name} (${formatDateDynamicYear(account.accountDate)})
        </div>
    `);
};

const accountSubLabel = (account: Account) => {
    return `${account.category.name} | ${brazilFormatter.format(
        account.value
    )}`;
};

const handleFilterConfirmation = async (data: FilterData) => {
    filterData.value = data;

    await paginationService.reset();
};

const handleOrderData = async (data: Partial<IOrderData>) => {
    Object.assign(orderData.value, data);

    await paginationService.reset();
};

const unwatch = watch(
    () => route.query,
    async (value) => {
        if (value.reset === 'true') await paginationService.reset();
    }
);

const searchFreight = async () => {
    const foundFreight = (await findFreight(freightId.value)) as Freight | null;

    if (!foundFreight) {
        await presentToast('Frete não encontrado', 'danger');

        return router.back();
    }

    freight.value = foundFreight;
};

onBeforeRouteUpdate(async (to, from) => {
    if (to.params.freightId !== from.params.freightId) {
        await searchFreight();
    }

    if (to.query.reset === 'true') await paginationService.reset();
});

onMounted(async () => {
    loading.value = true;

    try {
        await searchFreight();

        await paginationService.getFirstPage();
    } catch (e) {
        console.error(e);

        presentToast('Falha ao carregar gastos', 'danger');
    } finally {
        loading.value = false;
    }
});

onBeforeUnmount(() => {
    unwatch();
});
</script>
