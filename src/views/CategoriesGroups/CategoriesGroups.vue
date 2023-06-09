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

            <form class="form ion-padding" :formData="newCategoryGroup">
                <ion-list class="ion-no-padding">
                    <ion-item class="form-item" ref="nameRef">
                        <ion-label position="stacked">Nome *</ion-label>
                        <ion-input
                            required
                            name="name"
                            v-model="name"
                            autocomplete="name"
                            placeholder="Digite o nome do grupo"
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
                            v-model="color"
                            @input="updateColor"
                            @update:modelValue="updateColor"
                            :value="color"
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
                    @click="submit"
                    class="ion-margin-top"
                >
                    Criar grupo
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
import { storeToRefs } from 'pinia';
import { ref, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
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
import { CategoryGroup } from '@/models/categoryGroup';
import { useCategoriesGroupsStore } from '@/store/categoriesGroups';

import APIAdapter from '@/services/api';
import { presentToast } from '@/utils/toast';
import InputErrorNote from '@/components/InputErrorNote.vue';
import { IFormData } from './index';

import {
    ValidationErrors,
    clearFieldsErrors,
    validateRequiredFields,
    assignValidationErrorsFromResponse,
} from '@/utils/errors';
import APIError from '@/services/api/apiError';

const router = useRouter();

const nameRef = ref('');
const colorRef = ref('#FFFFFF');

const name = ref('');
const color = ref('#FFFFFF');
const loading = ref(false);
const errorMessage = ref('');
const validationErrors = ref<ValidationErrors>({});

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

const { formData, setAttribute } = toRefs(props);

const dataFields = computed<IFormData>(() => ({
    name: {
        value: formData.value.name,
        ref: name,
    },
    color: {
        value: formData.value.color,
        ref: color,
    },
}));

const updateColor = (selectedColor: any) => {
    console.log('selectedColor: ', selectedColor);
    color.value = selectedColor.hex;
    console.log('color: ', color.value);
};

const validateForm = () => {
    let validFields = true;
    const fieldsRefs = formFieldsRefs();
    const newValidationErrors = {} as ValidationErrors;

    errorMessage.value = '';
    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        {
            name: name.value,
            color: color.value,
        },
        fieldsRefs
    );

    if (!validFields)
        errorMessage.value = 'Todos os campos com * são obrigatórios';

    validationErrors.value = newValidationErrors;

    return validFields;
};

const submit = async () => {
    if (!validateForm()) return;

    loading.value = true;

    const apiAdapter = new APIAdapter();

    try {
        await apiAdapter.post({
            url: '/categories-groups/',
            data: {
                name: name.value,
                color: color.value.replace('#', ''),
            },
        });

        errorMessage.value = '';
        presentToast('Grupo criado com sucesso!', 'success');

        router.push({ name: 'Home' });
    } catch (error) {
        console.error(error);

        if (error instanceof APIError) {
            assignValidationErrorsFromResponse(
                validationErrors.value,
                error.response?.data,
                formFieldsRefs()
            );

            errorMessage.value = error.response.data.message;

            presentToast(errorMessage.value, 'danger');
        } else {
            errorMessage.value =
                'Erro de conexão com o servidor. Tente novamente.';
            presentToast(errorMessage.value, 'danger');
        }
    } finally {
        loading.value = false;
    }
};
</script>
