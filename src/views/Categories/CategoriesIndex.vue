<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Categorias</ion-title>

                <ConnectionStatus slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-loading :is-open="loading"></ion-loading>

            <ManageCategories
                itemName="Categoria"
                itemsName="Categorias"
                :model="Category"
                :orderData="orderData"
                :filterData="filterData"
                :label="categoryLabel"
                :items="categories"
                :addItem="createCategory"
                :showItem="showCategory"
                :editItem="editCategory"
                :removeItem="deleteCategory"
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
    IonicSafeString,
} from '@ionic/vue';

import { Category } from '@/models/category';
import { presentToast } from '@/utils/toast';
import { useCategoriesStore } from '@/store/categories';
import { FilterData, IOrderData } from '@/models/appBaseEntity';
import PaginationService from '@/utils/pagination/paginationService';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import ManageCategories from '@/components/Management/MainComponent.vue';

const FILTER_EXCLUDE_COLUMNS = ['color'];

const ORDER_EXCLUDE_COLUMNS = [...FILTER_EXCLUDE_COLUMNS];

const loading = ref(false);

const store = useCategoriesStore();

const route = useRoute();
const router = useRouter();

const { loadPaginated, removeCategory, setFilter, setOrder } = store;

const { categories, filterData, orderData } = storeToRefs(store);

const paginationService = reactive(new PaginationService(loadPaginated));

const createCategory = async () => {
    await router.push({ name: 'CategoryCreate' });
};

const showCategory = async (category: Category) => {
    await router.push({
        name: 'CategoryShow',
        params: { categoryId: category.id },
    });
};

const editCategory = async (category: Category) => {
    await router.push({
        name: 'CategoryEdit',
        params: { categoryId: category.id },
    });
};

const deleteCategory = async (category: Category) => {
    await removeCategory(category.id);

    await paginationService.reset();
};

const loadMoreItems = () => paginationService.getNextPage();

const categoryLabel = (category: Category) => {
    const categoryName =
        category.name.charAt(0).toUpperCase() + category.name.slice(1);

    return new IonicSafeString(`
        <div style="display:flex; align-items: center">
            <div style="width: 24px; height:24px; margin-right:8px; border-radius: 50%; background:${category.color}"></div>
            ${categoryName}
        </div>
    `);
};

const handleFilterConfirmation = async (filterData: FilterData) => {
    setFilter(filterData);

    await paginationService.reset();
};

const handleOrderData = async (orderData: Partial<IOrderData>) => {
    setOrder(orderData);

    await paginationService.reset();
};

const unwatch = watch(
    () => route.query,
    async (value) => {
        if (value.reset === 'true') await paginationService.reset();
    }
);

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
