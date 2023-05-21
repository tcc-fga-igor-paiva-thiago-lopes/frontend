<template>
    <ion-datetime-button :datetime="identifier"></ion-datetime-button>

    <ion-modal :keep-contents-mounted="true">
        <ion-datetime
            :id="identifier"
            locale="pt-BR"
            :value="value"
            @ion-change="(e) => emit('valueChange', e)"
        ></ion-datetime>
    </ion-modal>
</template>

<style></style>

<script setup lang="ts">
import { IonModal, IonDatetime, IonDatetimeButton } from '@ionic/vue';

import { toRefs } from 'vue';

interface IProps {
    value: string;
    identifier: string;
}
const props = defineProps<IProps>();

const { value, identifier } = toRefs(props);

const emit = defineEmits(['valueChange']);
</script>
