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
                class="display-flex ion-justify-content-between ion-margin-vertical"
            >
                <ion-text>
                    <h5>
                        <strong>Tipo de carga</strong>
                    </h5>
                </ion-text>

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
                        <strong>Lucro por tipo de carga</strong>
                    </h5>
                </ion-text>

                <ion-list>
                    <ion-item v-for="data in profitPerCargo" :key="data.cargo">
                        <ion-label text-wrap>
                            <h2>{{ data.cargo }}</h2>

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
import { onMounted, ref } from 'vue';

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
} from '@ionic/vue';

import { sync } from 'ionicons/icons';

import { brazilFormatter } from '@/utils/currency';
import { Freight, ProfitPerCargoResult } from '@/models/freight';

import DateRange from '@/components/Analysis/DateRange.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';

const loading = ref(false);

const startDate = ref('');
const endDate = ref('');

const profitPerCargo = ref<ProfitPerCargoResult[]>([]);

const queryResults = async () => {
    console.log('startDate: ', startDate.value);

    loading.value = true;

    try {
        profitPerCargo.value = await Freight.profitPerCargo(
            startDate.value,
            endDate.value
        );

        console.log('result: ', profitPerCargo.value);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await queryResults();
});
</script>
