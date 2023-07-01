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

        <ion-content :fullscreen="true">
            <ion-loading :is-open="loading"></ion-loading>

            <ManageFreights
                itemName="Frete"
                itemsName="Fretes"
                :model="Freight"
                :filterData="filterData"
                :label="freightLabel"
                :subLabel="freightSubLabel"
                :items="freights"
                :addItem="createFreight"
                :showItem="showFreight"
                :editItem="editFreight"
                :removeItem="deleteFreight"
                :loadMoreItems="loadMoreItems"
                :paginationService="paginationService"
                :filterExcludeColumns="FILTER_EXCLUDE_COLUMNS"
                @onFilterConfirm="handleFilterConfirmation"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { onBeforeUnmount, onMounted, reactive, watch, ref } from 'vue';

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
import { useFreightsStore } from '@/store/freights';
import { FilterData } from '@/models/appBaseEntity';
import { formatDateDynamicYear } from '@/utils/date';
import PaginationService from '@/utils/pagination/paginationService';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import ManageFreights from '@/components/Management/MainComponent.vue';

const FILTER_EXCLUDE_COLUMNS = [
    'originLatitude',
    'originLongitude',
    'destinationLatitude',
    'destinationLongitude',
];

const loading = ref(false);

const store = useFreightsStore();

const route = useRoute();
const router = useRouter();

const { loadPaginated, removeFreight, setFilter } = store;

const { freights, filterData } = storeToRefs(store);

const paginationService = reactive(new PaginationService(loadPaginated));

const createFreight = async () => {
    await router.push({ name: 'FreightCreate' });
};

const showFreight = async (freight: Freight) => {
    await router.push({
        name: 'FreightShow',
        params: { freightId: freight.id },
    });
};

const editFreight = async (freight: Freight) => {
    await router.push({
        name: 'FreightEdit',
        params: { freightId: freight.id },
    });
};

const deleteFreight = async (freight: Freight) => {
    await removeFreight(freight.id);

    await paginationService.reset();
};

const loadMoreItems = () => paginationService.getNextPage();

const freightLabel = (freight: Freight) => {
    const startDate = formatDateDynamicYear(new Date(freight.startDate));
    const finishedDate =
        freight.finishedDate &&
        formatDateDynamicYear(new Date(freight.finishedDate));

    return `${freight.cargo} (${startDate} - ${finishedDate || 'andamento'})`;
};

const freightSubLabel = (freight: Freight) => {
    // return `${freight.originCity} (${freight.originState}) --> ${freight.destinationCity} (${freight.destinationState})`;
    return `${freight.originCity} --> ${freight.destinationCity}`;
};

const handleFilterConfirmation = async (filterData: FilterData) => {
    setFilter(filterData);

    await paginationService.reset();
};

const unwatch = watch([route], async (value) => {
    if (value[0].query.reset === 'true') await paginationService.reset();
});

onMounted(async () => {
    try {
        await paginationService.getFirstPage();
    } catch (e) {
        console.error(e);

        presentToast('Falha ao carregar fretes', 'danger');
    } finally {
        loading.value = false;
    }
});

onBeforeUnmount(() => {
    unwatch();
});
</script>
