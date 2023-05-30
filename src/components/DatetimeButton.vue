<template>
    <ion-datetime-button
        :datetime="identifier"
        :disabled="disabled"
    ></ion-datetime-button>

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
    identifier: string;
    disabled?: boolean;
    value?: string | null;
}
const props = withDefaults(defineProps<IProps>(), { disabled: false });

const { value, disabled, identifier } = toRefs(props);

const emit = defineEmits(['valueChange']);
</script>
