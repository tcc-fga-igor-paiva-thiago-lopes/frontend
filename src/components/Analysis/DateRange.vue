<template>
    <ion-accordion-group>
        <ion-accordion value="first">
            <ion-item slot="header" color="light">
                <ion-label>Intervalo de datas</ion-label>
            </ion-item>

            <div style="padding: 0 8px" slot="content">
                <ion-text color="medium">
                    <p v-if="helperText" style="font-size: 12px">
                        {{ helperText }}
                    </p>
                </ion-text>

                <ion-item class="ion-margin-top">
                    <ion-label position="stacked" style="margin-bottom: 16px"
                        >Data de início</ion-label
                    >

                    <DatetimeButton
                        identifier="cargo-start-date"
                        :value="startDate"
                        @valueChange="
                            (e) => emit('onStartChange', e.target.value)
                        "
                    />

                    <ion-note slot="helper">
                        {{ startHelperText }}
                    </ion-note>
                </ion-item>

                <ion-item class="ion-margin-top">
                    <ion-label position="stacked" style="margin-bottom: 16px"
                        >Data final</ion-label
                    >

                    <DatetimeButton
                        identifier="cargo-end-date"
                        :value="endDate"
                        @valueChange="
                            (e) => emit('onEndChange', e.target.value)
                        "
                    />

                    <ion-note slot="helper">
                        {{ endHelperText }}
                    </ion-note>
                </ion-item>
            </div>
        </ion-accordion>
    </ion-accordion-group>
</template>

<style>
.divider-line {
    margin: 16px 0;
    background: var(--ion-color-medium);
}
</style>

<script setup lang="ts">
import { toRefs } from 'vue';

import {
    IonText,
    IonNote,
    IonItem,
    IonLabel,
    IonAccordion,
    IonAccordionGroup,
} from '@ionic/vue';

import DatetimeButton from '../DatetimeButton.vue';

interface IProps {
    helperText?: string;
    endHelperText: string;
    startHelperText: string;
    startDate?: string | null;
    endDate?: string | null;
}

const props = defineProps<IProps>();

const { helperText, endHelperText, startHelperText } = toRefs(props);

const emit = defineEmits(['onStartChange', 'onEndChange']);
</script>
