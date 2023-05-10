<template>
    <div class="container">
        <div class="header">
            <template v-for="(step, idx) in steps" :key="step.name">
                <div class="step-content">
                    <ion-icon
                        size="large"
                        :icon="step.icon || checkmarkCircle"
                        style="width: 40px; height: 40px"
                        :color="idx <= activeStep ? 'primary' : 'medium'"
                        @click="$emit('changeStep', idx)"
                    ></ion-icon>

                    <ion-text>
                        <h6>{{ step.title }}</h6>
                    </ion-text>
                </div>

                <div
                    v-if="idx < steps.length - 1"
                    :class="`divider-line ion-margin-top ${
                        idx < activeStep
                            ? 'bg-color-primary'
                            : 'divider-line-bg-color'
                    }`"
                ></div>
            </template>
        </div>

        <div class="content">
            <slot name="content"></slot>

            <div
                class="ion-margin-top display-flex ion-justify-content-between"
            >
                <ion-button
                    color="danger"
                    :disabled="activeStep <= 0"
                    @click="$emit('changeStep', activeStep - 1)"
                >
                    Voltar
                </ion-button>

                <ion-button
                    v-if="activeStep < steps.length - 1"
                    @click="$emit('changeStep', activeStep + 1)"
                >
                    Próximo
                </ion-button>

                <ion-button v-else @click="$emit('lastStepAction')">
                    {{ lastStepActionLabel }}
                </ion-button>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    width: 100%;
}

.header {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.step-content {
    display: flex;
    min-width: 64px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.content {
    width: 100%;
    display: flex;
    padding: 16px 0;
    flex-direction: column;
}

.divider-line {
    height: 2px;
    width: 100% !important;
}

.divider-line-bg-color {
    background-color: #ddd;
}
</style>

<script setup lang="ts">
import { toRefs } from 'vue';
import { checkmarkCircle } from 'ionicons/icons';

import { IonText, IonIcon, IonButton } from '@ionic/vue';

interface IStep {
    name: string;
    title: string;
    subtitle: string;
    icon?: string;
}

interface IProps {
    steps: IStep[];
    activeStep: number;
    lastStepActionLabel: string;
}
const props = defineProps<IProps>();

const { activeStep, steps, lastStepActionLabel } = toRefs(props);
</script>
