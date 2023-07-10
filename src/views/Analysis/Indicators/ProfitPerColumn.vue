<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Indicadores</ion-title>

                <ConnectionStatus slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <div
                class="display-flex ion-justify-content-between ion-align-items-center ion-margin-vertical"
            >
                <ion-item class="sort-item">
                    <ion-label position="stacked">Agrupar por</ion-label>

                    <ion-select interface="popover" v-model="column">
                        <IonSelectOption
                            v-for="column in FILTER_COLUMNS"
                            :value="column"
                            :key="column"
                            >{{
                                Freight.FRIENDLY_COLUMN_NAMES[column]
                            }}</IonSelectOption
                        >
                    </ion-select>
                </ion-item>

                <ion-button @click="queryResults()">
                    <ion-icon slot="start" :icon="sync"></ion-icon>
                    Atualizar
                </ion-button>
            </div>

            <DateRange
                :startDate="startDate"
                :endDate="endDate"
                @on-end-change="(value) => (endDate = value)"
                @on-start-change="(value) => (startDate = value)"
                helperText="Com nenhuma data selecionada todos os fretes finalizados são considerados"
                startHelperText="Selecionar apenas essa data irá considerar todos os fretes finalizados a partir dela até hoje"
                endHelperText="Selecionar apenas essa data irá considerar todos os fretes finalizados antes dela"
            />

            <hr class="divider-line" />

            <div>
                <ion-text>
                    <h5>
                        <strong>Lucro por {{ columnFriendlyName }}</strong>
                    </h5>
                </ion-text>

                <ion-list>
                    <ion-item v-for="data in profitPerColumn" :key="data.cargo">
                        <ion-label text-wrap>
                            <h2>{{ data[column] }}</h2>

                            <p>
                                Total de fretes:
                                {{ data.num }}
                            </p>
                        </ion-label>

                        <span slot="end">{{
                            brazilFormatter.format(data.total)
                        }}</span>
                    </ion-item>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<style>
.divider-line {
    margin: 16px 0;
    background: var(--ion-color-medium);
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import {
    IonIcon,
    IonText,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonSelect,
    IonSelectOption,
} from '@ionic/vue';

import { sync } from 'ionicons/icons';

import { brazilFormatter } from '@/utils/currency';
import { Freight, IProfitPerCargoResult } from '@/models/freight';

import DateRange from '@/components/Analysis/DateRange.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';

const FILTER_COLUMNS = ['cargo', 'contractor'];

const loading = ref(false);

const startDate = ref('');
const endDate = ref('');
const column = ref('cargo');

const profitPerColumn = ref<IProfitPerCargoResult[]>([]);

const columnFriendlyName = computed(() =>
    Freight.FRIENDLY_COLUMN_NAMES[column.value].toLowerCase()
);

const queryResults = async () => {
    loading.value = true;

    try {
        profitPerColumn.value = await Freight.profitPerColumn(
            column.value,
            startDate.value,
            endDate.value
        );
    } finally {
        loading.value = false;
    }
};

const unwatch = watch([column], async () => {
    await queryResults();
});

onMounted(async () => {
    await queryResults();
});

onBeforeUnmount(() => {
    unwatch();
});
</script>
