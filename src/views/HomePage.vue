<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Página inicial</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ManageAccounts
                labelField="name"
                itemName="Conta"
                itemsName="Contas"
                :items="accounts"
                :addItem="addItem"
                :showItem="showItem"
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
import {
    IonPage,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';

import { Ref, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAccountsStore } from '@/store';

import PaginationService from '@/utils/pagination/paginationService';
import ManageAccounts from '@/components/Management/MainComponent.vue';

const store = useAccountsStore();

const { loadPaginated } = store;

const { accounts } = storeToRefs(store);

const paginationService: Ref<PaginationService<unknown>> = ref(
    new PaginationService(loadPaginated, 13)
);

const addItem = () => {
    console.log('add new item');
};

const showItem = (item: any) => {
    console.log('Show: ', item);
};

const editItem = (item: any) => {
    console.log('Edit: ', item);
};

const removeItem = (item: any) => {
    console.log('Remove: ', item);
};

const loadMoreItems = () => paginationService.value.getNextPage();

onMounted(async () => {
    await paginationService.value.getFirstPage();
});
</script>
