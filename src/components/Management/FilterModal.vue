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
                                value="includes"
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

                        <ion-item class="ion-margin-top">
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
                        </ion-item>
                    </template>

                    <template v-if="columnMetadata.type === 'boolean'">
                        <ion-item>
                            <ion-checkbox
                                slot="start"
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
                                value="equals_to"
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

                        <ion-item class="ion-margin-top">
                            <ion-label position="stacked">Valor</ion-label>

                            <ion-input
                                type="number"
                                placeholder="Valor para filtrar"
                                @ionChange="
                                    (e) =>
                                        changeFilterData(
                                            columnMetadata.propertyName,
                                            { value: e.target.value }
                                        )
                                "
                            ></ion-input>
                        </ion-item>
                    </template>

                    <template v-if="columnMetadata.type === 'datetime'">
                        <ion-item>
                            <ion-label position="stacked"
                                >Tipo de filtro</ion-label
                            >

                            <ion-select
                                interface="popover"
                                value="equals_to"
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

                        <ion-item class="ion-margin-top">
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
import { ref, toRefs, onMounted } from 'vue';

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
    IonCheckbox,
    IonSelect,
    IonSelectOption,
} from '@ionic/vue';
import {
    AppBaseEntity,
    IFilterData,
    FilterData,
    FilterDataType,
} from '@/models/appBaseEntity';

import DatetimeButton from '../DatetimeButton.vue';

interface IProps {
    opened: boolean;
    toExcludeColumns?: string[];
    model: typeof AppBaseEntity;
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
    equals_to: 'Igual a',
    starts_with: 'Começa com',
    ends_with: 'Termina com',
};

const NUMBER_FILTER_OPTIONS: Record<string, string> = {
    equals_to: 'Igual a',
    less_than: 'Menor que',
    less_than_or_equal: 'Menor ou igual que',
    greater_than: 'Maior que',
    greater_than_or_equal: 'Maior ou igual que',
    // range: 'Intervalo',
};

const DATETIME_FILTER_OPTIONS: Record<string, string> = {
    equals_to: 'Igual a',
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

const { opened, model, toExcludeColumns } = toRefs(props);

const emit = defineEmits(['confirm']);

const data = ref<FilterData>({});
const columnsMetadata = ref<IColumnMetadata[]>([]);

const applyFilters = () => {
    emit('confirm', data.value);

    setOpen(false);
};

const changeFilterData = (field: string, newData: Partial<IFilterData>) => {
    const newFilterData = { ...data.value };

    newFilterData[field] = {
        ...newFilterData[field],
        ...newData,
    };

    data.value = newFilterData;
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

onMounted(() => {
    const newFilterData = { ...data.value };
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
        };
    });

    data.value = newFilterData;
});
</script>
