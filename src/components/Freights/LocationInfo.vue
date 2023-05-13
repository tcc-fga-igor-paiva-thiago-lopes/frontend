<template>
    <form class="form">
        <ion-item class="form-item" ref="distanceRef">
            <ion-label position="stacked">Distância</ion-label>
            <ion-input
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
                        <ion-label position="stacked">Cidade</ion-label>
                        <ion-input
                            type="text"
                            name="originCity"
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
                    </ion-item>

                    <ion-item class="form-item" ref="originStateRef">
                        <ion-label position="stacked">Estado</ion-label>
                        <ion-input
                            type="text"
                            name="originState"
                            :value="originState"
                            placeholder="Digite o estado de origem"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'originState',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>
                    </ion-item>

                    <ion-item class="form-item" ref="originCountryRef">
                        <ion-label position="stacked">Cidade</ion-label>
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
                        <ion-label position="stacked">Cidade</ion-label>
                        <ion-input
                            type="text"
                            name="destinationCity"
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
                    </ion-item>

                    <ion-item class="form-item" ref="destinationStateRef">
                        <ion-label position="stacked">Estado</ion-label>
                        <ion-input
                            type="text"
                            name="destinationState"
                            :value="destinationState"
                            placeholder="Digite o estado de destino"
                            @ionChange="
                                (e) =>
                                    emit(
                                        'fieldChange',
                                        'destinationState',
                                        e.target.value
                                    )
                            "
                        >
                        </ion-input>
                    </ion-item>

                    <ion-item class="form-item" ref="destinationCountryRef">
                        <ion-label position="stacked">Cidade</ion-label>
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
</style>

<script setup lang="ts">
import {
    IonItem,
    IonLabel,
    IonInput,
    IonAccordion,
    IonAccordionGroup,
} from '@ionic/vue';
import { toRefs } from 'vue';

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
</script>
