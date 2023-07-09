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
                :formData="newCategory"
                @on-submit="handleFormSubmit"
                :set-attribute="changeField"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

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

import { presentToast } from '@/utils/toast';
import { useCategoriesStore } from '@/store/categories';

import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CategoriesForm from '@/components/Categories/CategoriesForm.vue';

const loading = ref(false);

const router = useRouter();

const store = useCategoriesStore();

const { createCategory, setNewCategoryAttrs } = store;

const { newCategory } = storeToRefs(store);

const handleFormSubmit = async () => {
    try {
        await createCategory();

        await presentToast('Categoria criada com sucesso!', 'success');

        await router.push({ name: 'CategoryIndex', query: { reset: 'true' } });
    } catch (error) {
        console.error(error);

        await presentToast('Falha ao criar categoria', 'danger');
    }
};

const changeField = (field: string, value: unknown) => {
    setNewCategoryAttrs({ [field]: value });
};

onMounted(() => {
    setNewCategoryAttrs({
        color: '#000000 ',
    });
});
</script>
