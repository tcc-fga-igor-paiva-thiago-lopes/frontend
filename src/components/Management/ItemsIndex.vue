<template>
    <ion-list>
        <ion-item
            button
            v-for="item in items"
            :key="item.id"
            @click="() => showItem(item)"
        >
            <ion-label>{{ item[labelField] }}</ion-label>

            <div slot="end">
                <ion-button
                    size="small"
                    id="hover-trigger"
                    title="Visualizar item"
                    @click="() => showItem(item)"
                >
                    <ion-icon slot="icon-only" :icon="eye"></ion-icon>
                </ion-button>

                <ion-button
                    size="small"
                    title="Editar item"
                    @click="() => editItem(item)"
                >
                    <ion-icon slot="icon-only" :icon="pencil"></ion-icon>
                </ion-button>

                <ion-button
                    size="small"
                    title="Remover item"
                    @click="() => handleRemoval(item)"
                >
                    <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                </ion-button>
            </div>
        </ion-item>
    </ion-list>
</template>

<style>
button.alert-button.alert-button-confirm {
    background-color: var(--ion-color-danger);
    color: var(--ion-color-danger-contrast);
}
</style>

<script setup lang="ts">
import { toRefs } from 'vue';
import { IonButton, IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue';
import { eye, trash, pencil } from 'ionicons/icons';
import { presentConfirmationAlert } from '@/utils/alert';

interface IProps {
    items: any[];
    itemName: string;
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
</script>
