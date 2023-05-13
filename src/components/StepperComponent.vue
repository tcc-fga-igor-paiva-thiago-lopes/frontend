<template>
    <div class="container">
        <div class="header">
            <template v-for="(step, idx) in steps" :key="step.name">
                <div class="step">
                    <ion-icon
                        size="large"
                        :icon="step.icon"
                        style="width: 40px; height: 40px"
                        :color="idx <= activeStep ? 'primary' : 'medium'"
                        @click="emit('changeStep', idx)"
                    ></ion-icon>

                    <ion-text class="ion-text-center step-title">
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

        <div class="content-container" :style="`padding: ${contentPadding};`">
            <slot name="content"></slot>

            <div
                class="ion-margin-top display-flex ion-justify-content-between"
            >
                <slot v-if="!!slots.backBtn" name="backBtn"></slot>

                <ion-button
                    v-else
                    color="danger"
                    :disabled="activeStep <= 0"
                    @click="emit('changeStep', activeStep - 1)"
                >
                    Voltar
                </ion-button>

                <ion-button
                    v-if="activeStep < steps.length - 1"
                    @click="emit('changeStep', activeStep + 1)"
                >
                    Próximo
                </ion-button>

                <ion-button v-else @click="emit('lastStepAction')">
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

.step {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.step-title {
    min-width: 64px;
    max-width: 128px;
    word-wrap: break-word;
}

.content-container {
    width: 100%;
    display: flex;
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
import { toRefs, useSlots } from 'vue';

import { IonText, IonIcon, IonButton } from '@ionic/vue';

interface IStep {
    name: string;
    icon: string;
    title: string;
    subtitle: string;
}

interface IProps {
    steps: IStep[];
    activeStep: number;
    contentPadding?: string;
    lastStepActionLabel: string;
}
const props = withDefaults(defineProps<IProps>(), { contentPadding: '16px 0' });

const slots = useSlots();

const { activeStep, steps, lastStepActionLabel, contentPadding } =
    toRefs(props);

const emit = defineEmits(['changeStep', 'lastStepAction']);
</script>
