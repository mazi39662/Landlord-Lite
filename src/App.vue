<template>
  <ion-app :class="{ dark: darkMode }">
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { useDarkMode } from "@/useDarkMode";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
const { darkMode } = useDarkMode();
</script>
