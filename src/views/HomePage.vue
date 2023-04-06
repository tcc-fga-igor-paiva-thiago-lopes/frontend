<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Página inicial</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="options-container">
                <ion-text>
                    <h5>Bem-vindo!</h5>
                </ion-text>

                <ion-button
                    shape="round"
                    class="signup-button"
                    :onclick="() => $router.push({ name: 'SignUp' })"
                >
                    Criar conta
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<style>
.options-container {
    width: 100%;
    display: flex;
    padding-top: 32px;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
}

.signup-button {
    width: 250px;
    margin-top: 32px;
}
</style>

<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText,
    IonButton,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';
</script>
