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
        :prefer-wheel="false"
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
import { LocalNotifications } from "@capacitor/local-notifications";

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

// Schedule local notifications for upcoming dues (1 day before)
async function scheduleUpcomingNotifications() {
  const today = new Date();

  const upcoming = dueDates.value.filter((d) => {
    const due = new Date(d.date);
    const diffDays = Math.floor(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays === 1;
  });

  const notifications = upcoming.map((d, index) => ({
    id: index + 1,
    title: "📢 Rent Due Reminder",
    body: `Tenant ${d.tenant}'s rent is due tomorrow 💰`,
    schedule: {
      at: new Date(new Date(d.date).setDate(new Date(d.date).getDate() - 1)),
    },
  }));

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}

// 🔔 Send notification for tenants due today, repeat every 3 hours
async function startTodayDueReminder() {
  const today = new Date().toISOString().split("T")[0];
  const dueTodayList = dueDates.value.filter((d) => d.date === today);

  if (dueTodayList.length === 0) return;

  const tenantNames = dueTodayList.map((d) => d.tenant).join(", ");
  const message =
    dueTodayList.length === 1
      ? `Today, ${tenantNames} is due for rent!`
      : `Today, ${tenantNames} are due for rent!`;

  let notificationId = 500;

  // Function to trigger the notification
  const sendReminder = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId++,
          title: "📢 Rent Due Today",
          body: message,
          schedule: { at: new Date(new Date().getTime() + 1000) }, // 1 second delay
        },
      ],
    });
  };

  // Ask permission and start repeating reminder
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display === "granted") {
    sendReminder(); // send now
    setInterval(sendReminder, 3 * 60 * 60 * 1000); // repeat every 3 hours
  }
}

// Load and prepare due dates
function onLoad() {
  const stored = localStorage.getItem("tenants");
  if (!stored) return;

  try {
    const tenants = JSON.parse(stored);
    dueDates.value = generateRecurringDates(tenants);

    LocalNotifications.requestPermissions().then((result) => {
      if (result.display === "granted") {
        scheduleUpcomingNotifications();
        startTodayDueReminder();
      }
    });
  } catch (err) {
    console.error("Error parsing tenants:", err);
  }
}

onLoad();
</script>
