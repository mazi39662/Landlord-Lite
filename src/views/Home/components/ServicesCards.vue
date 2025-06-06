<template>
  <ion-card class="ion-text-center" @click="$emit('click')">
    <ion-icon :name="icon" size="large" class="icon-top"></ion-icon>

    <ion-card-header>
      <ion-card-title>{{ title }}</ion-card-title>
      <ion-card-subtitle>{{ subtitle }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      {{ description }}
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ServicesCards",
  components: {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
  },
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: false, default: "" },
    description: { type: String, required: false, default: "" },
  },
});
</script>

<style scoped>
.icon-top {
  font-size: 64px;
  color: #3880ff;
  margin-top: 20px;
}
</style>
