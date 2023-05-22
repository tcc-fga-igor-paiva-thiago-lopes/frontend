<template>
    <div
        v-if="type === 'icon'"
        :title="statusText"
        :class="`status-icon ${statusClass}`"
    ></div>

    <ion-chip v-else :class="statusClass">
        <ion-label>
            {{ statusText }}
        </ion-label>
    </ion-chip>
</template>

<style>
.status-icon {
    width: 16px;
    height: 16px;
    margin-right: 16px;
    border-radius: 50%;
}

.connected {
    color: var(--ion-color-success-contrast);
    background-color: var(--ion-color-success);
}

.disconnected {
    color: var(--ion-color-medium-contrast);
    background-color: var(--ion-color-medium);
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';
import { IonChip, IonLabel } from '@ionic/vue';

import { useAppStore } from '@/store/app';

interface IProps {
    type: 'icon' | 'chip';
}

const props = withDefaults(defineProps<IProps>(), { type: 'icon' });

const { type } = toRefs(props);

const { connectionStatus } = storeToRefs(useAppStore());

const statusText = computed(() =>
    connectionStatus.value.connected ? 'Conectado' : 'Desconectado'
);

const statusClass = computed(() =>
    connectionStatus.value.connected ? 'connected' : 'disconnected'
);
</script>
