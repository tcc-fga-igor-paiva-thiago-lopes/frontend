<template>
    <div>
        <ion-text color="medium">
            <h6><strong>Criado em: </strong>{{ createdAt }}</h6>
        </ion-text>

        <ion-text v-if="updatedAt" color="medium">
            <h6><strong>Atualizado em: </strong>{{ updatedAt }}</h6>
        </ion-text>
    </div>

    <div class="display-flex on-align-items-center ion-justify-content-between">
        <ion-button v-if="readonly" color="primary" @click="emit('edit')">
            <ion-icon :icon="pencil" slot="start"></ion-icon>

            Editar
        </ion-button>

        <ion-button v-if="edit" color="primary" @click="emit('view')">
            <ion-icon :icon="eye" slot="start"></ion-icon>

            Visualizar
        </ion-button>

        <ion-button color="danger" @click="emit('remove')">
            <ion-icon :icon="trashSharp" slot="start"></ion-icon>

            Remover
        </ion-button>
    </div>
</template>

<style>
.white-space-pre-line {
    white-space: pre-line;
}
</style>

<script setup lang="ts">
import { IonButton, IonIcon, IonText } from '@ionic/vue';
import { pencil, eye, trashSharp } from 'ionicons/icons';

import { toRefs } from 'vue';

interface IProps {
    edit: boolean;
    readonly: boolean;
    createdAt: string;
    updatedAt: string;
}

const props = defineProps<IProps>();

const { edit, readonly, createdAt, updatedAt } = toRefs(props);

const emit = defineEmits(['view', 'edit', 'remove']);
</script>
