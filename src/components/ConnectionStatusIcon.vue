<template>
    <div
        class="connection-status"
        :title="connectionStatus.connected ? 'Conectado' : 'Desconectado'"
        :style="`background-color: ${
            connectionStatus.connected
                ? 'var(--ion-color-success)'
                : 'var(--ion-color-medium)'
        }`"
    ></div>
</template>

<style>
.connection-status {
    width: 16px;
    height: 16px;
    margin-right: 16px;
    border-radius: 50%;
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/store/app';

const { connectionStatus } = storeToRefs(useAppStore());
</script>
