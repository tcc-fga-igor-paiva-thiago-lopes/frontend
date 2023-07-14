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
            <ion-loading :is-open="loading"></ion-loading>

            <div
                class="display-flex ion-justify-content-between ion-align-items-center ion-margin-vertical"
            >
                <ion-item class="sort-item">
                    <ion-label position="stacked">Agrupar por</ion-label>

                    <ion-select interface="popover" v-model="groupOption">
                        <IonSelectOption
                            v-for="[option, name] in Object.entries(
                                FILTER_PERIOD_OPTIONS
                            )"
                            :value="option"
                            :key="option"
                            >{{ name }}</IonSelectOption
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

            <ion-segment
                :value="displayMode"
                @ion-change="handleDisplayModeChange"
            >
                <ion-segment-button value="list">
                    <div
                        class="display-flex ion-justify-content-between ion-align-items-center"
                    >
                        <ion-icon
                            :icon="list"
                            class="ion-margin-end"
                            style="width: 24px; height: 24px"
                        ></ion-icon>

                        <ion-label>Lista</ion-label>
                    </div>
                </ion-segment-button>

                <ion-segment-button value="chart">
                    <div
                        class="display-flex ion-justify-content-between ion-align-items-center"
                    >
                        <ion-icon
                            :icon="barChart"
                            class="ion-margin-end"
                            style="width: 24px; height: 24px"
                        ></ion-icon>

                        <ion-label>Gráfico</ion-label>
                    </div>
                </ion-segment-button>
            </ion-segment>

            <div>
                <ion-text>
                    <h5>
                        <strong>Lucro por {{ groupOptionFriendlyName }}</strong>
                    </h5>
                </ion-text>

                <template v-if="displayMode === 'list'">
                    <ion-list>
                        <ion-item
                            v-for="data in queryData"
                            :key="data[groupOption]"
                        >
                            <ion-label text-wrap>
                                <h2>{{ data[groupOption] }}</h2>

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
                </template>

                <canvas
                    id="chartCanvas"
                    ref="chartRef"
                    :style="{ display: displayMode === 'chart' ? '' : 'none' }"
                ></canvas>
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
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import { ScreenOrientation } from '@capacitor/screen-orientation';
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
    IonLoading,
    IonSegment,
    IonSegmentButton,
    SegmentChangeEventDetail,
} from '@ionic/vue';
import { sync, list, barChart } from 'ionicons/icons';
import { IonSegmentCustomEvent } from '@ionic/core';

import { useAppStore } from '@/store/app';
import { brazilFormatter } from '@/utils/currency';
import { Freight, IProfitPerPeriodResult } from '@/models/freight';

import DateRange from '@/components/Analysis/DateRange.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';

Chart.register(...registerables);

const FILTER_PERIOD_OPTIONS = {
    month: 'Mês',
    year: 'Ano',
};

const appStore = useAppStore();

const { platform } = storeToRefs(appStore);

const route = useRoute();

const loading = ref(false);

const startDate = ref('');
const endDate = ref('');
const groupOption = ref<'month' | 'year'>('month');
const displayMode = ref<'list' | 'chart'>('list');

const chart = ref<Chart | null>(null);
const chartRef = ref<Element | null>(null);

const queryData = ref<IProfitPerPeriodResult[]>([]);

const groupOptionFriendlyName = computed(
    () => FILTER_PERIOD_OPTIONS[groupOption.value]
);

const generateChart = () => {
    const style = getComputedStyle(document.body);

    chart.value?.destroy();

    chart.value = new Chart(chartRef.value as any, {
        type: 'line',
        data: {
            labels: queryData.value.map((item) => item[groupOption.value]),
            datasets: [
                {
                    label: 'Lucro',
                    data: queryData.value.map((item) => item.total),
                    borderColor: style.getPropertyValue('--ion-color-primary'),
                },
            ],
        },
        options: {
            responsive: true,
        },
    });
};

const handleDisplayModeChange = async (
    event: IonSegmentCustomEvent<SegmentChangeEventDetail>
) => {
    loading.value = true;

    const value = event.target.value as 'list' | 'chart';

    displayMode.value = value;

    try {
        if (value === 'chart') {
            if (platform.value !== 'web')
                await ScreenOrientation.lock({ orientation: 'landscape' });
        } else {
            if (platform.value !== 'web') await ScreenOrientation.unlock();
        }
    } finally {
        loading.value = false;
    }
};

const queryResults = async () => {
    loading.value = true;

    try {
        queryData.value = await Freight.profitPerPeriod(
            groupOption.value,
            startDate.value,
            endDate.value
        );

        generateChart();
    } finally {
        loading.value = false;
    }
};

const unwatchColumn = watch([groupOption], async () => {
    await queryResults();
});

const unwatchRoute = watch([route], async () => {
    if (route.name !== 'ProfitPerPeriod') {
        ScreenOrientation.unlock();

        displayMode.value = 'list';
    } else {
        await queryResults();
    }
});

onMounted(async () => {
    await queryResults();
});

onBeforeUnmount(() => {
    unwatchColumn();
    unwatchRoute();

    ScreenOrientation.unlock();
});
</script>
