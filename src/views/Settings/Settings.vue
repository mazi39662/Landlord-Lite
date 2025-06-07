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
        <ion-item>
          <ion-icon :icon="mailOutline" slot="start" />
          <ion-label>Email Alerts</ion-label>
          <ion-toggle slot="end" v-model="settings.emailAlerts" />
        </ion-item>
      </ion-list>

      <!-- App Preferences -->
      <ion-list>
        <ion-item-divider color="light">App Preferences</ion-item-divider>
        <ion-item>
          <ion-icon :icon="moonOutline" slot="start" />
          <ion-label>Dark Mode</ion-label>
          <ion-toggle
            slot="end"
            v-model="settings.darkMode"
            @ionChange="toggleDarkMode"
          />
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
} from "@ionic/vue";
import {
  personOutline,
  lockClosedOutline,
  notificationsOutline,
  mailOutline,
  moonOutline,
  trashOutline,
  documentTextOutline,
  informationCircleOutline,
} from "ionicons/icons";
import { ref } from "vue";

// Settings state
const settings = ref({
  pushNotifications: true,
  emailAlerts: false,
  darkMode: false,
});

// Handlers
function goToProfile() {
  console.log("Navigating to profile settings...");
}

function changePassword() {
  console.log("Navigating to change password...");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark", settings.value.darkMode);
}

function clearCache() {
  console.log("Clearing app cache...");
  localStorage.clear();
  alert("Cache cleared successfully.");
}

function openPrivacyPolicy() {
  window.open("https://yourdomain.com/privacy", "_blank");
}
</script>

<style scoped>
ion-item {
  --inner-padding-end: 8px;
}
</style>
