<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>

                <ion-title>Página não encontrada</ion-title>

                <ConnectionStatusIcon slot="primary" />
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="container">
                <ion-text color="medium">
                    <h2>Não encontrado...</h2>
                </ion-text>

                <ion-icon
                    :icon="sad"
                    color="medium"
                    class="ion-margin-top sad-icon"
                ></ion-icon>

                <ion-button
                    shape="round"
                    @click="() => $router.push({ name: 'Home' })"
                >
                    Ir para página inicial
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<style>
.container {
    width: 100%;
    display: flex;
    padding-top: 32px;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
}

.sad-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 24px;
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
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton,
} from '@ionic/vue';
import { sad } from 'ionicons/icons';

import ConnectionStatusIcon from '@/components/ConnectionStatusIcon.vue';
</script>
