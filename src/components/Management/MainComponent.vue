<template>
    <ion-card class="ion-margin-bottom">
        <ion-card-header>
            <div
                class="display-flex ion-justify-content-between ion-align-items-center"
            >
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
            </div>

            <div
                class="display-flex ion-justify-content-between ion-align-items-center"
            >
                <ion-text>
                    <h6 class="results-text">
                        {{ filtersText }}
                    </h6>
                </ion-text>

                <ion-button @click="setFilterModalOpened(true)">
                    <ion-icon slot="start" :icon="funnel"></ion-icon>
                    Filtrar
                </ion-button>
            </div>
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

            <FilterModal
                :model="model"
                :opened="filterOpened"
                :setOpen="setFilterModalOpened"
                :toExcludeColumns="filterExcludeColumns"
                @onConfirm="(filterData) => emit('onFilterConfirm', filterData)"
            />
        </ion-card-content>
    </ion-card>
</template>

<style>
.results-text {
    font-size: 14px;
}

.content {
    padding: 8px;
}
</style>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import {
    IonButton,
    IonIcon,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardContent,
} from '@ionic/vue';
import { add, funnel } from 'ionicons/icons';
import { presentConfirmationAlert } from '@/utils/alert';

import { AppBaseEntity, FilterData } from '@/models/appBaseEntity';
import PaginationService from '@/utils/pagination/paginationService';

import FilterModal from './FilterModal.vue';
import ItemsIndex from '@/components/Management/ItemsIndex.vue';

interface IProps {
    items: any[];
    itemName: string;
    itemsName: string;
    filterData: FilterData;
    model: typeof AppBaseEntity;
    filterExcludeColumns: string[];
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

const {
    model,
    items,
    itemName,
    itemsName,
    filterData,
    paginationService,
    filterExcludeColumns,
} = toRefs(props);

const emit = defineEmits(['onFilterConfirm']);

const filterOpened = ref(false);

const resultsText = computed(() => {
    const totalResults = paginationService.value.totalResults;

    return `${totalResults} ${itemsName.value.toLowerCase()} encontrados(as)`;
});

const filtersText = computed(() => {
    const totalFilters = Object.values(filterData.value).filter(
        ({ active }) => !!active
    ).length;

    return totalFilters
        ? `${totalFilters} filtro(s) aplicado(s)`
        : 'Nenhum filtro aplicado';
});

const setFilterModalOpened = (value: boolean) => {
    filterOpened.value = value;
};

const handleRemoval = async (item: any) => {
    await presentConfirmationAlert({
        title: `Remover ${itemName.value}`,
        message: 'Deseja remover este registro?',
        confirmAction: () => removeItem(item),
        confirmClass: 'alert-button-confirm',
    });
};
</script>
