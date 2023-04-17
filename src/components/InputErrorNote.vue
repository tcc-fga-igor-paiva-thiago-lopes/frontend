<template>
    <ion-note slot="error" class="white-space-pre-line">
        {{
            displayValidationErrors(
                props.validationErrors,
                props.field,
                props.defaultMsg
            )
        }}
    </ion-note>
</template>

<style>
.white-space-pre-line {
    white-space: pre-line;
}
</style>

<script setup lang="ts">
import { IonNote } from '@ionic/vue';
import { ValidationErrors, displayValidationErrors } from '@/utils/errors';

interface IProps {
    field: string;
    defaultMsg: string;
    validationErrors: ValidationErrors;
}
const props = defineProps<IProps>();
</script>
