<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Blank</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Blank</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-button @click="removeAllAccounts"> Remove all </ion-button>

            <ion-button @click="addAccount({ name: 'Caramba' })">
                <ion-icon slot="icon-only" :icon="add"></ion-icon>
            </ion-button>

            <ion-list class="ion-padding">
                <ion-item v-for="account in accounts" :key="account.id">
                    <ion-label>
                        {{ account.id }} => {{ account.name }}
                    </ion-label>

                    <ion-button
                        slot="end"
                        @click="updateAccount(account.id, { name: 'Editou?' })"
                    >
                        <ion-icon slot="icon-only" :icon="pencil"></ion-icon>
                    </ion-button>

                    <ion-button slot="end" @click="removeAccount(account.id)">
                        <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
} from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';

import { Account } from '@/models/account';
import { useAccountsStore } from '@/store';

import { add, trash, pencil } from 'ionicons/icons';

const accountsStore = useAccountsStore();

const { accounts } = storeToRefs(accountsStore);

const {
    loadAccountsFromDatabase,
    addAccount,
    removeAllAccounts,
    removeAccount,
    updateAccount,
    findAccount,
} = accountsStore;

onBeforeMount(async () => {
    const accounts = await Account.find();

    console.log(JSON.stringify(accounts));

    await loadAccountsFromDatabase();

    console.log(await findAccount(66));
});
</script>

<style scoped></style>
