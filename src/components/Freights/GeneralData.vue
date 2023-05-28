<template>
    <form class="form">
        <ion-item lines="none">
            <ion-checkbox
                slot="start"
                :value="finished"
                @ionChange="
                    (e) => emit('fieldChange', 'finished', e.target.checked)
                "
            ></ion-checkbox>
            <ion-label>Finalizado?</ion-label>
        </ion-item>

        <ion-item class="form-item" ref="cargoTypeRef">
            <ion-label position="stacked">Tipo de carga *</ion-label>
            <ion-input
                required
                type="text"
                name="cargoType"
                :maxlength="30"
                :value="cargoType"
                placeholder="Digite o tipo de carga deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'cargoType', e.target.value)
                "
            >
            </ion-input>

            <ion-note slot="helper">Tamanho máximo 30 caracteres</ion-note>
        </ion-item>

        <ion-item class="form-item" ref="cargoWeightRef">
            <ion-label position="stacked">Peso carga (Toneladas) *</ion-label>
            <ion-input
                required
                type="number"
                name="cargoWeight"
                inputmode="decimal"
                :value="cargoWeight"
                placeholder="Digite o peso da carga deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'cargoWeight', e.target.value)
                "
            >
            </ion-input>
        </ion-item>

        <ion-item class="form-item" ref="contractorRef">
            <ion-label position="stacked">Contratante *</ion-label>
            <ion-input
                required
                type="text"
                name="contractor"
                :value="contractor"
                :maxlength="60"
                placeholder="Digite o contratante deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'contractor', e.target.value)
                "
            >
            </ion-input>

            <ion-note slot="helper">Tamanho máximo 60 caracteres</ion-note>
        </ion-item>

        <ion-item class="form-item" ref="agreedPaymentRef">
            <ion-label position="stacked">Pagamento acordado (R$) *</ion-label>
            <ion-input
                required
                type="number"
                inputmode="decimal"
                name="agreedPayment"
                :value="agreedPayment"
                placeholder="Digite o pagamento acordado"
                @ionChange="
                    (e) => emit('fieldChange', 'agreedPayment', e.target.value)
                "
            >
            </ion-input>
        </ion-item>

        <ion-item class="form-item" ref="dueDatetimeRef">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data limite</ion-label
            >

            <DatetimeButton
                identifier="dueDatetime"
                :value="dueDatetime"
                @valueChange="
                    (e) => emit('fieldChange', 'dueDatetime', e.target.value)
                "
            />

            <ion-note slot="helper">Data limite acordada para o frete</ion-note>
        </ion-item>

        <ion-item class="form-item" ref="startDatetimeRef">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data de início</ion-label
            >

            <DatetimeButton
                identifier="startDatetime"
                :value="startDatetime"
                @valueChange="
                    (e) => emit('fieldChange', 'startDatetime', e.target.value)
                "
            />
        </ion-item>

        <ion-item class="form-item" ref="finishedDatetimeRef" v-if="finished">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data de conclusão</ion-label
            >

            <DatetimeButton
                identifier="finishedDatetime"
                :value="finishedDatetime"
                @valueChange="
                    (e) =>
                        emit('fieldChange', 'finishedDatetime', e.target.value)
                "
            />
        </ion-item>

        <ion-item class="form-item" ref="descriptionRef">
            <ion-label position="stacked">Descrição *</ion-label>

            <ion-textarea
                required
                type="text"
                inputmode="text"
                name="description"
                :maxlength="500"
                :auto-grow="true"
                :value="description"
                placeholder="Digite uma descrição para este frete"
                @ionChange="
                    (e) => emit('fieldChange', 'description', e.target.value)
                "
            >
            </ion-textarea>

            <ion-note slot="helper">Tamanho máximo 500 caracteres</ion-note>
        </ion-item>
    </form>
</template>

<style>
.form {
    display: flex;
    flex-direction: column;
}

.form-item {
    margin: 8px 0;
}
</style>

<script setup lang="ts">
import {
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonTextarea,
    IonCheckbox,
} from '@ionic/vue';
import { toRefs } from 'vue';

import DatetimeButton from '@/components/DatetimeButton.vue';

interface IProps {
    finished: boolean;
    description: string;
    cargoType: string;
    cargoWeight: string;
    contractor: string;
    agreedPayment: string;
    startDatetime: string;
    dueDatetime: string;
    finishedDatetime: string;
}
const props = defineProps<IProps>();

const {
    finished,
    description,
    cargoType,
    cargoWeight,
    contractor,
    agreedPayment,
    startDatetime,
    dueDatetime,
    finishedDatetime,
} = toRefs(props);

const emit = defineEmits(['fieldChange']);
</script>
