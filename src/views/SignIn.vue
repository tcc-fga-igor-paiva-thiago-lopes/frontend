<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button
                        @click="() => $router.push({ name: 'Welcome' })"
                    >
                        <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
                    </ion-button>
                </ion-buttons>

                <ion-title>Login</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-loading :is-open="loading" />

            <form class="form ion-padding" @submit="submit">
                <ion-list class="ion-no-padding">
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
                    Login
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
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
    IonIcon,
    IonButtons,
} from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

import APIAdapter from '@/services/api';
import AuthService from '@/services/auth';
import { useAppStore } from '@/store/app';
import { presentToast } from '@/utils/toast';
import APIError from '@/services/api/apiError';

const loading = ref(false);
const errorMessage = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const { setUsername } = useAppStore();

const validateForm = () => {
    if (!email.value || !password.value) {
        errorMessage.value = 'Todos os campos com * são obrigatórios';
        return false;
    }

    if (
        !email.value.match(
            /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        )
    ) {
        errorMessage.value = 'E-mail inválido';
        return false;
    }

    return true;
};

const submit = async () => {
    if (!validateForm()) return;

    loading.value = true;

    try {
        const api = new APIAdapter();

        const response = await api.requestWithoutAuth({
            method: 'POST',
            url: '/truck-drivers/login',
            data: {
                email: email.value,
                password: password.value,
            },
        });

        await AuthService.setToken(response.data.token);
        await setUsername(response.data.name);

        router.push({ name: 'Home' });
    } catch (error) {
        console.error(error);

        if (error instanceof APIError) {
            errorMessage.value = error.response.data.message;

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
