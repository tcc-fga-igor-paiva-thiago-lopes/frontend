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
                :label="freightLabel"
                :subLabel="freightSubLabel"
                :items="freights"
                :addItem="createFreight"
                :showItem="showFreight"
                :editItem="editItem"
                :removeItem="removeItem"
                :loadMoreItems="loadMoreItems"
                :paginationService="paginationService"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Ref, onMounted, ref } from 'vue';

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
import { formatDateDynamicYear } from '@/utils/date';
import PaginationService from '@/utils/pagination/paginationService';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import ManageFreights from '@/components/Management/MainComponent.vue';

const loading = ref(false);

const store = useFreightsStore();

const router = useRouter();

const { loadPaginated, removeFreight } = store;

const { freights } = storeToRefs(store);

const paginationService: Ref<PaginationService<unknown>> = ref(
    new PaginationService(loadPaginated, 10)
);

const createFreight = async () => {
    await router.push({ name: 'FreightCreate' });
};

const showFreight = async (item: Freight) => {
    await router.push({ name: 'FreightShow', params: { freightId: item.id } });
};

const editItem = async (item: any) => {
    console.log('Edit: ', item);
};

const removeItem = async (item: Freight) => {
    await removeFreight(item.id);
};

const loadMoreItems = () => paginationService.value.getNextPage();

const freightLabel = (item: Freight) => {
    const startDate = formatDateDynamicYear(item.startDate);
    const finishedDate =
        item.finishedDate && formatDateDynamicYear(item.finishedDate);
    const cargoType = item.cargo.charAt(0).toUpperCase() + item.cargo.slice(1);

    return `${cargoType} (${startDate} - ${finishedDate || ''})`;
};

const freightSubLabel = (item: Freight) => {
    // return `${item.originCity} (${item.originState}) --> ${item.destinationCity} (${item.destinationState})`;
    return `${item.originCity} --> ${item.destinationCity}`;
};

onMounted(async () => {
    try {
        await paginationService.value.getFirstPage();
    } catch (e) {
        console.error(e);

        presentToast('Falha ao carregar contas', 'danger');
    } finally {
        loading.value = false;
    }
});
</script>
