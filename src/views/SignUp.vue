<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button @click="() => $router.back()">
                        <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
                    </ion-button>
                </ion-buttons>

                <ion-title>Cadastro</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-loading v-if="loading" />

            <form class="form ion-padding" @submit="submit">
                <ion-list class="ion-no-padding">
                    <ion-item class="form-item" ref="nameRef">
                        <ion-label position="stacked">Nome *</ion-label>
                        <ion-input
                            required
                            :name="name"
                            v-model="name"
                            placeholder="Digite seu nome"
                        >
                        </ion-input>

                        <InputErrorNote
                            field="name"
                            defaultMsg="Nome inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item class="form-item" ref="emailRef">
                        <ion-label position="stacked">E-mail *</ion-label>
                        <ion-input
                            required
                            type="email"
                            :name="email"
                            v-model="email"
                            inputmode="email"
                            @ionInput="handleEmailChange"
                            placeholder="Digite seu e-mail"
                        >
                        </ion-input>
                        <ion-note slot="helper"
                            >Insira um e-mail válido</ion-note
                        >

                        <InputErrorNote
                            field="email"
                            defaultMsg="E-mail inválido"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item class="form-item" ref="passwordRef">
                        <ion-label position="stacked">Senha *</ion-label>
                        <ion-input
                            required
                            type="password"
                            :name="password"
                            v-model="password"
                            placeholder="Digite sua senha"
                        >
                        </ion-input>

                        <InputErrorNote
                            field="password"
                            defaultMsg="Senha inválida"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>

                    <ion-item class="form-item" ref="passwordConfirmationRef">
                        <ion-label position="stacked"
                            >Confirmação de senha *</ion-label
                        >
                        <ion-input
                            required
                            type="password"
                            :name="passwordConfirmation"
                            v-model="passwordConfirmation"
                            placeholder="Confirme sua senha"
                        >
                        </ion-input>
                        <ion-note slot="helper"
                            >Deve ser igual a senha</ion-note
                        >

                        <InputErrorNote
                            field="passwordConfirmation"
                            defaultMsg="Confirmação de senha inválida"
                            :validationErrors="validationErrors"
                        />
                    </ion-item>
                </ion-list>

                <ion-text
                    color="danger on-align-self-center"
                    v-if="!loading && !!errorMessage"
                >
                    <h6>{{ errorMessage }}</h6>
                </ion-text>

                <ion-button
                    shape="round"
                    :onclick="submit"
                    class="ion-margin-top"
                >
                    Criar conta
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
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
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText,
    IonLoading,
    IonInput,
    IonButton,
    IonList,
    IonNote,
    IonItem,
    IonLabel,
    IonButtons,
    IonIcon,
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { IonInputCustomEvent } from '@ionic/core';

import APIAdapter from '@/services/api';
import { presentToast } from '@/utils/toast';
import InputErrorNote from '@/components/InputErrorNote.vue';

import {
    validateField,
    ValidationErrors,
    addErrorToFields,
    clearFieldsErrors,
    validateRequiredFields,
    assignValidationErrorsFromResponse,
} from '@/utils/errors';

const router = useRouter();

const nameRef = ref('');
const emailRef = ref('');
const passwordRef = ref('');
const passwordConfirmationRef = ref('');

const loading = ref(false);
const errorMessage = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const validationErrors = ref<ValidationErrors>({});

const formFieldsRefs = () => ({
    name: nameRef,
    email: emailRef,
    password: passwordRef,
    passwordConfirmation: passwordConfirmationRef,
});

const validateEmailFormat = (email: string) => {
    return email.match(
        /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    );
};

const validateEmail = (value: string, errors: ValidationErrors) => {
    return validateField(
        { value, field: 'email', fieldRef: emailRef },
        (v: string) => (validateEmailFormat(v) ? [] : ['E-mail inválido']),
        errors
    );
};

const handleEmailChange = (ev: IonInputCustomEvent<InputEvent>) => {
    const value = ev.target.value;

    validateEmail(value as string, validationErrors.value);
};

const validatePassword = (value: string, errors: ValidationErrors) => {
    return validateField(
        { value, field: 'password', fieldRef: passwordRef },
        (v: string) =>
            v.length >= 8 ? [] : ['Menor que o tamanho mínimo de 8 caracteres'],
        errors
    );
};

const validatePasswordAndConfirmation = (errors: ValidationErrors) => {
    if (password.value === passwordConfirmation.value) return true;

    const errorMessages = ['A senha e confirmação de senha devem ser iguais'];

    addErrorToFields({
        validationErrors: errors,
        errorMessages: {
            password: errorMessages,
            passwordConfirmation: errorMessages,
        },
        fieldRefs: formFieldsRefs(),
        overwriteErrors: true,
    });

    return false;
};

const validateForm = () => {
    let validFields = true;
    const fieldsRefs = formFieldsRefs();
    const newValidationErrors = {} as ValidationErrors;

    errorMessage.value = '';
    clearFieldsErrors(fieldsRefs);

    validFields = validateRequiredFields(
        newValidationErrors,
        {
            name: name.value,
            email: email.value,
            password: password.value,
            passwordConfirmation: passwordConfirmation.value,
        },
        fieldsRefs
    );

    if (!validFields)
        errorMessage.value = 'Todos os campos com * são obrigatórios';

    validFields =
        validFields && validateEmail(email.value, newValidationErrors);

    validFields =
        validFields && validatePassword(password.value, newValidationErrors);

    validFields =
        validFields && validatePasswordAndConfirmation(newValidationErrors);

    validationErrors.value = newValidationErrors;

    return validFields;
};

const submit = async () => {
    if (!validateForm()) return;

    loading.value = true;

    const apiAdapter = new APIAdapter();

    try {
        await apiAdapter.postWithoutAuth('/truck-drivers/', {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        });

        errorMessage.value = '';
        presentToast('Conta criada com sucesso!', 'success');

        router.push({ name: 'Home' });
    } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
            assignValidationErrorsFromResponse(
                validationErrors.value,
                error.response?.data,
                formFieldsRefs()
            );

            errorMessage.value = error.response?.data.message;

            presentToast(errorMessage.value, 'danger');
        } else {
            errorMessage.value =
                'Erro de conexão com o servidor. Tente novamente.';
            presentToast(errorMessage.value, 'danger');
        }
    } finally {
        loading.value = false;
    }
};
</script>
