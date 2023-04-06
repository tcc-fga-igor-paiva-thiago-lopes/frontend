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
                            v-model="name"
                            placeholder="Digite seu nome"
                        >
                        </ion-input>
                    </ion-item>

                    <ion-item class="form-item">
                        <ion-label position="stacked">E-mail *</ion-label>
                        <ion-input
                            required
                            type="email"
                            :name="email"
                            v-model="email"
                            inputmode="email"
                            placeholder="Digite seu e-mail"
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
                            v-model="password"
                            placeholder="Digite sua senha"
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
                            v-model="passwordConfirmation"
                            placeholder="Confirme sua senha"
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

import { presentToast } from '@/utils/toast';
import APIAdapter from '@/services/api';

const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const validateForm = () => {
    if (
        !name.value ||
        !email.value ||
        !password.value ||
        !passwordConfirmation.value
    ) {
        errorMessage.value = 'Todos os campos com * são obrigatórios';
        return false;
    }

    if (password.value !== passwordConfirmation.value) {
        errorMessage.value = 'A senha e confirmação de senha devem ser iguais';
        return false;
    }

    return true;
};

const submit = async () => {
    if (!validateForm()) return;

    loading.value = true;

    const apiAdapter = new APIAdapter();

    try {
        await apiAdapter.postWithoutAuth('/truck-drivers', {
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
            errorMessage.value = error.response?.data.error;
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
