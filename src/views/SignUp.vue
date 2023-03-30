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
                <ion-list style="padding: 0">
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
                            inputmode="email"
                            :name="email"
                            v-model="email"
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
                            placeholder="Confirme sua senha"
                            :name="passwordConfirmation"
                            v-model="passwordConfirmation"
                        >
                        </ion-input>
                        <ion-note slot="helper"
                            >Deve ser igual a senha</ion-note
                        >
                    </ion-item>

                    <ion-text color="danger" v-if="!loading && !!errorMessage">
                        <h6>{{ errorMessage }}</h6>
                    </ion-text>
                </ion-list>

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

<!-- <script lang="ts">
import axios from 'axios';

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
import { useState } from '@/composables/state';
import { presentToast } from '@/utils/toast';

export default {
    setup() {
        const [loading, setLoading] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [passwordConfirmation, setPasswordConfirmation] = useState('');

        return {
            loading,
            setLoading,
            errorMessage,
            setErrorMessage,
            name,
            setName,
            email,
            setEmail,
            password,
            setPassword,
            passwordConfirmation,
            setPasswordConfirmation,
        };
    },
    methods: {
        async submit() {
            const apiBaseUrl = process.env.VUE_APP_API_URL;

            const { name, email, password, passwordConfirmation } = this;

            console.log({
                name,
                email,
                password,
                passwordConfirmation,
            });

            if (!name || !email || !password || !passwordConfirmation) {
                this.setErrorMessage('Todos os campos com * são obrigatórios');
                return;
            }

            console.log('password: ', password);
            console.log('passwordConfirmation: ', passwordConfirmation);

            if (password !== passwordConfirmation) {
                this.setErrorMessage(
                    'A senha e confirmação de senha devem ser iguais'
                );
                return;
            }

            this.setLoading(true);

            try {
                const response = await axios.post(
                    `${apiBaseUrl}/truck_driver`,
                    {
                        name,
                        email,
                        password,
                        passwordConfirmation,
                    }
                );

                console.log(response);

                this.setErrorMessage('');
                presentToast('Conta criada com sucesso!', 'success');

                this.$router.push({ name: 'Home' });
            } catch (error) {
                console.error(error);

                if (axios.isAxiosError(error)) {
                    this.setErrorMessage(error.response?.data.error);
                    presentToast(this.errorMessage, 'danger');
                }
            } finally {
                this.setLoading(false);
            }
        },
    },
    components: {
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
    },
};
</script> -->

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
import { useState } from '@/composables/state';
import { presentToast } from '@/utils/toast';
import { ref } from 'vue';

const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

// const [loading, setLoading] = useState(false);
// const [errorMessage, setErrorMessage] = useState('');
// const [name, setName] = useState('');
// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');
// const [passwordConfirmation, setPasswordConfirmation] = useState('');

const submit = async () => {
    const apiBaseUrl = process.env.VUE_APP_API_URL;

    console.log({
        name,
        email,
        password,
        passwordConfirmation,
    });

    if (
        !name.value ||
        !email.value ||
        !password.value ||
        !passwordConfirmation.value
    ) {
        errorMessage.value = 'Todos os campos com * são obrigatórios';
        return;
    }

    console.log('password: ', password);
    console.log('passwordConfirmation: ', passwordConfirmation);

    if (password.value !== passwordConfirmation.value) {
        errorMessage.value = 'A senha e confirmação de senha devem ser iguais';
        return;
    }

    loading.value = true;

    try {
        const response = await axios.post(
            `${apiBaseUrl}/truck-drivers`,
            {
                name,
                email,
                password,
                passwordConfirmation,
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            }
        );

        console.log(response);

        errorMessage.value = '';
        presentToast('Conta criada com sucesso!', 'success');

        router.push({ name: 'Home' });
    } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
            errorMessage.value = error.response?.data.error;
            presentToast(errorMessage.value, 'danger');
        }
    } finally {
        loading.value = false;
    }
};
</script>
