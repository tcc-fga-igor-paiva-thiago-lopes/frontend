<template>
    <form class="form">
        <ion-item lines="none">
            <ion-checkbox
                slot="start"
                :value="fields.finished.value"
                @ionChange="
                    (e) => emit('fieldChange', 'finished', e.target.checked)
                "
            ></ion-checkbox>
            <ion-label>Finalizado?</ion-label>
        </ion-item>

        <ion-item class="form-item" :ref="fields.cargo.ref">
            <ion-label position="stacked">Tipo de carga *</ion-label>
            <ion-input
                required
                type="text"
                name="cargo"
                :maxlength="30"
                :value="fields.cargo.value"
                placeholder="Digite o tipo de carga deste frete"
                @ionChange="(e) => emit('fieldChange', 'cargo', e.target.value)"
            >
            </ion-input>

            <ion-note slot="helper">Tamanho máximo 30 caracteres</ion-note>

            <InputErrorNote
                field="cargo"
                defaultMsg="Tipo de carga inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.cargoWeight.ref">
            <ion-label position="stacked">Peso carga (Toneladas) *</ion-label>
            <ion-input
                required
                type="number"
                name="cargoWeight"
                inputmode="decimal"
                :value="fields.cargoWeight.value"
                placeholder="Digite o peso da carga deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'cargoWeight', e.target.value)
                "
            >
            </ion-input>

            <InputErrorNote
                field="cargoWeight"
                defaultMsg="Peso carga inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.contractor.ref">
            <ion-label position="stacked">Contratante *</ion-label>
            <ion-input
                required
                type="text"
                name="contractor"
                :value="fields.contractor.value"
                :maxlength="60"
                placeholder="Digite o contratante deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'contractor', e.target.value)
                "
            >
            </ion-input>

            <ion-note slot="helper">Tamanho máximo 60 caracteres</ion-note>

            <InputErrorNote
                field="contractor"
                defaultMsg="Contratante inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.agreedPayment.ref">
            <ion-label position="stacked">Pagamento acordado (R$) *</ion-label>
            <ion-input
                required
                type="number"
                inputmode="decimal"
                name="agreedPayment"
                :value="fields.agreedPayment.value"
                placeholder="Digite o pagamento acordado"
                @ionChange="
                    (e) => emit('fieldChange', 'agreedPayment', e.target.value)
                "
            >
            </ion-input>

            <InputErrorNote
                field="agreedPayment"
                defaultMsg="Pagamento acordado inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.dueDatetime.ref">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data limite</ion-label
            >

            <DatetimeButton
                identifier="dueDatetime"
                :value="fields.dueDatetime.value"
                @valueChange="
                    (e) => emit('fieldChange', 'dueDatetime', e.target.value)
                "
            />

            <ion-note slot="helper">Data limite acordada para o frete</ion-note>
        </ion-item>

        <ion-item class="form-item" :ref="fields.startDatetime.ref">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data de início</ion-label
            >

            <DatetimeButton
                identifier="startDatetime"
                :value="fields.startDatetime.value"
                @valueChange="
                    (e) => emit('fieldChange', 'startDatetime', e.target.value)
                "
            />
        </ion-item>

        <ion-item
            class="form-item"
            :ref="fields.finishedDatetime.ref"
            v-if="fields.finished.value"
        >
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data de conclusão</ion-label
            >

            <DatetimeButton
                identifier="finishedDatetime"
                :value="fields.finishedDatetime.value"
                @valueChange="
                    (e) =>
                        emit('fieldChange', 'finishedDatetime', e.target.value)
                "
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.description.ref">
            <ion-label position="stacked">Descrição *</ion-label>

            <ion-textarea
                required
                type="text"
                inputmode="text"
                name="description"
                :maxlength="500"
                :auto-grow="true"
                :value="fields.description.value"
                placeholder="Digite uma descrição para este frete"
                @ionChange="
                    (e) => emit('fieldChange', 'description', e.target.value)
                "
            >
            </ion-textarea>

            <ion-note slot="helper">Tamanho máximo 500 caracteres</ion-note>

            <InputErrorNote
                field="description"
                defaultMsg="Descrição inválida"
                :validationErrors="validationErrors"
            />
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
import { toRefs } from 'vue';

import {
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonTextarea,
    IonCheckbox,
} from '@ionic/vue';

import DatetimeButton from '@/components/DatetimeButton.vue';
import InputErrorNote from '../InputErrorNote.vue';
import { ValidationErrors } from '@/utils/errors';
import { IGeneralDataFields } from '.';

interface IProps {
    fields: IGeneralDataFields;
    validationErrors: ValidationErrors;
}
const props = defineProps<IProps>();

const { fields, validationErrors } = toRefs(props);

const emit = defineEmits(['fieldChange']);
</script>
