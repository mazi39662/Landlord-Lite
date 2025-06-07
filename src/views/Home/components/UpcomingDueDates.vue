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
        <ion-note slot="end"> {{ item.property }} - {{ item.Unit }} </ion-note>
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
import { ref, computed } from "vue";

// Sample due date data
const dueDates = ref([
  {
    name: "Juan Dela Cruz",
    date: "2025-06-08",
    Unit: 101,
    property: "Building A",
  },
  { name: "Maria Santos", date: "2025-06-09" },
  { name: "Carlos Reyes", date: "2025-06-10" },
  { name: "Outdated Entry", date: "2025-06-01" },
]);

const today = new Date();
const threeDaysFromNow = new Date();
threeDaysFromNow.setDate(today.getDate() + 3);

const filteredDueDates = computed(() =>
  dueDates.value.filter((item) => {
    const dueDate = new Date(item.date);
    return dueDate >= today && dueDate <= threeDaysFromNow;
  })
);
</script>

<style scoped>
.card-container {
  max-width: 600px;
  margin: 0 auto;
}
.list-container {
  height: 150px;
  overflow-y: scroll;
  background-color: aliceblue;
}
</style>
