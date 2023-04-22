<template>
    <ion-card>
        <ion-card-header class="header">
            <ion-text>
                <h4>{{ itemsName }}</h4>
            </ion-text>

            <ion-button @click="addNewItem">
                <ion-icon slot="start" :icon="add"></ion-icon>
                Adicionar
            </ion-button>
        </ion-card-header>

        <ion-card-content class="content">
            <ItemsIndex
                :items="items"
                :labelField="labelField"
                :itemName="itemName"
                :showItem="showItem"
                :editItem="editItem"
                :removeItem="handleRemoval"
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

interface IProps {
    items: any[];
    itemName: string;
    itemsName: string;
    labelField: string;
    editItem: (item: any) => void;
    showItem: (item: any) => void;
    removeItem: (item: any) => void;
}

const props = defineProps<IProps>();

// eslint-disable-next-line vue/no-setup-props-destructure
const { removeItem } = props;

const { items, itemName } = toRefs(props);

const handleRemoval = async (item: any) => {
    await presentConfirmationAlert({
        title: `Remover ${itemName.value}`,
        message: 'Deseja remover este registro?',
        confirmAction: () => removeItem(item),
        confirmClass: 'alert-button-confirm',
    });
};

const addNewItem = async () => {
    console.log('addNewItem');
};
</script>
