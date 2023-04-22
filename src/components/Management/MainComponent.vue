<template>
    <ion-card>
        <ion-card-header class="header">
            <div>
                <ion-text>
                    <h4>
                        <strong>{{ itemsName }}</strong>
                    </h4>
                </ion-text>

                <ion-text>
                    <h6 class="results-text">
                        {{
                            `${
                                paginationService.totalResults
                            } ${itemsName.toLowerCase()} encontrados(as)`
                        }}
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
                :labelField="labelField"
                :itemName="itemName"
                :itemsName="itemsName"
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
import { toRefs } from 'vue';
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
    labelField: string;
    paginationService: PaginationService<unknown>;
    addItem: () => void;
    editItem: (item: any) => void;
    showItem: (item: any) => void;
    removeItem: (item: any) => void;
    loadMoreItems: () => Promise<unknown>;
}

const props = defineProps<IProps>();

// eslint-disable-next-line vue/no-setup-props-destructure
const { addItem, removeItem, loadMoreItems } = props;

const { items, itemName, itemsName } = toRefs(props);

const handleRemoval = async (item: any) => {
    await presentConfirmationAlert({
        title: `Remover ${itemName.value}`,
        message: 'Deseja remover este registro?',
        confirmAction: () => removeItem(item),
        confirmClass: 'alert-button-confirm',
    });
};
</script>
