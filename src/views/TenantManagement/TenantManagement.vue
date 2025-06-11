<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tenant Management</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="viewMode === 'units'" @click="addUnit()">
            <ion-icon slot="icon-only" :icon="add" />
          </ion-button>
          <ion-button v-if="viewMode === 'tenants'" @click="addTenant()">
            <ion-icon slot="icon-only" :icon="add" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <search-bar v-model="searchTerm" />
      <!-- Action Buttons -->
    </ion-header>

    <ion-content>
      <PageRefresher />

      <!-- Toggle View: Tenants / Units -->
      <ion-segment v-model="viewMode">
        <ion-segment-button value="tenants">
          <ion-label>Tenants</ion-label>
        </ion-segment-button>
        <ion-segment-button value="units">
          <ion-label>Units</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-item-divider />

      <!-- Units List -->
      <ion-list v-if="viewMode === 'units' && unitData.length > 0">
        <ion-item
          v-for="(unit, index) in unitData"
          :key="index"
          class="ion-activatable ripple-parent"
          @click="editUnit(unit)"
        >
          <ion-label>
            <h2>{{ unit.name }}</h2>
            <p><strong>Property:</strong> {{ unit.property }}</p>
            <p>
              <strong>Price:</strong> {{ currency[0] || "$" }}{{ unit.price }}
            </p>
          </ion-label>

          <ion-chip :color="unit.status === 'Occupied' ? 'success' : 'warning'">
            {{ unit.status }}
          </ion-chip>
          <ion-ripple-effect />
        </ion-item>
      </ion-list>

      <!-- Tenants List -->
      <ion-list v-if="viewMode === 'tenants' && filteredTenants.length > 0">
        <tenant-card
          v-for="tenant in filteredTenants"
          :key="tenant.id"
          :tenant="tenant"
          @view="viewTenant"
          @edit="editTenant"
          @delete="deleteTenant"
        />
      </ion-list>

      <NoData
        v-else-if="viewMode === 'tenants' && tenants.length === 0"
        message="No tenants found."
      />
    </ion-content>

    <!-- Modals -->
    <TenantModal
      :isOpen="showAddModal"
      :tenant="newTenant"
      :viewOnly="viewOnly"
      :propertyNames="propertyNames"
      @close="showAddModal = false"
      @save="saveTenant"
    />

    <AddUnitModal
      :showUnitModal="showUnitModal"
      v-model:newUnit="newUnit"
      :propertyNames="propertyNames"
      @close="showUnitModal = false"
      @save="saveUnit"
    />

    <EditUnitModal
      :showEditModal="showEditModal"
      :selectedUnit="selectedUnit"
      :newTenant="newTenant"
      :viewOnly="viewOnly"
      @close="showEditModal = false"
      @save="({ unit, tenant }) => saveEditedUnit(unit, tenant)"
    />
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
  IonButton,
  IonIcon,
  IonSegmentButton,
  IonSegment,
  IonItemDivider,
  IonRippleEffect,
  IonChip,
  IonButtons,
} from "@ionic/vue";

import { ref, computed } from "vue";
import { add } from "ionicons/icons";
import TenantCard from "@/views/TenantManagement/components/TenantCard.vue";
import SearchBar from "@/components/SearchBar.vue";
import NoData from "@/components/NoData.vue";
import PageRefresher from "@/components/PageRefresher.vue";
import TenantModal from "@/views/TenantManagement/components/TenantModal.vue";
import AddUnitModal from "@/views/TenantManagement/components/AddUnitModal.vue";
import EditUnitModal from "@/views/TenantManagement/components/EditUnitModal.vue";

interface Tenant {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  id_image: string;
  ref_id?: string;
  unit_id?: number;
  unit: string;
  num_people?: number;
  due_date?: string;
  status?: "Occupied" | "Move Out" | "Available" | "Not Available";
  property: string;
  unit_price?: number;
}

interface Unit {
  property: string;
  name: string;
  price: number;
  status: "Available" | "Occupied" | "Not Available" | "Move Out";
}

const tenants = ref<Tenant[]>([]);
const propertyNames = ref<string[]>([]);
const searchTerm = ref("");
const viewOnly = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showUnitModal = ref(false);
const viewMode = ref<"tenants" | "units">("tenants");
const currency = ref<string[]>([]);
const selectedUnit = ref<Unit>({
  name: "",
  property: "",
  price: 0,
  status: "Available",
});

const newTenant = ref<Tenant>({
  id: 0,
  name: "",
  email: "",
  phone: "",
  address: "",
  id_image: "",
  ref_id: "",
  unit_id: undefined,
  unit: "",
  unit_price: 0,
  num_people: 1,
  due_date: "",
  status: "Occupied",
  property: "",
});

const newUnit = ref({
  property: "",
  name: "",
  price: 0,
  status: "Available",
});
const unitData = ref<Unit[]>([]);

