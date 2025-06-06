<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tenant Due Calendar</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-datetime
        class="custom-calendar"
        presentation="date"
        prefer-wheel="false"
        :value="selectedDate"
        :highlighted-dates="highlightedDates"
        @ionChange="onDateSelect"
      ></ion-datetime>

      <ion-list v-if="dueToday.length > 0" class="ion-margin-top">
        <ion-item-divider color="light"
          >Due on {{ selectedDate }}</ion-item-divider
        >
        <ion-item v-for="(due, index) in dueToday" :key="index">
          <ion-label>
            <h3>{{ due.tenant }}</h3>
            <p>🏢 {{ due.property }}</p>
            <p>💰 ₱{{ due.amount }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-text v-else class="ion-margin-top">
        <p>No dues on this day.</p>
      </ion-text>
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
  IonDatetime,
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonText,
} from "@ionic/vue";
import { ref, computed } from "vue";

// Sample due date data
const dueDates = ref([
  {
    date: "2025-06-10",
    tenant: "John Doe",
    property: "Building A - Unit 101",
    amount: 5000,
  },
  {
    date: "2025-06-15",
    tenant: "Jane Smith",
    property: "Building B - Unit 202",
    amount: 6200,
  },
  {
    date: "2025-06-15",
    tenant: "Mark Lee",
    property: "Building C - Unit 303",
    amount: 5400,
  },
]);

const selectedDate = ref(new Date().toISOString().split("T")[0]);

const dueToday = computed(() =>
  dueDates.value.filter((d) => d.date === selectedDate.value)
);

function onDateSelect(event: CustomEvent) {
  selectedDate.value = event.detail.value.split("T")[0];
}

// Highlighted Dates with colors for ion-datetime
const highlightedDates = computed(() =>
  dueDates.value.map((d) => ({
    date: d.date,
    textColor: "#ffffff",
    backgroundColor: "#ff4d4f", // red tone for dues
  }))
);
</script>
