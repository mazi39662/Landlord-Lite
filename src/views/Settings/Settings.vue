<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Notifications -->
      <ion-list>
        <ion-item-divider color="light">Notifications</ion-item-divider>
        <ion-item>
          <ion-icon :icon="notificationsOutline" slot="start" />
          <ion-label>Push Notifications</ion-label>
          <ion-toggle slot="end" v-model="settings.pushNotifications" />
        </ion-item>
      </ion-list>

      <!-- App Preferences -->
      <ion-list>
        <ion-item-divider color="light">App Preferences</ion-item-divider>
        <ion-item>
          <ion-icon :icon="moonOutline" slot="start" />
          <ion-label>Dark Mode</ion-label>
          <ion-toggle slot="end" v-model="settings.darkMode" />
        </ion-item>

        <!-- Currency Symbol Dropdown -->
        <ion-item>
          <ion-icon :icon="cashOutline" slot="start" />
          <ion-label>Currency Symbol</ion-label>
          <ion-select
            :value="settings.currency"
            @ionChange="(e) => (settings.currency = e.detail.value)"
            interface="popover"
          >
            <ion-select-option value="₱">₱ (Peso)</ion-select-option>
            <ion-select-option value="$">$ (Dollar)</ion-select-option>
            <ion-select-option value="€">€ (Euro)</ion-select-option>
            <ion-select-option value="¥">¥ (Yen)</ion-select-option>
            <ion-select-option value="₹">₹ (Rupee)</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item button @click="clearCache">
          <ion-icon :icon="trashOutline" slot="start" />
          <ion-label>Clear Cache</ion-label>
        </ion-item>
      </ion-list>

      <!-- About -->
      <ion-list>
        <ion-item-divider color="light">About</ion-item-divider>
        <ion-item button @click="openPrivacyPolicy">
          <ion-icon :icon="documentTextOutline" slot="start" />
          <ion-label>Privacy Policy</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :icon="informationCircleOutline" slot="start" />
          <ion-label>App Version</ion-label>
          <ion-note slot="end">1.0.0</ion-note>
        </ion-item>
      </ion-list>
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
  IonList,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonToggle,
  IonIcon,
  IonNote,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import {
  notificationsOutline,
  moonOutline,
  trashOutline,
  documentTextOutline,
  informationCircleOutline,
  cashOutline,
} from "ionicons/icons";
import { ref, watch } from "vue";
import { LocalNotifications } from "@capacitor/local-notifications";

// Load settings from localStorage or set default
const storedSettings = localStorage.getItem("user_settings");
const settings = ref(
  storedSettings
    ? JSON.parse(storedSettings)
    : {
        pushNotifications: false,
        emailAlerts: false,
        darkMode: false,
        currency: "₱",
      }
);

// Save settings to localStorage whenever they change
watch(
  settings,
  (val) => {
    localStorage.setItem("user_settings", JSON.stringify(val));
  },
  { deep: true }
);

// Watch push notifications toggle
watch(
  () => settings.value.pushNotifications,
  async (enabled) => {
    if (enabled) {
      const result = await LocalNotifications.requestPermissions();
      if (result.display !== "granted") {
        alert("Push notification permission denied.");
        settings.value.pushNotifications = false;
      } else {
        console.log("Push notifications enabled.");
      }
    } else {
      console.log("Push notifications disabled.");
    }
  }
);

// Watch dark mode toggle and apply/remove 'dark' class globally
watch(
  () => settings.value.darkMode,
  (enabled) => {
    if (enabled) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  },
  { immediate: true } // Apply on load
);

function clearCache() {
  const confirmClear = window.confirm(
    "⚠️ WARNING: Clearing cache will permanently delete all saved data from local storage.\n\n" +
      "This action cannot be undone.\n\n" +
      "It is strongly advised NOT to delete your data unless absolutely necessary.\n\n" +
      "Are you sure you want to continue?"
  );

  if (confirmClear) {
    localStorage.clear();
    alert("✅ Cache cleared successfully. All data has been deleted.");
  } else {
    alert("❌ Cache clearing cancelled. Your data is safe.");
  }
}

function openPrivacyPolicy() {
  window.open("https://yourdomain.com/privacy", "_blank");
}
</script>
