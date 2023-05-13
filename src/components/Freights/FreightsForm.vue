<template>
    <StepperComponent
        :activeStep="step"
        lastStepActionLabel="Criar frete"
        @changeStep="(newStep) => (step = newStep)"
        @lastStepAction="handleSubmit"
        :steps="steps"
    >
        <template v-slot:content>
            <GeneralData
                v-if="step === 0"
                :finished="formData.finished"
                :name="formData.name"
                :description="formData.description"
                :cargoType="formData.cargoType"
                :cargoWeight="formData.cargoWeight"
                :contractor="formData.contractor"
                :agreedPayment="formData.agreedPayment"
                :startDatetime="formData.startDatetime"
                :dueDatetime="formData.dueDatetime"
                :finishedDatetime="formData.finishedDatetime"
                @field-change="handleFieldChange"
            />

            <LocationInfo
                v-if="step === 1"
                :distance="formData.distance"
                :originCountry="formData.originCountry"
                :originCity="formData.originCity"
                :originState="formData.originState"
                :destinationCountry="formData.destinationCountry"
                :destinationCity="formData.destinationCity"
                :destinationState="formData.destinationState"
                @field-change="handleFieldChange"
            />
        </template>

        <template v-if="step === 0" v-slot:backBtn>
            <ion-button color="danger" @click="handleSubmit"
                >Criar frete</ion-button
            >
        </template>
    </StepperComponent>
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
import { ref } from 'vue';
import { IonButton } from '@ionic/vue';
import { menu, navigate } from 'ionicons/icons';

import GeneralData from './GeneralData.vue';
import LocationInfo from './LocationInfo.vue';
import StepperComponent from '@/components/StepperComponent.vue';
import { IFormData } from '.';

const step = ref(0);

const formData = ref<IFormData>({
    finished: false,
    name: '',
    description: '',
    cargoType: '',
    cargoWeight: '',
    contractor: '',
    agreedPayment: '',
    startDatetime: new Date().toISOString(),
    dueDatetime: '',
    finishedDatetime: '',
    distance: '',
    originCountry: 'Brasil',
    originCity: '',
    originState: '',
    destinationCountry: 'Brasil',
    destinationCity: '',
    destinationState: '',
});

const steps = [
    {
        name: 'step_one',
        title: 'Dados gerais',
        subtitle: 'sub title 1',
        icon: menu,
    },
    {
        name: 'step_two',
        title: 'Localização',
        subtitle: 'sub title 2',
        icon: navigate,
    },
];

const emit = defineEmits(['onSubmit']);

const handleFieldChange = (field: string, value: unknown) => {
    formData.value[field] = value;
};

const handleSubmit = () => {
    emit('onSubmit', formData.value);
};
</script>
