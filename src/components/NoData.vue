<template>
  <div class="no-data-container">
    <ion-icon :icon="warningOutline" class="no-data-icon" />
    <p class="no-data-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { warningOutline } from "ionicons/icons";
import { defineProps } from "vue";

defineProps({
  message: {
    type: String,
    default: "No data available.",
  },
});
</script>

<style scoped>
.no-data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--ion-color-medium);
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.no-data-message {
  font-size: 16px;
}
</style>