// Local Storage Utilities
function loadTenants(): Tenant[] {
  const stored = localStorage.getItem("tenants");
  const storedProperties = localStorage.getItem("propertyData");

  if (storedProperties) {
    try {
      const properties = JSON.parse(storedProperties);
      propertyNames.value = properties.map((p: any) => p.name);
    } catch (e) {
      console.error("Error parsing propertyData:", e);
    }
  }

  return stored ? JSON.parse(stored) : [];
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

function saveTenants(data: Tenant[]) {
  localStorage.setItem("tenants", JSON.stringify(data));
  console.log("Tenants saved:", data);
}

function loadUnits() {
  const data = localStorage.getItem("unitData");
  unitData.value = data ? JSON.parse(data) : [];
}

function saveUnits() {
  localStorage.setItem("unitData", JSON.stringify(unitData.value));
  console.log("Units saved:", unitData.value);
}

// Initialization
function initTenants() {
  try {
    tenants.value = loadTenants();
  } catch (error) {
    console.error("Error initializing tenants:", error);
    alert("Error initializing tenants.");
  }
}

initTenants();
loadUnits();
loadUserSettings();

// Computed
const filteredTenants = computed(() => {
  if (!searchTerm.value.trim()) return tenants.value;
  return tenants.value.filter((t) =>
    [t.name, t.email, t.phone, t.unit, t.property]
      .filter(Boolean)
      .some((field) =>
        field!.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
  );
});

function addTenant() {
  resetTenant();
  newTenant.value.ref_id = generateUniqueRefId();
  showAddModal.value = true;
  viewOnly.value = false;
}

function viewTenant(tenant: Tenant) {
  Object.assign(newTenant.value, tenant);
  showAddModal.value = true;
  viewOnly.value = true;
}

function editTenant(tenant: Tenant) {
  Object.assign(newTenant.value, tenant);
  showAddModal.value = true;
  viewOnly.value = false;
}

function deleteTenant(id: number) {
  if (confirm("Are you sure you want to delete this tenant?")) {
    tenants.value = tenants.value.filter((tenant) => tenant.id !== id);
    saveTenants(tenants.value);
    alert("Tenant deleted successfully.");
  }
}

function saveTenant() {
  if (viewOnly.value) return;

  const index = tenants.value.findIndex((t) => t.id === newTenant.value.id);

  if (index === -1) {
    const newId =
      tenants.value.length > 0
        ? Math.max(...tenants.value.map((t) => t.id)) + 1
        : 1;
    tenants.value.push({
      ...JSON.parse(JSON.stringify(newTenant.value)),
      id: newId,
    });
    alert("Tenant added successfully.");
  } else {
    tenants.value[index] = { ...JSON.parse(JSON.stringify(newTenant.value)) };
    alert("Tenant updated successfully.");
  }

  saveTenants(tenants.value);
  showAddModal.value = false;
  resetTenant();
}

function resetTenant() {
  Object.assign(newTenant.value, {
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    id_image: "",
    ref_id: "",
    unit_id: undefined,
    unit: "",
    unit_price: 0,
    num_people: 1,
    due_date: "",
    status: "Occupied",
    property: "",
  });
}

function generateUniqueRefId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function addUnit() {
  Object.assign(newUnit, { property: "", name: "", price: 0 });
  showUnitModal.value = true;
}

function saveUnit(unit: Unit) {
  if (!unit.property || !unit.name) {
    alert("Property and Unit name are required.");
    return;
  }

  unitData.value.push({
    ...unit,
    status: unit.status as Unit["status"],
  });

  saveUnits();
  alert("Unit added successfully.");
  showUnitModal.value = false;
}

function editUnit(unit: Unit) {
  resetTenant();
  newTenant.value.ref_id = generateUniqueRefId();

  selectedUnit.value = { ...unit };

  const existingTenant = tenants.value.find(
    (t) => t.unit === unit.name && t.property === unit.property
  );

  if (existingTenant) {
    Object.assign(newTenant.value, existingTenant);
  } else {
    newTenant.value.unit = unit.name;
    newTenant.value.property = unit.property;
    newTenant.value.unit_price = unit.price;
  }

  showEditModal.value = true;
}

function saveEditedUnit(updatedUnit: Unit, tenantData: any): void {
  const unitIndex = unitData.value.findIndex(
    (u: Unit) =>
      u.name === updatedUnit.name && u.property === updatedUnit.property
  );

  if (unitIndex !== -1) {
    unitData.value[unitIndex] = {
      ...updatedUnit,
      price: Number(updatedUnit.price),
    };

    if (tenantData.name || tenantData.email) {
      const existingTenantIndex = tenants.value.findIndex(
        (t) =>
          t.unit === updatedUnit.name && t.property === updatedUnit.property
      );

      const updatedTenant = {
        ...tenantData,
        unit: updatedUnit.name,
        property: updatedUnit.property,
        unit_price: Number(updatedUnit.price),
      };

      if (existingTenantIndex !== -1) {
        tenants.value[existingTenantIndex] = updatedTenant;
        console.log("Updated existing tenant");
      } else {
        const newId =
          tenants.value.length > 0
            ? Math.max(...tenants.value.map((t) => t.id)) + 1
            : 1;
        tenants.value.push({ ...updatedTenant, id: newId });
        console.log("Added new tenant");
      }
    }

    saveUnits();
    saveTenants(tenants.value);

    alert("Unit and related tenant(s) updated successfully.");
    showEditModal.value = false;
  } else {
    alert("Error: Unit not found.");
  }
}
</script>
