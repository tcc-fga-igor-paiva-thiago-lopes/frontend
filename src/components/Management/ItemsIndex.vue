<template>
    <ion-list>
        <ion-item
            button
            lines="full"
            v-for="item in items"
            :key="item.id"
            @click="() => showItem(item)"
        >
            <!-- <ion-checkbox slot="start"></ion-checkbox> -->

            <ion-label text-wrap>{{ item[labelField] }}</ion-label>

            <div
                slot="end"
                class="ion-justify-content-between ion-align-items-center"
            >
                <ion-icon
                    :icon="pencil"
                    size="large"
                    color="primary"
                    title="Editar item"
                    style="margin-right: 16px"
                    @click="(ev) => handleEdit(ev, item)"
                ></ion-icon>

                <ion-icon
                    :icon="trash"
                    size="large"
                    color="danger"
                    title="Remover item"
                    @click="(ev) => handleRemoval(ev, item)"
                ></ion-icon>
            </div>
        </ion-item>
    </ion-list>
</template>

<style>
ion-icon:hover {
    opacity: 0.9;
    cursor: pointer;
}

button.alert-button.alert-button-confirm {
    background-color: var(--ion-color-danger);
    color: var(--ion-color-danger-contrast);
}
</style>

<script setup lang="ts">
import { toRefs } from 'vue';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/vue';
import { trash, pencil } from 'ionicons/icons';

interface IProps {
    items: any[];
    itemName: string;
    labelField: string;
    editItem: (item: any) => void;
    showItem: (item: any) => void;
    removeItem: (item: any) => Promise<any>;
}

const props = defineProps<IProps>();

const { items } = toRefs(props);

// eslint-disable-next-line vue/no-setup-props-destructure
const { editItem, removeItem } = props;

const handleEdit = (ev: MouseEvent, item: any) => {
    editItem(item);
    ev.stopPropagation();
};

const handleRemoval = async (ev: MouseEvent, item: any) => {
    await removeItem(item);

    ev.stopPropagation();
};
</script>
