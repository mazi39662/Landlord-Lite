<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tenant Due Calendar</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <PageRefresher />
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
        <ion-item
          v-for="(due, index) in dueToday"
          :key="index"
          @click="openReceipt(due)"
          button
          detail
        >
          <ion-label>
            <h3>{{ due.tenant }}</h3>
            <p>🏢 {{ due.property }}</p>
            <p>💰 {{ currency[0] || "$" }}{{ formatAmount(due.amount) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-text v-else class="ion-margin-top">
        <p>No dues on this day.</p>
      </ion-text>

      <!-- 📋 Receipt Modal -->
      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Rent Receipt</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showModal = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div id="receipt-content" class="receipt">
            <h2>🏠 Rent Payment Receipt</h2>
            <p><strong>Tenant:</strong> {{ selectedTenant?.tenant }}</p>
            <p><strong>Property:</strong> {{ selectedTenant?.property }}</p>
            <p><strong>Date Due:</strong> {{ selectedTenant?.date }}</p>

            <!-- Utilities for viewing -->
            <div v-if="!isDownloading">
              <p><strong>Utilities:</strong></p>
              <ion-item>
                <ion-input
                  type="number"
                  v-model.number="electricity"
                  label="Electricity: "
                  placeholder="0"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-input
                  type="number"
                  v-model.number="water"
                  label="Water: "
                  placeholder="0"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-input
                  type="number"
                  v-model.number="otherUtility"
                  label="Other: "
                  placeholder="0"
                ></ion-input>
              </ion-item>
            </div>

            <!-- Utilities for printing -->
            <div v-else>
              <p>
                <strong>Electricity:</strong> {{ currency[0] || "$"
                }}{{ formatAmount(electricity) }}
              </p>
              <p>
                <strong>Water:</strong> {{ currency[0] || "$"
                }}{{ formatAmount(water) }}
              </p>
            </div>

            <p class="ion-margin-top">
              <strong>Base Rent:</strong> {{ currency[0] || "$"
              }}{{ formatAmount(selectedTenant?.amount || 0) }}
            </p>
            <p>
              <strong>Total:</strong>
              {{ currency[0] || "$" }}{{ formatAmount(totalAmount) }}
            </p>

            <hr />
            <p class="text-center">Thank you for your payment!</p>
          </div>

          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="downloadReceipt"
          >
            Download Receipt
          </ion-button>

          <ion-button expand="block" color="success" @click="saveUtilityData">
            Save Data
          </ion-button>
        </ion-content>
      </ion-modal>
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
  IonButton,
  IonButtons,
  IonInput,
  IonModal,
} from "@ionic/vue";
import { ref, computed, nextTick } from "vue";
import { LocalNotifications } from "@capacitor/local-notifications";
import html2canvas from "html2canvas";
import PageRefresher from "@/components/PageRefresher.vue";

// Reactive state
const dueDates = ref<
  { date: string; tenant: string; property: string; amount: number }[]
>([]);
const selectedDate = ref(new Date().toISOString().split("T")[0]);

const isDownloading = ref(false);
const otherUtility = ref(0);
const electricity = ref(0);
const water = ref(0);
const currency = ref<string[]>([]);

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
        // Format date manually to avoid timezone issues
        const localDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${dueDate.getDate().toString().padStart(2, "0")}`;

        list.push({
          date: localDate,
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

// Send notification for tenants due today, repeat every 3 hours
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

  const sendReminder = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId++,
          title: "📢 Rent Due Today",
          body: message,
          schedule: { at: new Date(new Date().getTime() + 1000) },
        },
      ],
    });
  };

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display === "granted") {
    sendReminder();
    setInterval(sendReminder, 3 * 60 * 60 * 1000); // repeat every 3 hours
  }
}

const showModal = ref(false);
const selectedTenant = ref<{
  tenant: string;
  property: string;
  amount: number;
  date: string;
} | null>(null);

function openReceipt(due: any) {
  selectedTenant.value = due;

  // Load saved utility data if exists
  const key = `utilities-${due.date}-${due.tenant}`;
  const saved = localStorage.getItem(key);

  if (saved) {
    const data = JSON.parse(saved);
    electricity.value = data.electricity || 0;
    water.value = data.water || 0;
    otherUtility.value = data.otherUtility || 0;
  } else {
    electricity.value = 0;
    water.value = 0;
    otherUtility.value = 0;
  }

  showModal.value = true;
}

const totalAmount = computed((): number => {
  const base = Number(selectedTenant.value?.amount) || 0;
  const elec = Number(electricity.value) || 0;
  const watr = Number(water.value) || 0;
  const otu = Number(otherUtility.value || 0);
  return base + elec + watr + otu;
});

async function downloadReceipt() {
  const element = document.getElementById("receipt-content");
  if (!element) return;

  isDownloading.value = true; // Switch to print view
  await nextTick(); // Wait for DOM update

  element.classList.add("light-mode");

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2, // Improve quality
  });

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `rent-receipt-${
    selectedTenant.value?.tenant || "tenant"
  }.png`;
  link.click();

  element.classList.remove("light-mode");
  isDownloading.value = false; // Switch back to input view
}

function saveUtilityData() {
  if (!selectedTenant.value) return;

  const key = `utilities-${selectedTenant.value.date}-${selectedTenant.value.tenant}`;
  const data = {
    electricity: Number(electricity.value),
    water: Number(water.value),
    otherUtility: Number(otherUtility.value),
  };

  localStorage.setItem(key, JSON.stringify(data));
  window.alert("Utility data saved successfully!");
}

function loadUserSettings() {
  const settings = localStorage.getItem("user_settings");
  console.log("User settings:", settings);
  if (settings) {
    try {
      const parsedSettings = JSON.parse(settings);
      currency.value = parsedSettings.currency || [];
    } catch (e) {
      console.error("Error parsing user settings:", e);
    }
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
loadUserSettings();
</script>

<style scoped>
.receipt p {
  margin: 6px 0;
  font-size: 16px;
}

.receipt strong {
  display: inline-block;
  min-width: 110px;
}

.receipt {
  border: 3px dashed #ccc;
  padding: 20px;
  border-radius: 10px;
}
.receipt h2 {
  text-align: center;
  margin-bottom: 20px;
}
.text-center {
  text-align: center;
}

.light-mode {
  background: white !important;
  color: black !important;
}

.light-mode * {
  background: transparent !important;
  color: black !important;
  border-color: #ccc !important;
}
</style>
