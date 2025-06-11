<template>
  <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
    <ion-refresher-content
      pullingText="Pull to refresh"
    ></ion-refresher-content>
  </ion-refresher>
</template>

<script lang="ts" setup>
import { IonRefresher, IonRefresherContent } from "@ionic/vue";

const handleRefresh = (event: CustomEvent) => {
  setTimeout(() => {
    (event.target as HTMLIonRefresherElement).complete();
  }, 1500);
};
</script>
