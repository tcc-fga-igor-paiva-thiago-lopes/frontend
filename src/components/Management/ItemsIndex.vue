<template>
    <ion-list>
        <ion-item
            button
            lines="full"
            v-for="item in items"
            :key="item.id"
            @click="(ev) => handleShow(ev, item)"
        >
            <!-- <ion-checkbox slot="start"></ion-checkbox> -->

            <ion-label text-wrap>
                <h2 v-html="getLabel(item)"></h2>

                <p v-if="subLabel">{{ subLabel(item) }}</p>
            </ion-label>

            <div
                slot="end"
                class="ion-justify-content-between ion-align-items-center"
            >
                <ion-icon
                    :icon="pencil"
                    size="large"
                    color="primary"
                    title="Editar item"
                    class="ion-margin-end"
                    @click="(ev) => handleEdit(ev, item)"
                ></ion-icon>

                <ion-icon
                    :icon="trashSharp"
                    size="large"
                    color="danger"
                    title="Remover item"
                    @click="(ev) => handleRemoval(ev, item)"
                ></ion-icon>
            </div>
        </ion-item>
    </ion-list>

    <ion-infinite-scroll
        :disabled="!hasPagination"
        @ionInfinite="handleInfiniteScroll"
    >
        <ion-infinite-scroll-content
            :loading-text="`Carregando ${itemsName.toLowerCase()}...`"
            loading-spinner="circular"
            class="ion-padding-vertical"
        ></ion-infinite-scroll-content>
    </ion-infinite-scroll>

    <ion-text class="ion-text-center">
        <h5 :class="!hasPagination ? 'pagination-message' : ''">
            {{ paginationMessage }}
        </h5>
    </ion-text>
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

.pagination-message {
    margin: 16px auto !important;
}
</style>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import {
    IonList,
    IonItem,
    IonIcon,
    IonText,
    IonLabel,
    IonicSafeString,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
} from '@ionic/vue';
import { trashSharp, pencil } from 'ionicons/icons';
import { IonInfiniteScrollCustomEvent } from '@ionic/core';

import PaginationService from '@/utils/pagination/paginationService';

interface IProps {
    items: any[];
    itemName: string;
    itemsName: string;
    paginationService: PaginationService<unknown>;
    label: (item: any) => IonicSafeString | string;
    subLabel?: (item: any) => string;
    editItem: (item: any) => Promise<void>;
    showItem: (item: any) => Promise<void>;
    removeItem: (item: any) => Promise<any>;
    loadMoreItems: () => Promise<unknown>;
}

const props = defineProps<IProps>();

const { items, itemsName, paginationService } = toRefs(props);

// eslint-disable-next-line vue/no-setup-props-destructure
const { showItem, editItem, removeItem, label, subLabel, loadMoreItems } =
    props;

const hasPagination = computed(
    () => items.value.length < paginationService.value.totalResults
);

const getLabel = (item: any) => {
    const labelValue = label(item);

    return typeof labelValue === 'string' ? labelValue : labelValue.value;
};

const paginationMessage = computed(() => {
    const lowerCaseName = itemsName.value.toLowerCase();

    return `Exibindo ${items.value.length} ${lowerCaseName} de ${paginationService.value.totalResults} ${lowerCaseName}`;
});

const handleShow = async (ev: MouseEvent, item: any) => {
    ev.stopPropagation();

    await showItem(item);
};

const handleEdit = async (ev: MouseEvent, item: any) => {
    ev.stopPropagation();

    await editItem(item);
};

const handleRemoval = async (ev: MouseEvent, item: any) => {
    ev.stopPropagation();

    await removeItem(item);
};

const handleInfiniteScroll = async (ev: IonInfiniteScrollCustomEvent<void>) => {
    await loadMoreItems();

    ev.target.complete();
};
</script>
