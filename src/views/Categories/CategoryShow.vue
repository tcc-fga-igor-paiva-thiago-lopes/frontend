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
                readonly
                v-if="!!category"
                :formData="category"
                :setAttribute="(field: string, value: unknown) => true"
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
import { onMounted, ref } from 'vue';
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

import { IFormData } from '@/components/Categories';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import CategoriesForm from '@/components/Categories/CategoriesForm.vue';

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const store = useCategoriesStore();

const { findCategory } = store;

const category = ref<IFormData | null>(null);

onMounted(async () => {
    const foundCategory = await findCategory(
        parseInt(route.params.categoryId as string, 10),
        true
    );

    if (!foundCategory) {
        presentToast('Categoria não encontrada', 'danger');

        await router.push({ name: 'CategoriesIndex' });
    }

    category.value = foundCategory as IFormData | null;
});
</script>
