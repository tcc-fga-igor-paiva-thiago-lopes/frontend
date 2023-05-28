<template>
    <form class="form">
        <ion-item class="form-item" ref="distanceRef">
            <ion-label position="stacked">Distância (km) *</ion-label>
            <ion-input
                required
                type="number"
                name="distance"
                inputmode="decimal"
                :value="distance"
                placeholder="Digite a distância entre origem e destino"
                @ionChange="
                    (e) => emit('fieldChange', 'distance', e.target.value)
                "
            >
            </ion-input>
        </ion-item>

        <ion-accordion-group multiple :value="['origin', 'destination']">
            <ion-accordion value="origin" class="form-item">
                <ion-item slot="header" color="light">
                    <ion-label>Origem</ion-label>
                </ion-item>

                <div class="ion-padding" slot="content">
                    <ion-item class="form-item" ref="originCityRef">
                        <ion-label position="stacked">Cidade *</ion-label>
                        <ion-input
                            required
                            type="text"
                            name="originCity"
                            :maxlength="50"
                            :value="originCity"
                            placeholder="Digite a cidade de origem"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'originCity',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>

                        <ion-note slot="helper"
                            >Tamanho máximo 50 caracteres</ion-note
                        >
                    </ion-item>

                    <ion-item class="form-item" ref="originStateRef">
                        <ion-label position="stacked">Estado *</ion-label>

                        <ion-select
                            ok-text="OK"
                            cancel-text="Fechar"
                            name="originState"
                            interface="action-sheet"
                            placeholder="Digite a sigla do estado de origem"
                            :interface-options="{
                                cssClass: 'action-sheet-custom-class',
                            }"
                            :value="originState"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'originState',
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
                    </ion-item>

                    <ion-item class="form-item" ref="originCountryRef">
                        <ion-label position="stacked">País</ion-label>
                        <ion-input
                            type="text"
                            name="originCountry"
                            :value="originCountry"
                            placeholder="Digite o país de origem"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'originCountry',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>
                    </ion-item>
                </div>
            </ion-accordion>

            <ion-accordion value="destination" class="form-item">
                <ion-item slot="header" color="light">
                    <ion-label>Destino</ion-label>
                </ion-item>

                <div class="ion-padding" slot="content">
                    <ion-item class="form-item" ref="destinationCityRef">
                        <ion-label position="stacked">Cidade *</ion-label>
                        <ion-input
                            required
                            type="text"
                            name="destinationCity"
                            :maxlength="50"
                            :value="destinationCity"
                            placeholder="Digite a cidade de destino"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'destinationCity',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>

                        <ion-note slot="helper"
                            >Tamanho máximo 50 caracteres</ion-note
                        >
                    </ion-item>

                    <ion-item class="form-item" ref="destinationStateRef">
                        <ion-label position="stacked">Estado *</ion-label>

                        <ion-select
                            ok-text="OK"
                            cancel-text="Fechar"
                            name="destinationState"
                            interface="action-sheet"
                            :interface-options="{
                                cssClass: 'action-sheet-custom-class',
                            }"
                            placeholder="Digite a sigla do estado de destino"
                            :value="destinationState"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
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
                    </ion-item>

                    <ion-item class="form-item" ref="destinationCountryRef">
                        <ion-label position="stacked">País</ion-label>
                        <ion-input
                            type="text"
                            name="destinationCountry"
                            :value="destinationCountry"
                            placeholder="Digite o país de destino"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'destinationCountry',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>
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
import { toRefs } from 'vue';

import { STATES_TO_NAME } from '@/utils/location';

interface IProps {
    distance: string;
    originCountry: string;
    originCity: string;
    originState: string;
    destinationCountry: string;
    destinationCity: string;
    destinationState: string;
}
const props = defineProps<IProps>();

const {
    distance,
    originCountry,
    originCity,
    originState,
    destinationCountry,
    destinationCity,
    destinationState,
} = toRefs(props);

const emit = defineEmits(['fieldChange']);

const statesAcronymAndNames = Object.entries(STATES_TO_NAME);
</script>
