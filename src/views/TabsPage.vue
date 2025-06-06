<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tenants" href="/tenantmanagement">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Tenants</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="properties" href="/propertieslist">
          <ion-icon aria-hidden="true" :icon="business" />
          <ion-label>Properties</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="calendar" href="/tenantduecalendar">
          <ion-icon aria-hidden="true" :icon="calendar" />
          <ion-label>Dues</ion-label>
        </ion-tab-button>

        <!-- <ion-tab-button tab="transactions" href="/tabs/transactions">
          <ion-icon aria-hidden="true" :icon="wallet" />
          <ion-label>Transactions</ion-label>
        </ion-tab-button> -->

        <!-- <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon aria-hidden="true" :icon="settings" />
          <ion-label>Settings</ion-label>
        </ion-tab-button> -->
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";

import {
  home,
  business,
  people,
  wallet,
  // settings,
  calendar,
} from "ionicons/icons";
</script>
