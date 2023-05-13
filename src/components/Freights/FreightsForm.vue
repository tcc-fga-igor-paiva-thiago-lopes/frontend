<template>
    <!-- TODO: add submit action -->
    <StepperComponent
        :activeStep="step"
        lastStepActionLabel="Criar frete"
        @changeStep="(newStep) => (step = newStep)"
        @lastStepAction="() => true"
        :steps="[
            {
                name: 'step_one',
                title: 'Dados gerais',
                subtitle: 'sub title 1',
                icon: menu,
            },
            {
                name: 'step_two',
                title: 'Localização',
                subtitle: 'sub title 2',
                icon: navigate,
            },
        ]"
    >
        <template v-slot:content>
            <form class="form" v-if="step === 0">
                <ion-item lines="none">
                    <ion-checkbox
                        slot="start"
                        v-model="finished"
                    ></ion-checkbox>
                    <ion-label>Finalizado?</ion-label>
                </ion-item>

                <ion-item class="form-item" ref="nameRef">
                    <ion-label position="stacked">Nome *</ion-label>
                    <ion-input
                        required
                        name="name"
                        type="text"
                        v-model="name"
                        autocomplete="name"
                        placeholder="Digite um nome para este frete"
                    >
                    </ion-input>
                </ion-item>

                <ion-item class="form-item" ref="descriptionRef">
                    <ion-label position="stacked">Descrição *</ion-label>
                    <ion-input
                        required
                        type="text"
                        name="description"
                        v-model="description"
                        placeholder="Digite uma descrição para este frete"
                    >
                    </ion-input>
                </ion-item>

                <ion-item class="form-item" ref="cargoTypeRef">
                    <ion-label position="stacked">Tipo de carga</ion-label>
                    <ion-input
                        type="text"
                        name="cargoType"
                        v-model="cargoType"
                        placeholder="Digite o tipo de carga deste frete"
                    ></ion-input>
                </ion-item>

                <ion-item class="form-item" ref="cargoWeightRef">
                    <ion-label position="stacked">Peso carga</ion-label>
                    <ion-input
                        type="number"
                        name="cargoWeight"
                        inputmode="decimal"
                        v-model="cargoWeight"
                        placeholder="Digite o peso da carga deste frete"
                    >
                    </ion-input>
                </ion-item>

                <ion-item class="form-item" ref="contractorRef">
                    <ion-label position="stacked">Contratante</ion-label>
                    <ion-input
                        type="text"
                        name="contractor"
                        v-model="contractor"
                        placeholder="Digite o contratante deste frete"
                    >
                    </ion-input>
                </ion-item>

                <ion-item class="form-item" ref="agreedPaymentRef">
                    <ion-label position="stacked">Pagamento acordado</ion-label>
                    <ion-input
                        type="number"
                        inputmode="decimal"
                        name="agreedPayment"
                        v-model="agreedPayment"
                        placeholder="Digite o pagamento acordado"
                    >
                    </ion-input>
                </ion-item>

                <ion-item class="form-item" ref="dueDatetimeRef">
                    <ion-label position="stacked" style="margin-bottom: 16px"
                        >Data limite</ion-label
                    >

                    <DatetimeButton
                        identifier="dueDatetime"
                        :value="dueDatetime"
                        @valueChange="(e) => (dueDatetime = e.target.value as string)"
                    />
                </ion-item>

                <ion-item class="form-item" ref="startDatetimeRef">
                    <ion-label position="stacked" style="margin-bottom: 16px"
                        >Data de início</ion-label
                    >

                    <DatetimeButton
                        identifier="startDatetime"
                        :value="startDatetime"
                        @valueChange="(e) => (startDatetime = e.target.value as string)"
                    />
                </ion-item>

                <ion-item
                    class="form-item"
                    ref="finishedDatetimeRef"
                    v-if="finished"
                >
                    <ion-label position="stacked" style="margin-bottom: 16px"
                        >Data de conclusão</ion-label
                    >

                    <DatetimeButton
                        identifier="finishedDatetime"
                        :value="finishedDatetime"
                        @valueChange="(e) => (finishedDatetime = e.target.value as string)"
                    />
                </ion-item>
            </form>

            <div v-if="step === 1">
                <ion-item class="form-item" ref="distanceRef">
                    <ion-label position="stacked">Distância</ion-label>
                    <ion-input
                        type="number"
                        name="distance"
                        inputmode="decimal"
                        v-model="distance"
                        placeholder="Digite a distância entre origem e destino"
                    >
                    </ion-input>
                </ion-item>

                <ion-accordion-group multiple>
                    <ion-accordion value="first" class="form-item">
                        <ion-item slot="header" color="light">
                            <ion-label>Origem</ion-label>
                        </ion-item>

                        <div class="ion-padding" slot="content">
                            <ion-item class="form-item" ref="originCityRef">
                                <ion-label position="stacked">Cidade</ion-label>
                                <ion-input
                                    type="text"
                                    name="originCity"
                                    v-model="originCity"
                                    placeholder="Digite a cidade de origem"
                                >
                                </ion-input>
                            </ion-item>

                            <ion-item class="form-item" ref="originStateRef">
                                <ion-label position="stacked">Estado</ion-label>
                                <ion-input
                                    type="text"
                                    name="originState"
                                    v-model="originState"
                                    placeholder="Digite o estado de origem"
                                >
                                </ion-input>
                            </ion-item>

                            <ion-item class="form-item" ref="originCountryRef">
                                <ion-label position="stacked">Cidade</ion-label>
                                <ion-input
                                    type="text"
                                    name="originCountry"
                                    v-model="originCountry"
                                    placeholder="Digite o país de origem"
                                >
                                </ion-input>
                            </ion-item>
                        </div>
                    </ion-accordion>

                    <ion-accordion value="second" class="form-item">
                        <ion-item slot="header" color="light">
                            <ion-label>Destino</ion-label>
                        </ion-item>

                        <div class="ion-padding" slot="content">
                            <ion-item
                                class="form-item"
                                ref="destinationCityRef"
                            >
                                <ion-label position="stacked">Cidade</ion-label>
                                <ion-input
                                    type="text"
                                    name="destinationCity"
                                    v-model="destinationCity"
                                    placeholder="Digite a cidade de destino"
                                >
                                </ion-input>
                            </ion-item>

                            <ion-item
                                class="form-item"
                                ref="destinationStateRef"
                            >
                                <ion-label position="stacked">Estado</ion-label>
                                <ion-input
                                    type="text"
                                    name="destinationState"
                                    v-model="destinationState"
                                    placeholder="Digite o estado de destino"
                                >
                                </ion-input>
                            </ion-item>

                            <ion-item
                                class="form-item"
                                ref="destinationCountryRef"
                            >
                                <ion-label position="stacked">Cidade</ion-label>
                                <ion-input
                                    type="text"
                                    name="destinationCountry"
                                    v-model="destinationCountry"
                                    placeholder="Digite o país de destino"
                                >
                                </ion-input>
                            </ion-item>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
            </div>
        </template>

        <template v-if="step === 0" v-slot:backBtn>
            <ion-button color="danger">Criar frete</ion-button>
        </template>
    </StepperComponent>
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
    IonButton,
    IonCheckbox,
    IonAccordion,
    IonAccordionGroup,
} from '@ionic/vue';
import { ref } from 'vue';

import { menu, navigate } from 'ionicons/icons';

import StepperComponent from '@/components/StepperComponent.vue';
import DatetimeButton from '@/components/DatetimeButton.vue';

const step = ref(0);
const finished = ref(false);
const name = ref('');
const description = ref('');
const cargoType = ref('');
const cargoWeight = ref('');
const contractor = ref('');
const agreedPayment = ref('');
const startDatetime = ref(new Date().toISOString());
const dueDatetime = ref('');
const finishedDatetime = ref('');
const distance = ref('');
const originCountry = ref('Brasil');
const originCity = ref('');
const originState = ref('');
const destinationCountry = ref('Brasil');
const destinationCity = ref('');
const destinationState = ref('');
</script>
