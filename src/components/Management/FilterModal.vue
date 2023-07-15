<template>
    <ion-modal :isOpen="opened" @willDismiss="setOpen(false)">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="setOpen(false)">Cancelar</ion-button>
                </ion-buttons>

                <ion-title>Filtros</ion-title>

                <ion-buttons slot="end">
                    <ion-button :strong="true" @click="applyFilters"
                        >Confirmar</ion-button
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-button color="danger" @click="handleFilterClear">
                <ion-icon slot="start" :icon="closeCircle"></ion-icon>
                Remover filtros
            </ion-button>

            <ion-text color="danger" v-if="hasInvalidField">
                <h6
                    v-for="[field, fieldMsg] in Object.entries(
                        invalidFieldsMessages
                    )"
                    :key="field"
                >
                    {{ fieldMsg }}
                </h6>
            </ion-text>

            <div
                v-for="columnMetadata in columnsMetadata"
                :key="columnMetadata.propertyName"
                :id="columnMetadata.propertyName"
                class="ion-margin-bottom"
            >
                <div
                    class="display-flex ion-justify-content-between ion-align-items-center"
                >
                    <ion-text>
                        <h5>
                            <strong>
                                {{
                                    model.FRIENDLY_COLUMN_NAMES[
                                        columnMetadata.propertyName
                                    ]
                                }}
                            </strong>
                        </h5>
                    </ion-text>

                    <div class="display-flex ion-align-items-center">
                        <ion-checkbox
                            slot="start"
                            class="ion-margin-end"
                            :checked="data[columnMetadata.propertyName]?.active"
                            @ionChange="
                                (e) =>
                                    changeFilterData(
                                        columnMetadata.propertyName,
                                        { active: e.target.checked }
                                    )
                            "
                        ></ion-checkbox>

                        <ion-label>Ativo?</ion-label>
                    </div>
                </div>

                <div class="ion-margin-horizontal">
                    <template v-if="columnMetadata.type === 'string'">
                        <ion-item>
                            <ion-label position="stacked"
                                >Tipo de filtro</ion-label
                            >

                            <ion-select
                                interface="popover"
                                :value="data[columnMetadata.propertyName]?.type"
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { type: e.target.value }
                                        )
                                "
                            >
                                <IonSelectOption
                                    v-for="entry in Object.entries(
                                        STRING_FILTER_OPTIONS
                                    )"
                                    :value="entry[0]"
                                    :key="entry[0]"
                                    >{{ entry[1] }}</IonSelectOption
                                >
                            </ion-select>
                        </ion-item>

                        <ion-item
                            class="ion-margin-top"
                            :class="
                                invalidFieldsMessages[
                                    columnMetadata.propertyName
                                ]
                                    ? 'ion-invalid'
                                    : 'ion-valid'
                            "
                        >
                            <ion-label position="stacked">Valor</ion-label>

                            <ion-input
                                v-if="!columnMetadata.enum"
                                type="text"
                                placeholder="Valor para filtrar"
                                :value="data[columnMetadata.propertyName].value"
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { value: e.target.value }
                                        )
                                "
                            ></ion-input>

                            <ion-select
                                v-else
                                ok-text="OK"
                                cancel-text="Fechar"
                                interface="action-sheet"
                                :interface-options="{
                                    cssClass: 'action-sheet-custom-class',
                                }"
                                :value="
                                    data[columnMetadata.propertyName]?.value
                                "
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { value: e.target.value }
                                        )
                                "
                            >
                                <IonSelectOption
                                    v-for="enumItem in columnMetadata.enum"
                                    :value="enumItem"
                                    :key="enumItem"
                                    >{{ enumItem }}</IonSelectOption
                                >
                            </ion-select>

                            <ion-note slot="error">
                                {{
                                    invalidFieldsMessages[
                                        columnMetadata.propertyName
                                    ]
                                }}
                            </ion-note>
                        </ion-item>
                    </template>

                    <template v-if="columnMetadata.type === 'boolean'">
                        <ion-item
                            :class="
                                invalidFieldsMessages[
                                    columnMetadata.propertyName
                                ]
                                    ? 'ion-invalid'
                                    : 'ion-valid'
                            "
                        >
                            <ion-checkbox
                                slot="start"
                                :checked="
                                    data[columnMetadata.propertyName]?.value
                                "
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { value: e.target.checked }
                                        )
                                "
                            ></ion-checkbox>

                            <ion-label>Sim ou não</ion-label>
                        </ion-item>
                    </template>

                    <template v-if="columnMetadata.type === 'number'">
                        <ion-item>
                            <ion-label position="stacked"
                                >Tipo de filtro</ion-label
                            >

                            <ion-select
                                interface="popover"
                                :value="data[columnMetadata.propertyName]?.type"
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { type: e.target.value }
                                        )
                                "
                            >
                                <IonSelectOption
                                    v-for="entry in Object.entries(
                                        NUMBER_FILTER_OPTIONS
                                    )"
                                    :value="entry[0]"
                                    :key="entry[0]"
                                    >{{ entry[1] }}</IonSelectOption
                                >
                            </ion-select>
                        </ion-item>

                        <ion-item
                            class="ion-margin-top"
                            :class="
                                invalidFieldsMessages[
                                    columnMetadata.propertyName
                                ]
                                    ? 'ion-invalid'
                                    : 'ion-valid'
                            "
                        >
                            <ion-label position="stacked">Valor</ion-label>

                            <ion-input
                                type="number"
                                placeholder="Valor para filtrar"
                                :value="
                                    data[columnMetadata.propertyName]?.value
                                "
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { value: e.target.value }
                                        )
                                "
                            ></ion-input>

                            <ion-note slot="error">
                                {{
                                    invalidFieldsMessages[
                                        columnMetadata.propertyName
                                    ]
                                }}
                            </ion-note>
                        </ion-item>
                    </template>

                    <template v-if="columnMetadata.type === 'datetime'">
                        <ion-item>
                            <ion-label position="stacked"
                                >Tipo de filtro</ion-label
                            >

                            <ion-select
                                interface="popover"
                                :value="data[columnMetadata.propertyName]?.type"
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { type: e.target.value }
                                        )
                                "
                            >
                                <IonSelectOption
                                    v-for="entry in Object.entries(
                                        DATETIME_FILTER_OPTIONS
                                    )"
                                    :value="entry[0]"
                                    :key="entry[0]"
                                    >{{ entry[1] }}</IonSelectOption
                                >
                            </ion-select>
                        </ion-item>

                        <ion-item
                            class="ion-margin-top"
                            :class="
                                invalidFieldsMessages[
                                    columnMetadata.propertyName
                                ]
                                    ? 'ion-invalid'
                                    : 'ion-valid'
                            "
                        >
                            <ion-label
                                position="stacked"
                                style="margin-bottom: 16px"
                                >Valor data</ion-label
                            >

                            <DatetimeButton
                                :identifier="`${columnMetadata.propertyName}-filter-value`"
                                :value="
                                    data[columnMetadata.propertyName]?.value
                                "
                                @valueChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { value: e.target.value }
                                        )
                                "
                            />

                            <ion-note slot="error">
                                {{
                                    invalidFieldsMessages[
                                        columnMetadata.propertyName
                                    ]
                                }}
                            </ion-note>
                        </ion-item>

                        <ion-item class="ion-margin-top">
                            <ion-checkbox
                                slot="start"
                                :checked="
                                    data[columnMetadata.propertyName]?.dateOnly
                                "
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { dateOnly: e.target.checked }
                                        )
                                "
                            ></ion-checkbox>

                            <ion-label>Usar apenas a data?</ion-label>

                            <ion-note slot="helper"
                                >Isso irá ignorar a hora e minuto
                                selecionado</ion-note
                            >
                        </ion-item>
                    </template>
                </div>
            </div>

            <div
                style="margin: 32px 0 56px 0"
                class="display-flex ion-justify-content-between"
            >
                <ion-button
                    expand="full"
                    shape="round"
                    color="danger"
                    @click="setOpen(false)"
                >
                    Cancelar
                </ion-button>

                <ion-button
                    expand="full"
                    shape="round"
                    color="primary"
                    @click="applyFilters"
                >
                    Confirmar
                </ion-button>
            </div>
        </ion-content>
    </ion-modal>
