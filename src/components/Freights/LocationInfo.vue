<template>
    <form class="form">
        <ion-item class="form-item" :ref="fields.distance.ref">
            <ion-label position="stacked">Distância (km) *</ion-label>
            <ion-input
                required
                type="number"
                name="distance"
                inputmode="decimal"
                :readonly="readonly"
                :value="fields.distance.value"
                placeholder="Digite a distância entre origem e destino"
                @ionChange="(e) => setAttribute('distance', e.target.value)"
            >
            </ion-input>

            <InputErrorNote
                field="distance"
                defaultMsg="Distância inválida"
                :validationErrors="validationErrors"
            />
        </ion-item>

        <ion-accordion-group multiple :value="['origin', 'destination']">
            <ion-accordion value="origin" class="form-item">
                <ion-item slot="header" color="light">
                    <ion-label>Origem</ion-label>
                </ion-item>

                <div class="ion-padding" slot="content">
                    <ion-item class="form-item" :ref="fields.originCity.ref">
                        <ion-label position="stacked">Cidade *</ion-label>
                        <ion-input
                            required
                            type="text"
                            name="originCity"
                            :maxlength="50"
                            :readonly="readonly"
                            :value="fields.originCity.value"
                            placeholder="Digite a cidade de origem"
                            @ionChange="
                                (e) =>
                                    setAttribute('originCity', e.target.value)
                            "
                        >
                        </ion-input>

                        <ion-note v-if="!readonly" slot="helper"
                            >Tamanho máximo 50 caracteres</ion-note
                        >

                        <InputErrorNote
                            field="originCity"
                            defaultMsg="Cidade de origem inválida"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item class="form-item" :ref="fields.originState.ref">
                        <ion-label position="stacked">Estado *</ion-label>

                        <ion-select
                            ok-text="OK"
                            cancel-text="Fechar"
                            name="originState"
                            interface="action-sheet"
                            placeholder="Digite a sigla do estado de origem"
                            :disabled="readonly"
                            :value="fields.originState.value"
                            :interface-options="{
                                cssClass: 'action-sheet-custom-class',
                            }"
                            @ionChange="
                                (e) =>
                                    setAttribute('originState', e.target.value)
                            "
                        >
                            <IonSelectOption
                                v-for="[
                                    acronym,
                                    state,
                                ] in statesAcronymAndNames"
                                :value="acronym"
                                :key="acronym"
                                >{{ `${state} (${acronym})` }}</IonSelectOption
                            >
                        </ion-select>

                        <InputErrorNote
                            field="originState"
                            defaultMsg="Estado de origem inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item class="form-item" :ref="fields.originCountry.ref">
                        <ion-label position="stacked">País</ion-label>
                        <ion-input
                            type="text"
                            name="originCountry"
                            :readonly="readonly"
                            :value="fields.originCountry.value"
                            placeholder="Digite o país de origem"
                            @ionChange="
                                (e) =>
                                    setAttribute(
                                        'originCountry',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>

                        <InputErrorNote
                            field="originCountry"
                            defaultMsg="País de origem inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>
                </div>
            </ion-accordion>

            <ion-accordion value="destination" class="form-item">
                <ion-item slot="header" color="light">
                    <ion-label>Destino</ion-label>
                </ion-item>

                <div class="ion-padding" slot="content">
                    <ion-item
                        class="form-item"
                        :ref="fields.destinationCity.ref"
                    >
                        <ion-label position="stacked">Cidade *</ion-label>
                        <ion-input
                            required
                            type="text"
                            name="destinationCity"
                            :maxlength="50"
                            :readonly="readonly"
                            :value="fields.destinationCity.value"
                            placeholder="Digite a cidade de destino"
                            @ionChange="
                                (e) =>
                                    setAttribute(
                                        'destinationCity',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>

                        <ion-note v-if="!readonly" slot="helper"
                            >Tamanho máximo 50 caracteres</ion-note
                        >

                        <InputErrorNote
                            field="destinationCity"
                            defaultMsg="Cidade de destino inválida"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item
                        class="form-item"
                        :ref="fields.destinationState.ref"
                    >
                        <ion-label position="stacked">Estado *</ion-label>

                        <ion-select
                            ok-text="OK"
                            cancel-text="Fechar"
                            name="destinationState"
                            interface="action-sheet"
                            :disabled="readonly"
                            :value="fields.destinationState.value"
                            :interface-options="{
                                cssClass: 'action-sheet-custom-class',
                            }"
                            placeholder="Digite a sigla do estado de destino"
                            @ionChange="
                                (e) =>
                                    setAttribute(
                                        'destinationState',
                                        e.target.value
                                    )
                            "
                        >
                            <IonSelectOption
                                v-for="[
                                    acronym,
                                    state,
                                ] in statesAcronymAndNames"
                                :value="acronym"
                                :key="acronym"
                                >{{ `${state} (${acronym})` }}</IonSelectOption
                            >
                        </ion-select>

                        <InputErrorNote
                            field="destinationState"
                            defaultMsg="Estado de destino inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item
                        class="form-item"
                        :ref="fields.destinationCountry.ref"
                    >
                        <ion-label position="stacked">País</ion-label>
                        <ion-input
                            type="text"
                            name="destinationCountry"
                            :readonly="readonly"
                            :value="fields.destinationCountry.value"
                            placeholder="Digite o país de destino"
                            @ionChange="
                                (e) =>
                                    setAttribute(
                                        'destinationCountry',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>

                        <InputErrorNote
                            field="destinationState"
                            defaultMsg="País de destino inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>
                </div>
            </ion-accordion>
        </ion-accordion-group>
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

.action-sheet-custom-class .action-sheet-cancel {
    background: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast);
}
</style>

<script setup lang="ts">
import { Ref, toRefs } from 'vue';

import {
    IonItem,
    IonNote,
    IonLabel,
    IonInput,
    IonSelect,
    IonAccordion,
    IonSelectOption,
    IonAccordionGroup,
} from '@ionic/vue';

import { STATES_TO_NAME } from '@/utils/location';
import { ILocationInfoFields } from '.';
import { ValidationErrors } from '@/utils/errors';
import InputErrorNote from '../InputErrorNote.vue';

interface IProps {
    readonly?: boolean;
    fields: ILocationInfoFields;
    validationErrors: ValidationErrors;
    setAttribute: (field: string, value: unknown) => void;
}
const props = defineProps<IProps>();

const { fields, readonly, validationErrors } = toRefs(props);

const statesAcronymAndNames = Object.entries(STATES_TO_NAME);
</script>
