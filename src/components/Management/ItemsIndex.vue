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

            <ion-label text-wrap>
                <h2>{{ label(item) }}</h2>
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
                    style="margin-right: 16px"
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
        :disabled="!hasPagination()"
        @ionInfinite="handleInfiniteScroll"
    >
        <ion-infinite-scroll-content
            :loading-text="`Carregando ${itemsName.toLowerCase()}...`"
            loading-spinner="circular"
            class="ion-padding-vertical"
        ></ion-infinite-scroll-content>
    </ion-infinite-scroll>

    <ion-text class="ion-text-center">
        <h5 :class="!hasPagination() ? 'pagination-message' : ''">
            {{ getPaginationMessage() }}
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
import { toRefs } from 'vue';
import {
    IonList,
    IonItem,
    IonIcon,
    IonText,
    IonLabel,
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
    label: (item: any) => string;
    subLabel?: (item: any) => string;
    editItem: (item: any) => void;
    showItem: (item: any) => void;
    removeItem: (item: any) => Promise<any>;
    loadMoreItems: () => Promise<unknown>;
}

const props = defineProps<IProps>();

const { items, itemsName, paginationService } = toRefs(props);

// eslint-disable-next-line vue/no-setup-props-destructure
const { editItem, removeItem, label, subLabel, loadMoreItems } = props;

const hasPagination = () =>
    items.value.length < paginationService.value.totalResults;

const getPaginationMessage = () => {
    const lowerCaseName = itemsName.value.toLowerCase();

    return `Exibindo ${items.value.length} ${lowerCaseName} de ${paginationService.value.totalResults} ${lowerCaseName}`;
};

const handleEdit = (ev: MouseEvent, item: any) => {
    editItem(item);

    ev.stopPropagation();
};

const handleRemoval = async (ev: MouseEvent, item: any) => {
    await removeItem(item);

    ev.stopPropagation();
};

const handleInfiniteScroll = async (ev: IonInfiniteScrollCustomEvent<void>) => {
    await loadMoreItems();

    ev.target.complete();
};
</script>
