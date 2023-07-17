<template>
    <form class="form ion-padding">
        <template v-if="readonly || edit">
            <RecordActions
                :edit="edit"
                :readonly="readonly"
                :createdAt="createdAt"
                :updatedAt="updatedAt"
                @view="redirectToCategoryRoute('CategoryShow')"
                @edit="redirectToCategoryRoute('CategoryEdit')"
                @remove="handleCategoryRemove"
            />
        </template>

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

        <ion-button
            v-if="!readonly"
            shape="round"
            @click="handleSubmit"
            class="ion-margin-top"
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
import { computed, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { Compact } from '@ckpack/vue-color';
import { IonText, IonInput, IonButton, IonItem, IonLabel } from '@ionic/vue';

import {
    ValidationErrors,
    clearFieldsErrors,
    validateRequiredFields,
} from '@/utils/errors';
import { IFormData } from './index';
import { useCategoriesStore } from '@/store/categories';
import { formatDatetime, parseISO } from '@/utils/date';
import { presentConfirmationAlert } from '@/utils/alert';

import RecordActions from '../RecordActions.vue';
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

const { removeCategory } = useCategoriesStore();

const emit = defineEmits(['onSubmit']);

const router = useRouter();

const errorMessage = ref('');

const nameRef = ref('');
const colorRef = ref('');

const validationErrors = ref<ValidationErrors>({});

const createdAt = computed(() =>
    formData.value.createdAt
        ? formatDatetime(parseISO(formData.value.createdAt))
        : ''
);
const updatedAt = computed(() =>
    formData.value.updatedAt
        ? formatDatetime(parseISO(formData.value.updatedAt))
        : ''
);

const formFieldsRefs = () => ({
    name: nameRef,
    color: colorRef,
});

const redirectToCategoryRoute = async (name: string) => {
    await router.push({
        name,
        params: { categoryId: formData.value.id },
    });
};

const handleCategoryRemove = async () => {
    await presentConfirmationAlert({
        title: 'Remover categoria',
        message: 'Deseja remover esta categoria?',
        confirmAction: async () => {
            await removeCategory(formData.value.id);
            await router.push({
                name: 'CategoriesIndex',
                query: { reset: 'true' },
            });
        },
        confirmClass: 'alert-button-confirm',
    });
};

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
