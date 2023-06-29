<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="() => $router.back()">
                        <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
                    </ion-button>
                </ion-buttons>

                <ion-title>Cadastro</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-loading v-if="loading" />

            <form class="form ion-padding" :formData="formData">
                <ion-list class="ion-no-padding">
                    <ion-item
                        class="form-item"
                        ref="nameRef"
                        :disabled="readonly"
                    >
                        <ion-label position="stacked">Nome *</ion-label>
                        <ion-input
                            required
                            name="name"
                            v-model="dataFields.name.value"
                            autocomplete="name"
                            placeholder="Digite o nome da categoria"
                            ref="nameRef"
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
                        <Compact
                            v-model="dataFields.color.value"
                            @update:modelValue="updateColor"
                            @ionChange="
                                (e) => setAttribute('color', e.target.value)
                            "
                        />
                    </ion-item>
                </ion-list>

                <ion-text
                    color="danger on-align-self-center"
                    v-if="!loading && !!errorMessage"
                >
                    <h6>{{ errorMessage }}</h6>
                </ion-text>

                <ion-button
                    shape="round"
                    @click="handleSubmit"
                    class="ion-margin-top"
                    >{{ edit ? 'Editar categoria' : 'Criar categoria' }}
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
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
import { Ref, ref, toRefs, computed } from 'vue';
import validateHTMLColorHex from 'validate-color';
import { Compact } from '@ckpack/vue-color';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText,
    IonLoading,
    IonInput,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonIcon,
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { Category } from '@/models/category';

import InputErrorNote from '@/components/InputErrorNote.vue';
import { IDataFields, IFormData } from './index';

import {
    ValidationErrors,
    clearFieldsErrors,
    validateRequiredFields,
    addErrorToField,
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

const errorMessage = ref('');

const nameRef = ref('');
const colorRef = ref('');

const dataFields = computed<IDataFields>(() => ({
    name: {
        value: formData.value.name,
        ref: nameRef,
    },
    color: {
        value: formData.value.color,
        ref: colorRef,
    },
}));

const color = dataFields.value.color.value;

const loading = ref(false);

const categoryRequiredFields = Category.requiredAttributes();

const validateColorInput = (errors: ValidationErrors) => {
    console.log('color: ', color);

    if (validateHTMLColorHex(color)) return true;

    const errorMessage = 'Cor inválida';
    addErrorToField({
        field: 'color',
        errorMessages: [errorMessage],
        fieldRef: colorRef,
        validationErrors: errors,
        overwriteErrors: true,
    });

    return false;
};

const validationErrors = ref<ValidationErrors>({});

const updateColor = (selectedColor: any) => {
    dataFields.value.color.value = selectedColor.hex;
};

const validateData = () => {
    let validFields = true;
    const fields = Object.keys(dataFields.value);

    console.log(fields);

    const newValidationErrors = {} as ValidationErrors;

    const requiredFields: Record<string, any> = {};
    const fieldsRefs: Record<string, Ref<any>> = {};

    fields
        .filter((field) => categoryRequiredFields.includes(field))
        .forEach((field) => {
            requiredFields[field] = dataFields.value[field].value;
            fieldsRefs[field] = dataFields.value[field].ref;
        });

    console.log(fields);

    console.log(categoryRequiredFields);

    console.log(requiredFields);

    errorMessage.value = '';
    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        requiredFields,
        fieldsRefs
    );

    console.log(newValidationErrors);

    validFields = validFields && validateColorInput(newValidationErrors);

    console.log(validFields);
    console.log(validateColorInput(newValidationErrors));

    validationErrors.value = newValidationErrors;

    return validFields;
};

const handleSubmit = () => {
    if (edit.value || validateData()) {
        emit('onSubmit');
    }
};
</script>
