<template>
  <ion-searchbar v-model="searchTerm" :debounce="300" placeholder="Search..." />
</template>

<script setup lang="ts">
import { IonSearchbar } from "@ionic/vue";
import { ref, watch, defineEmits } from "vue";

const searchTerm = ref("");
const emit = defineEmits<{
  (e: "update:searchTerm", val: string): void;
}>();

watch(searchTerm, (val) => {
  emit("update:searchTerm", val);
});
</script>
