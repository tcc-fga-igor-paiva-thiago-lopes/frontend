<template>
    <form class="form ion-padding">
        <ion-accordion-group>
            <ion-accordion value="first">
                <ion-item slot="header" color="light">
                    <ion-label>Frete ({{ freight?.cargo }})</ion-label>
                </ion-item>

                <div
                    slot="content"
                    class="flex-direction-column ion-margin-bottom ion-padding-top"
                >
                    <div class="flex-direction-column" style="padding: 0 8px">
                        <div class="display-flex ion-justify-content-between">
                            <ion-text color="medium">
                                <h6 style="margin: 0">
                                    <strong>Início: </strong
                                    >{{ freightStartDate }}
                                </h6>
                            </ion-text>

                            <ion-text color="medium">
                                <h6 style="margin: 0">
                                    <strong>Fim: </strong
                                    >{{ freightFinishedDate }}
                                </h6>
                            </ion-text>
                        </div>

                        <div
                            class="display-flex ion-justify-content-between ion-align-items-center ion-margin-top"
                        >
                            <ion-text color="medium">
                                <h6 style="margin: 0">
                                    <strong>De: </strong>{{ freightOriginText }}
                                </h6>
                            </ion-text>

                            <ion-icon
                                :icon="arrowForward"
                                size="small"
                                color="medium"
                            ></ion-icon>

                            <ion-text color="medium">
                                <h6 style="margin: 0">
                                    <strong>Para: </strong
                                    >{{ freightDestinationText }}
                                </h6>
                            </ion-text>
                        </div>
                    </div>
                </div>
            </ion-accordion>
        </ion-accordion-group>

        <template v-if="readonly || edit">
            <RecordActions
                :edit="edit"
                :readonly="readonly"
                :createdAt="createdAt"
                :updatedAt="updatedAt"
                @view="redirectToAccountRoute('FreightAccountShow')"
                @edit="redirectToAccountRoute('FreightAccountEdit')"
                @remove="handleAccountRemove"
            />
        </template>

        <ion-item ref="nameRef" class="form-item">
            <ion-label position="stacked">Nome *</ion-label>

            <ion-input
                required
                name="name"
                autocomplete="name"
                :maxlength="30"
                :readonly="readonly"
                :value="formData.name"
                placeholder="Digite o nome da gasto"
                @ion-change="(ev) => setAttribute('name', ev.target.value)"
            >
            </ion-input>

            <ion-note v-if="!readonly" slot="helper"
                >Tamanho máximo 30 caracteres</ion-note
            >

            <InputErrorNote
                field="name"
                defaultMsg="Nome inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" ref="valueRef">
            <ion-label position="stacked"> Valor (R$) * </ion-label>

            <ion-input
                required
                name="value"
                type="number"
                inputmode="decimal"
                :readonly="readonly"
                :value="formData.value"
                placeholder="Digite o valor do gasto"
                @ion-change="(ev) => setAttribute('value', ev.target.value)"
            >
            </ion-input>

            <InputErrorNote
                field="value"
                defaultMsg="Valor inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" ref="accountDateRef">
            <ion-label position="stacked" style="margin-bottom: 16px"
                >Data do gasto</ion-label
            >

            <DatetimeButton
                identifier="accountDate"
                :value="formData.accountDate"
                :disabled="readonly"
                @valueChange="
                    (e) => setAttribute('accountDate', e.target.value)
                "
            />

            <InputErrorNote
                field="accountDate"
                defaultMsg="Data inválida"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" ref="categoryIdRef">
            <ion-label position="stacked">Categoria *</ion-label>

            <ion-select
                ok-text="OK"
                cancel-text="Fechar"
                name="categoryId"
                interface="action-sheet"
                placeholder="Selecione uma categoria"
                :disabled="readonly"
                :value="formData.categoryId"
                :interface-options="{
                    cssClass: 'action-sheet-custom-class',
                }"
                @ionChange="(e) => setAttribute('categoryId', e.target.value)"
            >
                <IonSelectOption
                    v-for="category in categories"
                    :value="category.id.toString()"
                    :key="category.id"
                >
                    {{ category.name }}
                </IonSelectOption>
            </ion-select>

            <InputErrorNote
                field="cargo"
                defaultMsg="Tipo de carga inválido"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-item class="form-item" ref="descriptionRef">
            <ion-label position="stacked">Descrição *</ion-label>

            <ion-textarea
                required
                type="text"
                inputmode="text"
                name="description"
                :maxlength="500"
                :auto-grow="true"
                :readonly="readonly"
                :value="formData.description"
                placeholder="Digite uma descrição para este gasto"
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

        <ion-text color="danger on-align-self-center" v-if="!!errorMessage">
            <h6>{{ errorMessage }}</h6>
        </ion-text>

        <ion-button
            v-if="!readonly"
            shape="round"
            @click="handleSubmit"
            class="ion-margin-top"
            >{{ edit ? 'Editar gasto' : 'Criar gasto' }}
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
import {
    computed,
    onBeforeMount,
    onBeforeUnmount,
    ref,
    toRefs,
    watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    IonText,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon,
    IonSelect,
    IonTextarea,
    IonAccordion,
    IonAccordionGroup,
    IonSelectOption,
} from '@ionic/vue';
import { arrowForward } from 'ionicons/icons';