</template>

<style>
.action-sheet-custom-class .action-sheet-cancel {
    background: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast);
}
</style>

<script setup lang="ts">
import { ColumnType } from 'typeorm';
import { ref, toRefs, onBeforeMount, computed } from 'vue';

import {
    IonButton,
    IonModal,
    IonText,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonNote,
    IonCheckbox,
    IonSelect,
    IonSelectOption,
} from '@ionic/vue';
import { closeCircle } from 'ionicons/icons';

import {
    AppBaseEntity,
    IFilterData,
    FilterData,
    FilterDataType,
} from '@/models/appBaseEntity';
import DatetimeButton from '../DatetimeButton.vue';
import { presentConfirmationAlert } from '@/utils/alert';

interface IProps {
    opened: boolean;
    toExcludeColumns?: string[];
    model: typeof AppBaseEntity;
    filterData?: Record<string, Partial<IFilterData>>;
    setOpen: (value: boolean) => void;
}

interface IColumnMetadata {
    type: ColumnType;
    propertyName: string;
    enum?: (string | number)[];
}

const DEFAULT_EXCLUDE_COLUMNS = ['id', 'identifier', 'deletedAt'];

const STRING_FILTER_OPTIONS: Record<string, string> = {
    includes: 'Contém',
    not_includes: 'Não contém',
    equals_to: 'Igual a',
    not_equals_to: 'Diferente de',
    starts_with: 'Começa com',
    ends_with: 'Termina com',
};

