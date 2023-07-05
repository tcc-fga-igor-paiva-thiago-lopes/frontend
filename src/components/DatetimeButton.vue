<template>
    <ion-datetime-button :datetime="identifier" :disabled="disabled">
        <span slot="date-target" v-if="!value">{{ datePlaceholder }}</span>

        <span slot="time-target" v-if="!value">{{ timePlaceholder }}</span>
    </ion-datetime-button>

    <ion-modal :keep-contents-mounted="true">
        <ion-datetime
            :id="identifier"
            locale="pt-BR"
            :value="value"
            show-clear-button
            clear-text="Limpar"
            done-text="Pronto"
            cancel-text="Cancelar"
            show-default-buttons
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
    datePlaceholder?: string;
    timePlaceholder?: string;
}
const props = withDefaults(defineProps<IProps>(), {
    disabled: false,
    timePlaceholder: 'HH:mm',
    datePlaceholder: 'Clique para selecionar',
});

const { value, disabled, identifier, datePlaceholder, timePlaceholder } =
    toRefs(props);

const emit = defineEmits(['valueChange']);
</script>
