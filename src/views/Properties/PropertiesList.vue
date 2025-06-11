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
      <PageRefresher />
      <div v-if="filteredProperties.length > 0">
        <PropertiesList
          :properties="filteredProperties"
          :badgeColor="badgeColor"
          @edit="openEditModal"
          @delete="handleDeleteProperty"
        />
      </div>
      <div v-else>
        <NoData message="No properties found." />
      </div>
    </ion-content>

    <PropertyAddModal
      :isOpen="showModal"
      :properties="properties"
      :propertyToEdit="propertyToEdit"
      @close="closeModal"
      @add="handleAddProperty"
      @update="handleUpdateProperty"
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
import { ref, reactive, computed, watch } from "vue";
import NoData from "@/components/NoData.vue";
import SearchBar from "@/components/SearchBar.vue";
import PropertiesList from "@/views/Properties/components/PropertyList.vue";
import PropertyAddModal from "@/views/Properties/components/PropertyAddModal.vue";
import PageRefresher from "@/components/PageRefresher.vue";

// ---------------- Interfaces ----------------
interface Tenant {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
  status: "Occupied" | "Available" | "Not Available" | "Move Out";
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

// ---------------- Reactive Data ----------------
const showModal = ref(false);
const searchTerm = ref("");
const propertyToEdit = ref<Property | null>(null);
const STORAGE_KEY = "propertyData";

// Load or initialize local storage
function loadFromLocalStorage(): Property[] {
  const data = localStorage.getItem(STORAGE_KEY);
  const storedTenant = localStorage.getItem("tenants");

  if (!data) return [];

  const properties: Property[] = JSON.parse(data);

  // Parse and assign tenants to properties
  if (storedTenant) {
    const tenants = JSON.parse(storedTenant);
    tenants.forEach((tenant: any) => {
      const matchingProperty = properties.find(
        (p) => p.name === tenant.property
      );
      if (matchingProperty) {
        matchingProperty.units.push(tenant);
      }
    });
  }

  return properties;
}

const properties = reactive<Property[]>(loadFromLocalStorage());

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

// ---------------- Watchers ----------------
watch(() => properties, saveToLocalStorage, { deep: true });

// ---------------- Modal Handling ----------------
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

// ---------------- CRUD Operations ----------------
function getNextPropertyId(): number {
  const ids = properties.map((p) => p.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function handleAddProperty(newProp: Property) {
  const newProperty = {
    ...newProp,
    id: getNextPropertyId(),
    units: [],
    created_at: new Date().toISOString(),
  };
  properties.push(newProperty);
  closeModal();
}

function handleUpdateProperty(updatedProp: Property) {
  const index = properties.findIndex((p) => p.id === updatedProp.id);
  if (index !== -1) {
    properties[index] = { ...updatedProp };
  }
  closeModal();
}

function handleDeleteProperty(id: number) {
  const index = properties.findIndex((p) => p.id === id);
  if (index !== -1) properties.splice(index, 1);
}

// ---------------- Search Logic ----------------
const filteredProperties = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  if (!term) return properties;

  return properties
    .map((property) => {
      const matchingUnits = property.units.filter((unit) =>
        [unit.name, unit.status, unit.tenant?.name || ""].some((field) =>
          field.toLowerCase().includes(term)
        )
      );

      if (property.name.toLowerCase().includes(term) || matchingUnits.length) {
        return { ...property, units: matchingUnits };
      }

      return null;
    })
    .filter(Boolean) as Property[];
});

// ---------------- Helpers ----------------
function badgeColor(status: string): string {
  switch (status) {
    case "Occupied":
      return "success";
    case "Available":
      return "warning";
    case "Not Available":
      return "danger";
    case "Move Out":
      return "danger";
    default:
      return "medium"; // fallback color
  }
}
</script>
