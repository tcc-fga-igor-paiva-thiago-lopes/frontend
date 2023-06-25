<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Sincronização</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-card class="ion-margin-bottom">
                <ion-card-header class="header">
                    <div>
                        <ion-text>
                            <h4>
                                <strong>Sincronizáveis</strong>
                            </h4>
                        </ion-text>
                    </div>

                    <ion-button @click="handleFullSync">
                        <ion-icon slot="start" :icon="sync"></ion-icon>
                        Sincronizar
                    </ion-button>
                </ion-card-header>

                <ion-card-content class="content">
                    <ion-list>
                        <ion-item
                            button
                            lines="full"
                            v-for="entity in syncableEntities"
                            :key="entity.name"
                        >
                            <ion-label text-wrap>
                                <h2>{{ entity.FRIENDLY_NAME_PLURAL }}</h2>
                                <!-- TODO: <p>{{ lastSyncedDate }}</p> -->
                            </ion-label>

                            <div
                                slot="end"
                                class="ion-justify-content-between ion-align-items-center"
                            >
                                <ion-icon
                                    :icon="sync"
                                    size="large"
                                    color="primary"
                                    title="Sicronizar registros"
                                    style="margin-right: 16px"
                                    @click="(ev) => handleSync(ev, entity)"
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
    IonButton,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonText,
    IonCard,
    IonCardHeader,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCardContent,
    IonicSafeString,
} from '@ionic/vue';
import {
    sync,
    checkmarkCircle,
    closeCircle,
    alertCircle,
} from 'ionicons/icons';

import { presentAlert, presentConfirmationAlert } from '@/utils/alert';
import { SyncableEntity } from '@/models/syncableEntity';
import {
    syncAll,
    isStatusSuccess,
    isStatusIgnored,
    getSyncableEntities,
    NAME_TO_SYNC_FUNCTION,
} from '@/services/sync';
import { ref } from 'vue';
import { presentToast } from '@/utils/toast';
import { NAME_TO_CLASS } from '@/services/sync';

type SyncableModel = typeof SyncableEntity;

const loading = ref(false);

const syncableEntities: SyncableModel[] =
    getSyncableEntities() as SyncableModel[];

const handleSync = async (ev: MouseEvent, model: SyncableModel) => {
    ev.stopPropagation();

    const confirmAction = async () => {
        try {
            loading.value = true;

            const [, statuses] = await NAME_TO_SYNC_FUNCTION[model.name](true);

            if (isStatusIgnored(statuses)) {
                await presentToast(
                    `Não há ${model.FRIENDLY_NAME_PLURAL} para atualizar`,
                    'warning'
                );
            } else if (isStatusSuccess(statuses)) {
                await presentToast(
                    `${model.FRIENDLY_NAME_PLURAL} sincronizados com sucesso`,
                    'success'
                );
            } else {
                await presentToast(
                    `Falha ao sincronizar ${model.FRIENDLY_NAME_PLURAL}... Tente novamente`,
                    'danger'
                );
            }
        } finally {
            loading.value = false;
        }
    };

    await presentConfirmationAlert({
        title: `Sincronizar ${model.FRIENDLY_NAME_PLURAL}`,
        message: `Deseja sincronizar os(as) ${model.FRIENDLY_NAME_PLURAL}?`,
        confirmClass: 'alert-button-confirm',
        confirmAction,
    });
};

const handleFullSync = async () => {
    const confirmAction = async () => {
        try {
            loading.value = true;

            const result = await syncAll();

            let resultMessage = '';

            Object.entries(result).forEach(([entity, statuses]) => {
                const model = NAME_TO_CLASS[entity];

                if (isStatusIgnored(statuses)) {
                    const alertIconStr = `<ion-icon icon="${alertCircle}" color="warning" style="margin: 0 0 0 16px"></ion-icon>`;

                    resultMessage += `${model.FRIENDLY_NAME_PLURAL}: nada a sincronizar ${alertIconStr} <br />`;
                } else if (isStatusSuccess(statuses)) {
                    const statusIconStr = `<ion-icon icon="${checkmarkCircle}" color="success" style="margin: 0 0 0 16px"></ion-icon>`;

                    resultMessage += `${model.FRIENDLY_NAME_PLURAL}: sincronizado com sucesso! ${statusIconStr} <br />`;
                } else {
                    const errorIconStr = `<ion-icon icon="${closeCircle}" color="danger" style="margin: 0 0 0 16px"></ion-icon>`;

                    resultMessage += `${model.FRIENDLY_NAME_PLURAL}: falha ao sincronizar... Tente novamente ${errorIconStr} <br />`;
                }
            });

            await presentAlert({
                header: 'Resultado sincronização',
                message: new IonicSafeString(resultMessage),
                cssClass: 'alert-custom-class',
                buttons: ['OK'],
            });
        } finally {
            loading.value = false;
        }
    };

    await presentConfirmationAlert({
        title: 'Sincronização total',
        message: 'Deseja sincronizar todos os dados?',
        confirmClass: 'alert-button-confirm',
        confirmAction,
    });
};
</script>
