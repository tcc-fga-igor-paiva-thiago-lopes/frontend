<template>
    <ion-card class="ion-margin-bottom">
        <ion-card-header class="header">
            <div>
                <ion-text>
                    <h4>
                        <strong>{{ itemsName }}</strong>
                    </h4>
                </ion-text>

                <ion-text>
                    <h6 class="results-text">
                        {{ resultsText }}
                    </h6>
                </ion-text>
            </div>

            <ion-button @click="addItem">
                <ion-icon slot="start" :icon="add"></ion-icon>
                Adicionar
            </ion-button>
        </ion-card-header>

        <ion-card-content class="content">
            <ItemsIndex
                :items="items"
                :itemName="itemName"
                :itemsName="itemsName"
                :label="label"
                :subLabel="subLabel"
                :showItem="showItem"
                :editItem="editItem"
                :removeItem="handleRemoval"
                :loadMoreItems="loadMoreItems"
                :paginationService="paginationService"
            />
        </ion-card-content>
    </ion-card>
</template>

<style>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.results-text {
    font-size: 14px;
}

.content {
    padding: 8px;
}
</style>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import {
    IonButton,
    IonIcon,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardContent,
} from '@ionic/vue';
import { add } from 'ionicons/icons';
import { presentConfirmationAlert } from '@/utils/alert';

import ItemsIndex from '@/components/Management/ItemsIndex.vue';
import PaginationService from '@/utils/pagination/paginationService';

interface IProps {
    items: any[];
    itemName: string;
    itemsName: string;
    paginationService: PaginationService<unknown>;
    label: (item: any) => string;
    subLabel?: (item: any) => string;
    addItem: () => void;
    editItem: (item: any) => Promise<void>;
    showItem: (item: any) => Promise<void>;
    removeItem: (item: any) => Promise<void>;
    loadMoreItems: () => Promise<unknown>;
}

const props = defineProps<IProps>();

// eslint-disable-next-line vue/no-setup-props-destructure
const { addItem, removeItem, label, subLabel, loadMoreItems } = props;

const { items, itemName, itemsName, paginationService } = toRefs(props);

const resultsText = computed(() => {
    const totalResults = paginationService.value.totalResults;

    return `${totalResults} ${itemsName.value.toLowerCase()} encontrados(as)`;
});

const handleRemoval = async (item: any) => {
    await presentConfirmationAlert({
        title: `Remover ${itemName.value}`,
        message: 'Deseja remover este registro?',
        confirmAction: () => removeItem(item),
        confirmClass: 'alert-button-confirm',
    });
};
</script>
