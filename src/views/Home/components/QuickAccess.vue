<template>
  <ServicesCards
    v-for="(service, index) in services"
    :key="index"
    :icon="service.icon"
    :title="service.title"
    :subtitle="service.subtitle"
    :description="service.description"
    @click="goTo(service.path)"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ServicesCards from "@/views/Home/components/ServicesCards.vue";

const router = useRouter();

const services = ref([
  {
    icon: "people-outline",
    title: "Tenants Management",
    subtitle: "Manage tenant profiles and records",
    path: "/tenantmanagement",
    description:
      "Keep track of all your tenants in one place. View, add, or edit tenant information easily.",
  },
  {
    icon: "business-outline",
    title: "Properties",
    subtitle: "Manage your rental properties",
    path: "/propertieslist",
    description: "View and update property details and rooms.",
  },
  {
    icon: "calendar-outline",
    title: "Due Calendar",
    subtitle: "View upcoming dues",
    path: "/tenantduecalendar",
    description:
      "Check due dates for tenants. Click on a date to see details like tenant, property, and amount.",
  },
]);

function goTo(path: string) {
  if (path) {
    router.push(path);
  }
}
</script>
