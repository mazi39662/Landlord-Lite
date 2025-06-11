<template>
  <ion-item>
    <ion-label class="label-container">
      <img :src="tenant.id_image" alt="profileID" class="profileID" />
      <div>
        <h2>{{ tenant.name }}</h2>
        <p><strong>Unit:</strong> {{ tenant.unit }}</p>
        <p><strong>Property:</strong> {{ tenant.property }}</p>
      </div>
    </ion-label>
    <ion-buttons slot="end">
      <ion-button color="medium" @click="$emit('view', tenant)">
        <ion-icon slot="icon-only" :icon="eye" />
      </ion-button>
      <ion-button color="primary" @click="$emit('edit', tenant)">
        <ion-icon slot="icon-only" :icon="pencil" />
      </ion-button>
      <ion-button color="danger" @click="$emit('delete', tenant.id)">
        <ion-icon slot="icon-only" :icon="trash" />
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonButtons, IonButton, IonIcon } from "@ionic/vue";
import { pencil, trash, eye } from "ionicons/icons";

interface Tenant {
  id: number;
  name: string;
  id_image: string;
}

const props = defineProps<{
  tenant: Tenant & { unit: string; property: string };
}>();
</script>

<style scoped>
.profileID {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 10px;
}
.label-container {
  display: flex;
  align-items: center;
}
</style>
