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

        <ion-item class="form-item" ref="nameRef">
            <ion-label position="stacked">Nome *</ion-label>
            <ion-input
                required
                name="name"
                type="text"
                :value="name"
                autocomplete="name"
                placeholder="Digite um nome para este frete"
                @ionChange="(e) => emit('fieldChange', 'name', e.target.value)"
            >
            </ion-input>
        </ion-item>

        <ion-item class="form-item" ref="descriptionRef">
            <ion-label position="stacked">Descrição *</ion-label>
            <ion-input
                required
                type="text"
                name="description"
                :value="description"
                placeholder="Digite uma descrição para este frete"
                @ionChange="
                    (e) => emit('fieldChange', 'description', e.target.value)
                "
            >
            </ion-input>
        </ion-item>

        <ion-item class="form-item" ref="cargoTypeRef">
            <ion-label position="stacked">Tipo de carga</ion-label>
            <ion-input
                type="text"
                name="cargoType"
                :value="cargoType"
                placeholder="Digite o tipo de carga deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'cargoType', e.target.value)
                "
            ></ion-input>
        </ion-item>

        <ion-item class="form-item" ref="cargoWeightRef">
            <ion-label position="stacked">Peso carga</ion-label>
            <ion-input
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
            <ion-label position="stacked">Contratante</ion-label>
            <ion-input
                type="text"
                name="contractor"
                :value="contractor"
                placeholder="Digite o contratante deste frete"
                @ionChange="
                    (e) => emit('fieldChange', 'contractor', e.target.value)
                "
            >
            </ion-input>
        </ion-item>

        <ion-item class="form-item" ref="agreedPaymentRef">
            <ion-label position="stacked">Pagamento acordado</ion-label>
            <ion-input
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
import { IonItem, IonLabel, IonInput, IonCheckbox } from '@ionic/vue';
import { toRefs } from 'vue';

import DatetimeButton from '@/components/DatetimeButton.vue';

interface IProps {
    finished: boolean;
    name: string;
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
    name,
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
