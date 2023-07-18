<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Sincronização</ion-title>

                <ConnectionStatus slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <ion-loading :is-open="loading"></ion-loading>

            <ion-card class="ion-margin-bottom">
                <ion-card-header class="flex-direction-column">
                    <div
                        class="display-flex ion-justify-content-between ion-align-items-center"
                    >
                        <div>
                            <ion-text>
                                <h4>
                                    <strong>Sincronizações</strong>
                                </h4>
                            </ion-text>

                            <ion-text v-if="!connectionStatus.connected">
                                <h6 style="font-size: 14px">
                                    Para sincronizar é necessário conexão com a
                                    Internet
                                </h6>
                            </ion-text>
                        </div>

                        <ion-button
                            :disabled="!connectionStatus.connected"
                            @click="handleFullSync"
                        >
                            <ion-icon slot="start" :icon="sync"></ion-icon>
                            Sincronizar
                        </ion-button>
                    </div>

                    <div class="display-flex ion-align-items-center">
                        <ion-text class="ion-margin-end">
                            <h5>
                                <strong>Legenda status</strong>
                            </h5>
                        </ion-text>

                        <ion-icon
                            :icon="informationCircle"
                            size="large"
                            color="primary"
                            id="hover-trigger"
                        ></ion-icon>
                    </div>

                    <ion-popover trigger="hover-trigger" trigger-action="hover">
                        <ion-content class="ion-padding">
                            <div class="display-flex ion-align-items-center">
                                <ion-icon
                                    :icon="checkmarkCircle"
                                    size="large"
                                    color="success"
                                    style="margin-right: 8px"
                                ></ion-icon>

                                Sincronizado com sucesso
                            </div>

                            <div class="display-flex ion-align-items-center">
                                <ion-icon
                                    :icon="alertCircle"
                                    size="large"
                                    color="warning"
                                    style="margin-right: 8px"
                                ></ion-icon>

                                Nada a sincronizar
                            </div>

                            <div class="display-flex ion-align-items-center">
                                <ion-icon
                                    :icon="closeCircle"
                                    size="large"
                                    color="danger"
                                    style="margin-right: 8px"
                                ></ion-icon>

                                Falha ao sincronizar
                            </div>
                        </ion-content>
                    </ion-popover>
                </ion-card-header>

                <ion-card-content class="content">
                    <ion-list>
                        <ion-item
                            button
                            lines="full"
                            v-for="entityData in syncableEntitiesData"
                            :key="entityData.entity.name"
                        >
                            <ion-label text-wrap>
                                <h2>
                                    {{ entityData.entity.FRIENDLY_NAME_PLURAL }}
                                </h2>

                                <p v-html="entityData.lastSyncMessage"></p>
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
                                    v-if="connectionStatus.connected"
                                    @click="
                                        (ev) =>
                                            handleSync(ev, entityData.entity)
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
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

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
    IonPopover,
    IonCardHeader,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonLoading,
    IonCardContent,
    IonicSafeString,
    IonRefresher,
    IonRefresherContent,
    RefresherCustomEvent,
} from '@ionic/vue';

import {
    sync,
    closeCircle,
    alertCircle,
    checkmarkCircle,
    informationCircle,
} from 'ionicons/icons';

import {
    isStatusSuccess,
    isStatusIgnored,
    readLastSyncData,
    SYNCABLE_ENTITIES,
} from '@/services/sync';
import { useAppStore } from '@/store/app';
import { presentToast } from '@/utils/toast';
import { NAME_TO_CLASS } from '@/services/sync';
import { parseISO, formatDatetime } from '@/utils/date';
import { SyncableEntity } from '@/models/syncableEntity';
import { presentAlert, presentConfirmationAlert } from '@/utils/alert';

import ConnectionStatus from '@/components/ConnectionStatus.vue';

type SyncableModel = typeof SyncableEntity;

const loading = ref(false);

const syncableEntitiesData = ref<any[]>([]);

const appStore = useAppStore();

const { syncAll, syncEntity, openLoading, closeLoading } = appStore;

const { connectionStatus } = storeToRefs(appStore);

const ignoredIconStr = `<ion-icon icon="${alertCircle}" color="warning" style="margin: 0 0 0 4px"></ion-icon>`;
const successIconStr = `<ion-icon icon="${checkmarkCircle}" color="success" style="margin: 0 0 0 4px"></ion-icon>`;
const errorIconStr = `<ion-icon icon="${closeCircle}" color="danger" style="margin: 0 0 0 4px"></ion-icon>`;

const handleRefresh = async (event: RefresherCustomEvent) => {
    await updateEntitiesData();

    await event.target.complete();
};

const lastSyncInfoMessage = async (model: SyncableModel) => {
    const data = await readLastSyncData(model.name);

    if (!data) return new IonicSafeString('Nenhuma sincronização...');

    const { syncedAt, statuses } = data;

    const iconStr = isStatusIgnored(statuses)
        ? ignoredIconStr
        : isStatusSuccess(statuses)
        ? successIconStr
        : errorIconStr;

    return new IonicSafeString(
        `Atualizado em: ${formatDatetime(parseISO(syncedAt))} ${iconStr}`
    );
};

const updateEntitiesData = async () => {
    console.log('updateEntitiesData');

    try {
        loading.value = true;

        syncableEntitiesData.value = await Promise.all(
            SYNCABLE_ENTITIES.map(async (entity) => {
                const lastSyncMessage = (await lastSyncInfoMessage(entity))
                    .value;

                return { entity, lastSyncMessage };
            })
        );
    } finally {
        loading.value = false;
    }
};

const handleSync = async (ev: MouseEvent, model: SyncableModel) => {
    ev.stopPropagation();

    if (model.name === 'Account') return handleFullSync();

    const confirmAction = async () => {
        try {
            openLoading(`Sincronizando ${model.FRIENDLY_NAME_PLURAL}...`);

            const [, statuses] = await syncEntity(model);

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
            closeLoading();

            updateEntitiesData();
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
            openLoading('Sincronizando...');

            const result = await syncAll();

            let resultMessage = '';

            Object.entries(result).forEach(([entity, statuses]) => {
                const model = NAME_TO_CLASS[entity];

                if (isStatusIgnored(statuses)) {
                    resultMessage += `${model.FRIENDLY_NAME_PLURAL}: nada a sincronizar ${ignoredIconStr} <br />`;
                } else if (isStatusSuccess(statuses)) {
                    resultMessage += `${model.FRIENDLY_NAME_PLURAL}: sincronizado com sucesso! ${successIconStr} <br />`;
                } else {
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
            await updateEntitiesData();

            closeLoading();
        }
    };

    await presentConfirmationAlert({
        title: 'Sincronizar tudo',
        message: 'Deseja sincronizar todos os dados?',
        confirmClass: 'alert-button-confirm',
        confirmAction,
    });
};

onBeforeRouteUpdate(async () => {
    await updateEntitiesData();
});

onMounted(async () => {
    await updateEntitiesData();
});
</script>
