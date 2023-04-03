<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Cadastro</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div v-if="loading">
                <ion-loading />
            </div>

            <form class="form ion-padding" @submit="submit">
                <ion-list class="ion-no-padding">
                    <ion-item class="form-item">
                        <ion-label position="stacked">Nome *</ion-label>
                        <ion-input
                            required
                            :name="name"
                            placeholder="Digite seu nome"
                            @ion-change="(event) => setName(event.target.value as string)"
                        >
                        </ion-input>
                    </ion-item>

                    <ion-item class="form-item">
                        <ion-label position="stacked">E-mail *</ion-label>
                        <ion-input
                            required
                            type="email"
                            inputmode="email"
                            :name="email"
                            placeholder="Digite seu e-mail"
                            @ion-change="(event) => setEmail(event.target.value as string)"
                        >
                        </ion-input>
                        <ion-note slot="helper"
                            >Insira um e-mail válido</ion-note
                        >
                        <ion-note slot="error">E-mail inválido</ion-note>
                    </ion-item>

                    <ion-item class="form-item">
                        <ion-label position="stacked">Senha *</ion-label>
                        <ion-input
                            required
                            type="password"
                            :name="password"
                            placeholder="Digite sua senha"
                            @ion-change="(event) => setPassword(event.target.value as string)"
                        >
                        </ion-input>
                    </ion-item>

                    <ion-item class="form-item">
                        <ion-label position="stacked"
                            >Confirmação de senha *</ion-label
                        >
                        <ion-input
                            required
                            type="password"
                            :name="passwordConfirmation"
                            placeholder="Confirme sua senha"
                            @ion-change="(event) => setPasswordConfirmation(event.target.value as string)"
                        >
                        </ion-input>
                        <ion-note slot="helper"
                            >Deve ser igual a senha</ion-note
                        >
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
} from '@ionic/vue';
import { presentToast } from '@/utils/toast';
import APIAdapter from '@/services/api';
import { useState } from '@/composables/state';

const router = useRouter();

const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [passwordConfirmation, setPasswordConfirmation] = useState('');

const validateForm = () => {
    if (
        !name.value ||
        !email.value ||
        !password.value ||
        !passwordConfirmation.value
    ) {
        setErrorMessage('Todos os campos com * são obrigatórios');
        return false;
    }

    if (password.value !== passwordConfirmation.value) {
        setErrorMessage('A senha e confirmação de senha devem ser iguais');
        return false;
    }

    return true;
};

const submit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const apiAdapter = new APIAdapter();

    try {
        await apiAdapter.postWithoutAuth('/truck-drivers', {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        });

        setErrorMessage('');
        presentToast('Conta criada com sucesso!', 'success');

        router.push({ name: 'Home' });
    } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
            setErrorMessage(error.response?.data.error);
            presentToast(errorMessage.value, 'danger');
        } else {
            setErrorMessage('Erro de conexão com o servidor. Tente novamente.');
            presentToast(errorMessage.value, 'danger');
        }
    } finally {
        setLoading(false);
    }
};
</script>
