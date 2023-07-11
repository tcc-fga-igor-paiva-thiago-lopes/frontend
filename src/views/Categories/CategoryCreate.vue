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
                :name="newCategory.name"
                :color="newCategory.color"
                :setAttribute="changeField"
                @on-submit="handleFormSubmit"
            />
        </ion-content>
    </ion-page>
</template>

<style></style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref } from 'vue';
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

const COLORS = [
    '#4D4D4D',
    '#999999',
    '#FFFFFF',
    '#F44E3B',
    '#FE9200',
    '#FCDC00',
    '#DBDF00',
    '#A4DD00',
    '#68CCCA',
    '#73D8FF',
    '#AEA1FF',
    '#FDA1FF',
    '#333333',
    '#808080',
    '#CCCCCC',
    '#D33115',
    '#E27300',
    '#FCC400',
    '#B0BC00',
    '#68BC00',
    '#16A5A5',
    '#009CE0',
    '#7B64FF',
    '#FA28FF',
    '#000000',
    '#666666',
    '#B3B3B3',
    '#9F0500',
    '#C45100',
    '#FB9E00',
    '#808900',
    '#194D33',
    '#0C797D',
    '#0062B1',
    '#653294',
    '#AB149E',
];

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

onBeforeMount(() => {
    setNewCategoryAttrs({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
});
</script>
