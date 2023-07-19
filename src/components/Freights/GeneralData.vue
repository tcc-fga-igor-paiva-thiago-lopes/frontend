<template>
    <form class="form">
        <ion-item class="form-item" :ref="fields.status.ref">
            <ion-label position="stacked">Status *</ion-label>

            <ion-select
                ok-text="OK"
                cancel-text="Fechar"
                name="status"
                interface="popover"
                placeholder="Selecione o status deste frete"
                :disabled="readonly"
                :value="fields.status.value"
                :interface-options="{ cssClass: 'alert-custom-class' }"
                @ionChange="(e) => setAttribute('status', e.target.value)"
            >
                <IonSelectOption
                    v-for="freightStatus in freightStatuses"
                    :value="freightStatus"
                    :key="freightStatus"
                    >{{ freightStatus }}</IonSelectOption
                >
            </ion-select>

            <InputErrorNote
                field="status"
                defaultMsg="Status inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.cargo.ref">
            <ion-label position="stacked">Tipo de carga *</ion-label>

            <ion-select
                ok-text="OK"
                cancel-text="Fechar"
                name="cargo"
                interface="action-sheet"
                placeholder="Selecione o tipo de carga deste frete"
                :disabled="readonly"
                :value="fields.cargo.value"
                :interface-options="{
                    cssClass: 'action-sheet-custom-class',
                }"
                @ionChange="(e) => setAttribute('cargo', e.target.value)"
            >
                <IonSelectOption
                    v-for="cargoType in cargoTypes"
                    :value="cargoType"
                    :key="cargoType"
                    >{{ cargoType }}</IonSelectOption
                >
            </ion-select>

            <InputErrorNote
                field="cargo"
                defaultMsg="Tipo de carga inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.contractor.ref">
            <ion-label position="stacked">Contratante *</ion-label>
            <ion-input
                required
                type="text"
                name="contractor"
                :maxlength="60"
                :readonly="readonly"
                :value="fields.contractor.value"
                placeholder="Digite o contratante deste frete"
                @ionChange="(e) => setAttribute('contractor', e.target.value)"
            >
            </ion-input>

            <ion-note v-if="!readonly" slot="helper"
                >Tamanho máximo 60 caracteres</ion-note
            >

            <InputErrorNote
                field="contractor"
                defaultMsg="Contratante inválido"
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
                :readonly="readonly"
                :value="fields.cargoWeight.value"
                placeholder="Digite o peso da carga deste frete"
                @ionChange="(e) => setAttribute('cargoWeight', e.target.value)"
            >
            </ion-input>

            <InputErrorNote
                field="cargoWeight"
                defaultMsg="Peso carga inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" v-if="!readonly">
            <ion-checkbox slot="start" v-model="isPaymentPerTon"></ion-checkbox>

            <ion-label>Valor por tonelada?</ion-label>

            <ion-note slot="helper">Marque se o valor é por tonelada</ion-note>
        </ion-item>

        <ion-item class="form-item" :ref="fields.agreedPayment.ref">
            <ion-label position="stacked">
                Pagamento {{ paymentType }} (R$) *
            </ion-label>

            <ion-input
                required
                type="number"
                inputmode="decimal"
                name="agreedPayment"
                v-model="agreedPayment"
                :readonly="readonly"
                :value="fields.agreedPayment.value"
                :placeholder="`Digite o pagamento ${paymentType}`"
            >
            </ion-input>

            <ion-note
                slot="helper"
                v-if="agreedPayment && fields.cargoWeight.value"
            >
                {{ paymentHelperText }}
            </ion-note>

            <InputErrorNote
                field="agreedPayment"
                defaultMsg="Pagamento acordado inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.dueDate.ref">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data limite</ion-label
            >

            <DatetimeButton
                identifier="dueDate"
                :disabled="readonly"
                :value="fields.dueDate.value"
                @valueChange="(e) => setAttribute('dueDate', e.target.value)"
            />

            <ion-note v-if="!readonly" slot="helper"
                >Data limite acordada para o frete</ion-note
            >

            <InputErrorNote
                field="dueDate"
                defaultMsg="Data limite inválida"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.startDate.ref">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data de início *</ion-label
            >

            <DatetimeButton
                identifier="startDate"
                :disabled="readonly"
                :value="fields.startDate.value"
                @valueChange="(e) => setAttribute('startDate', e.target.value)"
            />

            <InputErrorNote
                field="startDate"
                defaultMsg="Data de início inválida"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" :ref="fields.finishedDate.ref">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data de conclusão</ion-label
            >

            <DatetimeButton
                identifier="finishedDate"
                :value="fields.finishedDate.value"
                :disabled="
                    readonly || fields.status.value !== FreightStatus.FINISHED
                "
                @valueChange="
                    (e) => setAttribute('finishedDate', e.target.value)
                "
            />

            <ion-note v-if="!readonly" slot="helper"
                >Só pode ser alterado se o frete estiver finalizado</ion-note
            >

            <InputErrorNote
                field="finishedDate"
                defaultMsg="Data de conclusão inválida"
                :validationErrors="validationErrors"
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
                :readonly="readonly"
                :value="fields.description.value"
                placeholder="Digite uma descrição para este frete"
                @ionChange="(e) => setAttribute('description', e.target.value)"
            >
            </ion-textarea>

            <ion-note v-if="!readonly" slot="helper"
                >Tamanho máximo 500 caracteres</ion-note
            >

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

