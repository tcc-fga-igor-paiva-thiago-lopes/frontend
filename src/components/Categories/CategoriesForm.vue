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

            <form class="form ion-padding">
                <ion-list class="ion-no-padding">
                    <ion-item
                        :ref="nameRef"
                        class="form-item"
                        :disabled="readonly"
                    >
                        <ion-label position="stacked">Nome *</ion-label>

                        <ion-input
                            required
                            name="name"
                            autocomplete="name"
                            :value="formData.name"
                            @ion-change="
                                (ev) => setAttribute('name', ev.target.value)
                            "
                            placeholder="Digite o nome da categoria"
                        >
                        </ion-input>

                        <InputErrorNote
                            field="name"
                            defaultMsg="Nome inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item class="form-item" :ref="colorRef">
                        <ion-label position="stacked" style="margin-bottom: 8px"
                            >Cor *</ion-label
                        >

                        <Compact
                            :modelValue="formData.color || '#000000'"
                            @update:model-value="
                                (e) => setAttribute('color', e.hex)
                            "
                        />

                        <InputErrorNote
                            field="color"
                            defaultMsg="Cor inválida"
                            :validationErrors="validationErrors"
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
import {
    Ref,
    ref,
    toRefs,
    computed,
    onMounted,
    onBeforeMount,
    onUpdated,
} from 'vue';
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
import { IFormData } from './index';

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

// eslint-disable-next-line vue/no-setup-props-destructure
const { setAttribute } = props;

const { edit, readonly, formData } = toRefs(props);

const emit = defineEmits(['onSubmit']);

const errorMessage = ref('');

const nameRef = ref('');
const colorRef = ref('');

const loading = ref(false);

const validationErrors = ref<ValidationErrors>({});

const formFieldsRefs = () => ({
    name: nameRef,
    color: colorRef,
});

const validateData = () => {
    let validFields = true;

    const newValidationErrors = {} as ValidationErrors;

    const fieldsRefs = formFieldsRefs();

    console.log('asdasd: ', (fieldsRefs.color.value as any).$el);

    (fieldsRefs.color.value as any).$el.classList.add('ion-invalid');

    errorMessage.value = '';

    clearFieldsErrors(formFieldsRefs());

    validFields = validateRequiredFields(
        newValidationErrors,
        formData,
        formFieldsRefs()
    );

    if (!validFields)
        errorMessage.value = 'Todos os campos com * são obrigatórios';

    console.log('formData: ', formData.value);

    console.log('valid fields: ', validFields);

    validationErrors.value = newValidationErrors;

    return validFields;
};

const handleSubmit = () => {
    if (edit.value || validateData()) {
        emit('onSubmit');
    }
};

onBeforeMount(() => {
    console.log('formData: ', formData.value);
});

onUpdated(() => {
    console.log('formData: ', formData.value);
});
</script>
