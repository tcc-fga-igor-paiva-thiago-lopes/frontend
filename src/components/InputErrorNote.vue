<template>
    <ion-note slot="error">
        {{
            displayValidationErrors(
                props.validationErrors,
                props.field,
                props.defaultMsg
            )
        }}
    </ion-note>
</template>

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
