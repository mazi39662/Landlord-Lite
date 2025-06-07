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
        <ion-item-divider color="light">
          Due on {{ selectedDate }}
        </ion-item-divider>
        <ion-item v-for="(due, index) in dueToday" :key="index">
          <ion-label>
            <h3>{{ due.tenant }}</h3>
            <p>🏢 {{ due.property }}</p>
            <p>💰 ₱{{ formatAmount(due.amount) }}</p>
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

// Reactive state
const dueDates = ref<
  { date: string; tenant: string; property: string; amount: number }[]
>([]);
const selectedDate = ref(new Date().toISOString().split("T")[0]);

// Generate recurring due dates (monthly)
function generateRecurringDates(tenants: any[]) {
  const today = new Date();
  const monthsToGenerate = 12;
  const list: any[] = [];

  tenants.forEach((tenant: any) => {
    const dueDay = new Date(tenant.due_date).getDate();

    for (let i = 0; i < monthsToGenerate; i++) {
      const dueDate = new Date(
        today.getFullYear(),
        today.getMonth() + i,
        dueDay
      );

      // Handle overflow dates (e.g., Feb 30th)
      if (dueDate.getDate() === dueDay) {
        list.push({
          date: dueDate.toISOString().split("T")[0],
          tenant: tenant.name,
          property: `${tenant.property} - Unit ${tenant.unit}`,
          amount: tenant.unit_price || 0,
        });
      }
    }
  });

  return list;
}

// Computed: Filter dues for selected date
const dueToday = computed(() =>
  dueDates.value.filter((d) => d.date === selectedDate.value)
);

// Computed: Highlighted dates for ion-datetime
const highlightedDates = computed(() =>
  dueDates.value.map((d) => ({
    date: d.date,
    textColor: "#ffffff",
    backgroundColor: "#ff4d4f",
  }))
);

// Format amount with commas
function formatAmount(value: number): string {
  return value.toLocaleString("en-PH");
}

// Handle date selection
function onDateSelect(event: CustomEvent) {
  selectedDate.value = event.detail.value.split("T")[0];
}

// Load and prepare due dates
function onLoad() {
  const stored = localStorage.getItem("tenants");
  if (!stored) return;

  try {
    const tenants = JSON.parse(stored);
    dueDates.value = generateRecurringDates(tenants);
  } catch (err) {
    console.error("Error parsing tenants:", err);
  }
}

onLoad();
</script>
