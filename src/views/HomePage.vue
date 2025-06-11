<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title size="large">Landlord - Lite</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="navigateToSettings">
            <ion-icon
              aria-hidden="true"
              :icon="settings"
              style="font-size: 28px; border-radius: 50%"
            />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <PageRefresher />
      <UpcomingDueDates />
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
import QuickAccess from "@/views/Home/components/QuickAccess.vue";
import { useRouter } from "vue-router";
import { settings } from "ionicons/icons";
import UpcomingDueDates from "@/views/Home/components/UpcomingDueDates.vue";
import PageRefresher from "@/components/PageRefresher.vue";

const router = useRouter();

function navigateToSettings() {
  router.push("/settings");
}
</script>
