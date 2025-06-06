<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title size="large">Landlord - Lite</ion-title>

        <ion-buttons slot="end">
          <ion-button fill="clear">
            <ion-icon
              aria-hidden="true"
              :icon="settings"
              style="font-size: 28px"
            />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ExploreContainer name="Tab 1 page" />
      <QuickAccess />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import QuickAccess from "@/views/Home/components/QuickAccess.vue";
import { settings } from "ionicons/icons";
</script>
