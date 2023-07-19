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

        <ion-content :fullscreen="true" class="ion-padding-horizontal">
            <ion-loading :is-open="loading"></ion-loading>

            <CategoriesForm
                v-if="!!categoryFound"
                edit
                :formData="editCategory"
                :setAttribute="changeField"
                @on-submit="handleFormSubmit"
            />

            <ion-text
                v-else
                color="danger"
                class="ion-margin-top ion-text-center"
            >
                <h5>Categoria não encontrado</h5>
            </ion-text>
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
    IonPage,
    IonText,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonLoading,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';

import { presentToast } from '@/utils/toast';
import { useCategoriesStore } from '@/store/categories';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CategoriesForm from '@/components/Categories/CategoriesForm.vue';

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const store = useCategoriesStore();

const { findEditCategory, setEditCategoryAttrs, updateCategory } = store;

const { editCategory } = storeToRefs(store);

const categoryFound = ref(false);

const categoryId = computed(() =>
    parseInt(route.params.categoryId as string, 10)
);

onMounted(async () => {
    categoryFound.value = await findEditCategory(categoryId.value);

    if (!categoryFound.value) {
        presentToast('Categoria não encontrada', 'danger');

        await router.push({ name: 'CategoriesIndex' });
    }
});

const changeField = (field: string, value: unknown) => {
    setEditCategoryAttrs({ [field]: value });
};

const handleFormSubmit = async () => {
    try {
        await updateCategory(categoryId.value);

        await presentToast('Categoria editada com sucesso!', 'success');

        await router.push({
            name: 'CategoriesIndex',
            query: { reset: 'true' },
        });
    } catch (error) {
        console.error(error);

        await presentToast('Falha ao editar categoria', 'danger');
    }
};
</script>
