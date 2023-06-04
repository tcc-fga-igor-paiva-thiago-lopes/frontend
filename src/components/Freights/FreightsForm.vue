<template>
    <StepperComponent
        :steps="steps"
        :activeStep="step"
        :hideSubmit="readonly"
        lastStepActionLabel="Criar frete"
        contentPadding="0 0 16px 0"
        @lastStepAction="handleSubmit"
        @changeStep="handleStepChange"
    >
        <template v-slot:content>
            <GeneralData
                v-if="step === 0"
                :readonly="readonly"
                :fields="generalDataFields"
                :setAttribute="setAttribute"
                :validationErrors="generalDataValidationErrors"
            />

            <LocationInfo
                v-if="step === 1"
                :readonly="readonly"
                :fields="locationInfoFields"
                :setAttribute="setAttribute"
                :validationErrors="locationInfoValidationErrors"
            />

            <ion-text color="danger" v-if="!!errorMessage">
                <h6>{{ errorMessage }}</h6>
            </ion-text>
        </template>

        <template v-if="edit && step === 0" v-slot:backBtn>
            <ion-button color="danger" @click="handleSubmit">{{
                edit ? 'Editar frete' : 'Criar frete'
            }}</ion-button>
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
import { Ref, computed, ref, toRefs } from 'vue';

import { IonText, IonButton } from '@ionic/vue';
import { menu, navigate } from 'ionicons/icons';

import { Freight } from '@/models/freight';
import GeneralData from './GeneralData.vue';
import LocationInfo from './LocationInfo.vue';
import StepperComponent from '@/components/StepperComponent.vue';
import { IFormData, IGeneralDataFields, ILocationInfoFields } from '.';
import {
    ValidationErrors,
    clearFieldsErrors,
    validateRequiredFields,
} from '@/utils/errors';

interface IProps {
    edit?: boolean;
    readonly?: boolean;
    formData: IFormData;
    setAttribute: (field: string, value: unknown) => void;
}
const props = withDefaults(defineProps<IProps>(), {
    edit: false,
    readonly: false,
});

const { edit, readonly, formData, setAttribute } = toRefs(props);

const emit = defineEmits(['onSubmit']);

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

const step = ref(0);
const errorMessage = ref('');

const cargoRef = ref('');
const finishedRef = ref('');
const cargoWeightRef = ref('');
const contractorRef = ref('');
const agreedPaymentRef = ref('');
const dueDateRef = ref('');
const startDateRef = ref('');
const finishedDateRef = ref('');
const descriptionRef = ref('');

const distanceRef = ref('');
const originCityRef = ref('');
const originStateRef = ref('');
const originCountryRef = ref('');
const destinationCityRef = ref('');
const destinationStateRef = ref('');
const destinationCountryRef = ref('');

const generalDataValidationErrors = ref<ValidationErrors>({});
const locationInfoValidationErrors = ref<ValidationErrors>({});

const generalDataFields = computed<IGeneralDataFields>(() => ({
    finished: {
        value: formData.value.finished,
        ref: finishedRef,
    },
    cargo: {
        value: formData.value.cargo,
        ref: cargoRef,
    },
    cargoWeight: {
        value: formData.value.cargoWeight,
        ref: cargoWeightRef,
    },
    contractor: {
        value: formData.value.contractor,
        ref: contractorRef,
    },
    agreedPayment: {
        value: formData.value.agreedPayment,
        ref: agreedPaymentRef,
    },
    dueDate: {
        value: formData.value.dueDate,
        ref: dueDateRef,
    },
    startDate: {
        value: formData.value.startDate,
        ref: startDateRef,
    },
    finishedDate: {
        value: formData.value.finishedDate,
        ref: finishedDateRef,
    },
    description: {
        value: formData.value.description,
        ref: descriptionRef,
    },
}));

const locationInfoFields = computed<ILocationInfoFields>(() => ({
    distance: {
        value: formData.value.distance,
        ref: distanceRef,
    },
    originCity: {
        value: formData.value.originCity,
        ref: originCityRef,
    },
    originState: {
        value: formData.value.originState,
        ref: originStateRef,
    },
    originCountry: {
        value: formData.value.originCountry,
        ref: originCountryRef,
    },
    destinationCity: {
        value: formData.value.destinationCity,
        ref: destinationCityRef,
    },
    destinationState: {
        value: formData.value.destinationState,
        ref: destinationStateRef,
    },
    destinationCountry: {
        value: formData.value.destinationCountry,
        ref: destinationCountryRef,
    },
}));

const freightRequiredFields = Freight.requiredAttributes();

const validateGeneralData = () => {
    let validFields = true;
    const newValidationErrors = {} as ValidationErrors;
    const fields = Object.keys(generalDataFields.value);

    const requiredFields: Record<string, any> = {};
    const fieldsRefs: Record<string, Ref<any>> = {};

    fields
        .filter((field) => freightRequiredFields.includes(field))
        .forEach((field) => {
            requiredFields[field] = formData.value[field];
            fieldsRefs[field] = generalDataFields.value[field].ref;
        });

    errorMessage.value = '';
    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        requiredFields,
        fieldsRefs
    );

    if (!validFields)
        errorMessage.value = 'Todos os campos com * são obrigatórios';

    generalDataValidationErrors.value = newValidationErrors;

    return validFields;
};

const validateLocationInfo = () => {
    let validFields = true;
    const newValidationErrors = {} as ValidationErrors;
    const fields = Object.keys(locationInfoFields.value);

    const requiredFields: Record<string, any> = {};
    const fieldsRefs: Record<string, Ref<any>> = {};

    fields
        .filter((field) => freightRequiredFields.includes(field))
        .forEach((field) => {
            requiredFields[field] = formData.value[field];
            fieldsRefs[field] = locationInfoFields.value[field].ref;
        });

    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        requiredFields,
        fieldsRefs
    );

    locationInfoValidationErrors.value = newValidationErrors;

    return validFields;
};

const handleStepChange = (newStep: number) => {
    if (step.value == 0 && !validateGeneralData()) return;

    step.value = newStep;
};

const handleSubmit = () => {
    if (edit.value || validateLocationInfo()) {
        emit('onSubmit');
    }
};
</script>
