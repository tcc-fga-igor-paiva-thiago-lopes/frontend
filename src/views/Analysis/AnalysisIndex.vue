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

        <ion-content :fullscreen="true">
            <ion-card class="ion-margin-bottom">
                <ion-card-header class="header">
                    <h4>
                        <strong>Indicadores</strong>
                    </h4>
                </ion-card-header>

                <ion-card-content class="content">
                    <ion-list>
                        <ion-item
                            button
                            lines="full"
                            v-for="indicator in indicators"
                            :key="indicator.route"
                            @click="
                                () =>
                                    $router.push({
                                        name: indicator.route,
                                    })
                            "
                        >
                            <ion-label text-wrap>
                                <h2>{{ indicator.label }}</h2>

                                <p v-if="indicator.sublabel">
                                    {{ indicator.sublabel }}
                                </p>
                            </ion-label>

                            <div
                                slot="end"
                                class="ion-justify-content-between ion-align-items-center"
                            >
                                <ion-icon
                                    :icon="eye"
                                    size="large"
                                    color="primary"
                                    title="Sicronizar registros"
                                    @click="
                                        () =>
                                            $router.push({
                                                name: indicator.route,
                                            })
                                    "
                                ></ion-icon>
                            </div>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </ion-page>
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

.alert-custom-class .alert-wrapper {
    --max-width: 90%;
}
</style>

<script setup lang="ts">
import {
    IonIcon,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCardContent,
} from '@ionic/vue';

import { eye } from 'ionicons/icons';

import ConnectionStatus from '@/components/ConnectionStatus.vue';

const indicators = [
    {
        route: 'ProfitPerColumn',
        label: 'Tipo de carga e contratante',
        sublabel: 'Lucro por tipo de carga/contratante',
    },
    {
        route: 'ProfitPerPeriod',
        label: 'Lucro por período',
        sublabel: 'Lucro por mês e ano',
    },
];
</script>
