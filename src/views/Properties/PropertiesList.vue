<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Properties</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal">
            <ion-icon slot="icon-only" :icon="add" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <search-bar v-model="searchTerm" />
    </ion-header>

    <ion-content>
      <PropertiesList
        :properties="filteredProperties"
        :badgeColor="badgeColor"
        @edit="openEditModal"
        @delete="handleDeleteProperty"
        @edit-unit="handleEditUnit"
        @delete-unit="handleDeleteUnit"
      />
    </ion-content>

    <PropertyAddModal
      :isOpen="showModal"
      :properties="properties"
      :propertyToEdit="propertyToEdit"
      @close="closeModal"
      @add="handleAddProperty"
      @update="handleUpdateProperty"
      @delete="handleDeleteProperty"
    />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import { ref, reactive, computed } from "vue";

import SearchBar from "@/components/SearchBar.vue";
import PropertiesList from "@/views/Properties/components/PropertyList.vue";
import PropertyAddModal from "@/views/Properties/components/PropertyAddModal.vue";

const showModal = ref(false);
const searchTerm = ref("");
const propertyToEdit = ref<Property | null>(null);

interface Tenant {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
  status: "Occupied" | "Available" | "Not Available";
  tenant?: Tenant;
}

interface Property {
  id: number;
  name: string;
  location: string;
  num_of_rooms: number;
  description?: string;
  created_at: string;
  units: Unit[];
}

const properties = reactive<Property[]>([
  {
    id: 1,
    name: "Building A",
    location: "123 Main St",
    num_of_rooms: 3,
    description: "Main branch",
    created_at: new Date().toISOString(),
    units: [
      {
        id: 101,
        name: "Unit 101",
        status: "Occupied",
        tenant: { id: 1, name: "John Doe" },
      },
      {
        id: 102,
        name: "Unit 102",
        status: "Available",
      },
      {
        id: 103,
        name: "Unit 103",
        status: "Not Available",
      },
    ],
  },
  {
    id: 2,
    name: "Building B",
    location: "456 Market St",
    num_of_rooms: 2,
    description: "Secondary location",
    created_at: new Date().toISOString(),
    units: [
      {
        id: 201,
        name: "Unit 201",
        status: "Occupied",
        tenant: { id: 2, name: "Jane Smith" },
      },
      {
        id: 202,
        name: "Unit 202",
        status: "Available",
      },
    ],
  },
]);

function openAddModal() {
  propertyToEdit.value = null;
  showModal.value = true;
}

function openEditModal(property: Property) {
  propertyToEdit.value = { ...property };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  propertyToEdit.value = null;
}

function handleAddProperty(newProp: Property) {
  properties.push(newProp);
  closeModal();
}

function handleUpdateProperty(updatedProp: Property) {
  const idx = properties.findIndex((p) => p.id === updatedProp.id);
  if (idx !== -1) {
    properties[idx] = { ...updatedProp };
  }
  closeModal();
}

function handleDeleteProperty(id: number) {
  const idx = properties.findIndex((p) => p.id === id);
  if (idx !== -1) properties.splice(idx, 1);
}

function handleEditUnit({
  propertyId,
  unit,
}: {
  propertyId: number;
  unit: Unit;
}) {
  const prop = properties.find((p) => p.id === propertyId);
  if (!prop) return;

  const idx = prop.units.findIndex((u) => u.id === unit.id);
  if (idx !== -1) {
    prop.units[idx] = { ...unit, name: unit.name + " (Edited)" }; // Demo edit
  }
}

function handleDeleteUnit({
  propertyId,
  unitId,
}: {
  propertyId: number;
  unitId: number;
}) {
  const prop = properties.find((p) => p.id === propertyId);
  if (!prop) return;

  const idx = prop.units.findIndex((u) => u.id === unitId);
  if (idx !== -1) prop.units.splice(idx, 1);
}

const filteredProperties = computed(() => {
  if (!searchTerm.value.trim()) return properties;

  const term = searchTerm.value.toLowerCase();

  return properties
    .map((property) => {
      const matchingUnits = property.units.filter((unit) => {
        return (
          unit.name.toLowerCase().includes(term) ||
          unit.status.toLowerCase().includes(term) ||
          unit.tenant?.name.toLowerCase().includes(term)
        );
      });

      if (property.name.toLowerCase().includes(term) || matchingUnits.length) {
        return { ...property, units: matchingUnits };
      }

      return null;
    })
    .filter(Boolean) as Property[];
});

function badgeColor(status: Unit["status"]) {
  switch (status) {
    case "Occupied":
      return "danger";
    case "Available":
      return "success";
    case "Not Available":
      return "medium";
  }
}
</script>
