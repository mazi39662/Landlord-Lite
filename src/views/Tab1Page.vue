<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title size="large"></ion-title>
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
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import QuickAccess from "@/views/Home/components/QuickAccess.vue";
</script>