const NUMBER_FILTER_OPTIONS: Record<string, string> = {
    equals_to: 'Igual a',
    not_equals_to: 'Diferente de',
    less_than: 'Menor que',
    less_than_or_equal: 'Menor ou igual que',
    greater_than: 'Maior que',
    greater_than_or_equal: 'Maior ou igual que',
    // range: 'Intervalo',
};

const DATETIME_FILTER_OPTIONS: Record<string, string> = {
    equals_to: 'Igual a',
    not_equals_to: 'Diferente de',
    less_than: 'Anterior a',
    less_than_or_equal: 'Anterior ou igual a',
    greater_than: 'Posterior a',
    greater_than_or_equal: 'Posterior ou igual a',
    // range: 'Intervalo',
};

const DEFAULT_FILTER_VALUES: Record<string, string> = {
    datetime: 'equals_to',
    string: 'includes',
    boolean: 'equals_to',
    number: 'equals_to',
};

const props = defineProps<IProps>();

// eslint-disable-next-line vue/no-setup-props-destructure
const { setOpen } = props;

const { opened, model, toExcludeColumns, filterData } = toRefs(props);

const emit = defineEmits(['onConfirm']);

const data = ref<FilterData>({});
const columnsMetadata = ref<IColumnMetadata[]>([]);
const invalidFieldsMessages = ref<Record<string, string>>({});

const hasInvalidField = computed(
    () =>
        Object.values(invalidFieldsMessages.value).filter((msg) => !msg)
            .length > 0
);

const applyFilters = () => {
    let valid = true;

    Object.entries(data.value).forEach(([field, filterData]) => {
        const { active, value } = filterData;

        if (active && !value) {
            valid = false;

            invalidFieldsMessages.value[
                field
            ] = `${model.value.FRIENDLY_COLUMN_NAMES[field]}: valor inválido`;
        } else {
            invalidFieldsMessages.value[field] = '';
        }
    });

    if (valid) {
        emit('onConfirm', data.value);

        setOpen(false);
    }
};

const changeFilterData = (field: string, newData: Partial<IFilterData>) => {
    const newFilterData = { ...data.value };

    newFilterData[field] = {
        ...newFilterData[field],
        ...newData,
    };

    data.value = newFilterData;
};

const handleFilterClear = async () => {
    await presentConfirmationAlert({
        title: 'Remover filtros',
        message: 'Deseja remover todos os filtros?',
        confirmClass: 'alert-button-confirm',
        confirmAction: () => {
            data.value = mountFilterData();
        },
    });
};

const parseColumnType = (type: ColumnType): ColumnType => {
    switch (type) {
        case Date:
        case 'datetime':
            return 'datetime';
        case String:
        case 'varchar':
            return 'string';
        case 'boolean':
            return 'boolean';
        case Number:
        case 'decimal':
            return 'number';
        default:
            return type;
    }
};

const mountFilterData = (filterData?: Record<string, Partial<IFilterData>>) => {
    const newFilterData = {} as FilterData;
    const columns = model.value.getRepository().metadata.columns;

    columnsMetadata.value = columns
        .map((column) => ({
            enum: column.enum,
            propertyName: column.propertyName,
            type: parseColumnType(column.type),
        }))
        .filter(
            (column) =>
                ![
                    ...DEFAULT_EXCLUDE_COLUMNS,
                    ...(toExcludeColumns?.value || []),
                ].includes(column.propertyName)
        );

    columnsMetadata.value.forEach((column) => {
        newFilterData[column.propertyName] = {
            value: null,
            active: false,
            type: DEFAULT_FILTER_VALUES[
                column.type as string
            ] as FilterDataType,
            ...((filterData && filterData[column.propertyName]) || {}),
        };
    });

    return newFilterData;
};

onBeforeMount(() => {
    data.value = mountFilterData(filterData?.value);
});
</script>
