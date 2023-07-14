<template>
    <form class="form ion-padding">
        <ion-item ref="nameRef" class="form-item">
            <ion-label position="stacked">Nome *</ion-label>

            <ion-input
                required
                name="name"
                autocomplete="name"
                :readonly="readonly"
                :value="formData.name"
                @ion-change="(ev) => setAttribute('name', ev.target.value)"
                placeholder="Digite o nome da categoria"
            >
            </ion-input>

            <InputErrorNote
                field="name"
                defaultMsg="Nome inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" ref="colorRef">
            <ion-label position="stacked" style="margin-bottom: 8px"
                >Cor *</ion-label
            >
            <div
                v-if="readonly"
                class="color-item"
                :style="{ background: formData.color }"
            ></div>

            <Compact
                v-else
                :modelValue="formData.color"
                @update:model-value="(e) => setAttribute('color', e.hex)"
            />

            <InputErrorNote
                field="color"
                defaultMsg="Cor inválida"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-text color="danger" v-if="!!errorMessage">
            <h6>{{ errorMessage }}</h6>
        </ion-text>

        <ion-button shape="round" @click="handleSubmit" class="ion-margin-top"
            >{{ edit ? 'Editar categoria' : 'Criar categoria' }}
        </ion-button>
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

.color-item {
    width: 100%;
    height: 32px;
    margin: 8px 0;
    border-radius: 32px;
}
</style>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { Compact } from '@ckpack/vue-color';
import { IonText, IonInput, IonButton, IonItem, IonLabel } from '@ionic/vue';

import { IFormData } from './index';

import {
    ValidationErrors,
    clearFieldsErrors,
    validateRequiredFields,
} from '@/utils/errors';

import InputErrorNote from '@/components/InputErrorNote.vue';

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

const errorMessage = ref('');

const nameRef = ref('');
const colorRef = ref('');

const validationErrors = ref<ValidationErrors>({});

const formFieldsRefs = () => ({
    name: nameRef,
    color: colorRef,
});

const validateData = () => {
    let validFields = true;

    const newValidationErrors = {} as ValidationErrors;

    const fieldsRefs = formFieldsRefs();

    errorMessage.value = '';

    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        {
            name: formData.value.name,
            color: formData.value.color,
        },
        fieldsRefs
    );

    if (!validFields)
        errorMessage.value = 'Todos os campos com * são obrigatórios';

    validationErrors.value = newValidationErrors;

    return validFields;
};

const handleSubmit = () => {
    if (edit.value || validateData()) {
        emit('onSubmit');
    }
};
</script>
