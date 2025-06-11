<template>
  <ion-card class="card-container">
    <ion-card-header>
      <ion-card-title>Upcoming Due Dates</ion-card-title>
    </ion-card-header>
    <ion-list class="list-container">
      <ion-item v-for="(item, index) in filteredDueDates" :key="index">
        <ion-label>
          <h2>{{ item.name }}</h2>
          <p>Due on {{ item.date }}</p>
        </ion-label>
        <ion-note slot="end">{{ item.property }} - {{ item.Unit }}</ion-note>
      </ion-item>
      <ion-item v-if="filteredDueDates.length === 0">
        <ion-label>
          <p>No upcoming dues in the next 3 days.</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
} from "@ionic/vue";
import { ref, computed, onMounted } from "vue";

// Reactive array for due dates
const dueDates = ref<any[]>([]);

// Load data on mounted lifecycle
onMounted(() => {
  const storedTenant = localStorage.getItem("tenants");

  if (storedTenant) {
    try {
      const tenants = JSON.parse(storedTenant);
      dueDates.value = tenants.map((t: any) => ({
        name: t.name,
        date: t.due_date,
        Unit: t.unit,
        property: t.property,
      }));
    } catch (err) {
      console.error("Error parsing tenants:", err);
    }
  }
});

// Today's date and 3 days from now
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize to start of day
const threeDaysFromNow = new Date(today);
threeDaysFromNow.setDate(today.getDate() + 3);

// Filter due dates within the next 3 days
const filteredDueDates = computed(() =>
  dueDates.value.filter((item) => {
    const dueDate = new Date(item.date);
    dueDate.setHours(0, 0, 0, 0); // Normalize
    return dueDate >= today && dueDate <= threeDaysFromNow;
  })
);
</script>

<style scoped>
.card-container {
  max-width: 600px;
  margin: 0 auto;
  max-height: 150px;
  height: fit-content;
  overflow-y: auto;
}
</style>