import {
    ValidationErrors,
    addErrorToField,
    clearFieldsErrors,
    validateRequiredFields,
} from '@/utils/errors';
import { IFormData } from './index';
import { Freight } from '@/models/freight';
import { Category } from '@/models/category';
import { useAccountsStore } from '@/store/accounts';
import { formatDatetime, parseISO } from '@/utils/date';

import RecordActions from '../RecordActions.vue';
import DatetimeButton from '../DatetimeButton.vue';
import InputErrorNote from '@/components/InputErrorNote.vue';
import { presentConfirmationAlert } from '@/utils/alert';

interface IProps {
    edit?: boolean;
    readonly?: boolean;
    formData: IFormData;
    freight: Freight | null;
    setAttribute: (field: string, value: unknown) => void;
}

const props = withDefaults(defineProps<IProps>(), {
    edit: false,
    readonly: false,
});

const { edit, readonly, formData, setAttribute, freight } = toRefs(props);

const emit = defineEmits(['onSubmit']);

const route = useRoute();
const router = useRouter();

const { removeAccount } = useAccountsStore();

const errorMessage = ref('');

const nameRef = ref('');
const valueRef = ref('');
const descriptionRef = ref('');
const accountDateRef = ref('');
const categoryIdRef = ref('');

const validationErrors = ref<ValidationErrors>({});

const categories = ref<Category[]>([]);

const freightOriginText = computed(
    () => `${freight.value?.originCity} (${freight.value?.originState})`
);

const freightDestinationText = computed(
    () =>
        `${freight.value?.destinationCity} (${freight.value?.destinationState})`
);

const freightStartDate = computed(() =>
    freight.value?.startDate ? formatDatetime(freight.value?.startDate) : ''
);

const freightFinishedDate = computed(() =>
    freight.value?.finishedDate
        ? formatDatetime(freight.value?.finishedDate)
        : 'andamento'
);

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
    value: valueRef,
    description: descriptionRef,
    accountDate: accountDateRef,
    categoryId: categoryIdRef,
});

const redirectToAccountRoute = async (name: string) => {
    await router.push({
        name,
        params: {
            freightId: route.params.freightId,
            accountId: formData.value.id,
        },
    });
};

const handleAccountRemove = async () => {
    await presentConfirmationAlert({
        title: 'Remover categoria',
        message: 'Deseja remover esta categoria?',
        confirmAction: async () => {
            await removeAccount(formData.value.id);
            await router.push({
                name: 'FreightAccountsIndex',
                params: {
                    freightId: route.params.freightId,
                },
                query: { reset: 'true' },
            });
        },
        confirmClass: 'alert-button-confirm',
    });
};

const validateData = () => {
    let validFields = true;

    const newValidationErrors = {} as ValidationErrors;

    const { name, value, description, accountDate, categoryId } =
        formData.value;

    const fieldsRefs = formFieldsRefs();

    errorMessage.value = '';

    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        {
            name,
            value,
            description,
            accountDate,
            categoryId,
        },
        fieldsRefs
    );

    if (!validFields)
        errorMessage.value = 'Todos os campos com * são obrigatórios';

    if (value && parseFloat(value) <= 0.0) {
        addErrorToField({
            field: 'value',
            fieldRef: valueRef,
            validationErrors: newValidationErrors,
            errorMessages: ['Valor deve ser maior que 0'],
        });
    }

    validationErrors.value = newValidationErrors;

    return validFields;
};

const handleSubmit = () => {
    if (edit.value || validateData()) {
        emit('onSubmit');
    }
};

const fetchCategories = async () => {
    categories.value = await Category.find();
};

const unwatch = watch([route], async () => {
    await fetchCategories();
});

onBeforeMount(async () => {
    await fetchCategories();
});

onBeforeUnmount(() => {
    unwatch();
});
</script>