.alert-custom-class .alert-wrapper {
    width: 100%;
}

.action-sheet-custom-class .action-sheet-cancel {
    background: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast);
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRefs, watch } from 'vue';

import {
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonSelect,
    IonCheckbox,
    IonTextarea,
    IonSelectOption,
} from '@ionic/vue';

import { FreightCargo, FreightStatus } from '@/models/freight';
import DatetimeButton from '@/components/DatetimeButton.vue';
import InputErrorNote from '../InputErrorNote.vue';
import { brazilFormatter } from '@/utils/currency';
import { ValidationErrors } from '@/utils/errors';
import { formatISO } from '@/utils/date';
import { IGeneralDataFields } from '.';

interface IProps {
    readonly?: boolean;
    fields: IGeneralDataFields;
    validationErrors: ValidationErrors;
    setAttribute: (field: string, value: unknown) => void;
}
const props = defineProps<IProps>();

const { fields, readonly, validationErrors, setAttribute } = toRefs(props);

const isPaymentPerTon = ref(false);

const agreedPayment = ref(fields.value.agreedPayment.value);

const cargoTypes = Object.values(FreightCargo);

const freightStatuses = Object.values(FreightStatus);

const paymentType = computed(() =>
    isPaymentPerTon.value ? 'por tonelada' : 'total'
);

const paymentHelperText = computed(() => {
    const inputPayment = parseFloat(agreedPayment.value);
    const weight = parseFloat(fields.value.cargoWeight.value);

    const displayValue = isPaymentPerTon.value
        ? Math.round(inputPayment * weight * 100) / 100
        : Math.round((inputPayment / weight) * 100) / 100;

    return `Valor ${
        isPaymentPerTon.value ? 'total' : 'por tonelada'
    }: ${brazilFormatter.format(displayValue)}`;
});

const unwatchPaymentData = watch(
    [isPaymentPerTon, agreedPayment, fields],
    (values) => {
        const [isPaymentPerTon, inputPayment, fields] = values;

        if (inputPayment && fields.cargoWeight.value) {
            const payment = parseFloat(inputPayment);
            const weight = parseFloat(fields.cargoWeight.value);

            const totalPayment = isPaymentPerTon
                ? Math.round(payment * weight * 100) / 100
                : inputPayment;

            setAttribute.value('agreedPayment', `${totalPayment}`);
        }
    }
);

const unwatchStatus = watch(
    () => fields.value.status.value,
    (newStatus) => {
        console.log('watchEffect status');

        if (newStatus === FreightStatus.FINISHED) {
            setAttribute.value('finishedDate', formatISO(new Date()));
        } else {
            setAttribute.value('finishedDate', '');
        }
    }
);

onBeforeUnmount(() => {
    unwatchStatus();
    unwatchPaymentData();
});
</script>
