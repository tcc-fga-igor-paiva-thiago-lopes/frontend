<template>
    <StepperComponent
        :steps="steps"
        :activeStep="step"
        lastStepActionLabel="Criar frete"
        contentPadding="0 0 16px 0"
        @lastStepAction="handleSubmit"
        @changeStep="(newStep) => (step = newStep)"
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
import { ref, toRefs } from 'vue';
import { IonButton } from '@ionic/vue';
import { menu, navigate } from 'ionicons/icons';

import GeneralData from './GeneralData.vue';
import { IFormData } from '@/store/freights';
import LocationInfo from './LocationInfo.vue';
import StepperComponent from '@/components/StepperComponent.vue';

interface IProps {
    formData: IFormData;
}
const props = defineProps<IProps>();

const { formData } = toRefs(props);

const step = ref(0);

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

const emit = defineEmits(['onSubmit', 'onFieldChange']);

const handleFieldChange = (field: string, value: unknown) => {
    emit('onFieldChange', field, value);
};

const handleSubmit = () => {
    emit('onSubmit', formData.value);
};
</script>
